import type { FC } from "react";
import { Route } from "@/routes/jobs";
import { useNavigate } from "@tanstack/react-router";
import { JobsList, type JobsListSearchProps } from "@/components/sections/jobsList";

export const JobsListPage: FC = () => {
  const navigate = useNavigate({ from: Route.fullPath });
  const queryParams = Route.useSearch();

  async function handleSearchChange(state: JobsListSearchProps) {
    await navigate({
      search: state,
    });
  }

  return <JobsList search={queryParams} onChange={handleSearchChange} />;
};
