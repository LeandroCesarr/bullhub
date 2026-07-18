import { useState } from "react";
import { JobsList, type JobsListSearchProps } from "@/components/sections/jobsList";
import { JobStateEnum } from "@/enums/jobStateEnum";
import type { FC } from "react";

interface JobsTabProps {
  queueName: string;
}

export const JobsTab: FC<JobsTabProps> = ({ queueName }) => {
  const [search, setSearch] = useState<JobsListSearchProps>({
    state: JobStateEnum.ACTIVE,
    queueName,
  });

  return <JobsList search={search} onChange={setSearch} hideQueueSelector />;
};
