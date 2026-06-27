import type { Queue, JobType, Job } from "bullmq";
import { BullhubJob } from "../models/BullhubJob";
import { NotFoundException } from "../exceptions/NotFoundException";
import type { BullhubClient } from "../clients/bullmq.client";
import type { JobStateEnum } from "../enums/JobStateEnum";
import type { PaginateJobsParams, Pagination } from "../types/bullhub";
import { ConflictException } from "../exceptions/ConflictException";

const DEFAULT_PAGE_SIZE = 20;

export class JobService {
  constructor(private readonly client: BullhubClient) {}

  async fetch(queueName: string, id: string): Promise<BullhubJob> {
    const job = await this.fetchFromSource(queueName, id);
    return await BullhubJob.fromBullMQ(job);
  }

  async paginate({ page = 1, queue, state }: PaginateJobsParams): Promise<Pagination<BullhubJob>> {
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

  public async retry(queueName: string, jobId: string): Promise<void> {
    const job = await this.fetchFromSource(queueName, jobId);

    const [isFailed, isCompleted] = await Promise.all([job.isFailed(), job.isCompleted()]);

    if (!isFailed && !isCompleted) {
      throw new ConflictException("Invalid job status to retry");
    }

    await job.retry();
  }

  private async fetchFromSource(queueName: string, id: string): Promise<Job> {
    const targetQueue = this.resolveQueue(queueName);
    const job = await targetQueue.getJob(id);

    if (!job) throw new NotFoundException("Job not found");

    return job;
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
    const states = state ? [state as JobType] : undefined;

    const jobs = await queue.getJobs(states, start, end, false);

    return jobs.filter((i) => !!i);
  }

  private async countJobs(queue: Queue, state?: JobStateEnum): Promise<number> {
    const states = state ? [state as JobType] : [];
    const result = states.length ? await queue.getJobCounts(...states) : await queue.getJobCounts();

    return Object.values(result).reduce((acc, curr) => acc + curr, 0);
  }
}
