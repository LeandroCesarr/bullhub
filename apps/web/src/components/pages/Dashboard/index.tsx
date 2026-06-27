import { useEffect, useState } from "react";
import { JobStateEnum } from "@/enums/jobStateEnum.ts";
import { RedisInfo } from "@/components/RedisInfo.tsx";
import { QueuesList } from "@/components/sections/queuesList";
import { ActivityMetricsChart } from "@/components/sections/activityMetricsChart";
import { useQueues } from "@/hooks/useQueues.ts";
import { JobsList, type JobsListSearchProps } from "@/components/sections/jobsList";

// ─── mock data ────────────────────────────────────────────────────────────────

// const statusDot: Record<string, string> = {
//   completed: "bg-status-success",
//   failed: "bg-status-error",
//   active: "bg-status-info shadow-[0_0_5px] shadow-status-info/60",
//   waiting: "bg-status-warning",
//   delayed: "bg-status-pending",
// };

// ─── overview card ────────────────────────────────────────────────────────────

// type OverviewItemProps = {
//   icon: React.ReactNode;
//   value: string;
//   label: string;
//   variant: "purple" | "green" | "blue" | "amber";
// };
//
// const overviewVariants = {
//   purple: "bg-[oklch(0.22_0.06_280)] border-status-pending/20",
//   green: "bg-[oklch(0.19_0.05_145)] border-status-success/20",
//   blue: "bg-[oklch(0.19_0.04_220)] border-status-info/20",
//   amber: "bg-[oklch(0.19_0.05_85)] border-status-warning/20",
// };

// function OverviewItem({ icon, value, label, variant }: OverviewItemProps) {
//   return (
//     <div className={`rounded-md border p-4 flex flex-col gap-2 ${overviewVariants[variant]}`}>
//       <div className="opacity-70">{icon}</div>
//       <div className="text-xl font-semibold text-foreground tracking-tight">{value}</div>
//       <div className="text-xs text-muted-foreground">{label}</div>
//     </div>
//   );
// }

// function OverviewCard() {
//   return (
//     <div className="bg-card border border-border rounded-radius-md p-5">
//       <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">overview</p>
//       <div className="grid grid-cols-2 gap-2">
//         <OverviewItem
//           icon={<Users size={18} className="text-status-pending" />}
//           value="5"
//           label="workers online"
//           variant="purple"
//         />
//         <OverviewItem
//           icon={<TrendingUp size={18} className="text-status-success" />}
//           value="245"
//           label="jobs/hour"
//           variant="green"
//         />
//         <OverviewItem
//           icon={<Clock size={18} className="text-status-info" />}
//           value="51"
//           label="delayed"
//           variant="blue"
//         />
//         <OverviewItem
//           icon={<Activity size={18} className="text-status-warning" />}
//           value="5.7k"
//           label="total processed"
//           variant="amber"
//         />
//       </div>
//     </div>
//   );
// }

// ─── stat cards ───────────────────────────────────────────────────────────────

// type StatCardProps = {
//   icon: React.ReactNode;
//   value: string;
//   label: string;
//   change?: string;
//   variant: "success" | "error" | "info" | "warning";
// };
//
// const statVariants = {
//   success: "bg-[oklch(0.16_0.04_145)] border-status-success/20 text-status-success",
//   error: "bg-[oklch(0.16_0.04_25)] border-status-error/20 text-status-error",
//   info: "bg-[oklch(0.16_0.03_220)] border-status-info/20 text-status-info",
//   warning: "bg-[oklch(0.16_0.04_85)] border-status-warning/20 text-status-warning",
// };

// function StatCard({ icon, value, label, change, variant }: StatCardProps) {
//   return (
//     <div
//       className={`rounded-radius-md border p-5 flex flex-col gap-3 min-h-[120px] ${statVariants[variant]}`}
//     >
//       <div className="flex items-start justify-between">
//         <div className="opacity-80">{icon}</div>
//         {change && <span className="text-xs font-medium">{change}</span>}
//       </div>
//       <div>
//         <div className="text-3xl font-semibold text-foreground tracking-tight">{value}</div>
//         <div className="text-xs text-muted-foreground mt-1">{label}</div>
//       </div>
//     </div>
//   );
// }

// function StatCards() {
//   return (
//     <div className="grid grid-cols-4 gap-4">
//       <StatCard
//         icon={<CheckCircle size={18} />}
//         value="5.716"
//         label="completed"
//         change="+12%"
//         variant="success"
//       />
//       <StatCard
//         icon={<XCircle size={18} />}
//         value="78"
//         label="failed"
//         change="-4%"
//         variant="error"
//       />
//       <StatCard
//         icon={<RotateCcw size={18} />}
//         value="20"
//         label="active"
//         change="now"
//         variant="info"
//       />
//       <StatCard
//         icon={<Clock size={18} />}
//         value="177"
//         label="waiting"
//         change="queued"
//         variant="warning"
//       />
//     </div>
//   );
// }

// ─── recent jobs card ─────────────────────────────────────────────────────────

function RecentJobsCard() {
  const { data } = useQueues();
  const [activeQueue, setActiveQueue] = useState("");
  const [activeTab, setActiveTab] = useState<JobStateEnum>(JobStateEnum.ACTIVE);

  function handleSearchChange(search: JobsListSearchProps) {
    setActiveQueue(search.queueName ?? "");
    setActiveTab(search.state);
  }

  useEffect(() => {
    if (data && !activeQueue) {
      setActiveQueue(data[0].name);
    }
  }, [data]);

  return (
    <JobsList
      className="col-span-3"
      search={{
        state: activeTab,
        queueName: activeQueue,
      }}
      onChange={handleSearchChange}
    />
  );
}

// ─── dashboard page ───────────────────────────────────────────────────────────

export function Dashboard() {
  return (
    <div className="p-6 bg-background text-foreground font-mono flex flex-col gap-4">
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-3 flex items-stretch justify-stretch min-h-96">
          <ActivityMetricsChart />
        </div>
        {/*<OverviewCard />*/}
        <RedisInfo />
      </div>

      {/*<StatCards />*/}

      <div className="grid grid-cols-4 gap-4 items-stretch justify-stretch">
        <RecentJobsCard />

        <QueuesList />
      </div>
    </div>
  );
}
