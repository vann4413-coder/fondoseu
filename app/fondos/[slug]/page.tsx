import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { funds } from "@/db/schema";
import { eq } from "drizzle-orm";
import { EUBadge } from "@/components/funds/eu-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EU_PROGRAMS, type EUProgramCode } from "@/lib/eu-programs";
import {
  FUNDING_TYPES,
  SCOPES,
  BENEFICIARY_TYPES,
  STAGES,
  SECTORS,
} from "@/lib/taxonomies";
import {
  formatAmountRange,
  formatDate,
  daysUntil,
} from "@/lib/utils";
import {
  ExternalLink,
  Clock,
  Euro,
  Building2,
  MapPin,
  Users,
  BookOpen,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";

async function getFund(slug: string) {
  const result = await db
    .select()
    .from(funds)
    .where(eq(funds.slug, slug))
    .limit(1);
  return result[0] ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const fund = await getFund(slug);
  if (!fund) return { title: "Ayuda no encontrada" };

  return {
    title: fund.title,
    description:
      fund.shortDescription ||
      `${fund.organism} · ${fund.scope} · ${fund.fundingType}`,
    openGraph: {
      title: fund.title,
      description: fund.shortDescription || fund.organism,
    },
  };
}

const LOOKUP = {
  fundingType: Object.fromEntries(FUNDING_TYPES.map((f) => [f.value, f.label])),
  scope: Object.fromEntries(SCOPES.map((s) => [s.value, s.label])),
  beneficiary: Object.fromEntries(BENEFICIARY_TYPES.map((b) => [b.value, b.label])),
  stage: Object.fromEntries(STAGES.map((s) => [s.value, s.label])),
  sector: Object.fromEntries(SECTORS.map((s) => [s.value, s.label])),
};

export default async function FondoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const fund = await getFund(slug);
  if (!fund) notFound();

  const days = daysUntil(fund.closeDate);
  const isOpen = fund.status === "abierta";
  const euProgram = fund.euProgram
    ? EU_PROGRAMS[fund.euProgram as EUProgramCode]
    : null;

  // JSON-LD GovernmentService
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "GovernmentService",
    name: fund.title,
    description: fund.shortDescription || fund.description,
    provider: { "@type": "GovernmentOrganization", name: fund.organism },
    areaServed: fund.region ?? "España",
    url: fund.sourceUrl,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container py-8 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/buscar" className="hover:text-foreground flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" />
            Buscador
          </Link>
          <span>/</span>
          <span className="text-foreground truncate max-w-xs">{fund.title}</span>
        </nav>

        {/* Cabecera */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {fund.euFunded && (
              <EUBadge
                program={fund.euProgram as EUProgramCode | null}
                detail={fund.euProgramDetail}
                size="md"
              />
            )}
            <Badge variant="outline">
              {LOOKUP.scope[fund.scope] ?? fund.scope}
            </Badge>
            <Badge variant="secondary">
              {LOOKUP.fundingType[fund.fundingType] ?? fund.fundingType}
            </Badge>
            {isOpen && (
              <Badge variant="success" className="gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-green-600 animate-pulse" />
                Abierta
              </Badge>
            )}
            {fund.status === "proximamente" && (
              <Badge variant="warning">Próximamente</Badge>
            )}
            {fund.status === "cerrada" && (
              <Badge variant="secondary" className="opacity-60">
                Cerrada
              </Badge>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-3">
            {fund.title}
          </h1>

          {fund.organism && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Building2 className="h-4 w-4 shrink-0" />
              <span>{fund.organism}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Descripción */}
            {fund.description && (
              <section>
                <h2 className="text-lg font-semibold mb-3">Sobre esta ayuda</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {fund.description}
                </p>
              </section>
            )}

            <Separator />

            {/* ¿Esto encaja contigo? */}
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                ¿Esto encaja contigo?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fund.beneficiaryTypes.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" /> Beneficiarios
                    </h3>
                    <ul className="space-y-1">
                      {fund.beneficiaryTypes.map((bt) => (
                        <li key={bt} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-3.5 w-3.5 text-green-500 shrink-0" />
                          {LOOKUP.beneficiary[bt] ?? bt}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {fund.stages.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Etapa del proyecto
                    </h3>
                    <ul className="space-y-1">
                      {fund.stages.map((s) => (
                        <li key={s} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-3.5 w-3.5 text-green-500 shrink-0" />
                          {LOOKUP.stage[s] ?? s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {fund.sectors.length > 0 && (
                  <div className="sm:col-span-2">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Sectores
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {fund.sectors.map((s) => (
                        <Badge key={s} variant="outline" className="text-xs">
                          {LOOKUP.sector[s] ?? s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Bloque programa europeo */}
            {fund.euFunded && euProgram && (
              <>
                <Separator />
                <section className="rounded-lg border border-eu-blue/20 bg-blue-50 p-5">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl" aria-hidden>
                      🇪🇺
                    </span>
                    <div className="flex-1">
                      <h2 className="font-semibold text-eu-blue mb-1">
                        Sobre {euProgram.shortName}
                      </h2>
                      {fund.euProgramDetail && (
                        <p className="text-xs text-eu-blue/70 mb-2">
                          {fund.euProgramDetail}
                        </p>
                      )}
                      <p className="text-sm text-slate-700 leading-relaxed mb-3">
                        {euProgram.description}
                      </p>
                      <div className="flex flex-wrap gap-3 text-xs text-slate-600 mb-3">
                        <span>
                          <strong>Presupuesto:</strong> {euProgram.budget}
                        </span>
                        <span>
                          <strong>Período:</strong> {euProgram.period}
                        </span>
                      </div>
                      <a
                        href={euProgram.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-eu-blue font-medium inline-flex items-center gap-1 hover:underline"
                      >
                        Más info en europa.eu
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </section>
              </>
            )}

            {/* Documentos requeridos */}
            {fund.requiredDocs.length > 0 && (
              <>
                <Separator />
                <section>
                  <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Documentación habitual
                  </h2>
                  <ul className="space-y-1.5">
                    {fund.requiredDocs.map((doc) => (
                      <li key={doc} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                        {doc}
                      </li>
                    ))}
                  </ul>
                </section>
              </>
            )}

            {/* Aviso legal */}
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 flex gap-3">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-800 leading-relaxed">
                Esta información es orientativa. Verifica siempre los requisitos,
                plazos y bases reguladoras en la convocatoria oficial antes de
                presentar tu solicitud.
              </p>
            </div>
          </div>

          {/* Sidebar derecha */}
          <div className="space-y-4">
            {/* Card acciones */}
            <Card className="border-primary/20 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Solicitar esta ayuda</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {fund.applicationUrl && (
                  <Button asChild className="w-full gap-2">
                    <a
                      href={fund.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Ir a la convocatoria oficial
                    </a>
                  </Button>
                )}
                {fund.sourceUrl && fund.sourceUrl !== fund.applicationUrl && (
                  <Button asChild variant="outline" className="w-full gap-2">
                    <a
                      href={fund.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Ver en BDNS
                    </a>
                  </Button>
                )}
                {fund.guideUrl && (
                  <Button asChild variant="secondary" className="w-full gap-2">
                    <a
                      href={fund.guideUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <BookOpen className="h-4 w-4" />
                      Cómo solicitarla
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Datos clave */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Datos clave</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {(fund.amountMin || fund.amountMax) && (
                  <div className="flex items-start gap-2">
                    <Euro className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs text-muted-foreground">Importe</div>
                      <div className="font-medium">
                        {formatAmountRange(fund.amountMin, fund.amountMax)}
                      </div>
                    </div>
                  </div>
                )}
                {fund.cofinancingPct && (
                  <div className="flex items-start gap-2">
                    <Euro className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs text-muted-foreground">Cofinanciación máx.</div>
                      <div className="font-medium">{fund.cofinancingPct}%</div>
                    </div>
                  </div>
                )}
                {fund.openDate && (
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs text-muted-foreground">Apertura</div>
                      <div className="font-medium">{formatDate(fund.openDate)}</div>
                    </div>
                  </div>
                )}
                {fund.closeDate && (
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs text-muted-foreground">Cierre</div>
                      <div
                        className={`font-medium ${
                          days !== null && days <= 7 ? "text-red-600" : ""
                        }`}
                      >
                        {formatDate(fund.closeDate)}
                        {days !== null && days >= 0 && days <= 30 && (
                          <span className="ml-1 text-xs font-normal text-muted-foreground">
                            ({days}d)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {fund.region && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs text-muted-foreground">Ámbito territorial</div>
                      <div className="font-medium">{fund.region}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* CTA wizard */}
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="pt-6 pb-5">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5" />
                  <span className="font-semibold">¿Buscas más ayudas?</span>
                </div>
                <p className="text-sm text-primary-foreground/80 mb-4 leading-relaxed">
                  Haz el test y encuentra las 10 ayudas más relevantes para tu
                  perfil.
                </p>
                <Button asChild variant="secondary" className="w-full">
                  <Link href="/wizard">Hacer el test</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
