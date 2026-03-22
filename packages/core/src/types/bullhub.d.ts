import type { ConnectionOptions } from "bullmq";
import type { BullhubClient } from "@/client";
import type { WorkerService } from "@/services/worker.service";
import { JobService } from "../services/job.service";

export type BullhubWorker = {
  id: string;
  name: string;
  queue: string;
  host: string;
  startedAt: string;
};

export interface BullhubOptions {
  queues: string[];
  connection: ConnectionOptions;
  basePath?: string;
}

export interface BullhubContext {
  client: BullhubClient;
  services: {
    worker: WorkerService;
    job: JobService;
  };
  routes: BullhubRoute[];
}

export interface BullhubRoute {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  handler: (
    params: Record<string, string>,
    query: Record<string, string>,
    body: unknown,
  ) => Promise<unknown>;
}

interface Pagination<TData> {
  items: TData[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

interface PaginateJobsParams {
  page?: number;
  status?: JobStateEnum;
  queue: string;
}
