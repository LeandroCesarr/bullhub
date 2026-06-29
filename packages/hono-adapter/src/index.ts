import type { Hono } from "hono";
import { createBullhub } from "@bullhub/core";
import type { BullhubOptions } from "@bullhub/core";

export type { BullhubOptions };

export async function registerBullhub(app: Hono, opts: BullhubOptions) {
  const { routes, client } = await createBullhub(opts);

  const basePath = opts.basePath ?? "";

  for (const route of routes) {
    const method = route.method.toLowerCase() as "get" | "post" | "patch" | "delete" | "put";

    app[method](`${basePath}${route.path}`, async (c) => {
      try {
        const params = c.req.param() as Record<string, string>;
        const query = c.req.query() as Record<string, string>;
        const body = await c.req.json().catch(() => null);

        const result = await route.handler(params, query, body);
        return c.json(result);
      } catch (error) {
        const message = error instanceof Error ? error.message : "internal server error";
        return c.json({ error: message }, error.statusCode);
      }
    });
  }

  return client;
}
