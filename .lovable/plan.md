## Fase 1 — Dashboard, Trips, Restaurants, Emergency

Vier nieuwe pagina's bovenop het bestaande GlutenGo project. Restaurants als seed data, Trips volledig in Supabase, Emergency public, Dashboard vervangt huidige `/dashboard`.

---

### 1. Database (één migratie)

Nieuwe tabellen + RLS (`auth.uid() = user_id`):

- **`trips`** — `title, destination_country, destination_city, country_code, start_date, end_date, status ('planning'|'active'|'completed'), notes`. *(Bestaande `trips` tabel wordt uitgebreid: `title`, `destination_country`, `destination_city`, `status` toegevoegd; `destination` blijft voor backward compat.)*
- **`saved_restaurants`** — `restaurant_id (text, slug), trip_id (nullable)`, unique(user_id, restaurant_id).
- **`trip_checklist_items`** — `trip_id, label, is_completed, sort_order`. Trigger seed default 8 items bij nieuwe trip.

---

### 2. Restaurant Finder — `/restaurants` (protected)

- **Seed file** `src/data/restaurants.ts` met 15 restaurants (Tokyo/Rome/Barcelona/Amsterdam/Bangkok) — slug, naam, cuisine, city, country, countryCode, lat/lng, gfScore, badges (certified/separate-kitchen/separate-fryer/trained-staff), crossContaminationRisk, priceTier, rating, reviewCount, description, hours, address.
- **`/restaurants`**: header, zoekbalk (filter op city/country/name), filter chips (All / Certified / Separate kitchen / 4.0+ / €/€€/€€€), grid van `RestaurantCard`.
- **`RestaurantCard`**: GlutenSafe score cirkel (groen 80+, oranje 50-79, rood <50), badges, risk badge, ❤️ save toggle (insert/delete `saved_restaurants`), rating, "Bekijk details".
- **`/restaurants/$slug`**: detail layout, "Open in Google Maps", openingstijden, kruisbesmetting info, 3 demo reviews (hardcoded in seed), "Opslaan in mijn reis" dropdown (kies trip).

---

### 3. Trip Planner — `/trips` (protected)

- **`/trips`**: header + "+ Plan new trip", lege staat (vliegtuig icoon + CTA), trip cards (vlag, datums, status badge, counts saved restaurants/cards, "Open trip").
- **`/trips/new`**: form (country dropdown met `countries.ts`, city, start/end date via shadcn Calendar in Popover, title, notes) → insert trip → redirect.
- **`/trips/$id`**: header (vlag + bestemming + data + edit), 5 tabs (shadcn Tabs):
  1. **Overview** — bewerkbare notes, stats, "Generate travel pack PDF" knop (subscription gate).
  2. **Restaurants** — lijst gekoppelde restaurants, link naar finder.
  3. **Translation Cards** — bestaande cards filter op trip (geen koppeling DB nu — toon alle user cards + "+ Genereer").
  4. **Checklist** — items met checkbox, "+ Voeg item toe".
  5. **Travel Pack** — jsPDF client-side: titelpagina, restaurants tabel, checklist, notes. Free plan → upgrade CTA.

---

### 4. Emergency Phrases — `/emergency` (PUBLIC)

- Hardcoded data file `src/data/emergencyPhrases.ts` met 6 phrases per land voor: Japan, Thailand, Italië, Spanje, USA, Duitsland, Frankrijk, Nederland (medical emergency, celiac+gluten, pharmacy, hospital direction, allergic reaction, call ambulance) — origineel + vertaling + phonetic.
- Land selector (grid van vlaggen).
- Phrase cards met Copy + Fullscreen modal (witte bg, grote tekst, tap to close).
- Onderaan: alarmnummers tabel (EU/Japan/Thailand/USA/Australia).
- Geen login required — toegevoegd buiten `_app` layout.

---

### 5. Persoonlijk Dashboard — `/dashboard` (vervang bestaand)

Refactor huidige `src/routes/_app/dashboard.tsx`:

- **Welkomst**: "Goedemorgen/middag/avond, {naam} 👋" (op basis `new Date().getHours()`).
- **Sectie 1**: 4 quick actions grid (Nieuwe kaart, Restaurant zoeken, Landengids, Vraag de AI).
- **Sectie 2**: Active trip widget (eerste trip met `status='active'` of upcoming) of empty state.
- **Sectie 3**: 3 recente translation cards.
- **Sectie 4**: Plan status — bestaande `useSubscription` + cards/AI usage progress (free) of "Manage billing" (paid). Behoudt huidige Manage billing logica.
- **Sectie 5**: Tip van de dag (hash van date → index in 10-tips array) + aanbevolen guide o.b.v. eerste trip country.

---

### 6. Navigatie & footer

- **Header** (`src/components/site-header.tsx`): nav items toevoegen "Restaurants", "Trips", "Emergency". Desktop links + mobile menu.
- **Footer**: nieuwe Product links naar /restaurants, /trips, /emergency (en /scan placeholder).

---

### Technical details

- Alle nieuwe routes onder `src/routes/_app/` behalve `emergency.tsx` (top-level public).
- File naming: `_app/restaurants.tsx`, `_app/restaurants.$slug.tsx`, `_app/trips.tsx`, `_app/trips.new.tsx`, `_app/trips.$id.tsx`.
- Loading skeletons (`Skeleton`) voor DB-driven lijsten.
- Lege staten met CTA op alle lijsten.
- jsPDF via `bun add jspdf`.
- Save-restaurant button: optimistic toggle via TanStack Query.
- Trip checklist defaults via DB trigger op `INSERT INTO trips`.

---

### Buiten scope (Fase 2)

Ingredient Scanner (`/scan`), Community Reviews schrijven, Notifications, Offline management — komen in volgende ronde.
