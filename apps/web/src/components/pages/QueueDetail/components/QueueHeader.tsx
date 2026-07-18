import { ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/utils/css";
import { useQueue } from "@/hooks/useQueue";
import { QueueActions } from "./QueueActions";
import type { FC } from "react";

interface QueueHeaderProps {
  queueName: string;
}

export const QueueHeader: FC<QueueHeaderProps> = ({ queueName }) => {
  const { data: queue } = useQueue(queueName);

  return (
    <div className="flex flex-col gap-4">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={14} />
        dashboard
      </Link>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold tracking-tight">{queueName}</h1>
          {queue && (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
                queue.paused
                  ? "bg-status-warning/15 text-status-warning border-status-warning/30"
                  : "bg-status-success/15 text-status-success border-status-success/30",
              )}
            >
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  queue.paused ? "bg-status-warning" : "bg-status-success",
                )}
              />
              {queue.paused ? "paused" : "active"}
            </span>
          )}
        </div>
        <QueueActions queueName={queueName} />
      </div>
    </div>
  );
};
