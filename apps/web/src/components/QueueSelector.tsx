import type { FC } from "react";
import { Layers, ChevronDown, Check, Loader } from "lucide-react";
import * as Select from "@radix-ui/react-select";
import { useQueues } from "@/hooks/useQueues";
import { cn } from "@/utils/css";

interface QueueSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
}

export const QueueSelector: FC<QueueSelectorProps> = ({ value, onChange }) => {
  const { data, isFetching } = useQueues();
  const queues = data ?? [];
  const selected = queues.find((q) => q.name === value);

  return (
    <Select.Root value={String(value)} onValueChange={onChange}>
      <Select.Trigger
        disabled={isFetching}
        className={cn(
          "relative flex items-center gap-2 h-9 pl-9 pr-8 rounded-md border border-input bg-transparent text-sm text-foreground outline-none cursor-pointer",
          "transition-[color,box-shadow]",
          "focus:border-ring focus:ring-ring/50 focus:ring-[3px]",
          "data-[placeholder]:text-muted-foreground min-w-60",
          "data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none",
        )}
      >
        <Layers className="absolute left-3 w-4 h-4 text-muted-foreground" />
        <Select.Value>{selected?.name ?? "Select queue"}</Select.Value>

        <Select.Icon asChild>
          {isFetching ? (
            <Loader className="absolute right-2 w-4 h-4 text-muted-foreground animate-spin" />
          ) : (
            <ChevronDown className="absolute right-2 w-4 h-4 text-muted-foreground" />
          )}
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={4}
          className={cn(
            "z-50 min-w-[var(--radix-select-trigger-width)] rounded-md border border-border bg-popover shadow-md",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          )}
        >
          <Select.Viewport className="p-1">
            {queues.map((queue) => (
              <Select.Item
                key={queue.name}
                value={queue.name}
                className={cn(
                  "relative flex items-center justify-between px-3 py-2 text-sm rounded-sm outline-none cursor-pointer select-none",
                  "text-muted-foreground transition-colors",
                  "data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground",
                  "data-[state=checked]:text-foreground",
                )}
              >
                <Select.ItemText>{queue.name}</Select.ItemText>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{queue.total}</span>
                  <Select.ItemIndicator>
                    <Check className="w-3.5 h-3.5 text-primary" />
                  </Select.ItemIndicator>
                </div>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};
