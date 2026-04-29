import type { MetadataRoute } from "next";
import { db } from "@/db";
import { funds } from "@/db/schema";
import { eq } from "drizzle-orm";
import { CCAA_LIST } from "@/lib/ccaa-data";

export const dynamic = "force-dynamic";

const BASE = "https://fondoseu.org";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const openFunds = await db
    .select({ slug: funds.slug, updatedAt: funds.updatedAt })
    .from(funds)
    .where(eq(funds.status, "abierta"));

  const fundUrls: MetadataRoute.Sitemap = openFunds.map((f) => ({
    url: `${BASE}/fondos/${f.slug}`,
    lastModified: f.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const ccaaUrls: MetadataRoute.Sitemap = CCAA_LIST.map((c) => ({
    url: `${BASE}/ayudas/${c.slug}`,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE}/buscar`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/mapa`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/wizard`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/calendario`, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/fondos-europeos`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/sobre`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/contacto`, changeFrequency: "monthly", priority: 0.4 },
  ];

  return [...staticPages, ...ccaaUrls, ...fundUrls];
}
