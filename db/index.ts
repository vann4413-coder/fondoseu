import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL no está definida");

const client = postgres(url, {
  max: 1,
  ssl: url.includes("neon.tech") ? "require" : false,
  connect_timeout: 10,
  idle_timeout: 20,
});

export const db = drizzle(client, { schema });
export { schema };
export { funds } from "./schema";
