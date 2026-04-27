export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { db } from "@/db";
import { funds } from "@/db/schema";
import { eq, and, or, ilike, desc, asc, sql, inArray } from "drizzle-orm";
import { FundCard, FundCardSkeleton } from "@/components/funds/fund-card";
import { FundFilters } from "@/components/funds/fund-filters";
import { SearchInput } from "./search-input";
import { Pagination } from "./pagination";

const LIMIT = 18;

interface SearchParams {
  q?: string;
  estado?: string;
  ue?: string;
  scope?: string | string[];
  pagina?: string;
}

async function getFunds(params: SearchParams) {
  const page = Math.max(1, parseInt(params.pagina ?? "1", 10));
  const offset = (page - 1) * LIMIT;
  const status = (params.estado ?? "abierta") as "abierta" | "cerrada" | "proximamente";
  const euOnly = params.ue === "true";
  const q = params.q;
  const scopes = params.scope
    ? Array.isArray(params.scope)
      ? params.scope
      : [params.scope]
    : [];

  const conditions = [];

  if (["abierta", "cerrada", "proximamente"].includes(status)) {
    conditions.push(eq(funds.status, status));
  }
  if (euOnly) conditions.push(eq(funds.euFunded, true));
  if (q) conditions.push(or(ilike(funds.title, `%${q}%`), ilike(funds.organism, `%${q}%`)));
  if (scopes.length > 0) {
    conditions.push(inArray(funds.scope, scopes as any[]));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [rows, countResult] = await Promise.all([
    db
      .select()
      .from(funds)
      .where(where)
      .orderBy(desc(funds.euFunded), asc(funds.closeDate), desc(funds.createdAt))
      .limit(LIMIT)
      .offset(offset),
    db.select({ count: sql<number>`count(*)` }).from(funds).where(where),
  ]);

  return {
    funds: rows,
    total: Number(countResult[0]?.count ?? 0),
    page,
  };
}

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { funds: results, total, page } = await getFunds(params);
  const euOnly = params.ue === "true";
  const q = params.q ?? "";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Cabecera */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">Buscador de ayudas</h1>
        <p className="text-muted-foreground text-sm">
          {total > 0
            ? `${total} ayuda${total !== 1 ? "s" : ""} encontrada${total !== 1 ? "s" : ""}${q ? ` para "${q}"` : ""}`
            : "Sin resultados para los filtros seleccionados"}
        </p>
      </div>

      {/* Campo de búsqueda */}
      <div className="mb-6">
        <Suspense>
          <SearchInput />
        </Suspense>
      </div>

      <div className="flex gap-8 items-start">
        {/* Sidebar filtros */}
        <div className="hidden lg:block w-64 shrink-0 sticky top-24 bg-white border rounded-lg p-5 max-h-[calc(100vh-7rem)] overflow-y-auto">
          <Suspense>
            <FundFilters />
          </Suspense>
        </div>

        {/* Resultados */}
        <div className="flex-1 min-w-0">
          {results.length === 0 ? (
            <div className="text-center py-16 border rounded-lg">
              <p className="text-2xl mb-2">🔍</p>
              <p className="font-semibold mb-1">Sin resultados</p>
              <p className="text-sm text-muted-foreground">
                Prueba cambiando los filtros o el texto de búsqueda.
              </p>
            </div>
          ) : (
            <>
              {euOnly && (
                <div className="mb-4 flex items-center gap-2 text-sm bg-blue-50 border border-eu-blue/20 rounded-lg px-4 py-2">
                  <span>🇪🇺</span>
                  <span className="text-eu-blue font-medium">
                    Mostrando solo fondos cofinanciados por la Unión Europea
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {results.map((fund) => (
                  <FundCard key={fund.id} fund={fund} />
                ))}
              </div>

              <Suspense>
                <Pagination page={page} total={total} limit={LIMIT} />
              </Suspense>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
