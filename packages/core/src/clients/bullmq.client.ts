import { Queue, QueueEvents } from "bullmq";
import type { ConnectionOptions } from "bullmq";
import type { BullhubOptions } from "../types/bullhub";

export class BullhubClient {
  readonly connection: ConnectionOptions;
  private queues = new Map<string, Queue>();
  private events = new Map<string, QueueEvents>();

  constructor({ connection, queues }: BullhubOptions) {
    this.connection = connection;

    for (const queue of queues) {
      this.queues.set(queue.name, new Queue(queue.name, { connection, prefix: queue.prefix }));
      this.events.set(
        queue.name,
        new QueueEvents(queue.name, { connection, prefix: queue.prefix }),
      );
    }
  }

  getQueue(name: string): Queue {
    const queue = this.queues.get(name);
    if (!queue) throw new Error(`Queue "${name}" not found`);
    return queue;
  }

  getEvents(name: string): QueueEvents {
    const events = this.events.get(name);
    if (!events) throw new Error(`QueueEvents "${name}" not found`);
    return events;
  }

  getQueues(): Queue[] {
    return [...this.queues.values()];
  }

  getQueueNames(): string[] {
    return [...this.queues.keys()];
  }

  async close(): Promise<void> {
    await Promise.all([
      ...[...this.queues.values()].map((q) => q.close()),
      ...[...this.events.values()].map((e) => e.close()),
    ]);
  }
}
