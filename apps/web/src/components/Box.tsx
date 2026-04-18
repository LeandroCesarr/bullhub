import type {FC, PropsWithChildren, ReactNode} from "react";
import { tv } from "tailwind-variants";
import { cn } from "@/utils/css.ts";

const box = tv({
  slots: {
    root: "bg-card border border-border rounded-md p-5 flex flex-col gap-2 w-full",
    title: "text-xs text-muted-foreground uppercase tracking-widest",
    content: "text-sm text-foreground grow bg-red",
  },
});

const Root: FC<PropsWithChildren> = ({ children }) => {
  const { root } = box();

  return <section className={root()}>{children}</section>;
};

const Title: FC<{ content: ReactNode }> = ({ content }) => {
  const { title } = box();

  return <h2 className={title()}>{content}</h2>;
};

const Content: FC<PropsWithChildren<{ className?: string }>> = ({ children, className }) => {
  const { content } = box();

  return <div className={cn(content(), className)}>{children}</div>;
};

export const Box = {
  Root,
  Title,
  Content,
};
