import { tv, type VariantProps } from "tailwind-variants";
import type { FC, MouseEventHandler } from "react";
import type { LucideIcon } from "lucide-react";

const button = tv({
  base: "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all active:scale-95 group",
  variants: {
    theme: {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90",
      foreground: "bg-card text-foreground border border-border hover:bg-muted",
      error:
        "bg-status-error/10 text-status-error border border-status-error/30 hover:bg-status-error/20",
    },
  },
  defaultVariants: {
    theme: "primary",
  },
});

interface ActionButtonProps extends VariantProps<typeof button> {
  onClick: MouseEventHandler<HTMLButtonElement>;
  icon: LucideIcon;
  iconClassName?: string;
  label: string;
}

export const ActionButton: FC<ActionButtonProps> = ({ onClick, theme, icon: Icon, label, iconClassName }) => (
  <button onClick={onClick} className={button({ theme })}>
    <Icon size={14} className={iconClassName} />
    {label}
  </button>
);
