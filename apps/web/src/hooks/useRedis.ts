import { ApiClient } from "@/client";
import { useQuery } from "@tanstack/react-query";
import { HttpMethodEnum } from "@/enums/httpMethodEnum";
import type { BullhubRedis } from "@/models/BullhubRedis.ts";

export function useRedis() {
  return useQuery<BullhubRedis>({
    enabled: true,
    refetchInterval: 1000,
    queryKey: ["redis"],
    queryFn: async () => {
      const { data } = await ApiClient.request<BullhubRedis>(HttpMethodEnum.GET, "redis");
      return data;
    },
  });
}
