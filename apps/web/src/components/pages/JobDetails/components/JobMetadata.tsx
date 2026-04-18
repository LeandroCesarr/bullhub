import type { FC, PropsWithChildren } from "react";

interface IJobMetadata {
  label: string;
}

export const JobMetadata: FC<PropsWithChildren<IJobMetadata>> = ({ label, children }) => {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground uppercase tracking-widest">{label}</span>
      <div className="text-sm text-foreground">{children}</div>
    </div>
  );
};
