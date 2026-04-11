import { createFileRoute } from "@tanstack/react-router";
import { JobList } from "@/components/pages/JobsList";
import { JobStateEnum } from "@/enums/jobStateEnum.ts";

type JobsSearch = {
  queueName?: string;
  page?: number;
  state: JobStateEnum;
};

export const Route = createFileRoute("/jobs/")({
  component: JobList,
  head: () => ({
    meta: [{ title: "Bullhub | Jobs" }],
  }),
  staticData: {
    title: "Jobs",
  },
  validateSearch: (search: Record<string, unknown>): JobsSearch => {
    return {
      queueName: search.queueName as string,
      page: Number(search?.page ?? 1),
      state: search.state ? (search.state as JobStateEnum) : JobStateEnum.ACTIVE,
    };
  },
});
