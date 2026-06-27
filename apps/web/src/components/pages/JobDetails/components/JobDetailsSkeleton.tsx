import type { FC } from "react";
import { Skeleton } from "@/components/Skeleton.tsx";
import { Box } from "@/components/Box.tsx";

export const JobDetailsSkeleton: FC = () => (
  <div className="bg-background text-foreground font-mono">
    <Skeleton className="h-4 w-12 mb-6" />

    <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 flex-wrap">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="flex gap-2 flex-wrap">
        <Skeleton className="h-7 w-[70px] rounded-md" />
        <Skeleton className="h-7 w-[90px] rounded-md" />
        <Skeleton className="h-7 w-[75px] rounded-md" />
      </div>
    </div>

    <div className="grid grid-cols-3 gap-4 mb-4">
      <Box.Root>
        <Box.Title content="created" />
        <Box.Content><Skeleton className="h-5 w-32" /></Box.Content>
      </Box.Root>
      <Box.Root>
        <Box.Title content="finished at" />
        <Box.Content><Skeleton className="h-5 w-32" /></Box.Content>
      </Box.Root>
      <Box.Root>
        <Box.Title content="duration" />
        <Box.Content><Skeleton className="h-5 w-20" /></Box.Content>
      </Box.Root>
    </div>

    <div className="grid grid-cols-2 gap-4 mb-4">
      <Box.Root>
        <Box.Title content="metadata" />
        <Box.Content>
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-1">
                <Skeleton className="h-4 w-14" />
                <Skeleton className="h-5 w-24" />
              </div>
            ))}
          </div>
        </Box.Content>
      </Box.Root>

      <Box.Root>
        <Box.Title content="payload" />
        <Box.Content className="flex flex-col [&>*:first-child]:grow">
          <Skeleton className="h-full min-h-32 w-full" />
        </Box.Content>
      </Box.Root>
    </div>
  </div>
);
