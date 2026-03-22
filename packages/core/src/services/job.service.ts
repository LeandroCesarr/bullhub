import type { Queue, JobType } from "bullmq";
import { BullhubJob } from "../models/BullhubJob";
import { JobStateEnum } from "../enums/JobStateEnum";
import { NotFoundException } from "../exceptions/NotFoundException";
import { PaginateJobsParams, Pagination } from "../types/bullhub";
import type { BullhubClient } from "../client";

const DEFAULT_PAGE_SIZE = 20;

export class JobService {
  constructor(private readonly client: BullhubClient) {}

  async paginate({
    page = 1,
    state = JobStateEnum.COMPLETED,
    queue,
  }: PaginateJobsParams): Promise<Pagination<BullhubJob>> {
    const targetQueue = this.resolveQueue(queue);

    const [jobs, total] = await Promise.all([
      this.fetchJobs(targetQueue, page, state),
      this.countJobs(targetQueue, state),
    ]);

    const parsed = await Promise.all(jobs.map(BullhubJob.fromBullMQ));

    return {
      items: parsed,
      pagination: {
        page,
        pageSize: DEFAULT_PAGE_SIZE,
        total,
        totalPages: Math.ceil(total / DEFAULT_PAGE_SIZE),
      },
    };
  }

  private resolveQueue(queueName: string): Queue {
    const queue = this.client.getQueue(queueName);

    if (!queue) {
      throw new NotFoundException(`Queue "${queueName}" not found`);
    }

    return queue;
  }

  private calculateOffset(page: number): number {
    return (page - 1) * DEFAULT_PAGE_SIZE;
  }

  private async fetchJobs(queue: Queue, page: number, state?: JobStateEnum) {
    const start = this.calculateOffset(page);
    const end = start + DEFAULT_PAGE_SIZE - 1;
    return queue.getJobs([state as JobType], start, end, true);
  }

  private async countJobs(queue: Queue, state?: JobStateEnum): Promise<number> {
    const result = await queue.getJobCounts(state as JobType);
    return result[state as JobType];
  }
}
