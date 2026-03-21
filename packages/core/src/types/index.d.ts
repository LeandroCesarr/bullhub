import type { ConnectionOptions } from "bullmq";
import type { BullhubClient } from "@/client";
import type { WorkerService } from "@/services/worker.service";

export interface WorkerInfo {
  id: string;
  name: string;
  addr: string;
  fd: string;
  age: string;
  idle: string;
  flags: string;
}

export interface BullhubOptions {
  queues: string[];
  connection: ConnectionOptions;
  basePath?: string;
}

export interface BullhubContext {
  client: BullhubClient;
  services: {
    worker: WorkerService;
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
