import { BullhubQueue } from "@/models/BullhubQueue.ts";
import type { FC } from "react";
import { cn } from "@/utils/css.ts";
import { QueueBar } from "@/components/sections/queuesList/components/QueueBar.tsx";

export const QueuesListItem: FC<{ queue: BullhubQueue }> = ({ queue }) => {
  const aggregateJobs = BullhubQueue.aggregateJobs(queue.jobs);

  const completedPercent = (aggregateJobs.completed / queue.total) * 100;
  const pendingPercent = (aggregateJobs.pending / queue.total) * 100;
  const failedPercent = (aggregateJobs.failed / queue.total) * 100;

  const indicatorPercentageMap = [completedPercent, pendingPercent, failedPercent];
  const indicatorMap = ["bg-primary", "bg-status-warning", "bg-error"];

  const greaterPercentage = Math.max(completedPercent, pendingPercent, failedPercent);
  const indicator = indicatorPercentageMap.findIndex((e) => e === greaterPercentage);

  return (
    <div className="py-2.5">
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", indicatorMap[indicator])} />
        <span className="text-xs font-medium">{queue.name}</span>
      </div>
      <div className="flex gap-3 text-xs mb-1.5">
        <span className="text-status-success">{aggregateJobs.completed} ok</span>
        <span className="text-status-warning">{aggregateJobs.pending} pend</span>
        <span className="text-status-error">{aggregateJobs.failed} fail</span>
      </div>
      <QueueBar
        ok={aggregateJobs.completed}
        pend={aggregateJobs.pending}
        fail={aggregateJobs.failed}
      />
    </div>
  );
};
