/**
 * seed.ts — 15 fondos curados, bien documentados.
 * Mezcla: UE puros (Kit Digital, EIC, Horizon, FEDER), nacionales (ENISA, CDTI, ICO, REINDUS)
 * y autonómicos de Cataluña (ACCIÓ, SOC, FEDER-CAT).
 *
 * Ejecutar: npm run seed
 */

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import * as schema from "../db/schema";

type SeedFund = typeof schema.funds.$inferInsert;

function s(title: string, id: string): string {
  return (
    title
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 60) +
    "-" +
    id.slice(0, 15)
  );
}

const FUNDS: SeedFund[] = [
  {
    source: "MANUAL",
    sourceId: "kit-digital-2024",
    sourceUrl: "https://www.acelerapyme.gob.es/kit-digital",
    slug: "kit-digital-bono-digitalizacion-kit-digital-2024",
    title: "Kit Digital — Bono de digitalización para PYMEs y autónomos",
    organism: "Red.es / Ministerio de Asuntos Económicos y Transformación Digital",
    description:
      "El Kit Digital es un programa de ayudas del Gobierno de España financiado con fondos NextGenerationEU para digitalizar a pequeñas empresas, microempresas y autónomos. Consiste en un bono que puedes canjear por soluciones digitales homologadas (web, CRM, ciberseguridad, ecommerce, factura electrónica, etc.).\n\nDotación por segmento:\n• Segmento A (10–49 empleados): hasta 12.000 €\n• Segmento B (3–9 empleados): hasta 6.000 €\n• Segmento C (0–2 empleados): hasta 2.000 €",
    shortDescription:
      "Bono de digitalización cofinanciado por NextGenerationEU. Hasta 12.000 € para soluciones digitales homologadas (web, CRM, ciberseguridad, ecommerce…).",
    scope: "ESPAÑA",
    euFunded: true,
    euProgram: "NEXTGEN",
    euProgramDetail: "NextGenerationEU · Plan de Recuperación, Transformación y Resiliencia",
    beneficiaryTypes: ["autonomo", "pyme"],
    sectors: ["digital", "tecnologia", "comercio", "servicios"],
    stages: ["lanzamiento", "crecimiento", "consolidacion"],
    fundingType: "subvencion",
    amountMin: "2000",
    amountMax: "12000",
    status: "abierta",
    openDate: "2026-01-01",
    closeDate: "2026-12-31",
    applicationUrl: "https://www.acelerapyme.gob.es/kit-digital/convocatorias",
    requiredDocs: ["Alta Sede Electrónica Red.es", "Certificado AEAT y TGSS", "Acreditación número de empleados"],
    rawData: { programa: "Kit Digital" },
    lastSyncedAt: new Date(),
  },
  {
    source: "MANUAL",
    sourceId: "kit-consulting-2024",
    sourceUrl: "https://www.acelerapyme.gob.es/kit-consulting",
    slug: "kit-consulting-asesoramiento-estrategico-pymes-kit-consulting-2024",
    title: "Kit Consulting — Asesoramiento estratégico para PYMEs",
    organism: "Red.es / Ministerio de Asuntos Económicos",
    description:
      "Kit Consulting financia servicios de asesoramiento para transformar y modernizar PYMEs, cofinanciados por NextGenerationEU.\n\nDotación:\n• Segmento A (50–249 empleados): hasta 24.000 €\n• Segmento B (10–49 empleados): hasta 12.000 €\n• Segmento C (3–9 empleados): hasta 6.000 €\n\nÁreas: Inteligencia Artificial, Ciberseguridad, Sostenibilidad, Internacionalización, Transformación Digital.",
    shortDescription:
      "Hasta 24.000 € para consultoría estratégica (IA, ciberseguridad, sostenibilidad…) en PYMEs. Cofinanciado NextGenerationEU.",
    scope: "ESPAÑA",
    euFunded: true,
    euProgram: "NEXTGEN",
    euProgramDetail: "NextGenerationEU · PRTR",
    beneficiaryTypes: ["pyme"],
    sectors: ["digital", "tecnologia", "servicios", "sostenibilidad"],
    stages: ["crecimiento", "consolidacion"],
    fundingType: "subvencion",
    amountMin: "6000",
    amountMax: "24000",
    status: "abierta",
    openDate: "2026-01-01",
    closeDate: "2026-12-31",
    applicationUrl: "https://www.acelerapyme.gob.es/kit-consulting",
    requiredDocs: ["Entre 3 y 249 empleados", "Al corriente de obligaciones fiscales y SS"],
    rawData: { programa: "Kit Consulting" },
    lastSyncedAt: new Date(),
  },
  {
    source: "MANUAL",
    sourceId: "enisa-jovenes-emprendedores",
    sourceUrl: "https://www.enisa.es/es/lineas-de-financiacion/jovenes-emprendedores",
    slug: "enisa-jovenes-emprendedores-prestamo-participativo-enisa-jovenes",
    title: "ENISA Jóvenes Emprendedores — Préstamo participativo sin garantías",
    organism: "ENISA — Empresa Nacional de Innovación (Ministerio de Industria)",
    description:
      "Préstamos participativos para emprendedores de 18–40 años con startups innovadoras. Sin garantías reales, carencia de hasta 7 años y tipos de interés reducidos.\n\n• Importe: 75.000 € – 300.000 €\n• Carencia: hasta 7 años\n• Empresa creada hace menos de 2 años o en proceso de constitución",
    shortDescription:
      "Préstamo participativo sin garantías para startups de jóvenes (18–40 años). Hasta 300.000 € con 7 años de carencia.",
    scope: "ESPAÑA",
    euFunded: false,
    euProgram: null,
    euProgramDetail: null,
    beneficiaryTypes: ["startup", "pyme", "emprendedor"],
    sectors: ["tecnologia", "digital", "biotecnologia", "sostenibilidad"],
    stages: ["validacion", "lanzamiento", "crecimiento"],
    fundingType: "prestamo",
    amountMin: "75000",
    amountMax: "300000",
    status: "abierta",
    openDate: "2026-01-01",
    closeDate: "2026-11-30",
    applicationUrl: "https://www.enisa.es/es/lineas-de-financiacion/jovenes-emprendedores",
    requiredDocs: ["Emprendedor 18–40 años", "Empresa < 2 años", "Plan de negocio", "Proyecto innovador"],
    rawData: { linea: "Jóvenes Emprendedores", organismo: "ENISA" },
    lastSyncedAt: new Date(),
  },
  {
    source: "MANUAL",
    sourceId: "eic-accelerator-2025",
    sourceUrl: "https://eic.ec.europa.eu/eic-funding-opportunities/eic-accelerator_en",
    slug: "eic-accelerator-financiacion-startups-disruptivas-eu-eic-accelerator",
    title: "EIC Accelerator — Hasta 17,5M€ para startups con innovación disruptiva",
    organism: "European Innovation Council (Comisión Europea)",
    description:
      "El EIC Accelerator es el programa estrella de la UE para startups y PYMEs con innovaciones disruptivas. Combina subvención directa e inversión de capital.\n\n• Solo subvención: hasta 2,5 M€ (70% costes elegibles)\n• Solo inversión: hasta 15 M€ en equity del EIC Fund\n• Combinada: hasta 17,5 M€\n\nProceso competitivo en 2 fases con entrevista en Bruselas.",
    shortDescription:
      "El programa más competitivo de la UE: subvención de hasta 2,5M€ + capital de hasta 15M€ para startups con innovación disruptiva. Horizon Europe.",
    scope: "UE",
    euFunded: true,
    euProgram: "EIC",
    euProgramDetail: "Horizon Europe — European Innovation Council Accelerator",
    beneficiaryTypes: ["startup", "pyme"],
    sectors: ["tecnologia", "biotecnologia", "energia", "digital", "salud", "movilidad"],
    stages: ["lanzamiento", "crecimiento", "internacionalizacion"],
    fundingType: "mixto",
    amountMin: "500000",
    amountMax: "17500000",
    status: "abierta",
    openDate: "2026-01-15",
    closeDate: "2026-10-08",
    applicationUrl: "https://eic.ec.europa.eu/eic-funding-opportunities/eic-accelerator_en",
    requiredDocs: ["PYME/startup UE", "Innovación disruptiva", "Pitch deck + modelo financiero"],
    rawData: { programa: "EIC Accelerator", convocatoria: "2025" },
    lastSyncedAt: new Date(),
  },
  {
    source: "MANUAL",
    sourceId: "cdti-neotec-2025",
    sourceUrl: "https://www.cdti.es/ayudas/neotec",
    slug: "cdti-neotec-subvencion-empresas-tecnologicas-nueva-creacion-cdti-neotec",
    title: "CDTI Neotec — Subvención para startups tecnológicas de nueva creación",
    organism: "CDTI — Centro para el Desarrollo Tecnológico y la Innovación (MCIN)",
    description:
      "Subvenciones para empresas tecnológicas de base innovadora creadas hace menos de 3 años. Cofinanciado con fondos FEDER.\n\n• Hasta 250.000 € (hasta el 70% del presupuesto)\n• Presupuesto mínimo: 175.000 €\n• Convocatoria anual (primer trimestre)",
    shortDescription:
      "Hasta 250.000 € para startups tecnológicas < 3 años. Cofinanciado FEDER. Presupuesto mínimo 175.000 €.",
    scope: "ESPAÑA",
    euFunded: true,
    euProgram: "FEDER",
    euProgramDetail: "FEDER 2021-2027 — Programa Operativo Plurirregional de España",
    beneficiaryTypes: ["startup", "pyme"],
    sectors: ["tecnologia", "digital", "biotecnologia", "energia", "salud"],
    stages: ["validacion", "lanzamiento"],
    fundingType: "subvencion",
    amountMin: "122500",
    amountMax: "250000",
    cofinancingPct: "70",
    status: "abierta",
    openDate: "2026-02-01",
    closeDate: "2026-04-30",
    applicationUrl: "https://www.cdti.es/ayudas/neotec",
    requiredDocs: ["Empresa < 3 años", ">50% capital en manos de personas físicas", "Memoria técnica"],
    rawData: { programa: "Neotec", organismo: "CDTI" },
    lastSyncedAt: new Date(),
  },
  {
    source: "MANUAL",
    sourceId: "ico-empresas-emprendedores",
    sourceUrl: "https://www.ico.es/web/ico/ico-empresas-y-emprendedores",
    slug: "ico-empresas-emprendedores-prestamo-inversion-liquidez-ico-empresas",
    title: "Línea ICO Empresas y Emprendedores — Préstamo para inversión y liquidez",
    organism: "Instituto de Crédito Oficial (ICO)",
    description:
      "Financiación de hasta 12,5 M€ para autónomos y empresas. Opera a través de la red bancaria privada.\n\n• Plazo: 1–20 años (con hasta 3 años de carencia)\n• Tipo: fijo o variable, negociado con la entidad bancaria\n• Usos: inversión en activos fijos y liquidez",
    shortDescription:
      "Préstamo de hasta 12,5M€ para inversión y liquidez. Canalizado por tu banco habitual. El ICO asume parte del riesgo. Plazos hasta 20 años.",
    scope: "ESPAÑA",
    euFunded: false,
    euProgram: null,
    euProgramDetail: null,
    beneficiaryTypes: ["autonomo", "pyme", "startup", "gran_empresa", "emprendedor"],
    sectors: [],
    stages: ["idea", "validacion", "lanzamiento", "crecimiento", "internacionalizacion"],
    fundingType: "prestamo",
    amountMin: "1000",
    amountMax: "12500000",
    status: "abierta",
    openDate: "2026-01-01",
    closeDate: "2026-12-15",
    applicationUrl: "https://www.ico.es/web/ico/ico-empresas-y-emprendedores",
    requiredDocs: ["Solicitar en entidad bancaria colaboradora", "NIF/CIF vigente", "Plan de negocio si es nueva empresa"],
    rawData: { linea: "ICO Empresas y Emprendedores", año: 2025 },
    lastSyncedAt: new Date(),
  },
  {
    source: "MANUAL",
    sourceId: "accio-startup-capital",
    sourceUrl: "https://accio.gencat.cat/ca/accio/programes-i-serveis/emprenedoria/startup-capital",
    slug: "accio-startup-capital-prestamo-startups-catalanas-accio-startup",
    title: "ACCIÓ Startup Capital — Préstamo para startups catalanas en etapa temprana",
    organism: "ACCIÓ — Agència per la Competitivitat de l'Empresa (Generalitat de Catalunya)",
    description:
      "Préstamo participativo cofinanciado con FEDER para startups catalanas de menos de 5 años. Sin garantías reales.\n\n• Importe: 25.000 € – 200.000 €\n• Carencia de capital: hasta 4 años\n• Tipo: Euribor + diferencial bajo\n• Complementado con mentoring y conexión con inversores",
    shortDescription:
      "Préstamo participativo de 25.000–200.000 € para startups catalanas. Sin garantías. Cofinanciado FEDER. Carencia hasta 4 años.",
    scope: "CATALUÑA",
    region: "Cataluña",
    euFunded: true,
    euProgram: "FEDER",
    euProgramDetail: "FEDER 2021-2027 — Programa Operatiu de Catalunya",
    beneficiaryTypes: ["startup", "pyme"],
    sectors: ["tecnologia", "digital", "biotecnologia", "sostenibilidad", "salud"],
    stages: ["idea", "validacion", "lanzamiento"],
    fundingType: "prestamo",
    amountMin: "25000",
    amountMax: "200000",
    status: "abierta",
    openDate: "2026-01-15",
    closeDate: "2026-09-30",
    applicationUrl: "https://accio.gencat.cat/ca/accio/programes-i-serveis/emprenedoria/startup-capital",
    requiredDocs: ["Sede social o fiscal en Cataluña", "Empresa < 5 años", "Plan de negocio"],
    rawData: { programa: "Startup Capital", organismo: "ACCIÓ" },
    lastSyncedAt: new Date(),
  },
  {
    source: "MANUAL",
    sourceId: "soc-empleo-autonomo",
    sourceUrl: "https://empresa.gencat.cat/ca/treb_ambits_d_actuacio/treball/politiques_actives_de_treball/persones-emprenedores/",
    slug: "soc-subvencions-autoocupacio-emprenedoria-soc-empleo-auto",
    title: "SOC — Subvenciones para el autoempleo y emprendimiento en Cataluña",
    organism: "SOC — Servei d'Ocupació de Catalunya (Generalitat de Catalunya)",
    description:
      "Programa cofinanciado con FSE+ para personas desempleadas que se establecen como autónomas en Cataluña.\n\n• Subvención base: hasta 10.000 €\n• Bonificaciones en cuota RETA\n• Formación complementaria subvencionada\n\nRequiere estar en situación de desempleo inscrito en el SOC.",
    shortDescription:
      "Hasta 10.000 € para personas que se dan de alta como autónomas en Cataluña. Cofinanciada por FSE+. Solo para personas desempleadas inscritas en el SOC.",
    scope: "CATALUÑA",
    region: "Cataluña",
    euFunded: true,
    euProgram: "FSE_PLUS",
    euProgramDetail: "Fondo Social Europeo Plus (FSE+) 2021-2027",
    beneficiaryTypes: ["autonomo", "emprendedor"],
    sectors: [],
    stages: ["idea", "lanzamiento"],
    fundingType: "subvencion",
    amountMin: "5000",
    amountMax: "10000",
    status: "abierta",
    openDate: "2026-01-01",
    closeDate: "2026-10-31",
    applicationUrl: "https://empresa.gencat.cat/ca/treb_ambits_d_actuacio/treball/politiques_actives_de_treball/persones-emprenedores/",
    requiredDocs: ["Inscripción como demandante de empleo en SOC", "Alta en RETA", "Plan de actividad"],
    rawData: { programa: "Empleo Autónomo", organismo: "SOC" },
    lastSyncedAt: new Date(),
  },
  {
    source: "MANUAL",
    sourceId: "enisa-emprendedoras-digitales",
    sourceUrl: "https://www.enisa.es/es/lineas-de-financiacion/emprendedoras",
    slug: "enisa-emprendedoras-digitales-prestamo-mujeres-tech-enisa-emprendedor",
    title: "ENISA Emprendedoras Digitales — Préstamo para mujeres emprendedoras en tecnología",
    organism: "ENISA — Empresa Nacional de Innovación",
    description:
      "Préstamos sin garantías para proyectos tecnológicos liderados por mujeres o con ≥50% de participación femenina en el equipo fundador.\n\n• Importe: 25.000 € – 300.000 €\n• Carencia: hasta 5 años\n• Sin garantías reales",
    shortDescription:
      "Préstamo sin garantías para startups digitales con equipo fundador femenino mayoritario. Hasta 300.000 € con 5 años de carencia.",
    scope: "ESPAÑA",
    euFunded: false,
    euProgram: null,
    euProgramDetail: null,
    beneficiaryTypes: ["startup", "pyme", "emprendedor"],
    sectors: ["digital", "tecnologia", "fintech", "salud"],
    stages: ["idea", "validacion", "lanzamiento"],
    fundingType: "prestamo",
    amountMin: "25000",
    amountMax: "300000",
    status: "abierta",
    openDate: "2026-01-01",
    closeDate: "2026-11-30",
    applicationUrl: "https://www.enisa.es/es/lineas-de-financiacion/emprendedoras",
    requiredDocs: ["≥50% capital o equipo fundador femenino", "Proyecto tecnológico/digital", "Plan de negocio escalable"],
    rawData: { linea: "Emprendedoras Digitales", organismo: "ENISA" },
    lastSyncedAt: new Date(),
  },
  {
    source: "MANUAL",
    sourceId: "horizon-europe-missions-2025",
    sourceUrl: "https://research-and-innovation.ec.europa.eu/funding/funding-opportunities/funding-programmes-and-open-calls/horizon-europe_es",
    slug: "horizon-europe-investigacion-innovacion-consorcio-horizon-europe",
    title: "Horizon Europe — Financiación para I+D+i en consorcio internacional",
    organism: "Comisión Europea — CINEA / REA / HADEA",
    description:
      "El mayor programa de I+D+i del mundo (95.500 M€). Su Pilar II financia colaboraciones entre empresas, universidades y centros de investigación europeos.\n\n• IA: hasta 70% de financiación\n• RIA: hasta 100%\n• Requiere consorcio de mínimo 3 entidades de 3 países",
    shortDescription:
      "Financia proyectos de innovación en consorcio internacional (mínimo 3 países). Hasta 100% cobertura. Para salud, clima, digital, alimentación y más.",
    scope: "UE",
    euFunded: true,
    euProgram: "HORIZON",
    euProgramDetail: "Horizon Europe 2021-2027 — Pilar II",
    beneficiaryTypes: ["pyme", "startup", "gran_empresa", "investigador"],
    sectors: ["salud", "sostenibilidad", "energia", "digital", "agroalimentario", "movilidad"],
    stages: ["crecimiento", "internacionalizacion"],
    fundingType: "subvencion",
    amountMin: "500000",
    amountMax: "10000000",
    cofinancingPct: "70",
    status: "abierta",
    openDate: "2026-01-01",
    closeDate: "2026-09-17",
    applicationUrl: "https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/home",
    requiredDocs: ["Consorcio ≥3 entidades de ≥3 países", "Propuesta técnica", "Presupuesto por Work Package"],
    rawData: { programa: "Horizon Europe", pillar: "II" },
    lastSyncedAt: new Date(),
  },
  {
    source: "MANUAL",
    sourceId: "feder-pyme-innovacio-cat-2025",
    sourceUrl: "https://accio.gencat.cat/ca/accio/programes-i-serveis/innovacio/",
    slug: "feder-innovacio-empresarial-pymes-cataluna-feder-pyme-innov",
    title: "FEDER Innovació Empresarial — Subvencions per a PYMEs catalanes (ACCIÓ)",
    organism: "ACCIÓ / Generalitat de Catalunya / Comissió Europea",
    description:
      "Subvenciones FEDER para proyectos de innovación de PYMEs catalanas: I+D+i, digitalización industrial, tecnologías avanzadas y economía circular.\n\n• Cofinanciación: 40–50% de los costes elegibles\n• Presupuesto mínimo: 100.000 €\n• Prioridad: áreas RIS3CAT (agroalimentario, energía, movilidad, salud, industria 4.0)",
    shortDescription:
      "Subvenciones FEDER del 40–50% para proyectos de innovación de PYMEs catalanas. Presupuesto mínimo 100.000 €.",
    scope: "CATALUÑA",
    region: "Cataluña",
    euFunded: true,
    euProgram: "FEDER",
    euProgramDetail: "FEDER 2021-2027 — Programa Operatiu de Catalunya",
    beneficiaryTypes: ["pyme"],
    sectors: ["tecnologia", "industria", "agroalimentario", "energia", "salud", "movilidad"],
    stages: ["crecimiento", "consolidacion"],
    fundingType: "subvencion",
    amountMin: "40000",
    amountMax: "500000",
    cofinancingPct: "50",
    status: "abierta",
    openDate: "2026-03-01",
    closeDate: "2026-12-15",
    applicationUrl: "https://accio.gencat.cat/ca/accio/programes-i-serveis/innovacio/",
    requiredDocs: ["PYME con sede en Cataluña", "Memòria tècnica del projecte", "Pressupost per partides"],
    rawData: { programa: "FEDER Innovació Empresarial" },
    lastSyncedAt: new Date(),
  },
  {
    source: "MANUAL",
    sourceId: "enisa-empresas-2025",
    sourceUrl: "https://www.enisa.es/es/lineas-de-financiacion/empresas",
    slug: "enisa-empresas-prestamo-participativo-pymes-crecimiento-enisa-empresas",
    title: "ENISA Empresas — Préstamo participativo para PYMEs en crecimiento",
    organism: "ENISA — Empresa Nacional de Innovación",
    description:
      "Préstamos participativos para PYMEs españolas con proyectos innovadores en crecimiento. Sin restricción de edad del fundador, para empresas con mínimo 2 años de antigüedad.\n\n• Importe: 25.000 € – 1,5 M€\n• Carencia: hasta 7 años\n• Sin garantías reales",
    shortDescription:
      "Préstamo participativo sin garantías para PYMEs con ≥2 años de actividad. Hasta 1,5M€ con carencia de 7 años.",
    scope: "ESPAÑA",
    euFunded: false,
    euProgram: null,
    euProgramDetail: null,
    beneficiaryTypes: ["pyme", "startup"],
    sectors: ["tecnologia", "digital", "industria", "salud", "servicios"],
    stages: ["crecimiento", "consolidacion", "internacionalizacion"],
    fundingType: "prestamo",
    amountMin: "25000",
    amountMax: "1500000",
    status: "abierta",
    openDate: "2026-01-01",
    closeDate: "2026-11-30",
    applicationUrl: "https://www.enisa.es/es/lineas-de-financiacion/empresas",
    requiredDocs: ["Empresa española ≥2 años", "Cuentas anuales últimos 2 años", "Plan de negocio"],
    rawData: { linea: "Empresas", organismo: "ENISA" },
    lastSyncedAt: new Date(),
  },
  {
    source: "MANUAL",
    sourceId: "investeu-pyme-spain",
    sourceUrl: "https://www.ico.es/web/ico/pymes-y-mid-caps",
    slug: "investeu-bei-prestamos-ventajosos-pymes-investeu-pyme-spa",
    title: "InvestEU / BEI — Financiación ventajosa para PYMEs a través del ICO",
    organism: "Banco Europeo de Inversiones (BEI) / ICO",
    description:
      "InvestEU canaliza garantías del BEI a través del ICO para facilitar préstamos en condiciones ventajosas a PYMEs.\n\n• Tipos de interés inferiores al mercado\n• Plazos hasta 15 años\n• Sin garantías adicionales en algunos tramos\n• Elegible cualquier sector productivo",
    shortDescription:
      "Préstamos con garantía BEI para PYMEs: tipos bajo mercado, plazos hasta 15 años. Canalizado por el ICO. Cobertura InvestEU.",
    scope: "ESPAÑA",
    euFunded: true,
    euProgram: "INVESTEU",
    euProgramDetail: "InvestEU — BEI Group / Garantías para PYMEs",
    beneficiaryTypes: ["pyme", "startup", "autonomo"],
    sectors: [],
    stages: ["lanzamiento", "crecimiento", "consolidacion"],
    fundingType: "prestamo",
    amountMin: "25000",
    amountMax: "5000000",
    status: "abierta",
    openDate: "2026-01-01",
    closeDate: "2026-12-31",
    applicationUrl: "https://www.ico.es/web/ico/pymes-y-mid-caps",
    requiredDocs: ["PYME española (< 250 empleados)", "Solicitar en banco colaborador ICO"],
    rawData: { programa: "InvestEU", canal: "ICO" },
    lastSyncedAt: new Date(),
  },
  {
    source: "MANUAL",
    sourceId: "feader-emprendimiento-rural-2025",
    sourceUrl: "https://www.mapa.gob.es/es/desarrollo-rural/temas/programas-ue/",
    slug: "feader-emprendimiento-rural-diversificacion-economica-feader-rural",
    title: "FEADER — Subvenciones para diversificación y emprendimiento en zonas rurales",
    organism: "MAPA / Comunidades Autónomas (cofinanciado FEADER)",
    description:
      "El FEADER financia proyectos de diversificación económica en zonas rurales a través de los GAL/LEADER.\n\n• Microempresas no agrarias en zonas rurales\n• Turismo rural y agroturismo\n• Artesanía y actividades culturales locales\n• Acceso: a través del GAL/LEADER de tu comarca",
    shortDescription:
      "Fondos FEADER para crear negocios en zonas rurales. Gestionado por GAL/LEADER locales. Turismo rural, artesanía, servicios y más.",
    scope: "ESPAÑA",
    euFunded: true,
    euProgram: "OTRO",
    euProgramDetail: "FEADER — Fondo Europeo Agrícola de Desarrollo Rural 2023-2027",
    beneficiaryTypes: ["autonomo", "pyme", "cooperativa", "emprendedor"],
    sectors: ["agroalimentario", "turismo", "cultura", "servicios"],
    stages: ["idea", "lanzamiento", "crecimiento"],
    fundingType: "subvencion",
    amountMin: "5000",
    amountMax: "200000",
    cofinancingPct: "80",
    status: "abierta",
    openDate: "2026-01-01",
    closeDate: "2027-12-31",
    applicationUrl: "https://www.mapa.gob.es/es/desarrollo-rural/temas/programas-ue/",
    requiredDocs: ["Proyecto en zona rural o municipio LEADER", "Contactar GAL/LEADER local", "Proyecto de negocio"],
    rawData: { fondo: "FEADER", acceso: "GAL/LEADER" },
    lastSyncedAt: new Date(),
  },
  {
    source: "MANUAL",
    sourceId: "reindus-2025",
    sourceUrl: "https://www.mincotur.gob.es/industria/subvenciones-y-ayudas/reindus",
    slug: "reindus-prestamos-proyectos-industriales-ministerio-industria-reindus-2025",
    title: "REINDUS — Préstamos para proyectos de inversión industrial",
    organism: "Ministerio de Industria y Turismo",
    description:
      "Préstamos a tipo reducido para financiar proyectos de inversión industrial en España: nuevas plantas, ampliaciones y modernizaciones.\n\n• Hasta el 75% del proyecto elegible como préstamo blando\n• Amortización hasta 10 años (3 de carencia)\n• Presupuesto mínimo: 500.000 €\n• Sectores: manufactura, agroalimentario, química, energía",
    shortDescription:
      "Préstamos blandos para proyectos industriales (mínimo 500.000 €). Hasta 75% financiado. Amortización 10 años con 3 de carencia.",
    scope: "ESPAÑA",
    euFunded: false,
    euProgram: null,
    euProgramDetail: null,
    beneficiaryTypes: ["pyme", "gran_empresa", "startup"],
    sectors: ["industria", "agroalimentario", "energia", "biotecnologia"],
    stages: ["lanzamiento", "crecimiento", "consolidacion"],
    fundingType: "prestamo",
    amountMin: "375000",
    amountMax: "10000000",
    cofinancingPct: "75",
    status: "proximamente",
    openDate: "2026-07-01",
    closeDate: "2026-10-31",
    applicationUrl: "https://www.mincotur.gob.es/industria/subvenciones-y-ayudas/reindus",
    requiredDocs: ["Empresa industrial", "Inversión ≥500.000 €", "Memoria técnica y económica"],
    rawData: { programa: "REINDUS", ministerio: "Industria y Turismo" },
    lastSyncedAt: new Date(),
  },
];

async function seed() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL no está definida en .env.local");
  }

  const client = postgres(connectionString, {
    max: 1,
    ssl: connectionString.includes("neon.tech") ? "require" : false,
  });
  const db = drizzle(client, { schema });

  console.log("🌱 Ejecutando seed de fondos curados…\n");

  let inserted = 0;
  let updated = 0;
  let euCount = 0;

  for (const fund of FUNDS) {
    try {
      const existing = await db
        .select({ id: schema.funds.id })
        .from(schema.funds)
        .where(eq(schema.funds.sourceId, fund.sourceId!))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(schema.funds)
          .set({ ...fund, updatedAt: new Date() })
          .where(eq(schema.funds.id, existing[0].id));
        updated++;
        console.log(`  ✏️  Actualizado: ${fund.title!.slice(0, 55)}…`);
      } else {
        await db.insert(schema.funds).values(fund);
        inserted++;
        console.log(`  ✅ Insertado:   ${fund.title!.slice(0, 55)}…`);
      }

      if (fund.euFunded) euCount++;
    } catch (err) {
      console.error(`  ❌ Error con ${fund.sourceId}:`, err);
    }
  }

  const euPct = Math.round((euCount / FUNDS.length) * 100);

  console.log("\n" + "═".repeat(52));
  console.log("📊 RESUMEN SEED");
  console.log("═".repeat(52));
  console.log(`   Total fondos:          ${FUNDS.length}`);
  console.log(`   Insertados nuevos:     ${inserted}`);
  console.log(`   Actualizados:          ${updated}`);
  console.log(`   Con fondos europeos:   ${euCount} (${euPct}%)`);
  console.log(`   Programas UE:          NextGen·FEDER·FSE+·EIC·Horizon·InvestEU·FEADER`);
  console.log("═".repeat(52));
  console.log("\n✅ Seed completado.\n");

  await client.end();
}

seed().catch((err) => {
  console.error("❌ Error fatal en seed:", err);
  process.exit(1);
});
