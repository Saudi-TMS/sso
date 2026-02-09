import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./lib/auth";

const authDomain = process.env.AUTH_DOMAIN; // e.g. ".example.com"

const app = new Hono();

app.use(
  "/api/auth/*",
  cors({
    origin: (origin) => {
      if (!origin) return origin;
      if (origin.startsWith("http://localhost")) return origin;
      if (authDomain && origin.endsWith(authDomain)) return origin;
      return null;
    },
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "OPTIONS"],
    credentials: true,
  })
);

app.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

export default app;
