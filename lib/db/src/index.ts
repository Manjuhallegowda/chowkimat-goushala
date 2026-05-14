import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export type Env = {
  DB: D1Database;
  BUCKET: R2Bucket;
  ADMIN_JWT_SECRET: string;
  FINANCIAL_SECRET_CODE: string;
};

/**
 * Create a Drizzle ORM instance from a Cloudflare D1 binding.
 * Call this inside each request handler with the env from the Worker.
 */
export function createDb(d1: D1Database) {
  return drizzle(d1, { schema });
}

export * from "./schema";
