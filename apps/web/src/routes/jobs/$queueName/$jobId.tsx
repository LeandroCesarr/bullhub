import type { FC } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { JobDetails } from "@/components/sections/JobDetails";

const JobsDetailsPage: FC = () => {
  return <JobDetails />;
};

export const Route = createFileRoute("/jobs/$queueName/$jobId")({
  component: JobsDetailsPage,
  head: ({ params }) => ({
    meta: [{ title: `Bullhub | Job #${params.jobId}` }],
  }),
  staticData: {
    title: "Job #:jobId",
  },
});
