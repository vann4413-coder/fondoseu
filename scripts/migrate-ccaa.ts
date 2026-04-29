/**
 * One-shot migration: reads all funds and sets ccaaCode based on region + scope.
 * Run: npx tsx scripts/migrate-ccaa.ts
 */
import { db } from "../db";
import { funds } from "../db/schema";
import { isNull, or, eq } from "drizzle-orm";
import { normalizeRegion } from "../lib/normalize-region";

async function main() {
  console.log("Fetching funds without ccaaCode…");
  const rows = await db
    .select({ id: funds.id, region: funds.region, scope: funds.scope })
    .from(funds)
    .where(or(isNull(funds.ccaaCode)));

  console.log(`Found ${rows.length} funds to process.`);

  let updated = 0;
  let unmatched: string[] = [];

  for (const row of rows) {
    if (row.scope === "ESPAÑA" || row.scope === "UE") {
      // National / EU funds don't belong to a single CCAA
      continue;
    }

    const code = normalizeRegion(row.region);
    if (!code) {
      if (row.region) unmatched.push(row.region);
      continue;
    }

    await db
      .update(funds)
      .set({ ccaaCode: code })
      .where(eq(funds.id, row.id));
    updated++;
  }

  console.log(`Updated: ${updated}`);
  if (unmatched.length > 0) {
    console.log("Unmatched regions (add to normalize-region.ts):");
    [...new Set(unmatched)].forEach((r) => console.log("  •", r));
  }
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
