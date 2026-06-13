import type { Metadata } from "next";
import Link from "next/link";
import { EU_PROGRAMS } from "@/lib/eu-programs";

export const metadata: Metadata = {
  title: "Fondos europeos para empresas y autónomos en España 2025-2026",
  description:
    "Guía completa de fondos europeos disponibles en España: NextGenerationEU, FEDER, FSE+, Horizon Europe y EIC Accelerator. Descubre qué ayudas puedes pedir y cómo solicitarlas.",
  alternates: { canonical: "https://fondoseu.org/fondos-europeos" },
  openGraph: {
    title: "Fondos europeos para empresas en España 2025-2026",
    description:
      "NextGenerationEU, FEDER, FSE+, Horizon Europe y EIC: qué son, a quién van dirigidos y cómo acceder desde España.",
  },
};

const PROGRAM_DETAILS: Record<string, { whoCanApply: string; howToApply: string; maxAmount: string }> = {
  NEXTGEN: {
    whoCanApply: "Autónomos, PYMEs, startups y grandes empresas. Los programas más accesibles son Kit Digital (hasta 29.000€) y Kit Consulting.",
    howToApply: "A través de convocatorias específicas del Ministerio o comunidades autónomas. Cada programa tiene su sede electrónica.",
    maxAmount: "Variable: desde 3.000€ (Kit Digital básico) hasta millones en los PERTE.",
  },
  FEDER: {
    whoCanApply: "PYMEs y autónomos principalmente, aunque varía por comunidad autónoma y convocatoria.",
    howToApply: "Cada comunidad autónoma gestiona sus propios fondos FEDER. Hay que consultar la agencia de desarrollo regional correspondiente.",
    maxAmount: "Hasta el 70% de la inversión elegible. Sin límite fijo por proyecto.",
  },
  FSE_PLUS: {
    whoCanApply: "Emprendedores, desempleados, jóvenes y autónomos que quieran formarse o crear su empresa.",
    howToApply: "A través del SEPE, comunidades autónomas o entidades colaboradoras certificadas.",
    maxAmount: "Cubre principalmente formación y coste de constitución empresarial.",
  },
  HORIZON: {
    whoCanApply: "Startups deep tech, investigadores y spin-offs universitarios. Requiere proyecto de I+D+i con socios europeos.",
    howToApply: "Directamente en el portal Funding & Tenders de la Comisión Europea. Proceso competitivo con evaluadores internacionales.",
    maxAmount: "Hasta 2,5 M€ por proyecto en modalidades de subvención directa.",
  },
  EIC: {
    whoCanApply: "Startups y PYMEs con innovaciones disruptivas de alto impacto y potencial de mercado global.",
    howToApply: "Convocatoria abierta en el portal EIC. Proceso en dos fases: propuesta corta y propuesta completa.",
    maxAmount: "Hasta 2,5 M€ de subvención + hasta 15 M€ de inversión de capital. Total: hasta 17,5 M€.",
  },
  LIFE: {
    whoCanApply: "Empresas, ONGs y entidades públicas con proyectos de medio ambiente, economía circular o acción por el clima.",
    howToApply: "Convocatorias anuales gestionadas por CINEA (Agencia Ejecutiva Europea para el Clima, Infraestructuras y Medio Ambiente).",
    maxAmount: "Hasta el 60% de costes elegibles. Sin límite fijo.",
  },
  INVESTEU: {
    whoCanApply: "PYMEs y startups que necesiten financiación mediante préstamos o garantías, no subvenciones directas.",
    howToApply: "En España a través del ICO (Instituto de Crédito Oficial) y entidades financieras colaboradoras.",
    maxAmount: "Préstamos e inversiones sin límite fijo, con condiciones preferentes respecto al mercado.",
  },
};

const FAQ = [
  {
    q: "¿Puedo pedir fondos europeos directamente como autónomo?",
    a: "Sí, pero depende del programa. NextGenerationEU (Kit Digital, Kit Consulting) y FSE+ tienen convocatorias específicas para autónomos. FEDER también, según la comunidad autónoma. Horizon y EIC están más orientados a startups con I+D.",
  },
  {
    q: "¿Los fondos europeos son subvenciones o préstamos?",
    a: "La mayoría son subvenciones a fondo perdido (no hay que devolverlas). InvestEU funciona mediante préstamos con condiciones preferentes. El EIC Accelerator combina ambos: subvención + inversión de capital.",
  },
  {
    q: "¿Qué diferencia hay entre FEDER y NextGenerationEU?",
    a: "NextGenerationEU es un fondo excepcional creado tras la pandemia para recuperación económica, con plazo hasta 2026. FEDER es el fondo estructural permanente de la UE para cohesión regional, con período 2021-2027. Ambos llegan a España pero por canales distintos.",
  },
  {
    q: "¿Cómo sé si mi proyecto cumple los requisitos?",
    a: "Cada convocatoria especifica los requisitos exactos: tipo de empresa, sector, importe mínimo de inversión, etc. En FondosEU filtramos y explicamos esos requisitos en lenguaje claro para que puedas comprobarlo en segundos.",
  },
  {
    q: "¿Cuándo abren las convocatorias de fondos europeos?",
    a: "Las convocatorias se abren a lo largo del año sin un patrón fijo. Lo mejor es suscribirse a alertas o revisar periódicamente el buscador de FondosEU, donde actualizamos las convocatorias abiertas diariamente.",
  },
];

export default function FondosEuropeosPage() {
  const programs = Object.entries(EU_PROGRAMS).filter(([key]) => key !== "OTRO");

  return (
    <div className="space-y-16 pb-16">
      {/* Hero */}
      <section className="bg-eu-blue text-white py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">
            Fondos europeos para empresas y autónomos en España
          </h1>
          <p className="text-lg text-blue-100 mb-6">
            La Unión Europea destina más de 1 billón de euros a financiar empresas, innovación y empleo.
            Aquí tienes una guía clara de los programas disponibles en España y cómo acceder a ellos.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/wizard"
              className="bg-eu-gold text-gray-900 px-5 py-2.5 rounded-lg font-semibold hover:bg-yellow-400 transition text-center"
            >
              Descubrir qué ayudas me corresponden
            </Link>
            <Link
              href="/buscar"
              className="border-2 border-white text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-white hover:text-eu-blue transition text-center"
            >
              Ver convocatorias abiertas
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Intro */}
        <section>
          <h2 className="text-2xl font-bold mb-4">¿Qué son los fondos europeos?</h2>
          <div className="prose prose-gray max-w-none text-gray-700 space-y-3">
            <p>
              Los fondos europeos son ayudas financieras que la Unión Europea pone a disposición de
              empresas, autónomos y ciudadanos a través de distintos programas. En España, estos fondos
              se canalizan tanto directamente desde Bruselas como a través del Estado y las comunidades autónomas.
            </p>
            <p>
              Para el período 2021-2027, España es uno de los países que más fondos europeos recibe:
              más de 35.000 millones de euros en fondos estructurales (FEDER + FSE+), más lo que
              corresponde del NextGenerationEU (69.500 M€ en transferencias y préstamos).
            </p>
          </div>
        </section>

        {/* Programas */}
        <section>
          <h2 className="text-2xl font-bold mb-8">Los principales programas europeos</h2>
          <div className="space-y-10">
            {programs.map(([key, program]) => {
              const details = PROGRAM_DETAILS[key];
              return (
                <article key={key} className="border rounded-xl p-6 hover:shadow-md transition">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${program.color} ${program.textColor} shrink-0`}>
                      {program.shortName}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{program.fullName}</h3>
                  <p className="text-gray-600 mb-4">{program.description}</p>

                  {details && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-sm">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="font-semibold text-gray-500 text-xs uppercase tracking-wide mb-1">¿Quién puede pedir?</div>
                        <div className="text-gray-700">{details.whoCanApply}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="font-semibold text-gray-500 text-xs uppercase tracking-wide mb-1">¿Cómo solicitarlo?</div>
                        <div className="text-gray-700">{details.howToApply}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="font-semibold text-gray-500 text-xs uppercase tracking-wide mb-1">Importe máximo</div>
                        <div className="text-gray-700">{details.maxAmount}</div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                    <span>Presupuesto: <strong className="text-gray-700">{program.budget}</strong></span>
                    <span>·</span>
                    <span>Período: <strong className="text-gray-700">{program.period}</strong></span>
                    <a
                      href={program.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto text-eu-blue hover:underline font-medium"
                    >
                      Fuente oficial →
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Preguntas frecuentes sobre fondos europeos</h2>
          <div className="space-y-4">
            {FAQ.map((item) => (
              <details key={item.q} className="border rounded-lg group">
                <summary className="px-5 py-4 cursor-pointer font-medium list-none flex items-center justify-between hover:bg-gray-50 rounded-lg">
                  {item.q}
                  <span className="text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-4">▾</span>
                </summary>
                <div className="px-5 pb-4 text-gray-600 text-sm leading-relaxed border-t pt-3">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
          <h2 className="text-xl font-bold mb-2">¿No sabes qué fondos te corresponden?</h2>
          <p className="text-gray-600 mb-5">
            Responde 8 preguntas sobre tu proyecto y te mostramos todas las ayudas públicas que puedes solicitar, ordenadas por relevancia.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/wizard"
              className="bg-eu-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Hacer el test gratuito
            </Link>
            <Link
              href="/contacto"
              className="border border-eu-blue text-eu-blue px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Hablar con un experto
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
