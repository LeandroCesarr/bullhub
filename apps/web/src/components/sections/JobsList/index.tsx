import {
  CheckCircle,
  XCircle,
  Clock,
  Loader,
  Timer,
  Layers,
} from "lucide-react";
import { List } from "../../List.tsx";
import { QueueSelector } from "../../QueueSelector.tsx";
import { JobStateSelector } from "../../JobStateSelector.tsx";
import { ListSkeleton } from "./components/ListSkeleton.tsx";

// const statusConfig = {
//   completed: {
//     icon: CheckCircle,
//     color: "text-status-success",
//     label: "Completado",
//   },
//   failed: {
//     icon: XCircle,
//     color: "text-status-error",
//     label: "Falha",
//   },
//   active: {
//     icon: Loader,
//     color: "text-status-info",
//     label: "Ativo",
//   },
//   waiting: {
//     icon: Clock,
//     color: "text-muted-foreground",
//     label: "Aguardando",
//   },
//   delayed: {
//     icon: Timer,
//     color: "text-status-warning",
//     label: "Agendado",
//   },
// };

// function timeAgo(timestamp: number) {
//   const diff = Date.now() - timestamp;
//   const seconds = Math.floor(diff / 1000);
//   if (seconds < 60) return "agora";
//   const minutes = Math.floor(seconds / 60);
//   if (minutes < 60) return `${minutes}m atrás`;
//   const hours = Math.floor(minutes / 60);
//   return `${hours}h atrás`;
// }
//
// function JobProgress({ progress }: { progress: number | object }) {
//   const value = typeof progress === "number" ? progress : 0;
//   if (value === 0) return null;
//
//   return (
//     <div className="flex items-center gap-2">
//       <span className="text-xs text-muted-foreground">Progresso</span>
//       <div className="w-24 h-1 rounded-full bg-secondary overflow-hidden">
//         <div
//           className="h-full rounded-full bg-primary transition-all"
//           style={{ width: `${value}%` }}
//         />
//       </div>
//       <span className="text-xs text-foreground font-medium">{value}%</span>
//     </div>
//   );
// }

// Mock de dados para exemplo

export function JobList() {
  return (
    <section>
      <List.Root>
        <List.Header title="Recent jobs">
          <div className="flex items-center gap-2">
            <QueueSelector />
            <JobStateSelector />
          </div>
        </List.Header>

        <List.Empty
          message="No queue selected"
          description="Select a queue to view jobs"
          icon={Layers}
        />

        <ListSkeleton />

        <List.Paginator
            page={1}
            totalPages={5}
            total={92}
            pageSize={20}
            onChange={(p) => console.log(p)}
        />

        {/*{mockJobs.map((job) => {*/}
        {/*  const config = statusConfig[job.status];*/}
        {/*  const Icon = config.icon;*/}
        {/*  const isExpanded = expandedId === job.id;*/}

        {/*  return (*/}
        {/*    <List.Item key={job.id}>*/}
        {/*      <div className="flex flex-col w-full gap-2">*/}
        {/*        <div className="flex items-center gap-3 w-full">*/}
        {/*          <Icon*/}
        {/*            className={cn(*/}
        {/*              "w-5 h-5 shrink-0",*/}
        {/*              config.color,*/}
        {/*              job.status === "active" && "animate-spin",*/}
        {/*            )}*/}
        {/*          />*/}

        {/*          <div className="flex items-center gap-2 flex-1 min-w-0">*/}
        {/*            <span className="text-sm font-medium text-foreground truncate">{job.name}</span>*/}
        {/*          </div>*/}

        {/*          <div className="flex items-center gap-3 shrink-0">*/}
        {/*            /!*<JobProgress progress={job.progress} />*!/*/}

        {/*            <span className="text-xs text-muted-foreground">{job.id}</span>*/}
        {/*            /!*<span className="text-xs text-muted-foreground">{timeAgo(job.timestamp)}</span>*!/*/}

        {/*            {job.status === "failed" && (*/}
        {/*              <button className="text-muted-foreground hover:text-foreground transition-colors">*/}
        {/*                <RotateCcw className="w-4 h-4" />*/}
        {/*              </button>*/}
        {/*            )}*/}

        {/*            <button className="text-muted-foreground hover:text-foreground transition-colors">*/}
        {/*              <MoreVertical className="w-4 h-4" />*/}
        {/*            </button>*/}

        {/*            <button*/}
        {/*              onClick={() => setExpandedId(isExpanded ? null : job.id)}*/}
        {/*              className="text-muted-foreground hover:text-foreground transition-colors"*/}
        {/*            >*/}
        {/*              <ChevronDown*/}
        {/*                className={cn("w-4 h-4 transition-transform", isExpanded && "rotate-180")}*/}
        {/*              />*/}
        {/*            </button>*/}
        {/*          </div>*/}
        {/*        </div>*/}
        {/*      </div>*/}
        {/*    </List.Item>*/}
        {/*  );*/}
        {/*})}*/}
      </List.Root>
    </section>
  );
}
