import { ApiClient } from "@/client";
import { useQuery } from "@tanstack/react-query";
import { HttpMethodEnum } from "@/enums/httpMethodEnum";
import type { BullhubQueue } from "@/models/BullhubQueue";
import { useRefresh } from "@/hooks/useRefresh.ts";

export function useQueues() {
  const [refetchInterval] = useRefresh();

  return useQuery<BullhubQueue[]>({
    enabled: true,
    queryKey: ["queues"],
    refetchInterval,
    queryFn: async () => {
      const { data } = await ApiClient.request<BullhubQueue[]>(HttpMethodEnum.GET, "queues");
      return data;
    },
  });
}
