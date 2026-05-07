// OpenStreetMap-backed restaurant search.
// Uses Nominatim for geocoding and Overpass for tagged restaurants.
// No API key required. Cached per place name in-memory.

export type OsmRestaurant = {
  slug: string; // e.g. "node-12345"
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
  bbox: [number, number, number, number]; // south, north, west, east
};

const NOMINATIM = "https://nominatim.openstreetmap.org/search";
const OVERPASS = "https://overpass-api.de/api/interpreter";

const placeCache = new Map<string, GeocodedPlace>();
const resultsCache = new Map<string, OsmRestaurant[]>();

export async function geocodePlace(query: string): Promise<GeocodedPlace | null> {
  const key = query.trim().toLowerCase();
  if (!key) return null;
  if (placeCache.has(key)) return placeCache.get(key)!;
  const url = `${NOMINATIM}?format=json&limit=1&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error("Could not look up that place.");
  const data = await res.json();
  if (!data?.length) return null;
  const r = data[0];
  const bb = r.boundingbox.map(parseFloat) as [number, number, number, number];
  const place: GeocodedPlace = {
    displayName: r.display_name,
    lat: parseFloat(r.lat),
    lng: parseFloat(r.lon),
    bbox: [bb[0], bb[1], bb[2], bb[3]],
  };
  placeCache.set(key, place);
  return place;
}

function elementToRestaurant(el: any): OsmRestaurant | null {
  const tags = el.tags || {};
  if (!tags.name) return null;
  const lat = el.lat ?? el.center?.lat;
  const lng = el.lon ?? el.center?.lon;
  if (lat == null || lng == null) return null;
  const diet =
    tags["diet:gluten_free"] === "only"
      ? "only"
      : tags["diet:gluten_free"] === "yes"
        ? "yes"
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
    osmType: el.type,
    osmId: el.id,
    name: tags.name,
    cuisine: tags.cuisine?.replace(/;/g, ", "),
    diet,
    lat,
    lng,
    address: addressParts.join(", ") || undefined,
    city: tags["addr:city"],
    country: tags["addr:country"],
    phone: tags.phone || tags["contact:phone"],
    website: tags.website || tags["contact:website"],
    openingHours: tags.opening_hours,
    takeaway: tags.takeaway,
    outdoorSeating: tags.outdoor_seating,
    wheelchair: tags.wheelchair,
    tags,
  };
}

export async function searchGlutenFree(place: string): Promise<{ place: GeocodedPlace; results: OsmRestaurant[] } | null> {
  const cacheKey = place.trim().toLowerCase();
  const geo = await geocodePlace(place);
  if (!geo) return null;
  if (resultsCache.has(cacheKey)) {
    return { place: geo, results: resultsCache.get(cacheKey)! };
  }
  const [s, n, w, e] = geo.bbox;
  const bbox = `${s},${w},${n},${e}`;
  const q = `
    [out:json][timeout:25];
    (
      nwr["amenity"~"restaurant|cafe|fast_food|bakery"]["diet:gluten_free"="only"](${bbox});
      nwr["amenity"~"restaurant|cafe|fast_food|bakery"]["diet:gluten_free"="yes"](${bbox});
      nwr["shop"="bakery"]["diet:gluten_free"="only"](${bbox});
    );
    out center tags 200;
  `;
  const res = await fetch(OVERPASS, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `data=${encodeURIComponent(q)}`,
  });
  if (!res.ok) throw new Error("Restaurant search is busy. Try again in a moment.");
  const data = await res.json();
  const results = (data.elements || [])
    .map(elementToRestaurant)
    .filter((x: OsmRestaurant | null): x is OsmRestaurant => !!x)
    .sort((a: OsmRestaurant, b: OsmRestaurant) => {
      // diet:only first, then yes
      const order = (d: OsmRestaurant["diet"]) => (d === "only" ? 0 : d === "yes" ? 1 : 2);
      return order(a.diet) - order(b.diet) || a.name.localeCompare(b.name);
    });
  resultsCache.set(cacheKey, results);
  return { place: geo, results };
}

export async function fetchRestaurantBySlug(slug: string): Promise<OsmRestaurant | null> {
  const m = slug.match(/^(node|way|relation)-(\d+)$/);
  if (!m) return null;
  const [, type, id] = m;
  const q = `[out:json][timeout:15];${type}(${id});out center tags;`;
  const res = await fetch(OVERPASS, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `data=${encodeURIComponent(q)}`,
  });
  if (!res.ok) return null;
  const data = await res.json();
  const el = (data.elements || [])[0];
  return el ? elementToRestaurant(el) : null;
}

export function dietLabel(d: OsmRestaurant["diet"]) {
  if (d === "only") return { label: "100% gluten-free", tone: "emerald" as const };
  if (d === "yes") return { label: "Gluten-free options", tone: "amber" as const };
  return { label: "Unverified", tone: "muted" as const };
}
