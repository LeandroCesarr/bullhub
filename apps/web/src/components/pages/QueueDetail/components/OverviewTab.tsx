import type { FC } from "react";
import { useQueue } from "@/hooks/useQueue";
import { useQueueMetrics } from "@/hooks/useQueueMetrics";
import { Box } from "@/components/Box";
import { ActivityMetricsChart } from "@/components/sections/activityMetricsChart";
import { JobStateEnum } from "@/enums/jobStateEnum";

interface OverviewTabProps {
  queueName: string;
}

const STATE_CARDS = [
  { state: JobStateEnum.ACTIVE, label: "active", color: "text-status-info" },
  { state: JobStateEnum.WAITING, label: "waiting", color: "text-status-warning" },
  { state: JobStateEnum.DELAYED, label: "delayed", color: "text-status-warning" },
  { state: JobStateEnum.FAILED, label: "failed", color: "text-status-error" },
  { state: JobStateEnum.COMPLETED, label: "completed", color: "text-status-success" },
] as const;

export const OverviewTab: FC<OverviewTabProps> = ({ queueName }) => {
  const { data: queue } = useQueue(queueName);
  const { data: metrics } = useQueueMetrics(queueName);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-5 gap-3">
        {STATE_CARDS.map(({ state, label, color }) => (
          <Box.Root key={state}>
            <Box.Title content={label} />
            <Box.Content className={`text-2xl font-semibold tracking-tight ${color}`}>
              {queue?.jobs[state] ?? "—"}
            </Box.Content>
          </Box.Root>
        ))}
      </div>

      {metrics && <ActivityMetricsChart data={metrics} />}
    </div>
  );
};
