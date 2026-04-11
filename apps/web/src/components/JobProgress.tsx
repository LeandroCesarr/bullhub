import type { FC } from "react";

export const JobProgress: FC<{ progress: number }> = ({ progress }) => {
  if (progress === 0) return null;

  return (
    <div className="flex items-stretch gap-1 flex-col">
      <div className="flex justify-between gap-1">
        <span className="text-xs text-muted-foreground">Progress</span>
        <span className="text-xs text-foreground font-medium">{progress}%</span>
      </div>
      <div className="w-24 h-1 rounded-full bg-secondary overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
