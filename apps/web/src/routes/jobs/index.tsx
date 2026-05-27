import { createFileRoute } from "@tanstack/react-router";
import { JobStateEnum } from "@/enums/jobStateEnum.ts";
import { JobsListPage } from "@/components/pages/JobsList";

type JobsSearch = {
  queueName?: string;
  page?: number;
  state: JobStateEnum;
};

export const Route = createFileRoute("/jobs/")({
  component: JobsListPage,
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
