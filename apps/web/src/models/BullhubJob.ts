import type { JobStateEnum } from "@/enums/jobStateEnum";

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
  readonly backoff: {
    type: string;
    delay: number | null;
  };
}
