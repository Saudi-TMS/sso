import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./lib/auth";

const app = new Hono();

app.use(
  "/api/auth/*",
  cors({
    origin: (origin) => {
      if (!origin) return origin;
      // Allow all subdomains of example.com and localhost
      if (
        origin.endsWith(".example.com") ||
        origin.startsWith("http://localhost")
      ) {
        return origin;
      }
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
