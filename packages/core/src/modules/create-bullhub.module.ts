import { BullhubClient } from "../client";
import { WorkerService } from "../services/worker.service";
import type { ConnectionOptions } from "bullmq";
import { BullhubContext, BullhubOptions, BullhubRoute } from "@/types";

export function createBullhub(opts: BullhubOptions): BullhubContext {
  const client = new BullhubClient(opts.queues, opts.connection);

  const worker = new WorkerService(client);

  const routes: BullhubRoute[] = [
    // workers
    {
      method: "GET",
      path: "/api/workers",
      handler: () => worker.getWorkers(),
    },
  ];

  return { client, services: { worker }, routes };
}

export { BullhubClient };
export type { ConnectionOptions };
