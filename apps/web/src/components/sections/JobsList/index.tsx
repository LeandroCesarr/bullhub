import { Fragment } from "react";
import { Layers } from "lucide-react";
import { List } from "../../List.tsx";
import { QueueSelector } from "../../QueueSelector.tsx";
import { JobStateSelector } from "../../JobStateSelector.tsx";
import { ListSkeleton } from "./components/ListSkeleton.tsx";
import { Route } from "../../../routes/jobs.tsx";
import { useNavigate } from "@tanstack/react-router";
import { useJobs } from "../../../hooks/useJobs.ts";
import { JobListItem } from "./components/JobListItem.tsx";
import type { JobStateEnum } from "../../../enums/jobStateEnum.ts";

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

        {isFetching && !data && <ListSkeleton />}

        {data ? (
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
