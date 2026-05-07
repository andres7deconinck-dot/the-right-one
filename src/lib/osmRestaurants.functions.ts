import { createServerFn } from "@tanstack/react-start";

export type OsmRestaurant = {
  slug: string;
  osmType: "node" | "way" | "relation";
  osmId: number;
  name: string;
  cuisine?: string;
  diet: "only" | "yes" | "unknown";
  lat: number;
  lng: number;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  website?: string;
  openingHours?: string;
  takeaway?: string;
  outdoorSeating?: string;
  wheelchair?: string;
  tags: Record<string, string>;
};

export type GeocodedPlace = {
  displayName: string;
  lat: number;
  lng: number;
  bbox: [number, number, number, number];
};

const NOMINATIM = "https://nominatim.openstreetmap.org/search";
const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
];
const UA = { "User-Agent": "GlutenGo/1.0 (gluten-free travel app)" };

function elementToRestaurant(el: any): OsmRestaurant | null {
  const tags = el.tags || {};
  if (!tags.name) return null;
  const lat = el.lat ?? el.center?.lat;
  const lng = el.lon ?? el.center?.lon;
  if (lat == null || lng == null) return null;
  const diet =
    tags["diet:gluten_free"] === "only" ? "only"
    : tags["diet:gluten_free"] === "yes" ? "yes"
    : "unknown";
  const addressParts = [
    tags["addr:housenumber"] && tags["addr:street"]
      ? `${tags["addr:street"]} ${tags["addr:housenumber"]}`
      : tags["addr:street"],
    tags["addr:postcode"],
    tags["addr:city"],
  ].filter(Boolean);
  return {
    slug: `${el.type}-${el.id}`,
    osmType: el.type, osmId: el.id, name: tags.name,
    cuisine: tags.cuisine?.replace(/;/g, ", "),
    diet, lat, lng,
    address: addressParts.join(", ") || undefined,
    city: tags["addr:city"], country: tags["addr:country"],
    phone: tags.phone || tags["contact:phone"],
    website: tags.website || tags["contact:website"],
    openingHours: tags.opening_hours,
    takeaway: tags.takeaway,
    outdoorSeating: tags.outdoor_seating,
    wheelchair: tags.wheelchair,
    tags,
  };
}

async function overpass(query: string): Promise<any> {
  let lastErr: any;
  for (const url of OVERPASS_ENDPOINTS) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded", ...UA },
        body: `data=${encodeURIComponent(query)}`,
      });
      if (res.ok) return await res.json();
      lastErr = new Error(`Overpass ${res.status}`);
    } catch (e) { lastErr = e; }
  }
  throw lastErr || new Error("Overpass unavailable");
}

export const searchGlutenFree = createServerFn({ method: "GET" })
  .inputValidator((data: { place: string }) => data)
  .handler(async ({ data }): Promise<{ place: GeocodedPlace; results: OsmRestaurant[] } | null> => {
    const place = data.place.trim();
    if (!place) return null;
    const geoRes = await fetch(`${NOMINATIM}?format=json&limit=1&q=${encodeURIComponent(place)}`, {
      headers: { Accept: "application/json", ...UA },
    });
    if (!geoRes.ok) throw new Error("Could not look up that place.");
    const geoData = await geoRes.json();
    if (!geoData?.length) return null;
    const r = geoData[0];
    const bb = r.boundingbox.map(parseFloat) as [number, number, number, number];
    const geo: GeocodedPlace = {
      displayName: r.display_name,
      lat: parseFloat(r.lat), lng: parseFloat(r.lon),
      bbox: [bb[0], bb[1], bb[2], bb[3]],
    };
    const [s, n, w, e] = geo.bbox;
    const bbox = `${s},${w},${n},${e}`;
    const q = `[out:json][timeout:25];(nwr["amenity"~"restaurant|cafe|fast_food|bakery"]["diet:gluten_free"="only"](${bbox});nwr["amenity"~"restaurant|cafe|fast_food|bakery"]["diet:gluten_free"="yes"](${bbox});nwr["shop"="bakery"]["diet:gluten_free"="only"](${bbox}););out center tags 200;`;
    const json = await overpass(q);
    const results: OsmRestaurant[] = (json.elements || [])
      .map(elementToRestaurant)
      .filter((x: OsmRestaurant | null): x is OsmRestaurant => !!x)
      .sort((a: OsmRestaurant, b: OsmRestaurant) => {
        const order = (d: OsmRestaurant["diet"]) => (d === "only" ? 0 : d === "yes" ? 1 : 2);
        return order(a.diet) - order(b.diet) || a.name.localeCompare(b.name);
      });
    return { place: geo, results };
  });

export const fetchRestaurantBySlug = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }): Promise<OsmRestaurant | null> => {
    const m = data.slug.match(/^(node|way|relation)-(\d+)$/);
    if (!m) return null;
    const [, type, id] = m;
    const json = await overpass(`[out:json][timeout:15];${type}(${id});out center tags;`);
    const el = (json.elements || [])[0];
    return el ? elementToRestaurant(el) : null;
  });

export function dietLabel(d: OsmRestaurant["diet"]) {
  if (d === "only") return { label: "100% gluten-free", tone: "emerald" as const };
  if (d === "yes") return { label: "Gluten-free options", tone: "amber" as const };
  return { label: "Unverified", tone: "muted" as const };
}
