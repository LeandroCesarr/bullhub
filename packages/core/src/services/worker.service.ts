import { BullhubWorker } from "../models/BullhubWorker";
import type { BullhubClient } from "../clients/bullmq.client";
import type { BullMQWorkerRaw } from "../types/bullmq";

export class WorkerService {
  constructor(private readonly client: BullhubClient) {}

  async list(queueName: string): Promise<BullhubWorker[]> {
    const queue = this.client.getQueue(queueName);
    const workers = (await queue.getWorkers()) as BullMQWorkerRaw[];
    return workers.map((w) => BullhubWorker.fromBullMQ(w, queueName));
  }
}
