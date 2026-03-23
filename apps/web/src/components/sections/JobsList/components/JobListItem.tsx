import type { FC } from "react";
import { cn } from "@/utils/css";
import { timeAgo } from "@/utils/date";
import { MoreVertical, RotateCcw } from "lucide-react";
import type { BullhubJob } from "@/models/BullhubJob";
import { jobStateData, JobStateEnum } from "@/enums/jobStateEnum";
import { JobProgress } from "@/components/JobProgress";

interface IListItemProps {
  job: BullhubJob;
}

export const JobListItem: FC<IListItemProps> = ({ job }) => {
  const config = jobStateData[job.status];
  const Icon = config.icon;

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex items-center gap-3 w-full">
        <Icon
          className={cn(
            "w-5 h-5 shrink-0",
            config.color,
            job.status === JobStateEnum.ACTIVE && "animate-spin",
          )}
        />

        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-sm font-medium text-foreground truncate">{job.name}</span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <JobProgress progress={job.progress} />

          <span className="text-xs text-muted-foreground">{job.id}</span>
          <span className="text-xs text-muted-foreground">{timeAgo(job.timestamp)}</span>

          {job.status === "failed" && (
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <RotateCcw className="w-4 h-4" />
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
