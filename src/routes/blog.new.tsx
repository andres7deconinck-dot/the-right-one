import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Image as ImageIcon, Upload } from "lucide-react";
import { createPost } from "@/lib/blog.functions";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { COUNTRIES } from "@/data/countries";
import { toast } from "sonner";

export const Route = createFileRoute("/blog/new")({
  component: NewPostPage,
});

function NewPostPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const submit = useServerFn(createPost);

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [city, setCity] = useState("");
  const [hotel, setHotel] = useState("");
  const [restaurant, setRestaurant] = useState("");
  const [tags, setTags] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", search: { redirect: "/blog/new" } as any });
  }, [user, loading, navigate]);

  const mut = useMutation({
    mutationFn: () => {
      const country = COUNTRIES.find((c) => c.slug === countryCode);
      return submit({
        data: {
          title,
          excerpt,
          content,
          cover_image_url: coverUrl || null,
          country_code: countryCode || null,
          country_name: country?.name ?? null,
          city: city || null,
          hotel_name: hotel || null,
          restaurant_name: restaurant || null,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 8),
        },
      });
    },
    onSuccess: (res: any) => {
      if (res.status === "published") {
        toast.success("Article published!");
        navigate({ to: "/blog/$slug", params: { slug: res.slug } });
      } else {
        toast.success("Submitted! Awaiting admin review.");
        navigate({ to: "/blog" });
      }
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to publish"),
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

  if (!user) return null;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-12">
        <h1 className="font-display text-4xl">Write a travel story</h1>
        <p className="mt-2 text-muted-foreground">
          Share your gluten-free travel experience. Our team reviews each story before publishing — verified contributors are auto-approved.
        </p>

        <div className="mt-8 space-y-5">
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
            </div>
          </div>

          <div>
            <Label>Short summary</Label>
            <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="One or two sentences shown on cards" maxLength={300} rows={2} />
          </div>

          <div>
            <Label>Story *</Label>
            <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Tell us about your trip — what was safe, what to avoid, restaurants and hotels you'd recommend…" rows={14} maxLength={20000} />
            <p className="mt-1 text-xs text-muted-foreground">{content.length} / 20000 characters · {Math.max(1, Math.round(content.split(/\s+/).filter(Boolean).length / 220))} min read</p>
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
            <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="rome, pizza, family-friendly" />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => navigate({ to: "/blog" })}>Cancel</Button>
            <Button
              disabled={title.length < 5 || content.length < 50 || mut.isPending}
              onClick={() => mut.mutate()}
            >
              {mut.isPending ? "Submitting…" : "Submit article"}
            </Button>
          </div>
        </div>
    </main>
  );
}
