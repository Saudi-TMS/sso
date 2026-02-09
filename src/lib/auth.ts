import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";

const corsOrigins = process.env.CORS_ORIGINS?.split(",") ?? [];
const authDomain = process.env.AUTH_DOMAIN;

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [...corsOrigins, "http://localhost:*"],
  advanced: {
    crossSubDomainCookies: authDomain
      ? { enabled: true, domain: authDomain }
      : undefined,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh every 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
});
