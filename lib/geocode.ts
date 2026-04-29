import { db } from "@/db";
import { geocodingCache } from "@/db/schema";
import { eq } from "drizzle-orm";

const NOMINATIM = "https://nominatim.openstreetmap.org/search";
const USER_AGENT = "FondosEU bot (https://fondoseu.org/contacto)";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export interface GeoResult {
  lat: number | null;
  lng: number | null;
  resolved: boolean;
}

export async function geocode(
  address: string,
  city: string,
  postalCode: string,
  country = "España"
): Promise<GeoResult> {
  const query = `${address}, ${postalCode} ${city}, ${country}`
    .trim()
    .replace(/\s+/g, " ");

  // Check cache first
  const cached = await db
    .select()
    .from(geocodingCache)
    .where(eq(geocodingCache.query, query))
    .limit(1);

  if (cached.length > 0) {
    return {
      lat: cached[0].lat,
      lng: cached[0].lng,
      resolved: cached[0].resolved,
    };
  }

  // Rate limit: 1 req/s for Nominatim
  await sleep(1100);

  try {
    const url = new URL(NOMINATIM);
    url.searchParams.set("q", query);
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", "1");
    url.searchParams.set("countrycodes", "es");

    const res = await fetch(url.toString(), {
      headers: { "User-Agent": USER_AGENT },
    });

    if (!res.ok) throw new Error(`Nominatim HTTP ${res.status}`);

    const data = await res.json();
    const result: GeoResult =
      data.length > 0
        ? { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), resolved: true }
        : { lat: null, lng: null, resolved: false };

    // Save to cache
    await db.insert(geocodingCache).values({
      query,
      lat: result.lat,
      lng: result.lng,
      resolved: result.resolved,
    });

    return result;
  } catch (err) {
    console.error(`Geocoding failed for "${query}":`, err);
    // Cache negative result to avoid retrying
    await db.insert(geocodingCache).values({ query, resolved: false }).catch(() => {});
    return { lat: null, lng: null, resolved: false };
  }
}
