import type { CcaaCode } from "./ccaa-data";

const RAW_MAP: Record<string, CcaaCode> = {
  // Andalucía
  "andalucia": "ES-AN", "andalucía": "ES-AN", "sevilla": "ES-AN",
  "málaga": "ES-AN", "malaga": "ES-AN", "granada": "ES-AN",
  "córdoba": "ES-AN", "cordoba": "ES-AN", "almería": "ES-AN",
  "almeria": "ES-AN", "cádiz": "ES-AN", "cadiz": "ES-AN",
  "huelva": "ES-AN", "jaén": "ES-AN", "jaen": "ES-AN",
  // Aragón
  "aragon": "ES-AR", "aragón": "ES-AR", "zaragoza": "ES-AR",
  "huesca": "ES-AR", "teruel": "ES-AR",
  // Asturias
  "asturias": "ES-AS", "principado de asturias": "ES-AS",
  // Baleares
  "baleares": "ES-IB", "islas baleares": "ES-IB", "illes balears": "ES-IB",
  "mallorca": "ES-IB", "palma": "ES-IB",
  // Canarias
  "canarias": "ES-CN", "islas canarias": "ES-CN", "santa cruz de tenerife": "ES-CN",
  "las palmas": "ES-CN", "tenerife": "ES-CN", "gran canaria": "ES-CN",
  // Cantabria
  "cantabria": "ES-CB", "santander": "ES-CB",
  // Castilla-La Mancha
  "castilla-la mancha": "ES-CM", "castilla la mancha": "ES-CM",
  "toledo": "ES-CM", "albacete": "ES-CM", "ciudad real": "ES-CM",
  "cuenca": "ES-CM", "guadalajara": "ES-CM",
  // Castilla y León
  "castilla y leon": "ES-CL", "castilla y león": "ES-CL",
  "castilla-leon": "ES-CL", "castilla-león": "ES-CL",
  "valladolid": "ES-CL", "burgos": "ES-CL", "salamanca": "ES-CL",
  "leon": "ES-CL", "león": "ES-CL", "segovia": "ES-CL",
  "avila": "ES-CL", "ávila": "ES-CL", "soria": "ES-CL", "zamora": "ES-CL",
  "palencia": "ES-CL",
  // Cataluña
  "cataluna": "ES-CT", "cataluña": "ES-CT", "catalunya": "ES-CT",
  "catalonia": "ES-CT", "barcelona": "ES-CT", "girona": "ES-CT",
  "lleida": "ES-CT", "tarragona": "ES-CT",
  // Ceuta
  "ceuta": "ES-CE",
  // Extremadura
  "extremadura": "ES-EX", "badajoz": "ES-EX", "cáceres": "ES-EX", "caceres": "ES-EX",
  // Galicia
  "galicia": "ES-GA", "galiza": "ES-GA", "a coruña": "ES-GA", "coruña": "ES-GA",
  "lugo": "ES-GA", "ourense": "ES-GA", "pontevedra": "ES-GA", "vigo": "ES-GA",
  // La Rioja
  "la rioja": "ES-RI", "rioja": "ES-RI", "logroño": "ES-RI", "logrono": "ES-RI",
  // Madrid
  "madrid": "ES-MD", "comunidad de madrid": "ES-MD", "comunidad madrid": "ES-MD",
  // Murcia
  "murcia": "ES-MC", "región de murcia": "ES-MC", "region de murcia": "ES-MC",
  // Navarra
  "navarra": "ES-NC", "nafarroa": "ES-NC", "comunidad foral de navarra": "ES-NC",
  "pamplona": "ES-NC",
  // País Vasco
  "pais vasco": "ES-PV", "país vasco": "ES-PV", "euskadi": "ES-PV",
  "euskal herria": "ES-PV", "bilbao": "ES-PV", "vitoria": "ES-PV",
  "donostia": "ES-PV", "san sebastian": "ES-PV", "san sebastián": "ES-PV",
  "alava": "ES-PV", "álava": "ES-PV", "vizcaya": "ES-PV", "bizkaia": "ES-PV",
  "gipuzkoa": "ES-PV", "guipuzkoa": "ES-PV",
  // Valencia
  "comunidad valenciana": "ES-VC", "comunitat valenciana": "ES-VC",
  "valencia": "ES-VC", "alicante": "ES-VC", "castellon": "ES-VC",
  "castellón": "ES-VC", "alacant": "ES-VC",
  // Melilla
  "melilla": "ES-ML",
  // Municipalities from BDNS data
  "arrasate/mondragón": "ES-PV", "arrasate": "ES-PV", "mondragón": "ES-PV",
  "durango": "ES-PV",
  "alcobendas": "ES-MD",
  "gijón": "ES-AS", "gijon": "ES-AS",
  "benidorm": "ES-VC",
  "puertollano": "ES-CM",
  "sant pere de ribes": "ES-CT", "esponellà": "ES-CT", "esponella": "ES-CT",
  "puebla de cazalla, la": "ES-AN", "la puebla de cazalla": "ES-AN",
  "alcaudete": "ES-AN",
  "orotava, la": "ES-CN", "la orotava": "ES-CN",
};

export function normalizeRegion(region: string | null | undefined): CcaaCode | null {
  if (!region) return null;
  const key = region.trim().toLowerCase();
  return RAW_MAP[key] ?? null;
}
