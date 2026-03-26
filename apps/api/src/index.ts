import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { registerBullhub } from "@bullhub/hono";
import { showRoutes } from "hono/dev";
import { cors } from "hono/cors";

const app = new Hono();

app.use("/*", cors());

app.get("/health", (c) => c.json({ ok: true }));

const queues = [
  "email-queue",
  "notification-queue",
  "report-generation",
  "image-processing",
  "webhook-delivery",
];

registerBullhub(app, {
  queues: queues.map((q) => ({
    name: q,
  })),
  connection: { host: "localhost", port: 6379 },
});

showRoutes(app);

serve({ fetch: app.fetch, port: 3000 });
