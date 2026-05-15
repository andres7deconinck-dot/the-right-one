## Doel
Een community-blog op `/blog` waar elke ingelogde gebruiker reisartikelen kan plaatsen (met locatie, hotel, persoon, badges), plus een `/admin`-paneel waar jij artikelen modereert, verifieert en gebruikers beheert. Admin-rechten worden gekoppeld aan jouw account `Andres7deconinck@gmail.com`.

## Belangrijke opmerking over het wachtwoord
Ik kan jouw wachtwoord (`Andres1327*`) niet hardcoden — dat zou onveilig zijn en bovendien niet werken (Supabase Auth slaat alleen gehashte wachtwoorden op). In plaats daarvan:
1. Jij registreert eenmalig via `/auth` met `Andres7deconinck@gmail.com` + dat wachtwoord.
2. Ik geef dat e-mailadres automatisch admin-rechten via een database-trigger (zodra die account aangemaakt wordt → krijgt de rol `admin`).
3. Daarna log je gewoon in en zie je `/admin` in het menu verschijnen.

## Database (migraties)

**Nieuwe enum + tabel `user_roles`** (veilige rolopslag, los van `profiles`):
- `app_role`: `admin` | `verified` | `user`
- `user_roles(id, user_id, role, unique(user_id, role))`
- Security-definer functie `has_role(user_id, role)` om RLS recursie te vermijden
- Trigger op `auth.users`: zodra `Andres7deconinck@gmail.com` registreert → automatisch `admin` rol

**Nieuwe tabel `blog_posts`**
- `id`, `author_id` (uuid), `title`, `slug` (uniek), `excerpt`, `content` (markdown/text), `cover_image_url`
- Locatievelden: `country_code`, `city`, `hotel_name`, `restaurant_name`, `latitude`, `longitude`
- Meta: `tags` (text[]), `status` (`draft` | `published` | `pending` | `rejected`), `is_featured` (bool), `verified_by_admin` (bool)
- Tellers: `views`, `likes`, `created_at`, `updated_at`, `published_at`

**Nieuwe tabel `blog_comments`** (id, post_id, author_id, body, created_at) — optioneel maar aanbevolen.

**Storage bucket `blog-images`** (publiek lezen) voor cover-foto's en inline beelden.

**RLS-policies**
- `blog_posts`: iedereen mag `published` lezen; auteur mag eigen posts CRUD; admin (via `has_role`) mag alles.
- `blog_comments`: iedereen leest, ingelogde users plaatsen, eigen verwijderen, admin alles.
- `user_roles`: alleen admin schrijft; user leest eigen rollen.

## Frontend routes

**Publiek**
- `/blog` — feed met alle gepubliceerde artikelen (filters: land, tags, geverifieerd, recent/populair). Vervangt huidige "coming soon" pagina.
- `/blog/$slug` — volledig artikel met locatiekaartje (hotel/restaurant + land), auteur met geverifieerd-badge ✓, like-knop, comments, share-knoppen, gerelateerde artikelen.

**Voor ingelogde users**
- `/blog/new` — editor met velden: titel, cover-foto upload, rich content (markdown), land-dropdown (uit bestaande `countries.ts`), stad, hotel, restaurant, tags. Submit → status `pending` (wacht op admin) of `published` als auteur al geverifieerd is.
- `/blog/edit/$id` — eigen post bewerken.
- Knop "Schrijf een artikel" zichtbaar op `/blog` voor ingelogden, anders → naar `/auth`.

**Admin** (`/_app/admin` bestaat al voor subscribers — uitbreiden met tabs)
- Tab **Subscribers** (huidig)
- Tab **Blog moderation**: lijst pending/published posts → goedkeuren / afwijzen / verwijderen / featuren / verifiëren
- Tab **Users**: lijst gebruikers, knop "Geef geverifieerd-badge", "Maak admin", "Blokkeer"
- Tab **Stats**: aantal posts, views, top-auteurs, posts per land
- Toegang via `has_role(auth.uid(), 'admin')` — niet meer hardcoded e-mailcheck.

## Navigatie
- "Blog" link verschuiven van footer naar **hoofdnavigatie** in `site-header.tsx` (zowel desktop nav als mobile menu).
- Voor admins extra "Admin"-link met shield-icoon in de header.

## Extra features die ik voorstel toe te voegen
1. **Geverifieerd-badge ✓** op auteurs (zoals Twitter/X) — admin kent toe aan échte celiac-reizigers.
2. **Locatie-pin** op artikelkaartje + mini-kaartje op detailpagina (Leaflet, gratis).
3. **Hotel/restaurant linking**: bij invoer kan de auteur kiezen uit bestaande `restaurants.ts` of nieuwe naam typen.
4. **Land-filter** zodat lezers snel "alle artikels uit Italië" zien — sluit aan bij bestaande country guides.
5. **"Helpful" reacties** + comments per post.
6. **Reading time** (auto berekend) en **publicatiedatum**.
7. **Featured posts carrousel** bovenaan `/blog`, beheerd vanuit admin.
8. **SEO per post**: dynamische `og:title`, `og:description`, `og:image` (cover) per slug, plus JSON-LD `Article` schema.
9. **Sitemap.xml** automatisch uitgebreid met blog-slugs.
10. **Email-notificatie** naar admin bij elke nieuwe pending post (later optioneel via Resend).
11. **Markdown preview** in de editor met simpele toolbar (bold/italic/heading/link/image).
12. **Rate-limit**: max 3 posts per dag per user om spam te voorkomen.

## Technische details
- Server functies (`createServerFn` + `requireSupabaseAuth`) voor: createPost, updatePost, deletePost, listPendingPosts, approvePost, verifyUser, toggleAdmin.
- Image-uploads via `supabase.storage.from('blog-images').upload(...)` direct vanuit de browser.
- Slugs auto-gegenereerd uit titel met uniciteitscheck.
- Bestaande `/_app/admin` route uitbreiden i.p.v. nieuwe — admin gate via `has_role` ipv hardcoded email.

## Stappenplan (uitvoering na goedkeuring)
1. Migratie: enum, `user_roles`, `blog_posts`, `blog_comments`, `has_role`, trigger voor jouw email, storage bucket, RLS.
2. Server functies voor blog CRUD + admin acties.
3. Nieuwe routes: `/blog` (feed), `/blog/$slug`, `/blog/new`, `/blog/edit/$id`.
4. `/_app/admin` uitbreiden met blog-moderatie + user-management tabs, admin-check via `has_role`.
5. `site-header.tsx`: Blog naar hoofdnav + Admin-link voor admins.
6. SEO + sitemap update.
7. Jij registreert eenmalig met je e-mail/wachtwoord → krijgt automatisch admin.