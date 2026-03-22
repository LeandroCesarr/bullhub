import type { Job } from "bullmq";
import { JobStateEnum } from "../enums/JobStateEnum";

export class BullhubJob {
  private constructor(
    readonly id: string,
    readonly name: string,
    readonly queueName: string,
    readonly status: JobStateEnum,
    readonly progress: number,
    readonly attemptsMade: number,
    readonly timestamp: number,
    readonly processedOn: number | undefined,
    readonly finishedOn: number | undefined,
    readonly failedReason: string | undefined,
    readonly delay: number | undefined,
  ) {}

  static async fromBullMQ(job: Job): Promise<BullhubJob> {
    return new BullhubJob(
      job.id ?? "",
      job.name,
      job.queueName,
      (await job.getState()) as JobStateEnum,
      typeof job.progress === "number" ? job.progress : 0,
      job.attemptsMade,
      job.timestamp,
      job.processedOn,
      job.finishedOn,
      job.failedReason,
      job.delay,
    );
  }
}
