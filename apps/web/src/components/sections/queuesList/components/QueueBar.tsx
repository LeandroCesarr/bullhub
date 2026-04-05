import type { FC } from "react";

export const QueueBar: FC<{ ok: number; pend: number; fail: number }> = ({ ok, pend, fail }) => {
  const total = ok + pend + fail || 1;

  return (
    <div className="h-0.75 rounded-full bg-border overflow-hidden flex gap-px">
      <div
        className="transition-[width] duration-300  bg-status-success rounded-full"
        style={{ width: `${(ok / total) * 100}%` }}
      />
      <div
        className="transition-[width] duration-300  bg-status-warning rounded-full"
        style={{ width: `${(pend / total) * 100}%` }}
      />
      <div
        className="transition-[width] duration-300  bg-status-error rounded-full"
        style={{ width: `${(fail / total) * 100}%` }}
      />
    </div>
  );
};
