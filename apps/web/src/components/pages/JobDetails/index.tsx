import { ArrowLeft, RotateCcw, Clock, Trash2 } from "lucide-react";
import { Link, useRouter } from "@tanstack/react-router";
import { Stacktrace } from "@/components/Stacktrace.tsx";
import { JsonViewer } from "@/components/JsonViewer.tsx";
import { StatusBadge } from "@/StatusBadge.tsx";
import { ActionButton } from "@/components/ActionButton.tsx";
import { JobMetadata } from "@/components/pages/JobDetails/components/JobMetadata.tsx";
import { AttemptDots } from "@/components/pages/JobDetails/components/AttemptDots.tsx";
import { Box } from "@/components/Box.tsx";
import { date } from "@/utils/date.ts";
import { Route } from "@/routes/jobs/$queueName/$jobId.tsx";
import { useJob } from "@/hooks/useJob.ts";
import { type FC, Fragment } from "react";
import { JobStateEnum } from "@/enums/jobStateEnum.ts";

export const JobDetails: FC = () => {
  const router = useRouter();
  const params = Route.useParams();
  const { data: job, isFetching } = useJob(params);

  function handleBack() {
    router.history.back();
  }

  function handleRetry() {
    // console.log("retry", job.id);
  }

  function handleRequeue() {
    // console.log("requeue", job.id);
  }

  function handleDelete() {
    // console.log("delete", job.id);
  }

  if (isFetching && !job) {
    return <>Loading ...</>;
  }

  return (
    <div className="bg-background text-foreground font-mono">
      <Link
        to="/"
        onClick={handleBack}
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        jobs
      </Link>

      {job && (
        <Fragment>
          <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl font-semibold tracking-tight">{job.name}</h1>
                <StatusBadge status={job.status} />
              </div>
              <p className="text-[11px] text-muted-foreground">
                #{job.id} &nbsp;·&nbsp; {job.queueName} &nbsp;·&nbsp; {job.processedBy}
              </p>
            </div>

            <div className="flex gap-2 flex-wrap">
              <ActionButton icon={RotateCcw} onClick={handleRetry} label="retry" theme="primary" />
              <ActionButton
                onClick={handleRequeue}
                icon={Clock}
                label="requeue"
                theme="foreground"
              />
              <ActionButton onClick={handleDelete} icon={Trash2} label="delete" theme="error" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <Box.Root>
              <Box.Title content="created" />
              <Box.Content>{date.format(job.createdAt)}</Box.Content>
            </Box.Root>

            {[JobStateEnum.COMPLETED, JobStateEnum.FAILED].includes(job.status) ? (
              <Box.Root>
                <Box.Title
                  content={job.status === JobStateEnum.FAILED ? "failed at" : "finished at"}
                />
                <Box.Content
                  className={job.status === JobStateEnum.FAILED ? "text-status-error" : ""}
                >
                  {job.finishedAt ? date.format(job.finishedAt) : "—"}
                </Box.Content>
              </Box.Root>
            ) : (
              <Box.Root>
                <Box.Title content="started at" />
                <Box.Content>{job.processedAt || "—"}</Box.Content>
              </Box.Root>
            )}

            <Box.Root>
              <Box.Title content="duration" />
              <Box.Content>{job.duration ? date.duration(job.duration) : "—"}</Box.Content>
            </Box.Root>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <Box.Root>
              <Box.Title content="metadata" />
              <Box.Content>
                <div className="grid grid-cols-2 gap-4">
                  <JobMetadata label="queue">{job.queueName}</JobMetadata>
                  <JobMetadata label="worker">{job.processedBy ?? "-"}</JobMetadata>
                  <JobMetadata label="priority">{job.priority}</JobMetadata>
                  <JobMetadata label="delay">{job.delay ? `${job.delay}ms` : "none"}</JobMetadata>
                  <JobMetadata label="attempts">
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className={
                          job.attempts.made >= job.attempts.max &&
                          job.status === JobStateEnum.FAILED
                            ? "text-status-error"
                            : ""
                        }
                      >
                        {job.attempts.made} / {job.attempts.max}
                      </span>
                      <AttemptDots attempt={job.attempts} state={job.status} />
                    </div>
                  </JobMetadata>
                  <JobMetadata label="backoff">{job.backoff.type}</JobMetadata>
                </div>
              </Box.Content>
            </Box.Root>

            <Box.Root>
              <Box.Title content="payload" />
              <Box.Content className="flex flex-col [&>*:first-child]:grow">
                <JsonViewer payload={job.payload} />
              </Box.Content>
            </Box.Root>
          </div>

          {!!job.stacktrace.length && (
            <Box.Root>
              <Box.Title content="stacktrace" />
              <Box.Content>
                <Stacktrace raw={job.stacktrace[0]} />
              </Box.Content>
            </Box.Root>
          )}
        </Fragment>
      )}
    </div>
  );
};
