import { ApiClient } from "@/client";
import { useQuery } from "@tanstack/react-query";
import { HttpMethodEnum } from "@/enums/httpMethodEnum";
import type { BullhubJob } from "@/models/BullhubJob";
import type { JobStateEnum } from "@/enums/jobStateEnum";
import type { PaginationResponse } from "@/types";
import { useRefresh } from "@/hooks/useRefresh.ts";

interface IUseJobsProps {
  queueName?: string;
  page?: number;
  state?: JobStateEnum;
}

export function useJobs({ queueName, ...props }: IUseJobsProps) {
  const [refetchInterval] = useRefresh();

  return useQuery<PaginationResponse<BullhubJob>>({
    refetchInterval,
    enabled: !!queueName && !!props.state,
    queryKey: ["jobs", queueName, { queueName, ...props }],
    queryFn: async () => {
      const { data } = await ApiClient.request<PaginationResponse<BullhubJob>>(
        HttpMethodEnum.GET,
        `queues/${queueName}/jobs`,
        undefined,
        props,
      );
      return data;
    },
  });
}
