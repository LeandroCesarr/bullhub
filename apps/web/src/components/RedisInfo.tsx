import { Server } from "lucide-react";
import { type FC, Fragment } from "react";
import { useRedis } from "@/hooks/useRedis.ts";
import { formatEpocDuration } from "@/utils/date.ts";
import { percent } from "@/utils/math.ts";
import { Box } from "./Box";

const RedisMeta: FC<{ label: string; value: string }> = ({ label, value }) => {
  return (
    <div className="bg-muted px-3 py-2.5">
      <p className="text-[10px] text-muted-foreground uppercase tracking- widest mb-1">{label}</p>
      <p className={`text-sm font-medium`}>{value}</p>
    </div>
  );
};

export const RedisInfo: FC = () => {
  const { data, isPending } = useRedis();

  if (isPending || !data) return <div>Loading ....</div>;

  const stats = [
    {
      label: "uptime",
      value: formatEpocDuration(data.server.startedAt),
      className: "text-primary",
    },
    { label: "clients", value: data.server.clients, className: "" }
  ];

  return (
    <Fragment>
      {data && (
        <Box.Root>
          <Box.Title
            content={
              <div className="flex justify-between">
                <div className="flex items-center gap-1.5 text-sm font-medium">
                  <Server className="text-primary h-4 w-4" />
                  redis
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  v{data.server.version}
                </span>
              </div>
            }
          />
          <Box.Content>
            <div className="grid grid-cols-2 gap-px bg-border rounded-md overflow-hidden mb-4">
              {stats.map((stat) => (
                <RedisMeta key={stat.label} label={stat.label} value={stat.value as string} />
              ))}
            </div>

            <div className="mb-3">
              <div className="flex justify-between text-[11px] text-muted-foreground mb-1.5">
                <span>memory</span>
                <span>
                  {data.memory.usedMemoryHuman} / {data.memory.totalSystemMemoryHuman}
                </span>
              </div>
              <div className="h-1 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{
                    width: `${percent(data.memory.usedMemory, data.memory.totalSystemMemory)}%`,
                  }}
                />
              </div>
            </div>

            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>{data.server.host}</span>
              <span className="text-accent">{data.server.mode}</span>
            </div>
          </Box.Content>
        </Box.Root>
      )}
    </Fragment>
  );
};
