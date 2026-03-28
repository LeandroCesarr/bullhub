import type { FC } from "react";
import { RefreshCw, ChevronDown, Check } from "lucide-react";
import * as Select from "@radix-ui/react-select";
import { cn } from "@/utils/css";
import { useRefresh } from "@/hooks/useRefresh.ts";

const intervals = [
  { label: "None", value: 0 },
  { label: "5s", value: 5000 },
  { label: "15s", value: 15000 },
  { label: "30s", value: 30000 },
  { label: "1min", value: 60000 },
  { label: "5min", value: 300000 },
];

export const RefreshSelect: FC = () => {
  const [value, setValue] = useRefresh();
  const selected = intervals.find((i) => i.value === value);

  function handleChange(val: number) {
    if (val > 0) {
      setValue(Number(val));
    } else {
      setValue(false);
    }
  }

  return (
    <Select.Root value={String(value)} onValueChange={(v) => handleChange(v as any)}>
      <Select.Trigger
        className={cn(
          "w-full relative flex items-center gap-2 h-9 pl-9 pr-8 rounded-md border border-input bg-transparent text-sm outline-none cursor-pointer",
          "transition-[color,box-shadow]",
          "focus:border-ring focus:ring-ring/50 focus:ring-[3px]",
          "data-placeholder:text-muted-foreground",
          value === 0 ? "text-muted-foreground" : "text-foreground",
        )}
      >
        <RefreshCw className="absolute left-3 w-4 h-4 text-muted-foreground" />
        <Select.Value>{selected?.label ?? "Update"}</Select.Value>
        <Select.Icon asChild>
          <ChevronDown className="absolute right-2 w-4 h-4 text-muted-foreground" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={4}
          className={cn(
            "z-50 min-w-(--radix-select-trigger-width) rounded-md border border-border bg-popover shadow-md",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          )}
        >
          <Select.Viewport className="p-1">
            {intervals.map((interval) => (
              <Select.Item
                key={interval.value}
                value={String(interval.value)}
                className={cn(
                  "relative flex items-center justify-between px-3 py-2 text-sm rounded-sm outline-none cursor-pointer select-none",
                  "text-muted-foreground transition-colors",
                  "data-highlighted:bg-secondary data-highlighted:text-foreground",
                  "data-[state=checked]:text-foreground",
                )}
              >
                <Select.ItemText>{interval.label}</Select.ItemText>
                <Select.ItemIndicator>
                  <Check className="w-3.5 h-3.5 text-primary" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};
