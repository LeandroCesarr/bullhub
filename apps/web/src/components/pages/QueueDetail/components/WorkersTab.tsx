import { Server, Clock, Activity } from "lucide-react";
import { useQueueWorkers } from "@/hooks/useQueueWorkers";
import { List } from "@/components/List";
import { date } from "@/utils/date";
import type { BullhubWorker } from "@/models/BullhubWorker";
import type { FC } from "react";

function WorkerCard({ worker }: { worker: BullhubWorker }) {
  return (
    <div className="bg-muted border border-border rounded-md p-4 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-md border bg-muted border-border">
          <Server size={16} className="text-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium truncate">{worker.name}</span>
            <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-status-success shadow-[0_0_5px] shadow-status-success/60" />
          </div>
          <span className="text-xs text-muted-foreground">{worker.host}</span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Activity size={12} />
          <span className="text-foreground">{worker.id}</span>
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <Clock size={12} />
          <span>{date.format(worker.startedAt)}</span>
        </div>
      </div>
    </div>
  );
}

interface WorkersTabProps {
  queueName: string;
}

export const WorkersTab: FC<WorkersTabProps> = ({ queueName }) => {
  const { data: workers } = useQueueWorkers(queueName);

  return (
    <List.Root>
      {!workers?.length && (
        <List.Message
          message="No workers"
          description="No workers connected to this queue"
          icon={Server}
        />
      )}
      {workers?.map((worker) => (
        <List.Item key={worker.id}>
          <WorkerCard worker={worker} />
        </List.Item>
      ))}
    </List.Root>
  );
};
