import { ApiClient } from "@/client";
import { useQuery } from "@tanstack/react-query";
import { HttpMethodEnum } from "@/enums/httpMethodEnum";
import { useRefresh } from "@/hooks/useRefresh.ts";
import type {BullhubWorker} from "@/models/BullhubWorker.ts";

export function useWorkers() {
  const [refetchInterval] = useRefresh();

  return useQuery<BullhubWorker[]>({
    enabled: true,
    queryKey: ["workers"],
    refetchInterval,
    queryFn: async () => {
      const { data } = await ApiClient.request<BullhubWorker[]>(HttpMethodEnum.GET, "workers");
      return data;
    },
  });
}
