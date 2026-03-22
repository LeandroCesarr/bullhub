import type { Queue } from "bullmq";

export class BullhubQueue {
  private constructor(
    readonly name: string,
    readonly total: number,
  ) {}

  static async fromBullMQ(queue: Queue): Promise<BullhubQueue> {
    const counts = await queue.getJobCounts(
      "active",
      "waiting",
      "completed",
      "failed",
      "delayed",
      "prioritized",
      "waiting-children",
    );

    const total = Object.values(counts).reduce((a, b) => a + b, 0);

    return new BullhubQueue(queue.name, total);
  }
}
