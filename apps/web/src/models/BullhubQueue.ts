import { JobStateEnum } from "@/enums/jobStateEnum.ts";

const pendingStatus = new Set([
  JobStateEnum.ACTIVE,
  JobStateEnum.DELAYED,
  JobStateEnum.WAITING,
  JobStateEnum.WAITING_CHILDREN,
  JobStateEnum.PRIORITIZED,
]);
const failedStatus = new Set([JobStateEnum.FAILED, JobStateEnum.UNKNOWN]);

export class BullhubQueue {
  readonly name: string;
  readonly total: number;

  readonly jobs: Record<JobStateEnum, number>;

  public static aggregateJobs(jobs: Record<JobStateEnum, number>): {
    completed: number;
    pending: number;
    failed: number;
  } {
    const entries = Object.entries(jobs);

    return {
      completed: jobs.completed,
      failed: entries
        .filter(([state]) => failedStatus.has(state as JobStateEnum))
        .reduce((acc, curr) => acc + curr[1], 0),
      pending: entries
        .filter(([state]) => pendingStatus.has(state as JobStateEnum))
        .reduce((acc, curr) => acc + curr[1], 0),
    };
  }
}
