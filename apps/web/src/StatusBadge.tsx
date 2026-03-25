import type { FC } from "react";
import { tv } from "tailwind-variants";
import { JobStateEnum } from "@/enums/jobStateEnum.ts";

const badge = tv({
  slots: {
    root: "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide border",
    dot: "w-1.5 h-1.5 rounded-full",
  },
  variants: {
    status: {
      [JobStateEnum.FAILED]: {
        root: "bg-status-error/15 text-status-error border-status-error/30",
        dot: "bg-status-error",
      },
      [JobStateEnum.COMPLETED]: {
        root: "bg-status-success/15 text-status-success border-status-success/30",
        dot: "bg-status-success",
      },
      [JobStateEnum.WAITING]: {
        root: "bg-muted-foreground/15 text-muted-foreground border-muted-foreground/30",
        dot: "bg-muted-foreground",
      },
      [JobStateEnum.ACTIVE]: {
        root: "bg-status-info/15 text-status-info border-status-info/30",
        dot: "bg-status-info shadow-sm shadow-status-info",
      },
      [JobStateEnum.DELAYED]: {
        root: "bg-status-warning/15 text-status-warning border-status-warning/30",
        dot: "bg-status-warning",
      },
      [JobStateEnum.PRIORITIZED]: {
        root: "bg-status-warning/15 text-status-warning border-status-warning/30",
        dot: "bg-status-warning",
      },
      [JobStateEnum.WAITING_CHILDREN]: {
        root: "bg-muted-foreground/15 text-muted-foreground border-muted-foreground/30",
        dot: "bg-muted-foreground",
      },
      [JobStateEnum.UNKNOWN]: {
        root: "bg-muted-foreground/15 text-muted-foreground border-muted-foreground/30",
        dot: "bg-muted-foreground",
      },
    },
  },
});

export const StatusBadge: FC<{ status: JobStateEnum }> = ({ status }) => {
  const { root, dot } = badge({ status });

  return (
    <span className={root()}>
      <span className={dot()} />
      {status}
    </span>
  );
};
