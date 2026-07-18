import { createFileRoute } from "@tanstack/react-router";
import { QueueDetailPage } from "@/components/pages/QueueDetail";

export const Route = createFileRoute("/queues/$queueName")({
  component: QueueDetailPage,
  head: ({ params }) => ({
    meta: [{ title: `Bullhub | ${params.queueName}` }],
  }),
  staticData: {
    title: ":queueName",
  },
});
