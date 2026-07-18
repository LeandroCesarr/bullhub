import { useAtom } from "jotai";
import { cn } from "@/utils/css";
import { queueTabAtom, type QueueTab } from "../atoms";
import type { FC } from "react";

const tabs: { id: QueueTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "workers", label: "Workers" },
  { id: "jobs", label: "Jobs" },
];

export const QueueTabs: FC = () => {
  const [activeTab, setActiveTab] = useAtom(queueTabAtom);

  return (
    <div className="flex gap-1 border-b border-border">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={cn(
            "px-4 py-2 text-xs font-medium transition-colors border-b-2 -mb-px",
            activeTab === tab.id
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
