export type CcaaCode =
  | "ES-AN" | "ES-AR" | "ES-AS" | "ES-IB" | "ES-CN" | "ES-CB"
  | "ES-CM" | "ES-CL" | "ES-CT" | "ES-CE" | "ES-EX" | "ES-GA"
  | "ES-RI" | "ES-MD" | "ES-MC" | "ES-NC" | "ES-PV" | "ES-VC"
  | "ES-ML" | "MULTIPLE";

export interface CcaaInfo {
  code: CcaaCode;
  nombre: string;
  slug: string;
}

export const CCAA_LIST: CcaaInfo[] = [
  { code: "ES-AN", nombre: "Andalucía",             slug: "andalucia" },
  { code: "ES-AR", nombre: "Aragón",                slug: "aragon" },
  { code: "ES-AS", nombre: "Asturias",              slug: "asturias" },
  { code: "ES-IB", nombre: "Islas Baleares",        slug: "islas-baleares" },
  { code: "ES-CN", nombre: "Canarias",              slug: "canarias" },
  { code: "ES-CB", nombre: "Cantabria",             slug: "cantabria" },
  { code: "ES-CM", nombre: "Castilla-La Mancha",    slug: "castilla-la-mancha" },
  { code: "ES-CL", nombre: "Castilla y León",       slug: "castilla-y-leon" },
  { code: "ES-CT", nombre: "Cataluña",              slug: "cataluna" },
  { code: "ES-CE", nombre: "Ceuta",                 slug: "ceuta" },
  { code: "ES-EX", nombre: "Extremadura",           slug: "extremadura" },
  { code: "ES-GA", nombre: "Galicia",               slug: "galicia" },
  { code: "ES-RI", nombre: "La Rioja",              slug: "la-rioja" },
  { code: "ES-MD", nombre: "Comunidad de Madrid",   slug: "madrid" },
  { code: "ES-MC", nombre: "Murcia",                slug: "murcia" },
  { code: "ES-NC", nombre: "Navarra",               slug: "navarra" },
  { code: "ES-PV", nombre: "País Vasco",            slug: "pais-vasco" },
  { code: "ES-VC", nombre: "Comunidad Valenciana",  slug: "comunidad-valenciana" },
  { code: "ES-ML", nombre: "Melilla",               slug: "melilla" },
];

export const CCAA_BY_CODE = Object.fromEntries(
  CCAA_LIST.map((c) => [c.code, c])
) as Record<CcaaCode, CcaaInfo>;

export const CCAA_BY_SLUG = Object.fromEntries(
  CCAA_LIST.map((c) => [c.slug, c])
) as Record<string, CcaaInfo>;
