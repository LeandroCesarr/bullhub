import type { BackoffOptions, Job } from "bullmq";
import type { JobStateEnum } from "../enums/JobStateEnum";

export class BullhubJob {
  private constructor(
    readonly id: string,
    readonly name: string,
    readonly queueName: string,
    readonly status: JobStateEnum,
    readonly progress: number,
    readonly attempts: { made: number; max: number },
    readonly priority: number,
    readonly createdAt: number,
    readonly payload: Record<string, unknown>,
    readonly processedAt: number | undefined,
    readonly finishedAt: number | undefined,
    readonly failedReason: string | undefined,
    readonly delay: number | undefined,
    readonly processedBy: string | undefined,
    readonly stacktrace: string[],
    readonly backoff: {
      type: string;
      delay: number | null;
    },
  ) {}

  public get duration() {
    return (this.finishedAt ?? 0) - (this.processedAt ?? 0);
  }

  static async fromBullMQ(job: Job): Promise<BullhubJob> {
    return new BullhubJob(
      job.id ?? "",
      job.name,
      job.queueName,
      (await job.getState()) as JobStateEnum,
      typeof job.progress === "number" ? job.progress : 0,
      {
        made: job.attemptsMade,
        max: Math.max(job.opts.attempts ?? 0, 1),
      },
      job.priority,
      job.timestamp,
      job.data,
      job.processedOn,
      job.finishedOn,
      job.failedReason,
      job.delay,
      job.processedBy,
      job.stacktrace,
      BullhubJob.formatBackoff(job.opts.backoff),
    );
  }

  private static formatBackoff(backoff: number | BackoffOptions | undefined): {
    type: string;
    delay: number | null;
  } {
    if (!backoff) return { type: "immediate", delay: null };

    if (typeof backoff === "number") {
      return { type: "fixed", delay: backoff };
    }

    return {
      type: backoff.type,
      delay: backoff.delay ?? null,
    };
  }

  public toJSON() {
    return {
      ...this,
      duration: this.duration,
    }
  }
}
