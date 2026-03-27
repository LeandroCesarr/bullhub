import { BullhubWorker } from "../models/BullhubWorker";
import type { BullhubClient } from "../clients/bullmq.client";
import type { BullMQWorkerRaw } from "../types/bullmq";

export class WorkerService {
  constructor(private readonly client: BullhubClient) {}

  async index(): Promise<BullhubWorker[]> {
    const results = await Promise.all(
      this.client.getQueueNames().map(async (name) => {
        const queue = this.client.getQueue(name);
        const workers = (await queue.getWorkers()) as BullMQWorkerRaw[];

        return workers.map((w) => BullhubWorker.fromBullMQ(w, name));
      }),
    );

    return results.flat();
  }
}
