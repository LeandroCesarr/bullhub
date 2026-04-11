import { Server, Activity, AlertCircle, Clock } from "lucide-react";
import { Box } from "@/components/Box";

// ─── types ────────────────────────────────────────────────────────────────────

type WorkerStatus = "online" | "offline";

type MockWorker = {
  id: string;
  name: string;
  queue: string;
  host: string;
  status: WorkerStatus;
  startedAt: string;
  processed: number;
  failed: number;
  currentJob?: string;
};

// ─── mock data ────────────────────────────────────────────────────────────────

const mockWorkers: MockWorker[] = [
  {
    id: "1",
    name: "email-worker-1",
    queue: "email-queue",
    host: "172.19.0.1",
    status: "online",
    startedAt: "2026-03-22T10:00:00.000Z",
    processed: 450,
    failed: 12,
    currentJob: "job-001",
  },
  {
    id: "2",
    name: "email-worker-2",
    queue: "email-queue",
    host: "172.19.0.1",
    status: "online",
    startedAt: "2026-03-23T06:00:00.000Z",
    processed: 380,
    failed: 8,
  },
  {
    id: "3",
    name: "notification-worker-1",
    queue: "notification-queue",
    host: "172.19.0.2",
    status: "online",
    startedAt: "2026-03-21T10:00:00.000Z",
    processed: 1200,
    failed: 3,
    currentJob: "job-002",
  },
  {
    id: "4",
    name: "notification-worker-2",
    queue: "notification-queue",
    host: "172.19.0.2",
    status: "online",
    startedAt: "2026-03-22T10:00:00.000Z",
    processed: 980,
    failed: 5,
    currentJob: "job-006",
  },
  {
    id: "5",
    name: "report-worker-1",
    queue: "report-generation",
    host: "172.19.0.3",
    status: "offline",
    startedAt: "2026-03-23T10:00:00.000Z",
    processed: 156,
    failed: 2,
  },
  {
    id: "6",
    name: "image-worker-1",
    queue: "image-processing",
    host: "172.19.0.3",
    status: "online",
    startedAt: "2026-03-20T10:00:00.000Z",
    processed: 890,
    failed: 45,
  },
];

// ─── utils ────────────────────────────────────────────────────────────────────

function formatUptime(startedAt: string): string {
  const diff = Date.now() - new Date(startedAt).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) return `${days}d ${hours}h`;
  return `${hours}h`;
}

// ─── worker card ──────────────────────────────────────────────────────────────

function WorkerCard({ worker }: { worker: MockWorker }) {
  const isOffline = worker.status === "offline";

  return (
    <div
      className={`bg-muted border border-border rounded-md p-4 flex flex-col gap-3 ${isOffline ? "opacity-60" : ""}`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-md border ${isOffline ? "bg-muted border-border" : "bg-muted border-border"}`}
        >
          <Server size={16} className={isOffline ? "text-muted-foreground" : "text-foreground"} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-medium truncate ${isOffline ? "text-muted-foreground" : "text-foreground"}`}
            >
              {worker.name}
            </span>
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                isOffline
                  ? "bg-muted-foreground"
                  : "bg-status-success shadow-[0_0_5px] shadow-status-success/60"
              }`}
            />
          </div>
          <span className="text-[11px] text-muted-foreground">{worker.queue}</span>
        </div>
      </div>

      <div className="flex items-center gap-6 text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Activity size={12} />
          <span className="text-foreground">{worker.processed.toLocaleString()}</span>
          <span>processados</span>
        </div>
        <div className="flex items-center gap-1.5">
          <AlertCircle size={12} className="text-status-error" />
          <span className={worker.failed > 0 ? "text-status-error" : "text-muted-foreground"}>
            {worker.failed} falhas
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground ml-auto">
          <Clock size={12} />
          <span>{isOffline ? "Offline" : formatUptime(worker.startedAt)}</span>
        </div>
      </div>

      {worker.currentJob && (
        <div className="pt-2 border-t border-border text-[11px] text-muted-foreground">
          Processando: <span className="text-foreground font-medium">{worker.currentJob}</span>
        </div>
      )}
    </div>
  );
}

// ─── workers page ─────────────────────────────────────────────────────────────

export function WorkersPage() {
  return (
    <Box.Root>
      <Box.Title
        content={
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-foreground">Workers</span>

            </div>
          </div>
        }
      />
      <Box.Content className="flex flex-col gap-2 mt-2">
        {mockWorkers.map((worker) => (
          <WorkerCard key={worker.id} worker={worker} />
        ))}
      </Box.Content>
    </Box.Root>
  );
}
