import type { FC } from "react";
import {epocToHours} from "@/utils/date.ts";
import type { TooltipPayload } from "recharts";

interface CustomTooltipProps {
  active?: boolean;
  readonly payload?: TooltipPayload;
  label?: string | number;
}

export const ChartTooltip: FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-card border border-border rounded-md px-3 py-2 text-xs font-mono">
      <p className="text-muted-foreground mb-1">{epocToHours(Number(label))}</p>
      <p className="text-status-success">completed: {payload[0]?.value}</p>
      <p className="text-status-error">failed: {payload[1]?.value}</p>
    </div>
  );
};
