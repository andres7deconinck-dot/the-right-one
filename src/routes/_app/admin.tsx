import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Shield, FileText, Users, Mail, Trash2, Eye, BadgeCheck, Star, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { checkIsAdmin, adminListAllPosts, adminUpdatePost, adminDeletePost, adminListUsers, adminToggleRole } from "@/lib/blog.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/admin")({
  head: () => ({ meta: [{ title: "Admin — GlutenGo" }] }),
  component: AdminPage,
});

type Tab = "blog" | "users" | "subscribers";

function AdminPage() {
  const { user, loading: authLoading } = useRequireAuth();
  const [tab, setTab] = useState<Tab>("blog");
  const checkAdmin = useServerFn(checkIsAdmin);

  const { data: meta, isLoading: metaLoading } = useQuery({
    queryKey: ["check-admin"],
    queryFn: () => checkAdmin({}),
    enabled: !!user,
  });

  if (authLoading || metaLoading) return <div className="px-5 py-20 text-center text-muted-foreground">Loading…</div>;

  if (!user || !meta?.isAdmin) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center">
        <Shield className="mx-auto h-10 w-10 text-muted-foreground/40" />
        <h1 className="mt-4 font-display text-3xl">No access</h1>
        <p className="mt-2 text-muted-foreground">This page is only available to administrators.</p>
        <Link to="/dashboard" className="mt-6 inline-block"><Button variant="outline">Back to dashboard</Button></Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-primary" />
        <h1 className="font-display text-3xl">Admin</h1>
      </div>
      <p className="mt-1 text-muted-foreground">Manage articles, users and subscribers.</p>

      {/* Tabs */}
      <div className="mt-6 flex gap-1 border-b border-border">
        {[
          { id: "blog", label: "Blog moderation", icon: FileText },
          { id: "users", label: "Users", icon: Users },
          { id: "subscribers", label: "Subscribers", icon: Mail },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as Tab)}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm transition-colors ${
              tab === t.id ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "blog" && <BlogTab />}
        {tab === "users" && <UsersTab />}
        {tab === "subscribers" && <SubscribersTab />}
      </div>
    </div>
  );
}

function BlogTab() {
  const qc = useQueryClient();
  const list = useServerFn(adminListAllPosts);
  const upd = useServerFn(adminUpdatePost);
  const del = useServerFn(adminDeletePost);
  const { data, isLoading } = useQuery({ queryKey: ["admin-posts"], queryFn: () => list({}) });

  const updMut = useMutation({
    mutationFn: (input: any) => upd({ data: input }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-posts"] }); toast.success("Updated"); },
    onError: (e: any) => toast.error(e.message),
  });
  const delMut = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-posts"] }); toast.success("Deleted"); },
  });

  if (isLoading) return <p className="text-muted-foreground">Loading…</p>;
  const posts = data ?? [];
  const pending = posts.filter((p: any) => p.status === "pending");
  const others = posts.filter((p: any) => p.status !== "pending");

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 font-medium">Pending review ({pending.length})</h2>
        {pending.length === 0 ? (
          <p className="text-sm text-muted-foreground">No articles awaiting review.</p>
        ) : (
          <div className="space-y-2">{pending.map((p: any) => <PostRow key={p.id} post={p} updMut={updMut} delMut={delMut} />)}</div>
        )}
      </section>
      <section>
        <h2 className="mb-3 font-medium">All articles ({others.length})</h2>
        <div className="space-y-2">{others.map((p: any) => <PostRow key={p.id} post={p} updMut={updMut} delMut={delMut} />)}</div>
      </section>
    </div>
  );
}

function PostRow({ post, updMut, delMut }: any) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{post.title}</span>
            <Badge className={
              post.status === "published" ? "bg-emerald-100 text-emerald-700" :
              post.status === "pending" ? "bg-amber-100 text-amber-700" :
              post.status === "rejected" ? "bg-rose-100 text-rose-700" : "bg-muted"
            }>{post.status}</Badge>
            {post.is_featured && <Badge className="bg-purple-100 text-purple-700"><Star className="mr-1 h-3 w-3" />Featured</Badge>}
            {post.verified_by_admin && <Badge className="bg-blue-100 text-blue-700"><BadgeCheck className="mr-1 h-3 w-3" />Verified</Badge>}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            by {post.author?.full_name || post.author?.email || "unknown"} · {post.country_name || "—"}{post.city ? `, ${post.city}` : ""} · {post.views} views
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-1">
          <Link to="/blog/$slug" params={{ slug: post.slug }}><Button size="sm" variant="ghost"><Eye className="h-4 w-4" /></Button></Link>
          {post.status !== "published" && (
            <Button size="sm" variant="outline" onClick={() => updMut.mutate({ id: post.id, status: "published" })}><Check className="mr-1 h-4 w-4" />Approve</Button>
          )}
          {post.status === "pending" && (
            <Button size="sm" variant="outline" onClick={() => updMut.mutate({ id: post.id, status: "rejected" })}><X className="mr-1 h-4 w-4" />Reject</Button>
          )}
          <Button size="sm" variant="outline" onClick={() => updMut.mutate({ id: post.id, is_featured: !post.is_featured })}>
            <Star className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => updMut.mutate({ id: post.id, verified_by_admin: !post.verified_by_admin })}>
            <BadgeCheck className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => { if (confirm("Delete this article?")) delMut.mutate(post.id); }}>
            <Trash2 className="h-4 w-4 text-rose-600" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function UsersTab() {
  const qc = useQueryClient();
  const list = useServerFn(adminListUsers);
  const toggle = useServerFn(adminToggleRole);
  const { data, isLoading } = useQuery({ queryKey: ["admin-users"], queryFn: () => list({}) });
  const mut = useMutation({
    mutationFn: (input: any) => toggle({ data: input }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-users"] }); toast.success("Updated"); },
  });

  if (isLoading) return <p className="text-muted-foreground">Loading…</p>;
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      {(data ?? []).map((u: any) => (
        <div key={u.id} className="flex flex-wrap items-center gap-3 border-b border-border p-4 last:border-0">
          <div className="min-w-0 flex-1">
            <p className="font-medium">{u.full_name || "—"}</p>
            <p className="text-xs text-muted-foreground">{u.email}</p>
          </div>
          <div className="flex flex-wrap gap-1">
            {u.roles.map((r: string) => <Badge key={r} variant="secondary">{r}</Badge>)}
          </div>
          <div className="flex gap-1">
            <Button size="sm" variant={u.roles.includes("verified") ? "default" : "outline"}
              onClick={() => mut.mutate({ user_id: u.id, role: "verified", enable: !u.roles.includes("verified") })}>
              <BadgeCheck className="mr-1 h-3 w-3" /> {u.roles.includes("verified") ? "Unverify" : "Verify"}
            </Button>
            <Button size="sm" variant={u.roles.includes("admin") ? "default" : "outline"}
              onClick={() => mut.mutate({ user_id: u.id, role: "admin", enable: !u.roles.includes("admin") })}>
              <Shield className="mr-1 h-3 w-3" /> {u.roles.includes("admin") ? "Demote" : "Make admin"}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function SubscribersTab() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-subscribers"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("admin-subscribers");
      if (error) throw error;
      return (data?.data || []) as { id: string; email: string | null; full_name: string | null; plan: string | null; created_at: string }[];
    },
  });
  if (isLoading) return <p className="text-muted-foreground">Loading…</p>;
  const subs = data ?? [];
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border px-4 py-3 text-sm text-muted-foreground">{subs.length} subscribers</div>
      {subs.map((s) => (
        <div key={s.id} className="flex items-center gap-3 border-b border-border p-4 last:border-0">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">{s.email}</p>
            {s.full_name && <p className="text-xs text-muted-foreground">{s.full_name}</p>}
          </div>
          <Badge variant="secondary">{s.plan ?? "free"}</Badge>
          <span className="text-xs text-muted-foreground">{new Date(s.created_at).toLocaleDateString()}</span>
        </div>
      ))}
    </div>
  );
}

