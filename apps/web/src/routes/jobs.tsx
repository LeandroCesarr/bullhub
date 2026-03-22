import type { FC } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { JobList } from "../components/sections/JobsList";
import type { JobStateEnum } from "../enums/jobStateEnum.ts";

const JobsPage: FC = () => {
  return <JobList />;
};

type JobsSearch = {
  queueName?: string;
  page?: number;
  state?: JobStateEnum;
};

export const Route = createFileRoute("/jobs")({
  component: JobsPage,
  staticData: {
    title: "Jobs",
  },
  validateSearch: (search: Record<string, unknown>): JobsSearch => {
    return {
      queueName: search.queueName as string,
      page: Number(search?.page ?? 1),
      state: search.state as JobStateEnum,
    };
  },
});
