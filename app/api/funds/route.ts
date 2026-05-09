export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { funds } from "@/db/schema";
import {
  eq,
  and,
  or,
  ilike,
  inArray,
  desc,
  asc,
  sql,
} from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const status = searchParams.get("estado") ?? "abierta";
    const euOnly = searchParams.get("ue") === "true";
    const q = searchParams.get("q");
    const page = Math.max(1, parseInt(searchParams.get("pagina") ?? "1", 10));
    const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "18", 10));
    const offset = (page - 1) * limit;

    const conditions = [];

    if (["abierta", "cerrada", "proximamente"].includes(status)) {
      conditions.push(
        eq(funds.status, status as "abierta" | "cerrada" | "proximamente")
      );
    }

    if (euOnly) {
      conditions.push(eq(funds.euFunded, true));
    }

    if (q) {
      conditions.push(
        or(
          ilike(funds.title, `%${q}%`),
          ilike(funds.organism, `%${q}%`)
        )
      );
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [rows, countResult] = await Promise.all([
      db
        .select()
        .from(funds)
        .where(where)
        .orderBy(desc(funds.euFunded), asc(funds.closeDate))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(funds)
        .where(where),
    ]);

    return NextResponse.json({
      funds: rows,
      total: Number(countResult[0]?.count ?? 0),
      page,
      limit,
    });
  } catch (err) {
    console.error("[API /funds]", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
