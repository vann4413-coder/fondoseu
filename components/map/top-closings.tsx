import Link from "next/link";
import { db } from "@/db";
import { funds } from "@/db/schema";
import { eq, and, isNotNull, asc } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { daysUntil } from "@/lib/utils";

export async function TopClosings() {
  const rows = await db
    .select({
      slug: funds.slug,
      title: funds.title,
      organism: funds.organism,
      closeDate: funds.closeDate,
      scope: funds.scope,
      ccaaCode: funds.ccaaCode,
    })
    .from(funds)
    .where(
      and(
        eq(funds.status, "abierta"),
        isNotNull(funds.closeDate)
      )
    )
    .orderBy(asc(funds.closeDate))
    .limit(3);

  if (rows.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-1.5">
        <Clock className="h-3.5 w-3.5" />
        Cierran antes
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {rows.map((f) => {
          const days = daysUntil(f.closeDate);
          return (
            <Link
              key={f.slug}
              href={`/fondos/${f.slug}`}
              className="block rounded-lg border p-3 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="text-xs font-medium line-clamp-2 leading-snug">
                  {f.title}
                </span>
                {days !== null && (
                  <Badge
                    variant={days <= 7 ? "destructive" : "outline"}
                    className="shrink-0 text-xs"
                  >
                    {days === 0 ? "Hoy" : `${days}d`}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {f.organism}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
