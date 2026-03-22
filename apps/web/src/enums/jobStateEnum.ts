import {
  AlertCircle,
  CheckCircle,
  Clock,
  GitBranch,
  HelpCircle,
  Loader,
  Timer,
  XCircle,
} from "lucide-react";

export enum JobStateEnum {
  ACTIVE = "active",
  WAITING = "waiting",
  COMPLETED = "completed",
  FAILED = "failed",
  DELAYED = "delayed",
  PRIORITIZED = "prioritized",
  WAITING_CHILDREN = "waiting-children",
  UNKNOWN = "unknown",
}

export const jobStateData = {
  [JobStateEnum.COMPLETED]: {
    icon: CheckCircle,
    color: "text-status-success",
    label: "Completed",
  },
  [JobStateEnum.FAILED]: {
    icon: XCircle,
    color: "text-status-error",
    label: "Failed",
  },
  [JobStateEnum.ACTIVE]: {
    icon: Loader,
    color: "text-status-info",
    label: "Active",
  },
  [JobStateEnum.WAITING]: {
    icon: Clock,
    color: "text-muted-foreground",
    label: "Waiting",
  },
  [JobStateEnum.DELAYED]: {
    icon: Timer,
    color: "text-status-warning",
    label: "Delayed",
  },
  [JobStateEnum.PRIORITIZED]: {
    icon: AlertCircle,
    color: "text-status-warning",
    label: "Prioritized",
  },
  [JobStateEnum.WAITING_CHILDREN]: {
    icon: GitBranch,
    color: "text-muted-foreground",
    label: "Waiting children",
  },
  [JobStateEnum.UNKNOWN]: {
    icon: HelpCircle,
    color: "text-muted-foreground",
    label: "Unknown",
  },
};
