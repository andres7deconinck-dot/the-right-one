import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Hotel, BadgeCheck, Eye, Heart, ArrowLeft, UtensilsCrossed, Calendar, Pencil, PenLine, Trash2 } from "lucide-react";
import { getPostBySlug, addComment, deleteComment, updateComment, likePost, checkIsAdmin } from "@/lib/blog.functions";
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
  const removeComment = useServerFn(deleteComment);
  const editComment = useServerFn(updateComment);
  const getAdminStatus = useServerFn(checkIsAdmin);
  const [comment, setComment] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBody, setEditBody] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: () => fetchPost({ data: { slug } }),
  });

  const { data: adminData } = useQuery({
    queryKey: ["is-admin"],
    queryFn: () => getAdminStatus({ data: undefined }),
    enabled: !!user,
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

  const deleteMut = useMutation({
    mutationFn: (comment_id: string) => removeComment({ data: { comment_id } }),
    onSuccess: () => {
      toast.success("Comment deleted");
      qc.invalidateQueries({ queryKey: ["blog-post", slug] });
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to delete"),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, body }: { id: string; body: string }) =>
      editComment({ data: { comment_id: id, body } }),
    onSuccess: () => {
      setEditingId(null);
      toast.success("Comment updated");
      qc.invalidateQueries({ queryKey: ["blog-post", slug] });
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to update"),
  });

  if (isLoading) {
    return <main className="flex-1 px-5 py-20 text-center text-muted-foreground">Loading…</main>;
  }

  if (!data?.post) {
    return (
      <main className="mx-auto max-w-2xl flex-1 px-5 py-20 text-center">
        <h1 className="font-display text-4xl">Article not found</h1>
        <p className="mt-3 text-muted-foreground">It may have been removed or unpublished.</p>
        <Link to="/blog" className="mt-6 inline-block"><Button variant="outline">Back to blog</Button></Link>
      </main>
    );
  }

  const post = data.post;
  const author = data.author;
  const comments = data.comments ?? [];

  return (
    <main className="flex-1">
        {post.cover_image_url && (
          <div className="h-72 w-full overflow-hidden md:h-96">
            <img src={post.cover_image_url} alt={post.title} className="h-full w-full object-cover" />
          </div>
        )}
        <article className="mx-auto max-w-3xl px-5 py-12">
          <div className="mb-6 flex items-center justify-between">
            <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Back to all stories
            </Link>
            {user && (user.id === post.author_id || adminData?.isAdmin) && (
              <Link to="/blog/edit/$slug" params={{ slug }}>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Pencil className="h-3.5 w-3.5" />
                  {adminData?.isAdmin && user.id !== post.author_id ? "Admin edit" : "Edit article"}
                </Button>
              </Link>
            )}
          </div>

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
              <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10"><PenLine className="h-5 w-5 text-primary" /></div>
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

          {/* Like button */}
          <div className="mt-8 flex justify-center">
            <GFLikeButton postId={post.id} initialLikes={post.likes ?? 0} />
          </div>

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
              {comments.map((c: any) => {
                const isOwn = user?.id === c.author_id;
                const isEditing = editingId === c.id;
                return (
                  <li key={c.id} className="rounded-xl border border-border bg-card p-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{c.author?.full_name || "Anonymous"}</span>
                      <div className="flex items-center gap-3">
                        <span>{new Date(c.created_at).toLocaleDateString()}</span>
                        {isOwn && !isEditing && (
                          <button
                            onClick={() => { setEditingId(c.id); setEditBody(c.body); }}
                            className="hover:text-foreground transition-colors"
                            aria-label="Edit comment"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {(isOwn || adminData?.isAdmin) && (
                          <button
                            onClick={() => deleteMut.mutate(c.id)}
                            disabled={deleteMut.isPending}
                            className="hover:text-destructive transition-colors"
                            aria-label="Delete comment"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                    {isEditing ? (
                      <div className="mt-2">
                        <Textarea value={editBody} onChange={(e) => setEditBody(e.target.value)} rows={3} className="text-sm" />
                        <div className="mt-2 flex gap-2">
                          <Button size="sm" disabled={!editBody.trim() || updateMut.isPending} onClick={() => updateMut.mutate({ id: c.id, body: editBody.trim() })}>
                            {updateMut.isPending ? "Saving…" : "Save"}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-2 text-sm">{c.body}</p>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        </article>
    </main>
  );
}

// ─── GF Like Button ───────────────────────────────────────────────────────────

const BURST_COLORS = ["#f59e0b", "#ef4444", "#10b981", "#3b82f6", "#a855f7", "#f97316", "#ec4899", "#14b8a6"];
const BURST_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

function GFLikeButton({ postId, initialLikes }: { postId: string; initialLikes: number }) {
  const likeFn = useServerFn(likePost);
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialLikes);
  const [bursting, setBursting] = useState(false);
  const [popping, setPopping] = useState(false);

  useEffect(() => {
    try {
      const stored: string[] = JSON.parse(localStorage.getItem("gf-liked-posts") ?? "[]");
      setLiked(stored.includes(postId));
    } catch {}
  }, [postId]);

  const handleLike = async () => {
    if (liked || bursting) return;
    setPopping(true);
    setBursting(true);
    setLiked(true);
    setCount((c) => c + 1);
    try {
      const stored: string[] = JSON.parse(localStorage.getItem("gf-liked-posts") ?? "[]");
      localStorage.setItem("gf-liked-posts", JSON.stringify([...stored, postId]));
    } catch {}
    likeFn({ data: { post_id: postId } }).catch(() => {});
    setTimeout(() => setBursting(false), 700);
    setTimeout(() => setPopping(false), 500);
  };

  return (
    <>
      <style>{`
        @keyframes gf-burst-particle {
          0%   { transform: translate(var(--tx), var(--ty)) scale(1); opacity: 1; }
          100% { transform: translate(calc(var(--tx) * 3), calc(var(--ty) * 3)) scale(0); opacity: 0; }
        }
        @keyframes gf-pop {
          0%   { transform: scale(1); }
          35%  { transform: scale(1.45); }
          65%  { transform: scale(0.92); }
          100% { transform: scale(1); }
        }
        @keyframes gf-count-fly {
          0%   { transform: translateY(0); opacity: 1; }
          40%  { transform: translateY(-10px); opacity: 0; }
          41%  { transform: translateY(10px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes gf-cross-draw {
          from { stroke-dashoffset: 30; }
          to   { stroke-dashoffset: 0; }
        }
      `}</style>

      <div className="relative inline-flex flex-col items-center gap-2">
        {/* Burst particles */}
        {bursting && BURST_ANGLES.map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <span
              key={i}
              style={{
                position: "absolute",
                left: "50%", top: "50%",
                width: 7, height: 7,
                borderRadius: "50%",
                background: BURST_COLORS[i],
                marginLeft: -3.5, marginTop: -3.5,
                pointerEvents: "none",
                "--tx": `${Math.round(Math.cos(rad) * 22)}px`,
                "--ty": `${Math.round(Math.sin(rad) * 22)}px`,
                animation: "gf-burst-particle 0.65s ease-out forwards",
              } as React.CSSProperties}
            />
          );
        })}

        {/* Button */}
        <button
          onClick={handleLike}
          disabled={liked}
          title={liked ? "GF approved! ✓" : "Mark as GF friendly"}
          style={popping ? { animation: "gf-pop 0.45s ease-out" } : {}}
          className={`group relative flex items-center gap-3 rounded-2xl border-2 px-6 py-3 text-sm font-semibold shadow-sm transition-all duration-300 ${
            liked
              ? "border-amber-400 bg-amber-50 text-amber-700 shadow-amber-100"
              : "border-border bg-card hover:border-amber-300 hover:bg-amber-50/60 hover:text-amber-600 hover:shadow-md cursor-pointer"
          }`}
        >
          {/* Crossed-grain SVG — the international GF symbol */}
          <svg viewBox="0 0 28 28" className="h-7 w-7 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Grain body */}
            <ellipse cx="14" cy="11" rx="5.5" ry="8"
              fill={liked ? "#fcd34d" : "none"}
              stroke={liked ? "#d97706" : "currentColor"}
              strokeWidth="1.6"
              className="transition-all duration-300"
            />
            {/* Grain texture lines */}
            <line x1="14" y1="4" x2="14" y2="19" stroke={liked ? "#d97706" : "currentColor"} strokeWidth="1.2" />
            <line x1="10.5" y1="8" x2="17.5" y2="8" stroke={liked ? "#d97706" : "currentColor"} strokeWidth="1" strokeLinecap="round" />
            <line x1="9.5" y1="11" x2="18.5" y2="11" stroke={liked ? "#d97706" : "currentColor"} strokeWidth="1" strokeLinecap="round" />
            <line x1="10.5" y1="14" x2="17.5" y2="14" stroke={liked ? "#d97706" : "currentColor"} strokeWidth="1" strokeLinecap="round" />
            {/* Stalk */}
            <line x1="14" y1="19" x2="14" y2="24" stroke={liked ? "#d97706" : "currentColor"} strokeWidth="1.6" strokeLinecap="round" />
            {/* GF cross line — animated in when liked */}
            {liked && (
              <line x1="6" y1="4" x2="22" y2="24"
                stroke="#dc2626" strokeWidth="2.2" strokeLinecap="round"
                strokeDasharray="30" strokeDashoffset="0"
                style={{ animation: "gf-cross-draw 0.3s ease-out forwards" }}
              />
            )}
          </svg>

          {/* Count */}
          <span
            style={popping ? { animation: "gf-count-fly 0.45s ease-out" } : {}}
            className="tabular-nums text-base"
          >
            {count}
          </span>

          {/* Label */}
          <span className="text-xs font-normal opacity-70">
            {liked ? "GF approved!" : "GF friendly?"}
          </span>
        </button>

        {liked && (
          <p className="text-[11px] text-amber-600 font-medium animate-pulse">
            ✓ You marked this article as gluten-free friendly
          </p>
        )}
      </div>
    </>
  );
}
