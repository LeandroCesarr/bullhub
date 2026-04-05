import type { CSSProperties, FC } from "react";
import { cn } from "@/utils/css";

interface SkeletonProps {
  style?: CSSProperties;
  className?: string;
}

export const Skeleton: FC<SkeletonProps> = ({ className, style }) => {
  return (
    <div className={cn("animate-pulse rounded-md bg-secondary/60", className)} style={style} />
  );
};
