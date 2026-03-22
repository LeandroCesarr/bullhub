import { cn } from "../utils/css.ts";
import type { FC, ReactNode } from "react";
import {ChevronLeft, ChevronRight, type LucideIcon} from "lucide-react";

interface ListRootProps {
  children: ReactNode;
  className?: string;
}

const ListRoot: FC<ListRootProps> = ({ children, className }) => {
  return <div className={cn("rounded-xl border border-border bg-card", className)}>{children}</div>;
};

interface ListHeaderProps {
  title: string;
  children?: ReactNode;
  className?: string;
}

const ListHeader: FC<ListHeaderProps> = ({ title, children, className }) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-4 py-3 border-b border-border",
        className,
      )}
    >
      <span className="text-sm font-medium text-foreground">{title}</span>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
};

interface ListItemProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const ListItem: FC<ListItemProps> = ({ children, className, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 border-b border-border last:border-0 transition-colors",
        onClick && "cursor-pointer hover:bg-secondary/50",
        className,
      )}
    >
      {children}
    </div>
  );
};

const ListEmpty = ({
  message,
  description,
  icon,
}: {
  icon?: LucideIcon;
  message?: string;
  description?: string;
}) => {
  const Icon = icon!;

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
      {icon && <Icon className="w-10 h-10 text-muted-foreground/40" />}
      <p className="text-sm font-medium text-foreground">{message}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
};

interface ListPaginatorProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
}

const ListPaginator: FC<ListPaginatorProps> = ({ page, totalPages, total, pageSize, onChange }) => {
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
      <div className="flex items-center justify-between px-4 py-3 border-t border-border">
      <span className="text-xs text-muted-foreground">
        {from}–{to} de {total} jobs
      </span>

        <div className="flex items-center gap-1">
          <button
              onClick={() => onChange(page - 1)}
              disabled={page <= 1}
              className={cn(
                  "w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground transition-colors",
                  "hover:bg-secondary hover:text-foreground",
                  "disabled:opacity-40 disabled:pointer-events-none",
              )}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs text-muted-foreground px-2">
          {page} / {totalPages}
        </span>

          <button
              onClick={() => onChange(page + 1)}
              disabled={page >= totalPages}
              className={cn(
                  "w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground transition-colors",
                  "hover:bg-secondary hover:text-foreground",
                  "disabled:opacity-40 disabled:pointer-events-none",
              )}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
  );
};

export const List = {
  Root: ListRoot,
  Header: ListHeader,
  Item: ListItem,
  Empty: ListEmpty,
  Paginator: ListPaginator,
};
