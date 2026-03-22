import type { FC } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { JobList } from "../components/sections/JobsList";

const JobsPage: FC = () => {
  return (
    <div className="p-6">
      <JobList />
    </div>
  );
};

export const Route = createFileRoute("/jobs")({
  component: JobsPage,
  staticData: {
    title: "Jobs",
  },
});
