import { createFileRoute } from "@tanstack/react-router";
import { useQueues } from "@/hooks/useQueues";
import { QueuesListItem } from "@/components/sections/queuesList/components/QueuesListItem";

function QueuesPage() {
  const { data: queues } = useQueues();

  return (
    <div className="p-6 bg-background text-foreground font-mono">
      <div className="grid grid-cols-4 gap-4">
        {queues?.map((queue) => (
          <div key={queue.name} className="bg-card border border-border rounded-md">
            <QueuesListItem queue={queue} />
          </div>
        ))}
      </div>
    </div>
  );
}

export const Route = createFileRoute("/queues/")({
  component: QueuesPage,
  head: () => ({
    meta: [{ title: "Bullhub | Queues" }],
  }),
  staticData: {
    title: "Queues",
  },
});
