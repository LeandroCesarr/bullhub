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
import { ChartTooltip } from "@/components/sections/activityMetricsChart/components/ChartTooltip";
import { epocToHours } from "@/utils/date";
import { Box } from "@/components/Box";
import type { ActivityMetric } from "@/types";

interface ActivityMetricsChartProps {
  data: ActivityMetric[];
}

export const ActivityMetricsChart: FC<ActivityMetricsChartProps> = ({ data }) => (
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
    <Box.Content className="grow min-h-64 h-0">
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
