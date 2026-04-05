import { createFileRoute } from "@tanstack/react-router";
import { JobDetails } from "@/components/pages/JobDetails";

export const Route = createFileRoute("/jobs/$queueName/$jobId")({
  component: JobDetails,
  head: ({ params }) => ({
    meta: [{ title: `Bullhub | Job #${params.jobId}` }],
  }),
  staticData: {
    title: "Job #:jobId",
  },
});
