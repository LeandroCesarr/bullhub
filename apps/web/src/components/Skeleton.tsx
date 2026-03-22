import { cn } from "../utils/css.ts";
import type { FC } from "react";

interface SkeletonProps {
  className?: string;
}

export const Skeleton: FC<SkeletonProps> = ({ className }) => {
  return <div className={cn("animate-pulse rounded-md bg-secondary/60", className)} />;
};
