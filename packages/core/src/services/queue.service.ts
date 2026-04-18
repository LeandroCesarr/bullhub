import type { BullhubClient } from "../clients/bullmq.client";
import { BullhubQueue } from "../models/BullhubQueue";
import type { ActivityMetric, BullhubOptions } from "../types/bullhub";
import type { Queue } from "bullmq";

const ONE_HOUR = 60 * 60 * 1000;

export class QueueService {
  constructor(
    private readonly options: BullhubOptions,
    private readonly client: BullhubClient,
  ) {}

  private get metricsCount(): number {
    return this.options.metricsCount ?? 24;
  }

  async list(): Promise<BullhubQueue[]> {
    const queues = this.client.getQueues();
    return Promise.all(queues.map(BullhubQueue.fromBullMQ));
  }

  async getActivityMetrics(queue: Queue): Promise<ActivityMetric[]> {
    const [completed, failed] = await Promise.all([
      queue.getMetrics("completed", 0, this.metricsCount - 1),
      queue.getMetrics("failed", 0, this.metricsCount - 1),
    ]);

    const now = Date.now();
    const currentHour = Math.floor(now / ONE_HOUR) * ONE_HOUR

    return Array.from({ length: this.metricsCount }, (_, i) => ({
      time: currentHour - (23 - i) * ONE_HOUR,
      completed: completed.data[i],
      failed: failed.data[i],
    }));
  }

  public async getAggregateActivityMetrics(): Promise<ActivityMetric[]> {
    const results = await Promise.all(
      this.client.getQueues().map(async (queue) => this.getActivityMetrics(queue)),
    );

    return Array.from({ length: this.metricsCount }, (_, i) => ({
      time: results[0][i].time,
      completed: results.reduce((sum, r) => sum + (r[i].completed ?? 0), 0),
      failed: results.reduce((sum, r) => sum + (r[i].failed ?? 0), 0),
    }));
  }
}
