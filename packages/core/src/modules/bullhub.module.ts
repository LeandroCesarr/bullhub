import type { ConnectionOptions } from "bullmq";
import { BullhubClient } from "../clients/bullmq.client";
import { ApiResponse } from "../http/ApiResponse";
import { WorkerService } from "../services/worker.service";
import { JobService } from "../services/job.service";
import { QueueService } from "../services/queue.service";
import { QueueDiscoveryService } from "../services/queue-discovery.service";
import { RedisClient } from "../clients/redis.client";
import { RedisService } from "../services/redis.service";
import type {
  BullhubContext,
  BullhubDiscoverOptions,
  BullhubOptions,
  BullhubOptionsQueue,
  BullhubRoute,
} from "../types/bullhub";

function resolveDiscoverPrefix(discover: boolean | BullhubDiscoverOptions): string {
  if (typeof discover === "boolean") return "bull";
  return discover.prefix ?? "bull";
}

function mergeQueues(
  explicit: BullhubOptionsQueue[],
  discovered: BullhubOptionsQueue[],
): BullhubOptionsQueue[] {
  const seen = new Set(explicit.map((q) => q.name));
  return [...explicit, ...discovered.filter((q) => !seen.has(q.name))];
}

export async function createBullhub(opts: BullhubOptions): Promise<BullhubContext> {
  const redisClient = new RedisClient(opts);

  let queues: BullhubOptionsQueue[] = opts.queues ?? [];

  if (opts.discover) {
    const prefix = resolveDiscoverPrefix(opts.discover);
    const discovery = new QueueDiscoveryService(redisClient);
    const discovered = await discovery.discover(prefix);
    queues = mergeQueues(queues, discovered);
  }

  const bullmqClient = new BullhubClient({ ...opts, queues });

  const redis = new RedisService(redisClient);
  const worker = new WorkerService(bullmqClient);
  const queue = new QueueService(opts, bullmqClient);
  const job = new JobService(bullmqClient);

  const routes: BullhubRoute[] = [
    // workers
    {
      method: "GET",
      path: "/api/workers",
      handler: async () => {
        const result = await worker.index();
        return ApiResponse.ok(result);
      },
    },

    //#region Queues

    {
      method: "GET",
      path: "/api/queues",
      handler: async () => {
        const result = await queue.list();
        return ApiResponse.ok(result);
      },
    },

    {
      method: "GET",
      path: "/api/queues/metrics",
      handler: async () => {
        const result = await queue.getAggregateActivityMetrics();
        return ApiResponse.ok(result);
      },
    },

    //#endregion

    //#region Jobs

    {
      method: "GET",
      path: "/api/queues/:queue/jobs",
      handler: async (params, query) => {
        const result = await job.paginate({
          page: Math.max(1, Number(query.page ?? 1)),
          queue: params.queue,
          state: query.state,
        });

        return ApiResponse.ok(result);
      },
    },

    {
      method: "GET",
      path: "/api/queues/:queue/jobs/:id",
      handler: async (params) => {
        const result = await job.fetch(params.queue, params.id);
        return ApiResponse.ok(result);
      },
    },

    {
      method: "POST",
      path: "/api/queues/:queue/jobs/:id/retry",
      handler: async (params) => {
        await job.retry(params.queue, params.id);
        return ApiResponse.noContent();
      },
    },

    {
      method: "DELETE",
      path: "/api/queues/:queue/jobs/:id",
      handler: async (params) => {
        await job.cancel(params.queue, params.id);
        return ApiResponse.noContent();
      },
    },

    {
      method: "POST",
      path: "/api/queues/:queue/jobs/:id/promote",
      handler: async (params) => {
        await job.promote(params.queue, params.id);
        return ApiResponse.noContent();
      },
    },

    //#endregion

    //#region Redis

    {
      method: "GET",
      path: "/api/redis",
      handler: async () => {
        const result = await redis.info();
        return ApiResponse.ok(result);
      },
    },

    //#endregion
  ];

  return { client: bullmqClient, services: { worker, job }, routes };
}

export { BullhubClient };
export type { ConnectionOptions };
