import type { JobStateEnum } from "@/enums/jobStateEnum";

export class BullhubJob {
  readonly id: string;
  readonly name: string;
  readonly queueName: string;
  readonly status: JobStateEnum;
  readonly progress: number;
  readonly attemptsMade: number;
  readonly timestamp: number;
  readonly processedOn?: number;
  readonly finishedOn?: number;
  readonly failedReason?: string;
  readonly delay?: number;
}
