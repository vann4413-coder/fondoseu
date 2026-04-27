import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { funds } from "@/db/schema";
import { eq } from "drizzle-orm";
import { scoreAndRankFunds } from "@/lib/recommendation";
import type { WizardAnswers } from "@/lib/recommendation";

export async function POST(req: NextRequest) {
  try {
    const answers = (await req.json()) as WizardAnswers;

    // Traer todos los fondos abiertos
    const allFunds = await db
      .select()
      .from(funds)
      .where(eq(funds.status, "abierta"))
      .limit(500);

    const results = scoreAndRankFunds(allFunds, answers);

    return NextResponse.json({ results });
  } catch (err) {
    console.error("[API /recommendations]", err);
    return NextResponse.json(
      { error: "Error interno al calcular recomendaciones" },
      { status: 500 }
    );
  }
}
