import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { getAuthOptions } from "./auth-options";

export const auth = betterAuth({
  ...getAuthOptions({
    DATABASE_URL: process.env.DATABASE_URL!,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET!,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL!,
    AUTH_DOMAIN: process.env.AUTH_DOMAIN,
    CORS_ORIGINS: process.env.CORS_ORIGINS,
  }),
  database: drizzleAdapter(db, { provider: "pg" }),
});
