import { NextResponse } from "next/server";
import { db } from "@/db";
import { funds } from "@/db/schema";
import { eq, and, isNotNull, sql } from "drizzle-orm";
import { CCAA_LIST } from "@/lib/ccaa-data";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export type CcaaMapItem = {
  code: string;
  nombre: string;
  slug: string;
  total: number;
  minDays: number | null;
  color: "urgente" | "pronto" | "activa" | "sin-datos";
};

function colorFromDays(total: number, minDays: number | null): CcaaMapItem["color"] {
  if (total === 0) return "sin-datos";
  if (minDays !== null && minDays <= 14) return "urgente";
  if (minDays !== null && minDays <= 45) return "pronto";
  return "activa";
}

export async function GET() {
  const today = new Date().toISOString().split("T")[0];

  const rows = await db
    .select({
      ccaaCode: funds.ccaaCode,
      closeDate: funds.closeDate,
    })
    .from(funds)
    .where(
      and(
        eq(funds.status, "abierta"),
        isNotNull(funds.ccaaCode),
        sql`${funds.ccaaCode} != 'MULTIPLE'`
      )
    );

  const byCcaa = new Map<string, { total: number; minDays: number | null }>();

  for (const row of rows) {
    if (!row.ccaaCode) continue;
    const entry = byCcaa.get(row.ccaaCode) ?? { total: 0, minDays: null };
    entry.total++;
    if (row.closeDate) {
      const diff = Math.ceil(
        (new Date(row.closeDate).getTime() - new Date(today).getTime()) /
          86400000
      );
      if (diff >= 0 && (entry.minDays === null || diff < entry.minDays)) {
        entry.minDays = diff;
      }
    }
    byCcaa.set(row.ccaaCode, entry);
  }

  const result: CcaaMapItem[] = CCAA_LIST.map((ccaa) => {
    const entry = byCcaa.get(ccaa.code) ?? { total: 0, minDays: null };
    return {
      code: ccaa.code,
      nombre: ccaa.nombre,
      slug: ccaa.slug,
      total: entry.total,
      minDays: entry.minDays,
      color: colorFromDays(entry.total, entry.minDays),
    };
  });

  return NextResponse.json(result, {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
  });
}
