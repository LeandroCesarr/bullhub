import { ApiClient } from "@/client";
import { useQuery } from "@tanstack/react-query";
import { HttpMethodEnum } from "@/enums/httpMethodEnum";
import { useRefresh } from "@/hooks/useRefresh.ts";
import type { ActivityMetric } from "@/types";

export function useActivityMetrics() {
  const [refetchInterval] = useRefresh();

  return useQuery<ActivityMetric[]>({
    enabled: true,
    refetchInterval,
    queryKey: ["queue_metrics"],
    queryFn: async () => {
      const { data } = await ApiClient.request<ActivityMetric[]>(
        HttpMethodEnum.GET,
        "queues/metrics",
      );
      return data;
    },
  });
}
