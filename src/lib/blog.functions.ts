import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 80);

const computeReadingMinutes = (content: string) =>
  Math.max(1, Math.round(content.split(/\s+/).length / 220));

// ===== PUBLIC: list published posts =====
export const listPublishedPosts = createServerFn({ method: "GET" })
  .inputValidator((input: { country?: string; limit?: number } = {}) => ({
    country: input.country,
    limit: Math.min(input.limit ?? 50, 100),
  }))
  .handler(async ({ data }) => {
    let q = supabaseAdmin
      .from("blog_posts")
      .select("id, title, slug, excerpt, cover_image_url, country_code, country_name, city, hotel_name, restaurant_name, tags, is_featured, verified_by_admin, views, likes, reading_minutes, published_at, author_id")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(data.limit);
    if (data.country) q = q.eq("country_code", data.country);
    const { data: posts, error } = await q;
    if (error) throw new Error(error.message);

    const authorIds = Array.from(new Set((posts ?? []).map((p) => p.author_id)));
    let authors: Record<string, { full_name: string | null; avatar_url: string | null; verified: boolean }> = {};
    if (authorIds.length) {
      const { data: profiles } = await supabaseAdmin
        .from("profiles")
        .select("id, full_name, avatar_url")
        .in("id", authorIds);
      const { data: roles } = await supabaseAdmin
        .from("user_roles")
        .select("user_id, role")
        .in("user_id", authorIds);
      const verifiedSet = new Set((roles ?? []).filter((r) => r.role === "verified").map((r) => r.user_id));
      for (const p of profiles ?? []) {
        authors[p.id] = { full_name: p.full_name, avatar_url: p.avatar_url, verified: verifiedSet.has(p.id) };
      }
    }
    return { posts: posts ?? [], authors };
  });

// ===== PUBLIC: get single post by slug =====
export const getPostBySlug = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => z.object({ slug: z.string().min(1).max(120) }).parse(input))
  .handler(async ({ data }) => {
    const { data: post, error } = await supabaseAdmin
      .from("blog_posts")
      .select("*")
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!post) return { post: null, author: null, comments: [] };

    // increment views (fire & forget)
    await supabaseAdmin.from("blog_posts").update({ views: (post.views ?? 0) + 1 }).eq("id", post.id);

    const { data: profile } = await supabaseAdmin
      .from("profiles").select("id, full_name, avatar_url").eq("id", post.author_id).maybeSingle();
    const { data: roles } = await supabaseAdmin
      .from("user_roles").select("role").eq("user_id", post.author_id);
    const verified = (roles ?? []).some((r) => r.role === "verified");

    const { data: comments } = await supabaseAdmin
      .from("blog_comments")
      .select("id, body, created_at, author_id")
      .eq("post_id", post.id)
      .order("created_at", { ascending: false });

    const commentAuthorIds = Array.from(new Set((comments ?? []).map((c) => c.author_id)));
    let commentAuthors: Record<string, { full_name: string | null; avatar_url: string | null }> = {};
    if (commentAuthorIds.length) {
      const { data: cps } = await supabaseAdmin
        .from("profiles").select("id, full_name, avatar_url").in("id", commentAuthorIds);
      for (const p of cps ?? []) commentAuthors[p.id] = { full_name: p.full_name, avatar_url: p.avatar_url };
    }

    return {
      post,
      author: profile ? { ...profile, verified } : null,
      comments: (comments ?? []).map((c) => ({ ...c, author: commentAuthors[c.author_id] ?? null })),
    };
  });

// ===== AUTH: create post =====
const PostInput = z.object({
  title: z.string().min(5).max(160),
  excerpt: z.string().max(300).optional().default(""),
  content: z.string().min(50).max(20000),
  cover_image_url: z.string().url().max(500).optional().nullable(),
  country_code: z.string().min(2).max(8).optional().nullable(),
  country_name: z.string().max(80).optional().nullable(),
  city: z.string().max(80).optional().nullable(),
  hotel_name: z.string().max(120).optional().nullable(),
  restaurant_name: z.string().max(120).optional().nullable(),
  tags: z.array(z.string().min(1).max(30)).max(8).default([]),
  display_author: z.string().max(120).optional().nullable(),
});

export const createPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => PostInput.parse(input))
  .handler(async ({ data, context }) => {
    const { userId } = context;
    // verified users auto-publish
    const { data: roles } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userId);
    const isVerified = (roles ?? []).some((r) => r.role === "verified" || r.role === "admin");

    let slug = slugify(data.title);
    // ensure unique
    const { data: existing } = await supabaseAdmin.from("blog_posts").select("id").eq("slug", slug);
    if (existing && existing.length) slug = `${slug}-${Date.now().toString(36)}`;

    const status = isVerified ? "published" : "pending";
    const { data: post, error } = await supabaseAdmin
      .from("blog_posts")
      .insert({
        author_id: userId,
        title: data.title,
        slug,
        excerpt: data.excerpt || data.content.slice(0, 200),
        content: data.content,
        cover_image_url: data.cover_image_url ?? null,
        country_code: data.country_code ?? null,
        country_name: data.country_name ?? null,
        city: data.city ?? null,
        hotel_name: data.hotel_name ?? null,
        restaurant_name: data.restaurant_name ?? null,
        ...(data.display_author ? { display_author: data.display_author } : {}),
        tags: data.tags,
        status,
        published_at: status === "published" ? new Date().toISOString() : null,
        reading_minutes: computeReadingMinutes(data.content),
      })
      .select("id, slug, status")
      .single();
    if (error) throw new Error(error.message);
    return post;
  });

// ===== AUTH: get post for editing (author or admin) =====
export const getPostForEdit = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { slug: string }) => z.object({ slug: z.string().min(1).max(120) }).parse(input))
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const { data: roles } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userId);
    const isAdmin = (roles ?? []).some((r) => r.role === "admin");

    const { data: post, error } = await supabaseAdmin
      .from("blog_posts").select("*").eq("slug", data.slug).maybeSingle();
    if (error) throw new Error(error.message);
    if (!post) throw new Error("Post not found");
    if (!isAdmin && post.author_id !== userId) throw new Response("Forbidden", { status: 403 });
    return { post, isAdmin };
  });

// ===== AUTH: update post (author or admin) =====
const UpdatePostInput = z.object({
  id: z.string().uuid(),
  title: z.string().min(5).max(160),
  excerpt: z.string().max(300).optional().nullable(),
  content: z.string().min(50).max(20000),
  cover_image_url: z.string().url().max(500).optional().nullable(),
  country_code: z.string().min(2).max(8).optional().nullable(),
  country_name: z.string().max(80).optional().nullable(),
  city: z.string().max(80).optional().nullable(),
  hotel_name: z.string().max(120).optional().nullable(),
  restaurant_name: z.string().max(120).optional().nullable(),
  tags: z.array(z.string().min(1).max(30)).max(8).default([]),
  display_author: z.string().max(120).optional().nullable(),
  status: z.enum(["draft", "pending", "published", "rejected"]).optional(),
  is_featured: z.boolean().optional(),
  verified_by_admin: z.boolean().optional(),
});

export const updatePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => UpdatePostInput.parse(input))
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const { data: roles } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userId);
    const isAdmin = (roles ?? []).some((r) => r.role === "admin");

    const { data: existing } = await supabaseAdmin.from("blog_posts").select("author_id").eq("id", data.id).maybeSingle();
    if (!existing) throw new Error("Post not found");
    if (!isAdmin && existing.author_id !== userId) throw new Response("Forbidden", { status: 403 });

    const patch: Record<string, any> = {
      title: data.title,
      excerpt: data.excerpt || data.content.slice(0, 200),
      content: data.content,
      cover_image_url: data.cover_image_url ?? null,
      country_code: data.country_code ?? null,
      country_name: data.country_name ?? null,
      city: data.city ?? null,
      hotel_name: data.hotel_name ?? null,
      restaurant_name: data.restaurant_name ?? null,
      tags: data.tags,
      ...(data.display_author ? { display_author: data.display_author } : {}),
      reading_minutes: computeReadingMinutes(data.content),
      updated_at: new Date().toISOString(),
    };

    if (isAdmin) {
      if (data.status !== undefined) {
        patch.status = data.status;
        if (data.status === "published") patch.published_at = new Date().toISOString();
      }
      if (data.is_featured !== undefined) patch.is_featured = data.is_featured;
      if (data.verified_by_admin !== undefined) patch.verified_by_admin = data.verified_by_admin;
    }

    const { data: updated, error } = await supabaseAdmin.from("blog_posts").update(patch).eq("id", data.id).select("id, slug").single();
    if (error) throw new Error(error.message);
    return updated;
  });

// ===== AUTH: list my posts =====
export const listMyPosts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .select("id, title, slug, status, created_at, views, likes")
      .eq("author_id", context.userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

// ===== AUTH: post comment =====
export const addComment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({
    post_id: z.string().uuid(),
    body: z.string().min(1).max(2000),
  }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await supabaseAdmin.from("blog_comments").insert({
      post_id: data.post_id,
      author_id: context.userId,
      body: data.body,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ===== ADMIN HELPERS =====
async function assertAdmin(userId: string) {
  const { data } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
  if (!data) throw new Response("Forbidden", { status: 403 });
}

export const adminListAllPosts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .select("id, title, slug, status, is_featured, verified_by_admin, author_id, country_name, city, hotel_name, created_at, views")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    const ids = Array.from(new Set((data ?? []).map((p) => p.author_id)));
    const { data: profs } = ids.length
      ? await supabaseAdmin.from("profiles").select("id, email, full_name").in("id", ids)
      : { data: [] as any[] };
    const map: Record<string, any> = {};
    for (const p of profs ?? []) map[p.id] = p;
    return (data ?? []).map((p) => ({ ...p, author: map[p.author_id] ?? null }));
  });

export const adminUpdatePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({
    id: z.string().uuid(),
    status: z.enum(["draft", "pending", "published", "rejected"]).optional(),
    is_featured: z.boolean().optional(),
    verified_by_admin: z.boolean().optional(),
  }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const patch: any = {};
    if (data.status !== undefined) {
      patch.status = data.status;
      if (data.status === "published") patch.published_at = new Date().toISOString();
    }
    if (data.is_featured !== undefined) patch.is_featured = data.is_featured;
    if (data.verified_by_admin !== undefined) patch.verified_by_admin = data.verified_by_admin;
    const { error } = await supabaseAdmin.from("blog_posts").update(patch).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeletePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("blog_posts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data: profs, error } = await supabaseAdmin
      .from("profiles")
      .select("id, email, full_name, avatar_url, created_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    const { data: roles } = await supabaseAdmin.from("user_roles").select("user_id, role");
    const rolesByUser: Record<string, string[]> = {};
    for (const r of roles ?? []) {
      (rolesByUser[r.user_id] ||= []).push(r.role as string);
    }
    return (profs ?? []).map((p) => ({ ...p, roles: rolesByUser[p.id] ?? [] }));
  });

export const adminToggleRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({
    user_id: z.string().uuid(),
    role: z.enum(["admin", "verified"]),
    enable: z.boolean(),
  }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    if (data.enable) {
      await supabaseAdmin.from("user_roles").insert({ user_id: data.user_id, role: data.role }).select();
    } else {
      await supabaseAdmin.from("user_roles").delete().eq("user_id", data.user_id).eq("role", data.role);
    }
    return { ok: true };
  });

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", context.userId);
    const roles = (data ?? []).map((r) => r.role as string);
    return { isAdmin: roles.includes("admin"), isVerified: roles.includes("verified") || roles.includes("admin") };
  });
