import { useAtomValue } from "jotai";
import { Route } from "@/routes/queues/$queueName";
import { queueTabAtom } from "./atoms";
import { QueueHeader } from "./components/QueueHeader";
import { QueueTabs } from "./components/QueueTabs";
import { OverviewTab } from "./components/OverviewTab";
import { WorkersTab } from "./components/WorkersTab";
import { JobsTab } from "./components/JobsTab";

export function QueueDetailPage() {
  const { queueName } = Route.useParams();
  const activeTab = useAtomValue(queueTabAtom);

  return (
    <div className="p-6 bg-background text-foreground font-mono flex flex-col gap-6">
      <QueueHeader queueName={queueName} />
      <QueueTabs />
      {activeTab === "overview" && <OverviewTab queueName={queueName} />}
      {activeTab === "workers" && <WorkersTab queueName={queueName} />}
      {activeTab === "jobs" && <JobsTab queueName={queueName} />}
    </div>
  );
}
