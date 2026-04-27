import {
  pgTable,
  text,
  varchar,
  uuid,
  timestamp,
  jsonb,
  boolean,
  numeric,
  date,
  integer,
  index,
} from "drizzle-orm/pg-core";

export const funds = pgTable(
  "funds",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    source: varchar("source", {
      enum: ["BDNS", "RAISC", "CIDO", "MANUAL"],
    }).notNull(),
    sourceId: varchar("source_id").notNull(),
    sourceUrl: text("source_url").notNull().default(""),

    // slug único para URLs amigables: /fondos/[slug]
    slug: varchar("slug", { length: 150 }).notNull().unique(),

    title: varchar("title", { length: 500 }).notNull(),
    organism: varchar("organism", { length: 300 }).notNull().default(""),
    description: text("description").default(""),
    shortDescription: text("short_description").default(""),

    scope: varchar("scope", {
      enum: ["UE", "ESPAÑA", "CATALUÑA", "PROVINCIAL", "MUNICIPAL"],
    })
      .notNull()
      .default("ESPAÑA"),
    region: varchar("region"),

    // Cofinanciación europea — diferenciador clave
    euFunded: boolean("eu_funded").notNull().default(false),
    euProgram: varchar("eu_program", {
      enum: ["NEXTGEN", "FEDER", "FSE_PLUS", "HORIZON", "EIC", "LIFE", "INVESTEU", "OTRO"],
    }),
    euProgramDetail: text("eu_program_detail"),

    beneficiaryTypes: jsonb("beneficiary_types").$type<string[]>().notNull().default([]),
    sectors: jsonb("sectors").$type<string[]>().notNull().default([]),
    stages: jsonb("stages").$type<string[]>().notNull().default([]),
    fundingType: varchar("funding_type", {
      enum: ["subvencion", "prestamo", "garantia", "capital", "mixto"],
    })
      .notNull()
      .default("subvencion"),

    // Usamos numeric como string para precisión (Drizzle recomienda esto)
    amountMin: numeric("amount_min", { precision: 15, scale: 2 }),
    amountMax: numeric("amount_max", { precision: 15, scale: 2 }),
    cofinancingPct: numeric("cofinancing_pct", { precision: 5, scale: 2 }),

    status: varchar("status", {
      enum: ["abierta", "cerrada", "proximamente"],
    })
      .notNull()
      .default("abierta"),
    openDate: date("open_date"),
    closeDate: date("close_date"),

    applicationUrl: text("application_url"),
    guideUrl: text("guide_url"),
    requiredDocs: jsonb("required_docs").$type<string[]>().notNull().default([]),

    rawData: jsonb("raw_data"),

    lastSyncedAt: timestamp("last_synced_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    sourceSourceIdIdx: index("funds_source_id_idx").on(table.source, table.sourceId),
    euFundedIdx: index("eu_funded_idx").on(table.euFunded),
    statusIdx: index("status_idx").on(table.status),
    scopeIdx: index("scope_idx").on(table.scope),
    closeDateIdx: index("close_date_idx").on(table.closeDate),
  })
);

export type Fund = typeof funds.$inferSelect;
export type NewFund = typeof funds.$inferInsert;
