import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./lib/auth.worker";
import type { AuthEnv } from "./lib/auth-options";

const app = new Hono<{ Bindings: AuthEnv }>();

app.use(
  "/api/auth/*",
  cors({
    origin: (origin, c) => {
      if (!origin) return origin;
      if (origin.startsWith("http://localhost")) return origin;
      const authDomain = c.env.AUTH_DOMAIN;
      if (authDomain && origin.endsWith(authDomain)) return origin;
      return null;
    },
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "OPTIONS"],
    credentials: true,
  })
);

app.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth(c.env).handler(c.req.raw);
});

app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

export default app;
