/**
 * Ingestión de Puntos de Atención al Emprendedor (PAE)
 * Fuente: https://paeelectronico.es
 * Uso: npx dotenv-cli -e .env.local -- tsx scripts/ingest-pae.ts
 */
import axios from "axios";
import * as cheerio from "cheerio";
import { db } from "../db";
import { assistancePoints, geocodingCache } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { normalizeRegion } from "../lib/normalize-region";

const BASE = "https://paeelectronico.es";
const SEARCH_URL =
  "https://paeelectronico.es/es-es/CreaEmpresaConAyuda/Paginas/ResultadosBuscadorPAE.aspx";
const UA = "FondosEU bot (https://fondoseu.org/contacto)";
const DELAY_MS = 1200;

const http = axios.create({
  baseURL: BASE,
  timeout: 20000,
  headers: {
    "User-Agent": UA,
    Accept: "text/html,application/xhtml+xml",
  },
});

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// ── Geocodificación con caché BD ─────────────────────────────────────────────

async function geocodeAddress(
  address: string,
  postalCode: string,
  city: string
): Promise<{ lat: number | null; lng: number | null }> {
  const query = `${address}, ${postalCode} ${city}, España`.trim().replace(/\s+/g, " ");

  const cached = await db
    .select()
    .from(geocodingCache)
    .where(eq(geocodingCache.query, query))
    .limit(1);

  if (cached.length > 0) {
    return { lat: cached[0].lat ?? null, lng: cached[0].lng ?? null };
  }

  await sleep(DELAY_MS); // Nominatim rate limit

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=es`;
    const res = await axios.get(url, {
      headers: { "User-Agent": UA },
      timeout: 10000,
    });

    const data = res.data;
    const lat = data[0] ? parseFloat(data[0].lat) : null;
    const lng = data[0] ? parseFloat(data[0].lon) : null;
    const resolved = lat !== null;

    await db
      .insert(geocodingCache)
      .values({ query, lat, lng, resolved })
      .onConflictDoNothing();

    return { lat, lng };
  } catch {
    await db
      .insert(geocodingCache)
      .values({ query, resolved: false })
      .onConflictDoNothing();
    return { lat: null, lng: null };
  }
}

// ── Scraping ─────────────────────────────────────────────────────────────────

interface RawPAE {
  id: string;
  name: string;
  type: string;
  address: string;
  postalCode: string;
  city: string;
  province: string;
  phone: string;
  email: string;
  website: string;
  raw: string;
}

async function fetchResultPage(url: string, cookies: string): Promise<cheerio.CheerioAPI> {
  await sleep(DELAY_MS);
  const res = await http.get(url, {
    headers: { Cookie: cookies },
    maxRedirects: 5,
  });
  return cheerio.load(res.data);
}

function extractCookies(headers: Record<string, string | string[]>): string {
  const setCookie = headers["set-cookie"];
  if (!setCookie) return "";
  const cookies = Array.isArray(setCookie) ? setCookie : [setCookie];
  return cookies.map((c) => c.split(";")[0]).join("; ");
}

async function scrapeListPage($: cheerio.CheerioAPI): Promise<RawPAE[]> {
  const points: RawPAE[] = [];

  // PAE results are typically in a table or list — try multiple selectors
  $("table tr, .pae-result, .resultado-pae, .ms-listviewtable tr").each((_, row) => {
    const cells = $(row).find("td");
    if (cells.length < 2) return;

    // Try to extract id_pait from any link in the row
    const link = $(row).find("a[href*='id_pait']").first();
    const href = link.attr("href") ?? "";
    const idMatch = href.match(/id_pait=(\d+)/i);
    if (!idMatch) return;

    const id = idMatch[1];
    const name = link.text().trim() || cells.eq(0).text().trim();
    const type = cells.eq(1).text().trim();
    const address = cells.eq(2).text().trim();
    const postalCode = cells.eq(3).text().trim().replace(/\D/g, "").slice(0, 5);
    const city = cells.eq(4).text().trim();
    const province = cells.eq(5).text().trim();
    const phone = cells.eq(6).text().trim();
    const email = cells.eq(7).text().trim();
    const website = cells.eq(8).text().trim();

    if (id && name) {
      points.push({
        id,
        name,
        type,
        address,
        postalCode,
        city,
        province,
        phone,
        email,
        website,
        raw: $(row).html() ?? "",
      });
    }
  });

  return points;
}

async function scrapeDetailPage(id: string, cookies: string): Promise<Partial<RawPAE>> {
  await sleep(DELAY_MS);
  try {
    const res = await http.get(
      `/es-es/CreaEmpresaConAyuda/Paginas/DetallePAE.aspx?id_pait=${id}`,
      { headers: { Cookie: cookies } }
    );
    const $ = cheerio.load(res.data);

    const getText = (label: string) => {
      const el = $(`*:contains("${label}")`).last();
      return el.next().text().trim() || el.parent().next().text().trim() || "";
    };

    return {
      id,
      name:
        $("h1, .pae-nombre, .titulo-pae").first().text().trim() ||
        getText("Nombre"),
      type: getText("Tipo") || getText("Entidad"),
      address: getText("Dirección") || getText("Domicilio") || getText("Calle"),
      postalCode: getText("Código Postal") || getText("C.P."),
      city: getText("Municipio") || getText("Ciudad") || getText("Localidad"),
      province: getText("Provincia"),
      phone: getText("Teléfono") || getText("Tel"),
      email: getText("Email") || getText("Correo"),
      website: getText("Web") || getText("Página web"),
      raw: res.data.slice(0, 5000),
    };
  } catch (err) {
    console.warn(`  ⚠ Detail fetch failed for id_pait=${id}:`, (err as Error).message);
    return { id };
  }
}

async function getInitialSession(): Promise<{ cookies: string; nextUrl: string | null }> {
  const res = await http.get(SEARCH_URL);
  const cookies = extractCookies(res.headers as Record<string, string | string[]>);
  const $ = cheerio.load(res.data);

  // Find next page link or pagination
  const nextLink =
    $("a:contains('Siguiente'), a.next, a[title='Next']").first().attr("href") ?? null;

  return { cookies, nextUrl: nextLink ? (BASE + nextLink) : null };
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🔍 Iniciando ingestión PAE…");
  console.log(`   User-Agent: ${UA}`);

  let { cookies, nextUrl } = await getInitialSession();
  console.log(`   Sesión iniciada. Cookies: ${cookies.slice(0, 60)}…`);

  // First pass: try to get IDs from detail pages directly
  // PAE detail pages: ?id_pait=1 to ~20000 (find upper bound from listing)
  let currentUrl = SEARCH_URL;
  let page = 0;
  const allRaw: RawPAE[] = [];

  // Scrape listing pages
  while (currentUrl) {
    page++;
    console.log(`  📄 Página ${page}: ${currentUrl.slice(0, 80)}`);

    try {
      const $ = await fetchResultPage(currentUrl, cookies);
      const points = await scrapeListPage($);
      allRaw.push(...points);
      console.log(`     → ${points.length} puntos (total: ${allRaw.length})`);

      // Find next page
      const nextHref =
        $("a:contains('Siguiente'), a.next, a[title='Next Page'], a[title='Siguiente']")
          .first()
          .attr("href");

      if (!nextHref || page >= 200) break; // safety cap
      currentUrl = nextHref.startsWith("http") ? nextHref : BASE + nextHref;
    } catch (err) {
      console.error(`  ✗ Error en página ${page}:`, (err as Error).message);
      break;
    }
  }

  console.log(`\n📊 Total scrapeado del listado: ${allRaw.length} puntos`);

  // If listing didn't yield results, try direct detail page scraping by ID range
  if (allRaw.length === 0) {
    console.log("\n⚡ Listado vacío — intentando scraping por ID directo (1..500 muestra)…");
    for (let id = 1; id <= 500; id++) {
      const detail = await scrapeDetailPage(String(id), cookies);
      if (detail.name) {
        allRaw.push(detail as RawPAE);
        if (id % 50 === 0) console.log(`  → ${id} IDs probados, ${allRaw.length} válidos`);
      }
    }
    console.log(`  → ${allRaw.length} puntos encontrados en muestra de 500 IDs`);
  }

  // ── Upsert a BD ─────────────────────────────────────────────────────────────
  let inserted = 0, updated = 0, geocoded = 0, failed = 0;

  for (const raw of allRaw) {
    const ccaaCode = normalizeRegion(raw.province) ?? normalizeRegion(raw.city) ?? null;

    // Geocodificar
    let lat: number | null = null;
    let lng: number | null = null;
    if (raw.address && (raw.postalCode || raw.city)) {
      const geo = await geocodeAddress(raw.address, raw.postalCode, raw.city);
      lat = geo.lat;
      lng = geo.lng;
      if (lat !== null) geocoded++;
    }

    const needsReview = !lat || !raw.address || !raw.city;

    const existing = await db
      .select({ id: assistancePoints.id })
      .from(assistancePoints)
      .where(
        and(
          eq(assistancePoints.source, "PAE"),
          eq(assistancePoints.sourceExternalId, raw.id)
        )
      )
      .limit(1);

    const values = {
      source: "PAE" as const,
      sourceExternalId: raw.id,
      name: raw.name,
      type: raw.type || null,
      address: raw.address || null,
      postalCode: raw.postalCode || null,
      city: raw.city || null,
      province: raw.province || null,
      ccaaCode,
      lat,
      lng,
      phone: raw.phone || null,
      email: raw.email || null,
      website: raw.website || null,
      needsReview,
      active: true,
      lastVerifiedAt: new Date(),
      rawData: { raw: raw.raw },
    };

    if (existing.length > 0) {
      await db
        .update(assistancePoints)
        .set({ ...values, updatedAt: new Date() })
        .where(eq(assistancePoints.id, existing[0].id));
      updated++;
    } else {
      await db.insert(assistancePoints).values(values);
      inserted++;
    }
  }

  if (allRaw.length === 0) {
    failed++;
    console.log("\n⚠️  No se pudieron scrapear puntos.");
    console.log("   La estructura de paeelectronico.es puede haber cambiado.");
    console.log("   Ejecuta con DEBUG=1 para ver el HTML de respuesta.");
    console.log("   Plan B: solicitar dataset a Red.es directamente.");
  }

  console.log("\n✅ Ingestión completada:");
  console.log(`   Nuevos:        ${inserted}`);
  console.log(`   Actualizados:  ${updated}`);
  console.log(`   Geocodificados:${geocoded} / ${allRaw.length}`);
  console.log(`   Sin geocodificar: ${allRaw.length - geocoded}`);
  if (failed) console.log(`   ⚠ Errores: ${failed}`);

  process.exit(0);
}

main().catch((e) => {
  console.error("Error fatal:", e);
  process.exit(1);
});
