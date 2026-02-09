import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../db/schema";
import { getAuthOptions, type AuthEnv } from "./auth-options";

export const auth = (env: AuthEnv) => {
  const sql = neon(env.DATABASE_URL);
  const db = drizzle(sql, { schema });

  return betterAuth({
    ...getAuthOptions(env),
    database: drizzleAdapter(db, { provider: "pg" }),
  });
};
