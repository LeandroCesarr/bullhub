import { type FC, useTransition } from "react";
import { cn } from "@/utils/css.ts";
import { timeAgo } from "@/utils/date.ts";
import { MoreVertical, RefreshCcw } from "lucide-react";
import type { BullhubJob } from "@/models/BullhubJob.ts";
import { jobStateData, JobStateEnum } from "@/enums/jobStateEnum.ts";
import { JobProgress } from "@/components/JobProgress.tsx";
import { toast } from "sonner";
import { sleep } from "@/utils/sleep.ts";
import { Link } from "@tanstack/react-router";

interface IListItemProps {
  queueName: string;
  job: BullhubJob;
}

export const JobListItem: FC<IListItemProps> = ({ job, queueName }) => {
  const [isPending, startTransition] = useTransition();
  const config = jobStateData[job.status];
  const Icon = config.icon;

  function handleRetry() {
    startTransition(async () => {
      const toastId = toast.loading("Retrying job...");

      try {
        await sleep(3000);
        toast.success("Job retried successfully!", { id: toastId });
      } catch {
        toast.error("Failed to retry job", { id: toastId });
      }
    });
  }

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex items-center gap-3 w-full">
        <div className="w-9 h-9 shrink-0 p-2 bg-secondary rounded-lg flex justify-center items-center">
          <Icon
            className={cn(config.color, job.status === JobStateEnum.ACTIVE && "animate-spin")}
          />
        </div>

        <Link
          to="/jobs/$queueName/$jobId"
          params={{ jobId: job.id, queueName }}
          className="flex items-start flex-1 min-w-0 flex-col"
        >
          <span className="text-sm font-medium text-foreground truncate">{job.name}</span>

          <div className="flex gap-2 text-xs text-muted-foreground">
            <span className="">{job.id}</span>
            {" • "}
            <span className="">{timeAgo(job.createdAt)}</span>
          </div>
        </Link>

        <div className="flex items-center gap-3 shrink-0">
          {job.status !== JobStateEnum.FAILED && <JobProgress progress={job.progress} />}

          {job.status === JobStateEnum.FAILED && (
            <button
              className="text-muted-foreground hover:text-foreground transition-colors"
              onClick={handleRetry}
              disabled={isPending}
            >
              <RefreshCcw className="w-4 h-4" />
            </button>
          )}

          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>

          {/*<button*/}
          {/*  onClick={() => setExpandedId(isExpanded ? null : job.id)}*/}
          {/*  className="text-muted-foreground hover:text-foreground transition-colors"*/}
          {/*>*/}
          {/*  <ChevronDown*/}
          {/*    className={cn("w-4 h-4 transition-transform", isExpanded && "rotate-180")}*/}
          {/*  />*/}
          {/*</button>*/}
        </div>
      </div>
    </div>
  );
};
