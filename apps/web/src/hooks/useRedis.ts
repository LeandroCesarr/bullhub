import { ApiClient } from "@/client";
import { useQuery } from "@tanstack/react-query";
import { HttpMethodEnum } from "@/enums/httpMethodEnum";
import type { BullhubRedis } from "@/models/BullhubRedis.ts";
import {useRefresh} from "@/hooks/useRefresh.ts";

export function useRedis() {
  const [refetchInterval] = useRefresh()

  return useQuery<BullhubRedis>({
    enabled: true,
    refetchInterval,
    queryKey: ["redis"],
    queryFn: async () => {
      const { data } = await ApiClient.request<BullhubRedis>(HttpMethodEnum.GET, "redis");
      return data;
    },
  });
}
