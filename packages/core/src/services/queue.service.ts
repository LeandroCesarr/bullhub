import type { BullhubClient } from "../client";
import { BullhubQueue } from "../models/BullhubQueue";

export class QueueService {
  constructor(private readonly client: BullhubClient) {}

  async list(): Promise<BullhubQueue[]> {
    const queues = this.client.getQueues();
    return Promise.all(queues.map(BullhubQueue.fromBullMQ));
  }
}
