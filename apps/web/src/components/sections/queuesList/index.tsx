import { type FC, Fragment } from "react";
import { useQueues } from "@/hooks/useQueues.ts";
import { Box } from "@/components/Box.tsx";
import { QueuesListSkeleton } from "@/components/sections/queuesList/components/QueuesListSkeleton.tsx";
import { CircleX, RefreshCcw } from "lucide-react";
import { ActionButton } from "@/components/ActionButton.tsx";
import { QueuesListItem } from "@/components/sections/queuesList/components/QueuesListItem.tsx";

export const QueuesList: FC = () => {
  const { data, isPending, error, refetch } = useQueues();

  return (
    <Fragment>
      <Box.Root>
        <Box.Title
          content={
            <div className="flex items-center justify-between">
              <p>queues</p>
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                {data?.length} queues
              </span>
            </div>
          }
        />
        <Box.Content>
          <div>
            {isPending && <QueuesListSkeleton />}

            {error && (
              <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
                <CircleX className="w-10 h-10 text-muted-foreground/40" />
                <p className="text-sm font-medium text-foreground">Something went wrong</p>
                <ActionButton
                  onClick={() => refetch()}
                  icon={RefreshCcw}
                  label="Reload"
                  theme="foreground"
                />
              </div>
            )}

            {data && !error && data.map((q) => <QueuesListItem queue={q} key={q.name} />)}
          </div>
        </Box.Content>
      </Box.Root>
    </Fragment>
  );
};
