import type { FC } from "react";
import { Check, ListFilter, ChevronDown } from "lucide-react";
import * as Select from "@radix-ui/react-select";
import { cn } from "../utils/css.ts";

const statusFilters = [
  { label: "Todos", value: "all" },
  { label: "Ativo", value: "active" },
  { label: "Aguardando", value: "waiting" },
  { label: "Completado", value: "completed" },
  { label: "Falha", value: "failed" },
  { label: "Agendado", value: "delayed" },
];

interface JobStateSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
}

export const JobStateSelector: FC<JobStateSelectorProps> = ({ value, onChange }) => {
  const selected = statusFilters.find((q) => q.value === value);

  return (
    <Select.Root value={String(value)} onValueChange={onChange}>
      <Select.Trigger
        className={cn(
          "relative flex items-center gap-2 h-9 pl-9 pr-8 rounded-md border border-input bg-transparent text-sm text-foreground outline-none cursor-pointer",
          "transition-[color,box-shadow]",
          "focus:border-ring focus:ring-ring/50 focus:ring-[3px]",
          "data-[placeholder]:text-muted-foreground",
        )}
      >
        <ListFilter className="absolute left-3 w-4 h-4 text-muted-foreground" />
        <Select.Value>{selected?.label ?? "Select state"}</Select.Value>
        <Select.Icon asChild>
          <ChevronDown className="absolute right-2 w-4 h-4 text-muted-foreground" />
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
            <div className="my-1 h-px bg-border" />

            {statusFilters.map((status) => (
              <Select.Item
                key={status.value}
                value={status.value}
                className={cn(
                  "relative flex items-center justify-between px-3 py-2 text-sm rounded-sm outline-none cursor-pointer select-none",
                  "text-muted-foreground transition-colors",
                  "data-[highlighted]:bg-secondary data-[highlighted]:text-foreground",
                  "data-[state=checked]:text-foreground",
                )}
              >
                <Select.ItemText>{status.label}</Select.ItemText>
                <div className="flex items-center gap-2">
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
