import { Fragment } from "react";
import { Layers } from "lucide-react";
import { List } from "@/components/List.tsx";
import { QueueSelector } from "@/components/QueueSelector.tsx";
import { JobStateSelector } from "@/components/JobStateSelector.tsx";
import { Route } from "@/routes/jobs";
import { useNavigate } from "@tanstack/react-router";
import { useJobs } from "@/hooks/useJobs.ts";
import type { JobStateEnum } from "@/enums/jobStateEnum.ts";
import { JobsListSkeleton } from "./components/JobsListSkeleton.tsx";
import { JobListItem } from "./components/JobListItem.tsx";

export function JobList() {
  const navigate = useNavigate({ from: Route.fullPath });
  const queryParams = Route.useSearch();

  const { data, error, isFetching } = useJobs(queryParams);

  async function handleStateChange(state: JobStateEnum) {
    await navigate({
      search: {
        ...queryParams,
        page: 1,
        state,
      },
    });
  }

  async function handlePageChange(page: number) {
    await navigate({
      search: {
        ...queryParams,
        page,
      },
    });
  }

  async function handleQueueChange(queueName: string) {
    await navigate({
      search: {
        ...queryParams,
        page: 1,
        queueName,
      },
    });
  }

  return (
    <section>
      <List.Root>
        <List.Header title="Recent jobs">
          <div className="flex items-center gap-2">
            <QueueSelector value={queryParams.queueName} onChange={handleQueueChange} />
            <JobStateSelector value={queryParams.state} onChange={handleStateChange} />
          </div>
        </List.Header>

        {!queryParams.queueName && (
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
                <JobListItem queueName={queryParams.queueName!} job={job} />
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
}
