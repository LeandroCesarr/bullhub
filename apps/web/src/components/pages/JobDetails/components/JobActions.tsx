import { RotateCcw, FastForward, Trash2 } from "lucide-react";
import type { FC } from "react";
import { ActionButton } from "@/components/ActionButton.tsx";
import { useJob } from "@/hooks/useJob.ts";
import type { BullhubJob } from "@/models/BullhubJob";

interface JobActionsProps {
  job: BullhubJob;
}

export const JobActions: FC<JobActionsProps> = ({ job }) => {
  const { retry, promote, cancel, can } = useJob({ queueName: job.queueName, jobId: job.id });

  return (
    <div className="flex gap-2 flex-wrap">
      <ActionButton
        icon={RotateCcw}
        onClick={retry.execute}
        label="retry"
        theme="primary"
        isLoading={retry.isPending}
        disabled={!can("retry")}
        iconClassName="group-hover:rotate-[-270deg] transition-transform duration-300"
      />
      <ActionButton
        icon={FastForward}
        onClick={promote.execute}
        label="promote"
        theme="foreground"
        isLoading={promote.isPending}
        disabled={!can("promote")}
      />
      <ActionButton
        icon={Trash2}
        onClick={cancel.execute}
        label="cancel"
        theme="error"
        isLoading={cancel.isPending}
        disabled={!can("cancel")}
      />
    </div>
  );
};
