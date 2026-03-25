import { ApiClient } from "@/client";
import { useQuery } from "@tanstack/react-query";
import { HttpMethodEnum } from "@/enums/httpMethodEnum";
import type { BullhubJob } from "@/models/BullhubJob";
import { sleep } from "@/utils/sleep";

interface IUseJobProps {
  queueName: string;
  jobId: string;
}

export function useJob({ queueName, jobId }: IUseJobProps) {
  return useQuery<BullhubJob>({
    refetchInterval: 1000,
    enabled: !!queueName,
    queryKey: ["jobs", queueName, jobId],
    queryFn: async () => {
      await sleep(2000);

      const { data } = await ApiClient.request<BullhubJob>(
        HttpMethodEnum.GET,
        `queues/${queueName}/jobs/${jobId}`,
        undefined,
      );

      return data;
    },
  });
}
