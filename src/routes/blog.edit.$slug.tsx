import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Image as ImageIcon, Upload } from "lucide-react";
import { getPostForEdit, updatePost, updateMyProfile } from "@/lib/blog.functions";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { COUNTRIES } from "@/data/countries";
import { toast } from "sonner";

export const Route = createFileRoute("/blog/edit/$slug")({
  component: EditPostPage,
});

function EditPostPage() {
  const { slug } = Route.useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const fetchForEdit = useServerFn(getPostForEdit);
  const submitUpdate = useServerFn(updatePost);
  const updateProfile = useServerFn(updateMyProfile);

  const { data, isLoading, error } = useQuery({
    queryKey: ["blog-edit", slug],
    queryFn: () => fetchForEdit({ data: { slug } }),
    enabled: !!user,
    retry: false,
  });

  const post = data?.post;
  const isAdmin = data?.isAdmin ?? false;
  const isAuthor = !!user && !!post && user.id === post.author_id;

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [city, setCity] = useState("");
  const [hotel, setHotel] = useState("");
  const [restaurant, setRestaurant] = useState("");
  const [tags, setTags] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [publishedAs, setPublishedAs] = useState("");
  const [status, setStatus] = useState("published");
  const [isFeatured, setIsFeatured] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", search: { redirect: `/blog/edit/${slug}` } as any });
  }, [user, loading, navigate, slug]);

  useEffect(() => {
    if (post) {
      setTitle(post.title ?? "");
      setExcerpt(post.excerpt ?? "");
      setContent(post.content ?? "");
      setCountryCode(post.country_code ?? "");
      setCity(post.city ?? "");
      setHotel(post.hotel_name ?? "");
      setRestaurant(post.restaurant_name ?? "");
      setTags((post.tags ?? []).join(", "));
      setCoverUrl(post.cover_image_url ?? "");
      setStatus(post.status ?? "published");
      setIsFeatured(post.is_featured ?? false);
    }
    if (data?.authorName) setPublishedAs(data.authorName);
  }, [post, data]);

  const mut = useMutation({
    mutationFn: async () => {
      if (isAuthor && publishedAs.trim()) {
        await updateProfile({ data: { full_name: publishedAs.trim() } });
      }
      const country = COUNTRIES.find((c) => c.slug === countryCode);
      return submitUpdate({
        data: {
          id: post!.id,
          title,
          excerpt: excerpt || undefined,
          content,
          cover_image_url: coverUrl || null,
          country_code: countryCode || null,
          country_name: country?.name ?? null,
          city: city || null,
          hotel_name: hotel || null,
          restaurant_name: restaurant || null,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 8),
          ...(isAdmin ? { status: status as any, is_featured: isFeatured } : {}),
        },
      });
    },
    onSuccess: (res: any) => {
      toast.success("Article updated!");
      navigate({ to: "/blog/$slug", params: { slug: res.slug } });
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to update"),
  });

  const handleUpload = async (file: File) => {
    if (!user) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("blog-images").upload(path, file, { upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from("blog-images").getPublicUrl(path);
      setCoverUrl(data.publicUrl);
      toast.success("Cover image uploaded");
    } catch (e: any) {
      toast.error(e.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (!user || isLoading) {
    return <main className="flex-1 px-5 py-20 text-center text-muted-foreground">Loading…</main>;
  }

  if (error || !post) {
    return (
      <main className="mx-auto max-w-2xl flex-1 px-5 py-20 text-center">
        <h1 className="font-display text-4xl">Not found or no access</h1>
        <Link to="/blog" className="mt-6 inline-block"><Button variant="outline">Back to blog</Button></Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-12">
      <Link to="/blog/$slug" params={{ slug }} className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to article
      </Link>

      <div className="flex items-center gap-3">
        <h1 className="font-display text-4xl">Edit article</h1>
        {isAdmin && <Badge className="bg-primary/10 text-primary">Admin</Badge>}
      </div>
      <p className="mt-2 text-muted-foreground">Changes are saved immediately and visible on the article page.</p>

      <div className="mt-8 space-y-5">
        {isAuthor && (
          <div>
            <Label>Published as *</Label>
            <Input value={publishedAs} onChange={(e) => setPublishedAs(e.target.value)} placeholder="Your name or brand" maxLength={120} />
            <p className="mt-1 text-xs text-muted-foreground">The author name shown on this article. Also updates your profile name.</p>
          </div>
        )}

        <div>
          <Label>Title *</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="My week eating gluten-free in Rome" maxLength={160} />
        </div>

        <div>
          <Label>Cover image</Label>
          <div className="mt-1 flex items-center gap-3">
            {coverUrl ? (
              <img src={coverUrl} alt="" className="h-20 w-32 rounded-lg object-cover" />
            ) : (
              <div className="grid h-20 w-32 place-items-center rounded-lg bg-muted text-muted-foreground"><ImageIcon className="h-6 w-6" /></div>
            )}
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm hover:bg-muted">
              <Upload className="h-4 w-4" />
              {uploading ? "Uploading…" : "Upload"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
            </label>
            {coverUrl && <button onClick={() => setCoverUrl("")} className="text-xs text-rose-500 hover:underline">Remove</button>}
          </div>
        </div>

        <div>
          <Label>Short summary</Label>
          <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="One or two sentences shown on cards" maxLength={300} rows={2} />
        </div>

        <div>
          <Label>Story *</Label>
          <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={14} maxLength={20000} />
          <p className="mt-1 text-xs text-muted-foreground">{content.length} / 20000 characters</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Country</Label>
            <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="">Select…</option>
              {COUNTRIES.map((c) => (
                <option key={c.slug} value={c.slug}>{c.flag} {c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>City</Label>
            <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Rome" maxLength={80} />
          </div>
          <div>
            <Label>Hotel</Label>
            <Input value={hotel} onChange={(e) => setHotel(e.target.value)} placeholder="e.g. Hotel Artemide" maxLength={120} />
          </div>
          <div>
            <Label>Restaurant</Label>
            <Input value={restaurant} onChange={(e) => setRestaurant(e.target.value)} placeholder="e.g. Mama Eat" maxLength={120} />
          </div>
        </div>

        <div>
          <Label>Tags (comma separated, max 8)</Label>
          <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="turkey, hotel, family-friendly" />
        </div>

        {isAdmin && (
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-4">
            <p className="text-sm font-semibold text-primary">Admin controls</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Status</Label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="published">Published</option>
                  <option value="pending">Pending review</option>
                  <option value="draft">Draft</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="flex items-center gap-3 mt-6">
                <input type="checkbox" id="featured" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="h-4 w-4" />
                <Label htmlFor="featured">Featured article</Label>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => navigate({ to: "/blog/$slug", params: { slug } })}>Cancel</Button>
          <Button
            disabled={title.length < 5 || content.length < 50 || mut.isPending}
            onClick={() => mut.mutate()}
          >
            {mut.isPending ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </div>
    </main>
  );
}
