import type { BullhubClient } from "../client";
import { WorkerInfo } from "../types";

export class WorkerService {
  constructor(private readonly client: BullhubClient) {}

  async getWorkers(): Promise<WorkerInfo[]> {
    const results = await Promise.all(
      this.client.getQueueNames().map((name) => this.client.getQueue(name).getWorkers()),
    );

    return results.flat() as unknown as WorkerInfo[];
  }
}
