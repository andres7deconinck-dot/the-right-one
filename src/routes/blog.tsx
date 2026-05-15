import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Hotel, BadgeCheck, PenLine, Eye, Heart, Star, Filter } from "lucide-react";
import { listPublishedPosts } from "@/lib/blog.functions";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Celiac Travel Stories from Real Travelers | GlutenGo" },
      { name: "description", content: "Real stories, hotel & restaurant tips and country guides written by gluten-free travelers around the world." },
      { property: "og:title", content: "GlutenGo Blog — Celiac travel stories from real travelers" },
      { property: "og:description", content: "Verified gluten-free travel stories, hotel tips and country guides — written by the community." },
      { property: "og:url", content: "https://glutengo.app/blog" },
    ],
  }),
  component: BlogPage,
});

function BlogPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [country, setCountry] = useState<string | undefined>(undefined);
  const fetchPosts = useServerFn(listPublishedPosts);
  const { data, isLoading } = useQuery({
    queryKey: ["blog-posts", country ?? "all"],
    queryFn: () => fetchPosts({ data: { country } }),
  });

  const posts = data?.posts ?? [];
  const authors = data?.authors ?? {};
  const featured = posts.filter((p) => p.is_featured);
  const countries = Array.from(new Set(posts.map((p) => p.country_code).filter(Boolean))) as string[];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border/60 bg-gradient-to-br from-primary/5 via-background to-amber-50/40 px-5 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  <Star className="h-3 w-3" /> Community stories
                </span>
                <h1 className="mt-4 font-display text-5xl md:text-6xl">Celiac travel, told by people who lived it.</h1>
                <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                  Real stories, hotel tips and restaurant finds — submitted by gluten-free travelers from around the world. Verified by our team.
                </p>
              </div>
              <Button
                size="lg"
                onClick={() => navigate({ to: user ? "/blog/new" : "/auth", search: user ? undefined : ({ redirect: "/blog/new" } as any) })}
                className="gap-2"
              >
                <PenLine className="h-4 w-4" />
                Write an article
              </Button>
            </div>
          </div>
        </section>

        {/* Filter */}
        {countries.length > 0 && (
          <div className="border-b border-border/60 px-5 py-4">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <button
                onClick={() => setCountry(undefined)}
                className={`rounded-full px-3 py-1 text-sm transition-colors ${!country ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}
              >
                All countries
              </button>
              {countries.map((c) => (
                <button
                  key={c}
                  onClick={() => setCountry(c)}
                  className={`rounded-full px-3 py-1 text-sm transition-colors ${country === c ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}
                >
                  {c.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Featured */}
        {featured.length > 0 && (
          <section className="px-5 py-10">
            <div className="mx-auto max-w-7xl">
              <h2 className="mb-5 font-display text-2xl">Featured</h2>
              <div className="grid gap-5 md:grid-cols-2">
                {featured.slice(0, 2).map((p) => (
                  <PostCard key={p.id} post={p} author={authors[p.author_id]} featured />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All posts */}
        <section className="px-5 pb-20 pt-6">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-5 font-display text-2xl">Latest stories</h2>
            {isLoading ? (
              <p className="text-muted-foreground">Loading…</p>
            ) : posts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
                <p className="text-muted-foreground">No stories yet. Be the first to share yours!</p>
                <Button className="mt-4" onClick={() => navigate({ to: user ? "/blog/new" : "/auth" })}>Write the first article</Button>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {posts.filter((p) => !p.is_featured).map((p) => (
                  <PostCard key={p.id} post={p} author={authors[p.author_id]} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function PostCard({ post, author, featured }: { post: any; author?: any; featured?: boolean }) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className={`group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-lg ${featured ? "md:flex-row" : ""}`}
    >
      {post.cover_image_url ? (
        <img src={post.cover_image_url} alt={post.title} className={`h-48 w-full object-cover ${featured ? "md:h-auto md:w-1/2" : ""}`} />
      ) : (
        <div className={`flex h-48 w-full items-center justify-center bg-gradient-to-br from-primary/10 to-amber-100 ${featured ? "md:h-auto md:w-1/2" : ""}`}>
          <span className="text-5xl">🌍</span>
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {post.country_name && (
            <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {post.country_name}{post.city ? `, ${post.city}` : ""}</span>
          )}
          {post.hotel_name && (
            <span className="inline-flex items-center gap-1"><Hotel className="h-3 w-3" /> {post.hotel_name}</span>
          )}
          {post.verified_by_admin && (
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100"><BadgeCheck className="mr-1 h-3 w-3" /> Verified</Badge>
          )}
        </div>
        <h3 className="mt-2 font-display text-xl leading-tight group-hover:text-primary">{post.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
        <div className="mt-auto flex items-center justify-between pt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            {author?.avatar_url ? (
              <img src={author.avatar_url} alt="" className="h-6 w-6 rounded-full" />
            ) : (
              <div className="grid h-6 w-6 place-items-center rounded-full bg-primary/10 text-xs">{(author?.full_name || "?").slice(0, 1)}</div>
            )}
            <span>{author?.full_name || "Anonymous"}</span>
            {author?.verified && <BadgeCheck className="h-3.5 w-3.5 text-primary" />}
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1"><Eye className="h-3 w-3" /> {post.views}</span>
            <span className="inline-flex items-center gap-1"><Heart className="h-3 w-3" /> {post.likes}</span>
            {post.reading_minutes && <span>{post.reading_minutes} min</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}
