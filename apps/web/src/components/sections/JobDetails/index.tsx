import { ArrowLeft, RotateCcw, Clock, Trash2 } from "lucide-react";
import { Link } from "@tanstack/react-router";

type JobStatus = "failed" | "completed" | "waiting" | "active" | "delayed";

type Job = {
  id: string;
  name: string;
  queue: string;
  worker: string;
  status: JobStatus;
  createdAt: string;
  finishedAt: string | null;
  duration: number | null;
  priority: number;
  delay: number;
  attempts: number;
  maxAttempts: number;
  backoff: string;
  payload: Record<string, unknown>;
  stacktrace: string | null;
};

const mockJob: Job = {
  id: "8821",
  name: "send-invoice-email",
  queue: "email-queue",
  worker: "worker-email-1",
  status: "failed",
  createdAt: "2026-03-23T10:31:04.000Z",
  finishedAt: "2026-03-23T10:31:12.000Z",
  duration: 8200,
  priority: 0,
  delay: 0,
  attempts: 3,
  maxAttempts: 3,
  backoff: "exponential",
  payload: {
    userId: 91,
    invoiceId: "INV-881",
    email: "user@acme.com",
    template: "invoice-v2",
    locale: "en-US",
  },
  stacktrace: `Error: SMTP connection timeout after 8000ms
at EmailService.send (services/email.service.ts:142:11)
at InvoiceWorker.process (workers/invoice.worker.ts:38:22)
at Worker.callProcessJob (node_modules/bullmq/dist/classes/worker.js:371:14)
at async Worker.retryIfFailed (node_modules/bullmq/dist/classes/worker.js:398:9)`,
};

const statusStyles: Record<JobStatus, { badge: string; dot: string }> = {
  failed: {
    badge: "bg-status-error/15 text-status-error border border-status-error/30",
    dot: "bg-status-error",
  },
  completed: {
    badge: "bg-status-success/15 text-status-success border border-status-success/30",
    dot: "bg-status-success",
  },
  waiting: {
    badge: "bg-status-warning/15 text-status-warning border border-status-warning/30",
    dot: "bg-status-warning",
  },
  active: {
    badge: "bg-status-info/15 text-status-info border border-status-info/30",
    dot: "bg-status-info shadow-[0_0_6px] shadow-status-info/60",
  },
  delayed: {
    badge: "bg-status-pending/15 text-status-pending border border-status-pending/30",
    dot: "bg-status-pending",
  },
};

function StatusBadge({ status }: { status: JobStatus }) {
  const s = statusStyles[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide ${s.badge}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

function AttemptDots({ attempts, max }: { attempts: number; max: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`w-2 h-2 rounded-full ${i < attempts ? "bg-status-error" : "bg-border"}`}
        />
      ))}
    </div>
  );
}

function MetaItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] text-muted-foreground uppercase tracking-widest">{label}</span>
      <div className="text-sm text-foreground">{children}</div>
    </div>
  );
}

function PayloadViewer({ payload }: { payload: Record<string, unknown> }) {
  return (
    <pre className="bg-background border border-border rounded-md p-4 text-xs leading-relaxed overflow-x-auto">
      {Object.entries(payload).map(([key, val]) => (
        <div key={key}>
          <span className="text-accent">&quot;{key}&quot;</span>
          <span className="text-muted-foreground">: </span>
          {typeof val === "string" ? (
            <span className="text-[oklch(0.78_0.12_100)]">&quot;{val}&quot;</span>
          ) : (
            <span className="text-primary">{String(val)}</span>
          )}
        </div>
      ))}
    </pre>
  );
}

function Stacktrace({ raw }: { raw: string }) {
  const [errorLine, ...stackLines] = raw.split("\n");
  return (
    <div className="bg-background border border-status-error/30 border-l-[3px] border-l-status-error rounded-md p-4 text-xs leading-relaxed overflow-x-auto">
      <p className="text-status-error font-semibold mb-2">{errorLine}</p>
      {stackLines.map((line, i) => {
        const isUserCode = !line.includes("node_modules");
        return (
          <div key={i} className={isUserCode ? "text-foreground" : "text-muted-foreground"}>
            <span className="text-muted-foreground/50 mr-1.5">at</span>
            {line.trim().replace(/^at\s*/, "")}
          </div>
        );
      })}
    </div>
  );
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function JobDetails() {
  const job = mockJob;

  function handleRetry() {
    console.log("retry", job.id);
  }

  function handleRequeue() {
    console.log("requeue", job.id);
  }

  function handleDelete() {
    console.log("delete", job.id);
  }

  return (
    <div className="bg-background text-foreground font-mono">
      <Link
        to="/jobs"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        jobs
      </Link>

      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-semibold tracking-tight">{job.name}</h1>
            <StatusBadge status={job.status} />
          </div>
          <p className="text-[11px] text-muted-foreground">
            #{job.id} &nbsp;·&nbsp; {job.queue} &nbsp;·&nbsp; {job.worker}
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-95"
          >
            <RotateCcw size={14} />
            retry
          </button>
          <button
            onClick={handleRequeue}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-medium bg-card border border-border hover:bg-muted transition-all active:scale-95"
          >
            <Clock size={14} />
            requeue
          </button>
          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-medium bg-status-error/10 text-status-error border border-status-error/30 hover:bg-status-error/20 transition-all active:scale-95"
          >
            <Trash2 size={14} />
            delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-card border border-border rounded-md p-5">
          <MetaItem label="created">{formatDate(job.createdAt)}</MetaItem>
        </div>
        <div className="bg-card border border-border rounded-md p-5">
          <MetaItem label={job.status === "failed" ? "failed at" : "finished at"}>
            <span className={job.status === "failed" ? "text-status-error" : ""}>
              {job.finishedAt ? formatDate(job.finishedAt) : "—"}
            </span>
          </MetaItem>
        </div>
        <div className="bg-card border border-border rounded-md p-5">
          <MetaItem label="duration">
            <span className="text-primary">
              {job.duration ? formatDuration(job.duration) : "—"}
            </span>
          </MetaItem>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-card border border-border rounded-md p-5">
          <p className="text-[11px] text-muted-foreground uppercase tracking-widest mb-4">
            metadata
          </p>
          <div className="grid grid-cols-2 gap-4">
            <MetaItem label="queue">{job.queue}</MetaItem>
            <MetaItem label="worker">{job.worker}</MetaItem>
            <MetaItem label="priority">{job.priority}</MetaItem>
            <MetaItem label="delay">{job.delay > 0 ? `${job.delay}ms` : "none"}</MetaItem>
            <MetaItem label="attempts">
              <div className="flex items-center gap-2 mt-0.5">
                <span className={job.attempts >= job.maxAttempts ? "text-status-error" : ""}>
                  {job.attempts} / {job.maxAttempts}
                </span>
                <AttemptDots attempts={job.attempts} max={job.maxAttempts} />
              </div>
            </MetaItem>
            <MetaItem label="backoff">{job.backoff}</MetaItem>
          </div>
        </div>

        <div className="bg-card border border-border rounded-md p-5">
          <p className="text-[11px] text-muted-foreground uppercase tracking-widest mb-4">
            payload
          </p>
          <PayloadViewer payload={job.payload} />
        </div>
      </div>

      {job.stacktrace && (
        <div className="bg-card border border-border rounded-md p-5">
          <p className="text-[11px] text-muted-foreground uppercase tracking-widest mb-4">
            stacktrace
          </p>
          <Stacktrace raw={job.stacktrace} />
        </div>
      )}
    </div>
  );
}
