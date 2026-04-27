-- Generado con: npm run db:generate
-- Aplicar con: npm run db:migrate

CREATE TYPE "source" AS ENUM ('BDNS', 'RAISC', 'CIDO', 'MANUAL');
CREATE TYPE "scope" AS ENUM ('UE', 'ESPAÑA', 'CATALUÑA', 'PROVINCIAL', 'MUNICIPAL');
CREATE TYPE "eu_program" AS ENUM ('NEXTGEN', 'FEDER', 'FSE_PLUS', 'HORIZON', 'EIC', 'LIFE', 'INVESTEU', 'OTRO');
CREATE TYPE "funding_type" AS ENUM ('subvencion', 'prestamo', 'garantia', 'capital', 'mixto');
CREATE TYPE "status" AS ENUM ('abierta', 'cerrada', 'proximamente');

CREATE TABLE IF NOT EXISTS "funds" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "source" "source" NOT NULL,
  "source_id" text NOT NULL,
  "source_url" text NOT NULL DEFAULT '',
  "title" text NOT NULL,
  "slug" text NOT NULL UNIQUE,
  "organism" text NOT NULL DEFAULT '',
  "description" text NOT NULL DEFAULT '',
  "short_description" text NOT NULL DEFAULT '',
  "scope" "scope" NOT NULL DEFAULT 'ESPAÑA',
  "region" text,
  "eu_funded" boolean NOT NULL DEFAULT false,
  "eu_program" "eu_program",
  "eu_program_detail" text,
  "beneficiary_types" text[] NOT NULL DEFAULT '{}',
  "sectors" text[] NOT NULL DEFAULT '{}',
  "stages" text[] NOT NULL DEFAULT '{}',
  "funding_type" "funding_type" NOT NULL DEFAULT 'subvencion',
  "amount_min" numeric(15, 2),
  "amount_max" numeric(15, 2),
  "cofinancing_pct" numeric(5, 2),
  "status" "status" NOT NULL DEFAULT 'abierta',
  "open_date" date,
  "close_date" date,
  "application_url" text,
  "guide_url" text,
  "required_docs" text[] NOT NULL DEFAULT '{}',
  "raw_data" jsonb,
  "last_synced_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "funds_curated" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "fund_id" uuid REFERENCES "funds"("id") ON DELETE CASCADE,
  "guide_steps" jsonb,
  "faqs" jsonb,
  "external_links" jsonb,
  "featured_order" integer,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "funds_source_source_id_idx" ON "funds" ("source", "source_id");
CREATE INDEX IF NOT EXISTS "funds_status_idx" ON "funds" ("status");
CREATE INDEX IF NOT EXISTS "funds_eu_funded_idx" ON "funds" ("eu_funded");
CREATE INDEX IF NOT EXISTS "funds_close_date_idx" ON "funds" ("close_date");
CREATE INDEX IF NOT EXISTS "funds_scope_idx" ON "funds" ("scope");
