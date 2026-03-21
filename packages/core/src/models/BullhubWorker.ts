import type { BullMQWorkerRaw } from "../types/bullmq";

export class BullhubWorker {
  id: string;
  name: string;
  queue: string;
  host: string;
  startedAt: string;

  private constructor(data: BullhubWorker) {
    this.id = data.id;
    this.name = data.name;
    this.queue = data.queue;
    this.host = data.host;
    this.startedAt = data.startedAt;
  }

  static fromBullMQ(raw: BullMQWorkerRaw, queueName: string): BullhubWorker {
    return new BullhubWorker({
      id: raw.id,
      queue: queueName,
      name: BullhubWorker.parseWorkerName(raw.rawname),
      host: BullhubWorker.parseHost(raw.addr),
      startedAt: BullhubWorker.calcStartedAt(raw.age),
    });
  }

  private static parseHost(host: string): string {
    return host.split(":")[0];
  }

  private static parseWorkerName(rawname: string): string {
    const parts = rawname.split(":w:");
    return parts[1] ?? rawname;
  }

  private static calcStartedAt(ageInSeconds: string): string {
    const started = Date.now() - Number(ageInSeconds) * 1000;
    return new Date(started).toISOString();
  }
}
