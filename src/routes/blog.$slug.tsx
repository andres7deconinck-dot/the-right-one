import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Hotel, BadgeCheck, Eye, Heart, ArrowLeft, UtensilsCrossed, Calendar } from "lucide-react";
import { getPostBySlug, addComment } from "@/lib/blog.functions";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/blog/$slug")({
  component: BlogDetailPage,
});

function BlogDetailPage() {
  const { slug } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const fetchPost = useServerFn(getPostBySlug);
  const postComment = useServerFn(addComment);
  const [comment, setComment] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: () => fetchPost({ data: { slug } }),
  });

  const commentMut = useMutation({
    mutationFn: (body: string) => postComment({ data: { post_id: data!.post!.id, body } }),
    onSuccess: () => {
      setComment("");
      toast.success("Comment posted");
      qc.invalidateQueries({ queryKey: ["blog-post", slug] });
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to post"),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader /><main className="flex-1 px-5 py-20 text-center text-muted-foreground">Loading…</main><SiteFooter />
      </div>
    );
  }

  if (!data?.post) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader />
        <main className="mx-auto max-w-2xl flex-1 px-5 py-20 text-center">
          <h1 className="font-display text-4xl">Article not found</h1>
          <p className="mt-3 text-muted-foreground">It may have been removed or unpublished.</p>
          <Link to="/blog" className="mt-6 inline-block"><Button variant="outline">Back to blog</Button></Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const post = data.post;
  const author = data.author;
  const comments = data.comments ?? [];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        {post.cover_image_url && (
          <div className="h-72 w-full overflow-hidden md:h-96">
            <img src={post.cover_image_url} alt={post.title} className="h-full w-full object-cover" />
          </div>
        )}
        <article className="mx-auto max-w-3xl px-5 py-12">
          <Link to="/blog" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to all stories
          </Link>

          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            {post.country_name && <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" /> {post.country_name}{post.city ? `, ${post.city}` : ""}</span>}
            {post.verified_by_admin && (
              <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100"><BadgeCheck className="mr-1 h-3 w-3" /> Verified by GlutenGo</Badge>
            )}
          </div>

          <h1 className="mt-3 font-display text-4xl md:text-5xl">{post.title}</h1>

          {/* Author + meta */}
          <div className="mt-6 flex flex-wrap items-center gap-4 border-y border-border py-4">
            <div className="flex items-center gap-3">
              {author?.avatar_url ? (
                <img src={author.avatar_url} className="h-10 w-10 rounded-full" alt="" />
              ) : (
                <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10">{(author?.full_name || "?").slice(0, 1)}</div>
              )}
              <div>
                <div className="flex items-center gap-1 text-sm font-medium">
                  {author?.full_name || "Anonymous"}
                  {author?.verified && <BadgeCheck className="h-4 w-4 text-primary" />}
                </div>
                <div className="text-xs text-muted-foreground">{post.published_at ? new Date(post.published_at).toLocaleDateString() : ""}</div>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1"><Eye className="h-4 w-4" /> {post.views}</span>
              <span className="inline-flex items-center gap-1"><Heart className="h-4 w-4" /> {post.likes}</span>
              {post.reading_minutes && <span className="inline-flex items-center gap-1"><Calendar className="h-4 w-4" /> {post.reading_minutes} min read</span>}
            </div>
          </div>

          {/* Location card */}
          {(post.hotel_name || post.restaurant_name) && (
            <div className="mt-6 rounded-2xl border border-border bg-card p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Where this happened</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {post.hotel_name && (
                  <div className="flex items-center gap-2"><Hotel className="h-4 w-4 text-primary" /> <span className="font-medium">{post.hotel_name}</span></div>
                )}
                {post.restaurant_name && (
                  <div className="flex items-center gap-2"><UtensilsCrossed className="h-4 w-4 text-primary" /> <span className="font-medium">{post.restaurant_name}</span></div>
                )}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg mt-8 max-w-none whitespace-pre-wrap leading-relaxed text-foreground">
            {post.content}
          </div>

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {post.tags.map((t: string) => (
                <Badge key={t} variant="secondary">#{t}</Badge>
              ))}
            </div>
          )}

          {/* Comments */}
          <section className="mt-12 border-t border-border pt-8">
            <h2 className="font-display text-2xl">Comments ({comments.length})</h2>

            {user ? (
              <div className="mt-4">
                <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your experience or ask a question…" rows={3} />
                <Button
                  className="mt-2"
                  disabled={!comment.trim() || commentMut.isPending}
                  onClick={() => commentMut.mutate(comment.trim())}
                >
                  {commentMut.isPending ? "Posting…" : "Post comment"}
                </Button>
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">
                <button onClick={() => navigate({ to: "/auth" })} className="text-primary underline">Sign in</button> to leave a comment.
              </p>
            )}

            <ul className="mt-6 space-y-4">
              {comments.map((c: any) => (
                <li key={c.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{c.author?.full_name || "Anonymous"}</span>
                    <span>{new Date(c.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="mt-2 text-sm">{c.body}</p>
                </li>
              ))}
            </ul>
          </section>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
