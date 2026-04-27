// Vocabularios controlados — formato array para compatibilidad con .map() en componentes

export const SECTORS = [
  { value: "tecnologia", label: "Tecnología e innovación" },
  { value: "sostenibilidad", label: "Sostenibilidad y medio ambiente" },
  { value: "comercio", label: "Comercio y retail" },
  { value: "industria", label: "Industria y manufactura" },
  { value: "agroalimentario", label: "Agroalimentario" },
  { value: "turismo", label: "Turismo y hostelería" },
  { value: "salud", label: "Salud y bienestar" },
  { value: "educacion", label: "Educación y formación" },
  { value: "cultura", label: "Cultura y economía creativa" },
  { value: "transporte", label: "Transporte y logística" },
  { value: "construccion", label: "Construcción e inmobiliario" },
  { value: "servicios", label: "Servicios profesionales" },
  { value: "social", label: "Economía social e impacto" },
  { value: "digital", label: "Digitalización y software" },
  { value: "fintech", label: "Fintech y servicios financieros" },
  { value: "energia", label: "Energía y eficiencia energética" },
  { value: "maritimo", label: "Sector marítimo y pesca" },
  { value: "biotecnologia", label: "Biotecnología y ciencias de la vida" },
  { value: "movilidad", label: "Movilidad sostenible" },
] as const;

export type SectorValue = (typeof SECTORS)[number]["value"];

export const BENEFICIARY_TYPES = [
  { value: "autonomo", label: "Autónomo / Freelance" },
  { value: "pyme", label: "PYME (< 250 empleados)" },
  { value: "startup", label: "Startup" },
  { value: "gran_empresa", label: "Gran empresa" },
  { value: "cooperativa", label: "Cooperativa / S.A.T." },
  { value: "asociacion", label: "Asociación / ONG" },
  { value: "emprendedor", label: "Emprendedor (sin empresa aún)" },
  { value: "investigador", label: "Investigador / spin-off universitario" },
] as const;

export type BeneficiaryType = (typeof BENEFICIARY_TYPES)[number]["value"];

export const STAGES = [
  { value: "idea", label: "Idea / Proyecto" },
  { value: "validacion", label: "Validación / MVP" },
  { value: "lanzamiento", label: "Lanzamiento" },
  { value: "crecimiento", label: "Crecimiento" },
  { value: "consolidacion", label: "Consolidación" },
  { value: "internacionalizacion", label: "Internacionalización" },
] as const;

export type StageValue = (typeof STAGES)[number]["value"];

export const FUNDING_TYPES = [
  { value: "subvencion", label: "Subvención (a fondo perdido)" },
  { value: "prestamo", label: "Préstamo blando" },
  { value: "garantia", label: "Garantía / Aval" },
  { value: "capital", label: "Capital / Equity" },
  { value: "mixto", label: "Mixto" },
] as const;

export const SCOPES = [
  { value: "UE", label: "Unión Europea" },
  { value: "ESPAÑA", label: "España (estatal)" },
  { value: "CATALUÑA", label: "Cataluña" },
  { value: "PROVINCIAL", label: "Provincial" },
  { value: "MUNICIPAL", label: "Municipal" },
] as const;

export const TRANSVERSAL_THEMES = [
  { value: "digitalizacion", label: "Digitalización" },
  { value: "sostenibilidad", label: "Sostenibilidad" },
  { value: "mujer_emprendedora", label: "Mujer emprendedora" },
  { value: "joven_30", label: "Joven emprendedor (< 30 años)" },
  { value: "zona_rural", label: "Zona rural o despoblación" },
  { value: "internacionalizacion", label: "Internacionalización" },
  { value: "innovacion", label: "Innovación y I+D" },
] as const;

// Mapeo de descripciones BDNS → nuestros valores normalizados
export const BDNS_BENEFICIARY_MAP: Record<string, BeneficiaryType[]> = {
  "PYME": ["pyme"],
  "Pequeñas y medianas empresas": ["pyme"],
  "Pequeñas empresas": ["pyme"],
  "Medianas empresas": ["pyme"],
  "Microempresas": ["pyme"],
  "Autónomos": ["autonomo"],
  "Trabajadores autónomos": ["autonomo"],
  "Empresas": ["pyme", "gran_empresa"],
  "Startups": ["startup"],
  "Cooperativas": ["cooperativa"],
  "Entidades de economía social": ["cooperativa"],
  "Emprendedores": ["emprendedor", "autonomo"],
  "Personas físicas": ["emprendedor", "autonomo"],
};

// Tipo legacy exportado para compatibilidad con sync-bdns
export type EUProgram = "NEXTGEN" | "FEDER" | "FSE_PLUS" | "HORIZON" | "EIC" | "LIFE" | "INVESTEU" | "OTRO";
