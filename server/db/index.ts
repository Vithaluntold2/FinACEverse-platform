import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema.js";

const { Pool } = pg;

const hasDB = !!process.env.DATABASE_URL;

export const pool = hasDB
  ? new Pool({ connectionString: process.env.DATABASE_URL, max: 10 })
  : (null as unknown as pg.Pool);

export const db = hasDB
  ? drizzle(pool, { schema })
  : (null as any);

export { hasDB };
