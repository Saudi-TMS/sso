import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../db/schema.d1";
import { getAuthOptions, type AuthEnv } from "./auth-options";

export interface WorkerEnv extends AuthEnv {
  sso_auth: D1Database;
}

export const auth = (env: WorkerEnv) => {
  const db = drizzle(env.sso_auth, { schema });

  return betterAuth({
    ...getAuthOptions(env),
    database: drizzleAdapter(db, { provider: "sqlite" }),
  });
};
