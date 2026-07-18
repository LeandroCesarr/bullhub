import type { ConnectionOptions } from "bullmq";
import type { BullhubClient } from "@/clients";
import type { WorkerService } from "@/services/worker.service";
import type { JobService } from "../services/job.service";

export type BullhubWorker = {
  id: string;
  name: string;
  queue: string;
  host: string;
  startedAt: string;
};

export interface BullhubOptionsQueue {
  name: string;
  prefix?: string;
}

export type BullhubDiscoverOptions = {
  prefix?: string;
};

export interface BullhubOptions {
  queues?: BullhubOptionsQueue[];
  discover?: boolean | BullhubDiscoverOptions;
  connection: ConnectionOptions;
  basePath?: string;
  metricsCount?: number;
}

export interface BullhubContext {
  client: BullhubClient;
  services: {
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
  state?: JobStateEnum;
  queue: string;
}

interface ActivityMetric {
  time: number;
  completed: number
  failed: number
}