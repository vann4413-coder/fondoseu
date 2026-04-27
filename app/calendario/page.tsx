export const dynamic = "force-dynamic";

import Link from "next/link";
import { db } from "@/db";
import { funds } from "@/db/schema";
import { eq, and, isNotNull, asc, or } from "drizzle-orm";
import { EUBadge } from "@/components/funds/eu-badge";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Euro, ArrowRight } from "lucide-react";
import { formatAmount, daysUntil } from "@/lib/utils";
import type { EUProgramCode } from "@/lib/eu-programs";

async function getUpcomingFunds() {
  const today = new Date().toISOString().split("T")[0];

  const rows = await db
    .select()
    .from(funds)
    .where(
      and(
        or(eq(funds.status, "abierta"), eq(funds.status, "proximamente")),
        isNotNull(funds.closeDate)
      )
    )
    .orderBy(asc(funds.closeDate))
    .limit(100);

  return rows;
}

function groupByMonth(rows: Awaited<ReturnType<typeof getUpcomingFunds>>) {
  const groups: Record<string, typeof rows> = {};
  for (const fund of rows) {
    if (!fund.closeDate) continue;
    const d = new Date(fund.closeDate);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(fund);
  }
  return groups;
}

function formatMonthLabel(key: string) {
  const [year, month] = key.split("-");
  const d = new Date(parseInt(year), parseInt(month) - 1, 1);
  return d.toLocaleDateString("es-ES", { month: "long", year: "numeric" });
}

function urgencyColor(days: number | null) {
  if (days === null) return "";
  if (days <= 7) return "text-red-600";
  if (days <= 30) return "text-orange-600";
  return "text-muted-foreground";
}

export default async function CalendarioPage() {
  const rows = await getUpcomingFunds();
  const groups = groupByMonth(rows);
  const monthKeys = Object.keys(groups).sort();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Cabecera */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Calendar className="h-6 w-6 text-eu-blue" />
          <h1 className="text-3xl font-bold">Calendario de plazos</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          {rows.length} ayuda{rows.length !== 1 ? "s" : ""} con plazo de cierre próximo. Haz clic para ver la ficha completa.
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="text-center py-16 border rounded-lg">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="font-semibold mb-1">Sin convocatorias próximas</p>
          <p className="text-sm text-muted-foreground">Vuelve pronto, actualizamos el listado cada día.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {monthKeys.map((key) => (
            <section key={key}>
              {/* Cabecera de mes */}
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-lg font-bold capitalize">{formatMonthLabel(key)}</h2>
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">
                  {groups[key].length} ayuda{groups[key].length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Lista de fondos del mes */}
              <div className="space-y-2">
                {groups[key].map((fund) => {
                  const days = daysUntil(fund.closeDate);
                  return (
                    <Link
                      key={fund.id}
                      href={`/fondos/${fund.slug}`}
                      className="group flex items-start gap-4 rounded-lg border bg-card p-4 hover:shadow-sm hover:border-primary/30 transition-all"
                    >
                      {/* Día de cierre */}
                      <div className="shrink-0 text-center w-12">
                        <div className="text-2xl font-bold leading-none text-foreground">
                          {new Date(fund.closeDate!).getDate()}
                        </div>
                        <div className="text-xs text-muted-foreground uppercase">
                          {new Date(fund.closeDate!).toLocaleDateString("es-ES", { month: "short" })}
                        </div>
                      </div>

                      {/* Separador vertical */}
                      <div className="w-px self-stretch bg-border shrink-0" />

                      {/* Contenido */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap gap-1.5 mb-1.5">
                          {fund.euFunded && (
                            <EUBadge
                              program={fund.euProgram as EUProgramCode | null}
                              size="sm"
                            />
                          )}
                          {fund.status === "proximamente" && (
                            <Badge variant="warning" className="text-xs">Próximamente</Badge>
                          )}
                          {fund.status === "abierta" && (
                            <Badge variant="success" className="text-xs">Abierta</Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {fund.scope}
                          </Badge>
                        </div>

                        <p className="font-medium text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                          {fund.title}
                        </p>

                        {fund.organism && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                            {fund.organism}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          {(fund.amountMin || fund.amountMax) && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Euro className="h-3 w-3" />
                              {fund.amountMin && fund.amountMax
                                ? `${formatAmount(fund.amountMin)} – ${formatAmount(fund.amountMax)}`
                                : fund.amountMax
                                ? `Hasta ${formatAmount(fund.amountMax)}`
                                : `Desde ${formatAmount(fund.amountMin)}`}
                            </span>
                          )}
                          {days !== null && (
                            <span
                              className={`flex items-center gap-1 text-xs font-medium ${urgencyColor(days)}`}
                            >
                              <Clock className="h-3 w-3" />
                              {days === 0
                                ? "¡Cierra hoy!"
                                : days < 0
                                ? "Cerrada"
                                : `${days}d restantes`}
                            </span>
                          )}
                        </div>
                      </div>

                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
