import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { funds } from "@/db/schema";
import { eq, and, or, isNull, asc } from "drizzle-orm";
import { CCAA_BY_SLUG } from "@/lib/ccaa-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FundCard } from "@/components/funds/fund-card";
import { ArrowLeft, MapPin, Clock, Globe } from "lucide-react";
import { daysUntil, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ccaa = CCAA_BY_SLUG[slug];
  if (!ccaa) return { title: "Comunidad no encontrada" };
  return {
    title: `Ayudas y subvenciones en ${ccaa.nombre} | FondosEU`,
    description: `Descubre todas las convocatorias abiertas para empresas y autónomos en ${ccaa.nombre}. Incluye ayudas autonómicas y nacionales aplicables.`,
    openGraph: {
      title: `Ayudas en ${ccaa.nombre}`,
      description: `Convocatorias abiertas en ${ccaa.nombre}. Subvenciones, préstamos y fondos europeos para tu negocio.`,
    },
  };
}

export default async function CcaaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ccaa = CCAA_BY_SLUG[slug];
  if (!ccaa) notFound();

  const [regional, national] = await Promise.all([
    db
      .select()
      .from(funds)
      .where(
        and(
          eq(funds.status, "abierta"),
          eq(funds.ccaaCode, ccaa.code as any)
        )
      )
      .orderBy(asc(funds.closeDate)),
    db
      .select()
      .from(funds)
      .where(
        and(
          eq(funds.status, "abierta"),
          or(eq(funds.scope, "ESPAÑA"), eq(funds.scope, "UE"))
        )
      )
      .orderBy(asc(funds.closeDate))
      .limit(10),
  ]);

  const urgent = regional.filter((f) => {
    const d = daysUntil(f.closeDate);
    return d !== null && d <= 14;
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Ayudas en ${ccaa.nombre}`,
    numberOfItems: regional.length,
    itemListElement: regional.map((f, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: f.title,
      url: `https://fondoseu.org/fondos/${f.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container py-8 max-w-5xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link
            href="/mapa"
            className="hover:text-foreground flex items-center gap-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Mapa
          </Link>
          <span>/</span>
          <span className="text-foreground">{ccaa.nombre}</span>
        </nav>

        {/* Hero */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <Badge variant="outline">{ccaa.code}</Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Ayudas en {ccaa.nombre}
          </h1>
          <p className="text-muted-foreground">
            {regional.length > 0
              ? `${regional.length} ayuda${regional.length !== 1 ? "s" : ""} autonómica${regional.length !== 1 ? "s" : ""} activa${regional.length !== 1 ? "s" : ""} ahora mismo.`
              : "No hay ayudas autonómicas específicas en este momento."}
            {national.length > 0 &&
              ` También hay ${national.length} ayudas nacionales aplicables.`}
          </p>
        </div>

        {/* Cierra pronto */}
        {urgent.length > 0 && (
          <div className="mb-8 rounded-lg border border-red-200 bg-red-50 p-4">
            <h2 className="text-sm font-semibold text-red-700 flex items-center gap-1.5 mb-3">
              <Clock className="h-4 w-4" />
              Cierran en menos de 14 días
            </h2>
            <div className="space-y-2">
              {urgent.map((f) => {
                const d = daysUntil(f.closeDate);
                return (
                  <div key={f.slug} className="flex items-center justify-between gap-3">
                    <Link
                      href={`/fondos/${f.slug}`}
                      className="text-sm font-medium text-red-800 hover:underline line-clamp-1"
                    >
                      {f.title}
                    </Link>
                    <span className="text-xs text-red-600 shrink-0 font-medium">
                      {d === 0 ? "Hoy" : `${d}d`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Ayudas autonómicas */}
        {regional.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-semibold mb-4">
              Ayudas autonómicas en {ccaa.nombre}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {regional.map((f) => (
                <FundCard key={f.slug} fund={f} />
              ))}
            </div>
          </section>
        )}

        {/* Ayudas nacionales */}
        {national.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">
                Ayudas nacionales aplicables
              </h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Estas convocatorias están abiertas para toda España, incluida {ccaa.nombre}.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {national.map((f) => (
                <FundCard key={f.slug} fund={f} />
              ))}
            </div>
            <div className="mt-4">
              <Button asChild variant="outline">
                <Link href="/buscar">Ver todas las ayudas nacionales</Link>
              </Button>
            </div>
          </section>
        )}

        {regional.length === 0 && national.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="mb-4">No hay convocatorias activas ahora mismo.</p>
            <Button asChild>
              <Link href="/buscar">Buscar todas las ayudas</Link>
            </Button>
          </div>
        )}

        {/* CTA */}
        <div className="rounded-lg bg-primary text-primary-foreground p-6 text-center">
          <h3 className="font-semibold text-lg mb-2">
            ¿No sabes qué ayudas encajan con tu proyecto?
          </h3>
          <p className="text-sm text-primary-foreground/80 mb-4">
            Haz el test en 2 minutos y te mostramos las más relevantes para ti.
          </p>
          <Button asChild variant="secondary">
            <Link href="/wizard">Hacer el test</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
