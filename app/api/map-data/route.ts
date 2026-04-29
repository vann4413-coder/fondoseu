import { NextResponse } from "next/server";
import { getMapData, type CcaaMapItem } from "@/lib/map-data";

export const dynamic = "force-dynamic";
export type { CcaaMapItem };

export async function GET() {
  const result = await getMapData();
  return NextResponse.json(result, {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
  });
}
