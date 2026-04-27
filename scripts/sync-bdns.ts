/**
 * BDNS Sync Script
 * Endpoint real: https://www.infosubvenciones.es/bdnstrans/api/convocatorias/ultimas
 * Estructura respuesta: { content: [...], totalElements, totalPages }
 * Campo mrr=true indica MRR/PRTR/NextGenerationEU directamente.
 */

import axios from "axios";
import { db, funds } from "../db/index";
import { eq } from "drizzle-orm";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const BDNS_BASE = "https://www.infosubvenciones.es/bdnstrans/api";
const BDNS_URL = `${BDNS_BASE}/convocatorias/ultimas`;

interface BDNSItem {
  id: number;
  mrr: boolean;
  numeroConvocatoria: string;
  descripcion: string;
  descripcionLeng?: string;
  fechaRecepcion: string;
  nivel1: string;
  nivel2: string;
  nivel3: string;
  codigoInvente?: string | null;
}

interface BDNSResponse {
  content: BDNSItem[];
  totalElements: number;
  totalPages: number;
  pageable: { pageNumber: number; pageSize: number };
}

const EU_KEYWORDS = [
  "nextgeneration", "prtr", "next generation", "plan de recuperacion",
  "feder", "fondo europeo de desarrollo",
  "fse", "fondo social europeo",
  "horizon", "horizonte europa",
  "european innovation council", " eic ",
  "programa life", " life ",
  "investeu",
];

function detectEUProgram(item: BDNSItem): {
  euFunded: boolean;
  program: string | null;
  detail: string | null;
} {
  if (item.mrr) {
    return { euFunded: true, program: "NEXTGEN", detail: "MRR — PRTR" };
  }

  const text = (item.descripcion + " " + (item.descripcionLeng || "")).toLowerCase();

  if (text.includes("nextgeneration") || text.includes("prtr") || text.includes("plan de recuperacion")) {
    return { euFunded: true, program: "NEXTGEN", detail: "NextGenerationEU" };
  }
  if (text.includes("feder")) {
    return { euFunded: true, program: "FEDER", detail: "FEDER 2021-2027" };
  }
  if (text.includes("fse") || text.includes("fondo social europeo")) {
    return { euFunded: true, program: "FSE_PLUS", detail: "FSE+" };
  }
  if (text.includes("horizon")) {
    return { euFunded: true, program: "HORIZON", detail: "Horizon Europe" };
  }
  if (text.includes("european innovation") || text.includes(" eic ")) {
    return { euFunded: true, program: "EIC", detail: "EIC" };
  }
  if (text.includes("programa life") || text.includes(" life ")) {
    return { euFunded: true, program: "LIFE", detail: "LIFE" };
  }
  if (text.includes("investeu")) {
    return { euFunded: true, program: "INVESTEU", detail: "InvestEU" };
  }

  return { euFunded: false, program: null, detail: null };
}

function mapScope(nivel1: string): "UE" | "ESPAÑA" | "CATALUÑA" | "PROVINCIAL" | "MUNICIPAL" {
  const n = nivel1.toUpperCase();
  if (n.includes("ESTATAL") || n.includes("NACIONAL")) return "ESPAÑA";
  if (n.includes("AUTON")) return "CATALUÑA";
  if (n.includes("PROVIN")) return "PROVINCIAL";
  if (n.includes("LOCAL") || n.includes("MUNIC")) return "MUNICIPAL";
  return "ESPAÑA";
}

function isRelevantBeneficiary(desc: string): boolean {
  const text = desc.toLowerCase();
  const include = ["empresa", "pyme", "autonomo", "autonoma", "startup", "emprendedor", "cooperativa", "microempresa", "negocio"];
  const exclude = ["solo persona fisica no empresaria", "solo entidades locales", "becas", "estudiante", "academia"];
  if (exclude.some(kw => text.includes(kw))) return false;
  return include.some(kw => text.includes(kw));
}

async function syncBDNS() {
  try {
    console.log("Iniciando sincronizacion BDNS...");
    console.log(`Endpoint: ${BDNS_URL}`);

    let totalFetched = 0;
    let totalInserted = 0;
    let totalEU = 0;
    let totalFiltered = 0;
    const MAX_PAGES = 10;

    for (let page = 0; page < MAX_PAGES; page++) {
      const response = await axios.get<BDNSResponse>(BDNS_URL, {
        params: { page, pageSize: 50 },
        headers: { Accept: "application/json" },
        timeout: 15000,
      });

      const { content, totalPages } = response.data;
      if (!content || content.length === 0) break;

      totalFetched += content.length;
      console.log(`Pagina ${page + 1}/${Math.min(totalPages, MAX_PAGES)}: ${content.length} convocatorias`);

      for (const item of content) {
        if (!isRelevantBeneficiary(item.descripcion)) {
          totalFiltered++;
          continue;
        }

        const { euFunded, program, detail } = detectEUProgram(item);
        if (euFunded) totalEU++;

        const sourceId = `BDNS-${item.id}`;
        const sourceUrl = `https://www.infosubvenciones.es/bdnstrans/GE/es/convocatoria/${item.id}`;
        const slug = `bdns-${item.id}`;

        const fundData = {
          source: "BDNS" as const,
          sourceId,
          sourceUrl,
          slug,
          title: item.descripcion.substring(0, 499),
          organism: item.nivel3 || item.nivel2 || "Organismo",
          description: item.descripcion,
          shortDescription: item.descripcion.substring(0, 200),
          scope: mapScope(item.nivel1),
          region: item.nivel2 || null,
          euFunded,
          euProgram: program as any,
          euProgramDetail: detail,
          beneficiaryTypes: ["pyme"] as string[],
          sectors: [] as string[],
          stages: ["idea", "validacion", "crecimiento"] as string[],
          fundingType: "subvencion" as const,
          amountMin: null,
          amountMax: null,
          cofinancingPct: euFunded ? "50" : null,
          status: "abierta" as const,
          openDate: null,
          closeDate: null,
          applicationUrl: sourceUrl,
          requiredDocs: [] as string[],
          rawData: item,
        };

        try {
          const existing = await db.select().from(funds).where(eq(funds.sourceId, sourceId));
          if (existing.length === 0) {
            await db.insert(funds).values(fundData);
            totalInserted++;
          }
        } catch (e: any) {
          console.error(`  Error insertando ${sourceId}: ${e?.message}`);
        }
      }

      if (page + 1 >= totalPages) break;
      await new Promise(r => setTimeout(r, 500));
    }

    const relevant = totalFetched - totalFiltered;
    console.log(`\nResultados BDNS:`);
    console.log(`  Total descargadas:      ${totalFetched}`);
    console.log(`  Filtradas (no relevantes): ${totalFiltered}`);
    console.log(`  Relevantes:             ${relevant}`);
    console.log(`  Insertadas en BD:       ${totalInserted}`);
    console.log(`  Con cofinanciacion UE:  ${totalEU}`);
    if (relevant > 0) {
      console.log(`  Porcentaje EU:          ${((totalEU / relevant) * 100).toFixed(1)}%`);
    }

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error HTTP:", error.response?.status, error.message);
    } else {
      console.error("Error:", error);
    }
    process.exit(1);
  }
}

syncBDNS();
