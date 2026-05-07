# Prijsverhoging pricing pagina

## Doel
Prijzen iets premiumer maken, met behoud van psychologisch aantrekkelijke prijspunten en duidelijke "2 maanden gratis"-jaarkorting.

## Nieuwe prijzen

| Plan | Maandelijks | Jaarlijks | Effectief / maand (jaar) | Besparing /jaar |
|---|---|---|---|---|
| Free | €0 | €0 | — | — |
| Traveler | €12.99 | €119 | €9.92 | €36.88 |
| Family | €24.99 | €229 | €19.08 | €70.88 |

## Wijzigingen

**1. `src/routes/pricing.tsx` — `PLANS` array**
- Traveler: `monthly: 12.99, yearly: 119`
- Family: `monthly: 24.99, yearly: 229`

**2. `priceLabel()` functie**
Huidige formattering toont `€${plan.monthly}` — dat rendert `€12.99` correct, maar de "yearly"-tak doet `(yearly/12).toFixed(2)` → `€9.92` / `€19.08`. Dat blijft kloppen, geen aanpassing nodig.

**3. `src/routes/index.tsx` — pricing teaser sectie**
Huidige zin: *"3 cards/month free, forever. €9/month for unlimited everything."*
Vervangen door: *"3 cards/month free, forever. From €12.99/month for unlimited everything."*

**4. SEO meta description op `/pricing`**
Huidige tekst noemt €9 en €19 — bijwerken naar €12.99 en €24.99.

## Niet-wijzigingen
- Vergelijkingstabel, FAQ, betaalmethode-strip en garantie-badge blijven hetzelfde.
- Paddle products/prices: nog niet aangemaakt — dus geen sync nodig. Wanneer je later de checkout activeert, maken we de Paddle prices direct aan met deze bedragen, zodat front-end en Paddle in sync zijn.

## Out of scope
- Werkende Paddle checkout knoppen (apart vervolgtraject).
- Andere pagina's die geen prijs noemen.
