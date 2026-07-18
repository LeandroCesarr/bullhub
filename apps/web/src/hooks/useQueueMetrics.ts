import { useQuery } from "@tanstack/react-query";
import { ApiClient } from "@/client";
import { HttpMethodEnum } from "@/enums/httpMethodEnum";
import { useRefresh } from "@/hooks/useRefresh";
import type { ActivityMetric } from "@/types";

export function useQueueMetrics(queueName: string) {
  const [refetchInterval] = useRefresh();

  return useQuery<ActivityMetric[]>({
    queryKey: ["queues", queueName, "metrics"],
    refetchInterval,
    queryFn: async () => {
      const { data } = await ApiClient.request<ActivityMetric[]>(
        HttpMethodEnum.GET,
        `queues/${queueName}/metrics`,
      );
      return data;
    },
  });
}
