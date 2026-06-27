import { JobStateEnum } from "@/enums/jobStateEnum";

export type JobActionType = "retry" | "promote" | "cancel";

const ACTION_STATES: Record<JobActionType, Set<JobStateEnum>> = {
  retry: new Set([JobStateEnum.FAILED, JobStateEnum.COMPLETED]),
  promote: new Set([JobStateEnum.DELAYED]),
  cancel: new Set([JobStateEnum.WAITING, JobStateEnum.DELAYED, JobStateEnum.ACTIVE, JobStateEnum.WAITING_CHILDREN]),
};

export class BullhubJob {
  readonly id: string;
  readonly name: string;
  readonly queueName: string;
  readonly status: JobStateEnum;
  readonly progress: number;
  readonly attempts: { made: number; max: number };
  readonly priority: number;
  readonly duration: number;
  readonly createdAt: number;
  readonly payload: Record<string, unknown>;
  readonly processedAt: number | undefined;
  readonly finishedAt: number | undefined;
  readonly failedReason: string | undefined;
  readonly delay: number | undefined;
  readonly processedBy: string | undefined;
  readonly stacktrace: string[];
  readonly backoff: { type: string; delay: number | null };

  static from(raw: unknown): BullhubJob {
    return Object.assign(Object.create(BullhubJob.prototype), raw);
  }

  can(action: JobActionType): boolean {
    return ACTION_STATES[action].has(this.status);
  }
}
