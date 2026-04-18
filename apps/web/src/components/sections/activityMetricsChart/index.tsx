import type { FC } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useActivityMetrics } from "@/hooks/useActivityMetrics.ts";
import { ChartTooltip } from "@/components/sections/activityMetricsChart/components/ChartTooltip.tsx";
import { epocToHours } from "@/utils/date.ts";
import { Box } from "@/components/Box";

export const ActivityMetricsChart: FC = () => {
  const { data } = useActivityMetrics();

  if (!data) return <>Loading...</>;

  return (
    <Box.Root>
      <Box.Title
        content={
          <div className="flex justify-between">
            <span>job activity</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              24 hours
            </span>
          </div>
        }
      />
      <Box.Content className="grow">
        <ResponsiveContainer width="100%" height="100%" className="grow">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.01 260 / 0.5)" />
            <XAxis
              dataKey="time"
              tick={{
                fill: "var(--color-muted-foreground)",
                fontSize: 10,
                fontFamily: "JetBrains Mono",
              }}
              tickLine={false}
              axisLine={false}
              interval={1}
              tickFormatter={(val) => epocToHours(Number(val))}
            />
            <YAxis
              tick={{
                fill: "var(--color-muted-foreground)",
                fontSize: 10,
                fontFamily: "JetBrains Mono",
              }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              content={(val) => (
                <ChartTooltip label={val.label} active={val.active} payload={val.payload} />
              )}
            />
            <Line
              type="monotone"
              dataKey="completed"
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={false}
              isAnimationActive
            />
            <Line
              type="monotone"
              dataKey="failed"
              stroke="var(--color-status-error)"
              strokeWidth={1.5}
              dot={false}
              isAnimationActive
            />
          </LineChart>
        </ResponsiveContainer>
      </Box.Content>
    </Box.Root>
  );

  return (
    <div className="w-full bg-card border border-border rounded-radius-md p-5 flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-4 text-xs text-muted-foreground">
          <span>
            <span className="text-status-success">●</span> completed
          </span>
          <span>
            <span className="text-status-error">●</span> failed
          </span>
        </div>
      </div>
    </div>
  );
};
