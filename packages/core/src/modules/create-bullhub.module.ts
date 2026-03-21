import type { ConnectionOptions } from "bullmq";
import { BullhubClient } from "../client";
import { ApiResponse } from "../http/ApiResponse";
import { WorkerService } from "../services/worker.service";
import { BullhubContext, BullhubOptions, BullhubRoute } from "../types/bullhub";

export function createBullhub(opts: BullhubOptions): BullhubContext {
  const client = new BullhubClient(opts.queues, opts.connection);

  const worker = new WorkerService(client);

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
  ];

  return { client, services: { worker }, routes };
}

export { BullhubClient };
export type { ConnectionOptions };
