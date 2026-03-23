import type { ComponentProps, FC } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/utils/css";

interface InputProps extends ComponentProps<"input"> {
  startIcon?: LucideIcon;
  endIcon?: LucideIcon;
}

export const Input: FC<InputProps> = ({ className, type, startIcon, endIcon, ...props }) => {
  const StartIcon = startIcon;
  const EndIcon = endIcon;

  return (
    <div className="relative flex items-center w-full">
      {StartIcon && (
        <StartIcon className="absolute left-3 flex items-center text-muted-foreground pointer-events-none w-4 h-4" />
      )}
      <input
        type={type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          StartIcon && "pl-9",
          EndIcon && "pr-9",
          className,
        )}
        {...props}
      />
      {EndIcon && (
        <EndIcon className="absolute left-3 flex items-center text-muted-foreground pointer-events-none w-4 h-4" />
      )}
    </div>
  );
};
