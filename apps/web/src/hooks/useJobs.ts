import { ApiClient } from "@/client";
import { useQuery } from "@tanstack/react-query";
import { HttpMethodEnum } from "@/enums/httpMethodEnum";
import type { BullhubJob } from "@/models/BullhubJob";
import type { JobStateEnum } from "@/enums/jobStateEnum";
import type { PaginationResponse } from "@/types";
import { sleep } from "@/utils/sleep";

interface IUseJobsProps {
  queueName?: string;
  page?: number;
  state?: JobStateEnum;
}

export function useJobs({ queueName, ...props }: IUseJobsProps) {
  return useQuery<PaginationResponse<BullhubJob>>({
    refetchInterval: 1000,
    enabled: !!queueName,
    queryKey: ["jobs", queueName, { queueName, ...props }],
    queryFn: async () => {
      await sleep(2000);

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
