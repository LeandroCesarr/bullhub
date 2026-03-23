import { Fragment } from "react";
import { List } from "@/components/List";
import { Skeleton } from "@/components/Skeleton";

const JOB_SKELETON_COUNT = 8;

const ItemSkeleton = () => (
  <List.Item>
    <div className="flex items-center gap-3 w-full">
      <Skeleton className="w-5 h-5 rounded-full shrink-0" />

      <div className="flex items-center gap-2 flex-1">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-5 w-24 rounded-md" />
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-12" />
        <Skeleton className="w-4 h-4 rounded-sm" />
        <Skeleton className="w-4 h-4 rounded-sm" />
      </div>
    </div>
  </List.Item>
);

export const JobsListSkeleton = () => (
  <Fragment>
    {Array.from({ length: JOB_SKELETON_COUNT }).map((_, i) => (
      <ItemSkeleton key={i} />
    ))}
  </Fragment>
);
