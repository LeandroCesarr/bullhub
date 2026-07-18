import { useQuery } from "@tanstack/react-query";
import { ApiClient } from "@/client";
import { HttpMethodEnum } from "@/enums/httpMethodEnum";
import { useRefresh } from "@/hooks/useRefresh";
import type { BullhubWorker } from "@/models/BullhubWorker";

export function useQueueWorkers(queueName: string) {
  const [refetchInterval] = useRefresh();

  return useQuery<BullhubWorker[]>({
    queryKey: ["queues", queueName, "workers"],
    refetchInterval,
    queryFn: async () => {
      const { data } = await ApiClient.request<BullhubWorker[]>(
        HttpMethodEnum.GET,
        `queues/${queueName}/workers`,
      );
      return data;
    },
  });
}
