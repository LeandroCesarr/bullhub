import { type FC, Fragment } from "react";
import { Skeleton } from "@/components/Skeleton.tsx";

function random(min: number, max: number): number {
  const minCelled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCelled + 1) + minCelled);
}

export const QueuesListSkeleton: FC = () => {
  return (
    <Fragment>
      {Array.from({ length: random(4, 6) }).map((_, idx) => (
        <div className="py-2.5" key={`qlk-${idx}`}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Skeleton className="w-1.5 h-1.5 rounded-full shrink-0" />
            <Skeleton
              className="h-3"
              style={{
                width: `${random(150, 250)}px`,
              }}
            />
          </div>
          <div className="flex gap-3 mb-1.5">
            <span className="text-status-success">
              <Skeleton className="w-10 h-1.5" />
            </span>
            <span className="text-status-warning">
              <Skeleton className="w-10 h-1.5" />
            </span>
            <span className="text-status-error">
              <Skeleton className="w-10 h-1.5" />
            </span>
          </div>
          <Skeleton className="w-full h-1.5" />
        </div>
      ))}
    </Fragment>
  );
};
