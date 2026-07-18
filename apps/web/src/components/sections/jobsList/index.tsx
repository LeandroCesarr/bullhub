import { type FC, Fragment } from "react";
import { Layers } from "lucide-react";
import { List } from "@/components/List.tsx";
import { QueueSelector } from "@/components/QueueSelector.tsx";
import { JobStateSelector } from "@/components/JobStateSelector.tsx";
import { useJobs } from "@/hooks/useJobs.ts";
import type { JobStateEnum } from "@/enums/jobStateEnum.ts";
import { JobsListSkeleton } from "./components/JobsListSkeleton.tsx";
import { JobListItem } from "./components/JobListItem.tsx";

export interface JobsListSearchProps {
  page?: number;
  state: JobStateEnum;
  queueName?: string;
}

interface JobsListProps {
  className?: string;
  search: JobsListSearchProps;
  onChange: (value: JobsListSearchProps) => void;
  hideQueueSelector?: boolean;
}

export const JobsList: FC<JobsListProps> = ({ search, onChange, className, hideQueueSelector }) => {
  const { data, error, isFetching } = useJobs(search);

  const shouldShowEmptyMessage = !search.queueName && search.state;

  function handleStateChange(state: JobStateEnum) {
    onChange({
      ...search,
      page: 1,
      state,
    });
  }

  function handlePageChange(page: number) {
    onChange({
      ...search,
      page,
    });
  }

  function handleQueueChange(queueName: string) {
    onChange({
      ...search,
      page: 1,
      queueName,
    });
  }

  return (
    <section className={className}>
      <List.Root className="flex grow w-full items-stretch justify-stretch flex-col">
        <List.Header title="Recent jobs">
          <div className="flex items-center gap-2">
            {!hideQueueSelector && (
              <QueueSelector value={search.queueName} onChange={handleQueueChange} />
            )}
            <JobStateSelector value={search.state} onChange={handleStateChange} />
          </div>
        </List.Header>

        {shouldShowEmptyMessage && (
          <List.Message
            message="No queue selected"
            description="Select a queue to view jobs"
            icon={Layers}
          />
        )}

        {error && (
          <List.Message message="Error to list jobs" description="Try again later" icon={Layers} />
        )}

        {isFetching && !data && <JobsListSkeleton />}

        {data && !error ? (
          <Fragment>
            {!data.items.length && <List.Message message="No jobs to list" icon={Layers} />}

            {data.items.map((job) => (
              <List.Item key={job.id}>
                <JobListItem queueName={search.queueName!} job={job} />
              </List.Item>
            ))}

            {!!data.items.length && (
              <List.Paginator pagination={data.pagination} onChange={handlePageChange} />
            )}
          </Fragment>
        ) : null}
      </List.Root>
    </section>
  );
};
