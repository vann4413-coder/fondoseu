import axios from "axios";
import * as cheerio from "cheerio";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
const BASE = "https://paeelectronico.es";
const RESULTS = "/es-es/CreaEmpresaConAyuda/Paginas/ResultadosBuscadorPAE.aspx";

async function fetchPAE(params: Record<string, string>): Promise<string | null> {
  const url = `${BASE}${RESULTS}?${new URLSearchParams(params)}`;
  try {
    const res = await axios.get(url, {
      headers: { "User-Agent": UA },
      timeout: 10000,
    });
    const $ = cheerio.load(res.data);
    const nombre = $(".portalPAE .titulo span:last-child").text().trim();
    const organismo = $(".infoPAE li:first-child .datosPAE span").text().trim();
    const direccion = $(".infoPAE li:nth-child(2) .datosPAE span").text().trim();
    if (nombre || organismo) {
      return `${nombre} | ${organismo} | ${direccion.slice(0, 60)}`;
    }
    return null;
  } catch (e: any) {
    return `ERROR: ${e.response?.status ?? e.message}`;
  }
}

async function main() {
  // Try different URL params to load different PAEs
  const tests = [
    { id_pait: "1" },
    { id_pait: "2" },
    { id_pait: "100" },
    { id_pait: "15187" },
    { idPait: "1" },
    { PAIT: "1" },
    { pait: "1" },
    { id: "1" },
    { codigoPAIT: "1" },
    { codigo: "15187" },
  ];

  console.log("Testing URL params to load individual PAEs:\n");
  for (const params of tests) {
    const result = await fetchPAE(params);
    console.log(`  ${JSON.stringify(params)} → ${result}`);
    await new Promise(r => setTimeout(r, 600));
  }

  // Also check the full HTML for any list of PAEs or navigation links
  const res = await axios.get(`${BASE}${RESULTS}`, {
    headers: { "User-Agent": UA }, timeout: 10000,
  });
  const $ = cheerio.load(res.data);

  // Look for any list-like structure with multiple PAE names
  console.log("\nAll links on page:");
  $("a").each((_, el) => {
    const href = $(el).attr("href") ?? "";
    const text = $(el).text().trim();
    if (text && href && !href.includes("/_layouts") && !href.includes("javascript")) {
      console.log(`  "${text.slice(0, 50)}" → ${href.slice(0, 100)}`);
    }
  });
}

main().catch(console.error);
