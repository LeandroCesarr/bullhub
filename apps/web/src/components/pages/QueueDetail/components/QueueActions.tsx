import { Pause, Play, Trash2 } from "lucide-react";
import type { FC } from "react";
import { ActionButton } from "@/components/ActionButton";
import { useQueue } from "@/hooks/useQueue";

interface QueueActionsProps {
  queueName: string;
}

export const QueueActions: FC<QueueActionsProps> = ({ queueName }) => {
  const { data: queue, pause, resume, drain } = useQueue(queueName);

  return (
    <div className="flex gap-2 flex-wrap">
      <ActionButton
        icon={Pause}
        onClick={pause.execute}
        label="pause"
        theme="foreground"
        isLoading={pause.isPending}
        disabled={queue?.paused ?? false}
      />
      <ActionButton
        icon={Play}
        onClick={resume.execute}
        label="resume"
        theme="primary"
        isLoading={resume.isPending}
        disabled={!queue?.paused}
      />
      <ActionButton
        icon={Trash2}
        onClick={drain.execute}
        label="drain"
        theme="error"
        isLoading={drain.isPending}
      />
    </div>
  );
};
