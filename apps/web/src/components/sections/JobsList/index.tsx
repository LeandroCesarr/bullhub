import { Fragment } from "react";
import { Layers } from "lucide-react";
import { List } from "@/components/List";
import { QueueSelector } from "@/components/QueueSelector";
import { JobStateSelector } from "@/components/JobStateSelector";
import { Route } from "@/routes/jobs";
import { useNavigate } from "@tanstack/react-router";
import { useJobs } from "@/hooks/useJobs";
import type { JobStateEnum } from "@/enums/jobStateEnum";
import { JobsListSkeleton } from "./components/JobsListSkeleton";
import { JobListItem } from "./components/JobListItem";

export function JobList() {
  const navigate = useNavigate({ from: Route.fullPath });
  const queryParams = Route.useSearch();

  const { data, error, isFetching } = useJobs(queryParams);

  async function handleStateChange(state?: JobStateEnum) {
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
                <JobListItem job={job} />
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
