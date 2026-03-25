import type {ConnectionOptions} from "bullmq";
import {BullhubClient} from "../client";
import {ApiResponse} from "../http/ApiResponse";
import {WorkerService} from "../services/worker.service";
import {JobService} from "../services/job.service";
import {QueueService} from "../services/queue.service";
import type {BullhubContext, BullhubOptions, BullhubRoute} from "../types/bullhub";

export function createBullhub(opts: BullhubOptions): BullhubContext {
  const client = new BullhubClient(opts.queues, opts.connection);

  const worker = new WorkerService(client);
  const queue = new QueueService(client);
  const job = new JobService(client);

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
      path: "/api/queues/:queue/jobs/:id",
      handler: async (params) => {
        const result = await job.fetch(params.queue, params.id);
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

    //#endregion
  ];

  return { client, services: { worker, job }, routes };
}

export { BullhubClient };
export type { ConnectionOptions };
