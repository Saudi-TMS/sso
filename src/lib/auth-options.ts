import type { BetterAuthOptions } from "better-auth";
import { bearer } from "better-auth/plugins/bearer";

export interface AuthEnv {
  DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  AUTH_DOMAIN?: string;
  CORS_ORIGINS?: string;
}

export function getAuthOptions(env: AuthEnv): BetterAuthOptions {
  const corsOrigins = env.CORS_ORIGINS?.split(",") ?? [];
  const authDomain = env.AUTH_DOMAIN;

  return {
    emailAndPassword: {
      enabled: true,
    },
    plugins: [bearer()],
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
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
  };
}
