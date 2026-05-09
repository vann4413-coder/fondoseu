import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL no está definida");
  const client = postgres(url, {
    max: 1,
    ssl: url.includes("neon.tech") ? "require" : false,
    connect_timeout: 10,
    idle_timeout: 20,
  });
  return drizzle(client, { schema });
}

type Db = ReturnType<typeof createDb>;
let _db: Db | null = null;

export const db = new Proxy({} as Db, {
  get(_, prop) {
    if (!_db) _db = createDb();
    return (_db as any)[prop];
  },
});

export { schema };
export { funds } from "./schema";
