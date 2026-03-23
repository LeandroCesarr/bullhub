import type { FC } from "react";
import { cn } from "@/utils/css";

interface SkeletonProps {
  className?: string;
}

export const Skeleton: FC<SkeletonProps> = ({ className }) => {
  return <div className={cn("animate-pulse rounded-md bg-secondary/60", className)} />;
};
