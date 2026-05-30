import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { serve } from "@hono/node-server";
import { registerBullhub } from "@bullhub/hono";
import { serveStatic } from "@hono/node-server/serve-static";

const app = new Hono();

app.use(logger());
app.use("/*", cors());

app.get("/health", (c) => c.json({ ok: true }));

const queues: Array<{ name: string; prefix?: string }> = process.env.BULLMQ_QUEUES_JSON
  ? JSON.parse(process.env.BULLMQ_QUEUES_JSON)
  : (process.env.BULLMQ_QUEUES ?? "")
      .split(",")
      .map((name) => ({
        name: name.trim(),
        prefix: process.env.BULLMQ_PREFIX,
      }))
      .filter((queue) => queue.name);

console.log(queues, process.env.BULLMQ_QUEUES)

registerBullhub(app, {
  queues,
  connection: {
    host: process.env.REDIS_HOST ?? "localhost",
    port: Number(process.env.REDIS_PORT ?? 6379),
  },
});

if (process.env.NODE_ENV === "production") {
  app.use("/*", serveStatic({ root: "./apps/web/dist" }));
  app.get("*", serveStatic({ path: "./apps/web/dist/index.html" }));
}

serve({ fetch: app.fetch, port: Number(process.env.PORT ?? 3000) });
