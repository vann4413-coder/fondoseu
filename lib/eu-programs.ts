// Definición de programas europeos con metadatos para UI y detección

export type EUProgramCode =
  | "NEXTGEN"
  | "FEDER"
  | "FSE_PLUS"
  | "HORIZON"
  | "EIC"
  | "LIFE"
  | "INVESTEU"
  | "OTRO";

export interface EUProgram {
  code: EUProgramCode;
  shortName: string;      // nombre corto para badges y UI
  fullName: string;       // nombre completo
  description: string;
  budget: string;
  period: string;
  officialUrl: string;
  targetBeneficiaries: string;
  color: string;          // Tailwind bg class
  textColor: string;      // Tailwind text class
}

export const EU_PROGRAMS: Record<EUProgramCode, EUProgram> = {
  NEXTGEN: {
    code: "NEXTGEN",
    shortName: "NextGenerationEU",
    fullName: "NextGenerationEU / Plan de Recuperación (PRTR)",
    description:
      "El mayor instrumento de estímulo de la UE (806.900 M€). En España se articula como Plan de Recuperación, Transformación y Resiliencia (PRTR). Incluye programas como Kit Digital, Kit Consulting, PERTE y muchos más.",
    budget: "806.900 M€ (UE total)",
    period: "2021–2026",
    officialUrl: "https://next-generation-eu.europa.eu/",
    targetBeneficiaries: "Empresas, autónomos, startups, investigadores",
    color: "bg-blue-700",
    textColor: "text-white",
  },
  FEDER: {
    code: "FEDER",
    shortName: "FEDER",
    fullName: "Fondo Europeo de Desarrollo Regional",
    description:
      "Reduce las desigualdades entre regiones europeas financiando infraestructuras, digitalización, innovación y apoyo a PYMEs. En España gestionan los fondos las comunidades autónomas.",
    budget: "226.000 M€ (UE total, período 2021–2027)",
    period: "2021–2027",
    officialUrl: "https://ec.europa.eu/regional_policy/funding/erdf_es",
    targetBeneficiaries: "PYMEs, autónomos, startups, organismos públicos",
    color: "bg-indigo-600",
    textColor: "text-white",
  },
  FSE_PLUS: {
    code: "FSE_PLUS",
    shortName: "FSE+",
    fullName: "Fondo Social Europeo Plus",
    description:
      "Financia empleo, formación, inclusión social y apoyo al emprendimiento. En España: programas de empleo autónomo, formación para desempleados y economía social.",
    budget: "99.300 M€ (UE total)",
    period: "2021–2027",
    officialUrl: "https://ec.europa.eu/european-social-fund-plus",
    targetBeneficiaries: "Emprendedores, autónomos, desempleados, jóvenes",
    color: "bg-teal-600",
    textColor: "text-white",
  },
  HORIZON: {
    code: "HORIZON",
    shortName: "Horizon Europe",
    fullName: "Horizon Europe — Programa Marco de I+D+i de la UE",
    description:
      "El mayor programa de financiación para investigación e innovación del mundo (95.500 M€). Financia proyectos en consorcio internacional.",
    budget: "95.500 M€",
    period: "2021–2027",
    officialUrl: "https://research-and-innovation.ec.europa.eu/funding/funding-opportunities/funding-programmes-and-open-calls/horizon-europe_es",
    targetBeneficiaries: "Startups deeptech, investigadores, spin-offs universitarios",
    color: "bg-purple-600",
    textColor: "text-white",
  },
  EIC: {
    code: "EIC",
    shortName: "EIC Accelerator",
    fullName: "European Innovation Council — EIC Accelerator",
    description:
      "Financiación directa de la UE para startups y PYMEs con innovaciones disruptivas de alto impacto. Combina subvención de hasta 2,5M€ con inversión de capital de hasta 15M€.",
    budget: "Hasta 17,5M€ por empresa",
    period: "2021–2027",
    officialUrl: "https://eic.ec.europa.eu/eic-funding-opportunities/eic-accelerator_es",
    targetBeneficiaries: "Startups y PYMEs con innovación disruptiva",
    color: "bg-yellow-500",
    textColor: "text-gray-900",
  },
  LIFE: {
    code: "LIFE",
    shortName: "Programa LIFE",
    fullName: "Programa LIFE — Medio Ambiente y Acción por el Clima",
    description:
      "Financia proyectos de protección medioambiental, biodiversidad, economía circular y acción por el clima.",
    budget: "5.400 M€",
    period: "2021–2027",
    officialUrl: "https://cinea.ec.europa.eu/programmes/life_es",
    targetBeneficiaries: "Empresas, ONGs, organismos públicos con proyectos ambientales",
    color: "bg-green-600",
    textColor: "text-white",
  },
  INVESTEU: {
    code: "INVESTEU",
    shortName: "InvestEU",
    fullName: "InvestEU — Fondo Europeo de Inversiones Estratégicas",
    description:
      "Moviliza inversión privada mediante garantías del BEI. En España se canaliza a través del ICO para préstamos e inversiones en PYMEs.",
    budget: "26.200 M€ (garantías UE)",
    period: "2021–2027",
    officialUrl: "https://investeu.europa.eu/",
    targetBeneficiaries: "PYMEs, startups, infraestructuras",
    color: "bg-orange-500",
    textColor: "text-white",
  },
  OTRO: {
    code: "OTRO",
    shortName: "Fondos UE",
    fullName: "Otros fondos europeos",
    description: "Convocatoria cofinanciada con fondos europeos.",
    budget: "Variable",
    period: "2021–2027",
    officialUrl: "https://european-union.europa.eu/",
    targetBeneficiaries: "Variable según convocatoria",
    color: "bg-blue-500",
    textColor: "text-white",
  },
};

// Palabras clave para detección automática en textos BDNS
export const EU_DETECTION_KEYWORDS: {
  keyword: string;
  program: EUProgramCode;
  weight: number;
}[] = [
  { keyword: "NextGenerationEU", program: "NEXTGEN", weight: 3 },
  { keyword: "Next Generation EU", program: "NEXTGEN", weight: 3 },
  { keyword: "PRTR", program: "NEXTGEN", weight: 3 },
  { keyword: "Plan de Recuperación", program: "NEXTGEN", weight: 2 },
  { keyword: "Plan de Recuperacion", program: "NEXTGEN", weight: 2 },
  { keyword: "MRR", program: "NEXTGEN", weight: 2 },
  { keyword: "Mecanismo de Recuperación", program: "NEXTGEN", weight: 2 },
  { keyword: "Kit Digital", program: "NEXTGEN", weight: 3 },
  { keyword: "Kit Consulting", program: "NEXTGEN", weight: 3 },
  { keyword: "FEDER", program: "FEDER", weight: 3 },
  { keyword: "Fondo Europeo de Desarrollo Regional", program: "FEDER", weight: 3 },
  { keyword: "ERDF", program: "FEDER", weight: 3 },
  { keyword: "FSE+", program: "FSE_PLUS", weight: 3 },
  { keyword: "FSE Plus", program: "FSE_PLUS", weight: 3 },
  { keyword: "Fondo Social Europeo", program: "FSE_PLUS", weight: 3 },
  { keyword: "FEMP", program: "FSE_PLUS", weight: 2 },
  { keyword: "Horizon Europe", program: "HORIZON", weight: 3 },
  { keyword: "Horizon 2020", program: "HORIZON", weight: 3 },
  { keyword: "H2020", program: "HORIZON", weight: 3 },
  { keyword: "EIC Accelerator", program: "EIC", weight: 3 },
  { keyword: "European Innovation Council", program: "EIC", weight: 3 },
  { keyword: "Programa LIFE", program: "LIFE", weight: 3 },
  { keyword: "LIFE+", program: "LIFE", weight: 3 },
  { keyword: "InvestEU", program: "INVESTEU", weight: 3 },
  { keyword: "FEADER", program: "OTRO", weight: 2 },
  { keyword: "fondos europeos", program: "OTRO", weight: 1 },
  { keyword: "fondos comunitarios", program: "OTRO", weight: 1 },
  { keyword: "cofinanciado por la Unión Europea", program: "OTRO", weight: 2 },
  { keyword: "cofinançat per la Unió Europea", program: "OTRO", weight: 2 },
];

export function detectEUProgram(text: string): {
  euFunded: boolean;
  euProgram: EUProgramCode | null;
  euProgramDetail: string | null;
} {
  if (!text) return { euFunded: false, euProgram: null, euProgramDetail: null };

  const normalizedText = text.toLowerCase();
  let bestMatch: { program: EUProgramCode; weight: number; keyword: string } | null = null;

  for (const { keyword, program, weight } of EU_DETECTION_KEYWORDS) {
    if (normalizedText.includes(keyword.toLowerCase())) {
      if (!bestMatch || weight > bestMatch.weight) {
        bestMatch = { program, weight, keyword };
      }
    }
  }

  if (!bestMatch) return { euFunded: false, euProgram: null, euProgramDetail: null };

  return {
    euFunded: true,
    euProgram: bestMatch.program,
    euProgramDetail: bestMatch.keyword,
  };
}
