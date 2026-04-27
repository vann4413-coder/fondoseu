import type { Fund } from "@/db/schema";

export interface WizardAnswers {
  stage: "idea" | "validacion" | "lanzamiento" | "crecimiento" | "internacionalizacion";
  entityType: "autonomo" | "sl" | "cooperativa" | "unknown";
  sectors: string[];
  location: "españa" | "cataluña" | "provincial";
  amountRange: "<10k" | "10-50k" | "50-200k" | ">200k";
  fundingType: "subvencion" | "prestamo" | "capital" | "cualquiera";
  transversalThemes: string[];
  euPreference: "priority" | "any";
}

export interface RecommendationResult {
  fund: Fund;
  score: number;
  matchReasons: string[];
}

// Ponderaciones del algoritmo de scoring
const WEIGHTS = {
  beneficiary: 30,     // tipo de beneficiario coincide
  fundingType: 20,     // tipo de financiación coincide
  sector: 15,          // sector coincide
  stage: 15,           // etapa coincide
  scope: 10,           // ámbito geográfico coincide
  amount: 10,          // importe en rango
  euPreference: 10,    // preferencia UE
  transversal: 5,      // temas transversales
};

function entityTypeToBeneficiary(
  entityType: WizardAnswers["entityType"]
): string[] {
  const map: Record<WizardAnswers["entityType"], string[]> = {
    autonomo: ["autonomo", "emprendedor"],
    sl: ["pyme", "startup"],
    cooperativa: ["cooperativa", "pyme"],
    unknown: ["emprendedor", "autonomo", "pyme", "startup"],
  };
  return map[entityType];
}

function stageToWizardStage(stage: WizardAnswers["stage"]): string[] {
  const map: Record<WizardAnswers["stage"], string[]> = {
    idea: ["idea"],
    validacion: ["idea", "validacion"],
    lanzamiento: ["validacion", "lanzamiento"],
    crecimiento: ["lanzamiento", "crecimiento", "consolidacion"],
    internacionalizacion: ["crecimiento", "internacionalizacion"],
  };
  return map[stage];
}

function amountInRange(
  amountRange: WizardAnswers["amountRange"],
  min: string | null,
  max: string | null
): boolean {
  const ranges: Record<WizardAnswers["amountRange"], [number, number]> = {
    "<10k": [0, 10_000],
    "10-50k": [10_000, 50_000],
    "50-200k": [50_000, 200_000],
    ">200k": [200_000, Infinity],
  };
  const [userMin, userMax] = ranges[amountRange];
  const fundMin = min ? parseFloat(min) : 0;
  const fundMax = max ? parseFloat(max) : Infinity;
  return fundMax >= userMin && fundMin <= userMax;
}

export function scoreAndRankFunds(
  funds: Fund[],
  answers: WizardAnswers
): RecommendationResult[] {
  const userBeneficiaries = entityTypeToBeneficiary(answers.entityType);
  const userStages = stageToWizardStage(answers.stage);

  const results: RecommendationResult[] = funds.map((fund) => {
    let score = 0;
    const matchReasons: string[] = [];

    // Beneficiario
    const beneficiaryMatch = fund.beneficiaryTypes.some((bt) =>
      userBeneficiaries.includes(bt)
    );
    if (beneficiaryMatch) {
      score += WEIGHTS.beneficiary;
      const label = userBeneficiaries[0];
      matchReasons.push(`Tipo de beneficiario compatible (${label})`);
    }

    // Tipo de financiación
    if (
      answers.fundingType === "cualquiera" ||
      fund.fundingType === answers.fundingType
    ) {
      score += WEIGHTS.fundingType;
      if (answers.fundingType !== "cualquiera") {
        matchReasons.push(`Tipo de financiación: ${fund.fundingType}`);
      }
    }

    // Sector
    const sectorMatch = fund.sectors.some((s) =>
      answers.sectors.includes(s)
    );
    if (sectorMatch || answers.sectors.length === 0) {
      score += WEIGHTS.sector;
      if (sectorMatch) matchReasons.push("Sector encaja");
    }

    // Etapa
    const stageMatch = fund.stages.some((s) => userStages.includes(s));
    if (stageMatch || fund.stages.length === 0) {
      score += WEIGHTS.stage;
      if (stageMatch) matchReasons.push("Etapa del proyecto encaja");
    }

    // Ámbito geográfico
    const scopeMap: Record<WizardAnswers["location"], string[]> = {
      españa: ["ESPAÑA", "UE"],
      cataluña: ["CATALUÑA", "ESPAÑA", "UE"],
      provincial: ["PROVINCIAL", "MUNICIPAL", "CATALUÑA", "ESPAÑA", "UE"],
    };
    if (scopeMap[answers.location].includes(fund.scope)) {
      score += WEIGHTS.scope;
      matchReasons.push(`Ámbito: ${fund.scope}`);
    }

    // Importe
    if (amountInRange(answers.amountRange, fund.amountMin, fund.amountMax)) {
      score += WEIGHTS.amount;
      matchReasons.push("Importe en rango");
    }

    // Preferencia UE
    if (answers.euPreference === "priority" && fund.euFunded) {
      score += WEIGHTS.euPreference;
      const programName = fund.euProgram ?? "UE";
      matchReasons.push(`Cofinanciada por ${programName}`);
    }

    // Temas transversales
    const transversalMatches = answers.transversalThemes.filter((theme) =>
      fund.sectors.includes(theme) ||
      fund.title.toLowerCase().includes(theme) ||
      (fund.description ?? "").toLowerCase().includes(theme)
    );
    if (transversalMatches.length > 0) {
      score += WEIGHTS.transversal;
      matchReasons.push(`Tema transversal: ${transversalMatches[0]}`);
    }

    return { fund, score, matchReasons };
  });

  return results
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

export function formatMatchReasons(reasons: string[]): string {
  if (reasons.length === 0) return "Compatible con tu perfil";
  return "Encaja porque: " + reasons.slice(0, 3).join(" · ");
}
