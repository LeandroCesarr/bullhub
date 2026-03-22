import { useQuery } from "@tanstack/react-query";
import { ApiClient } from "../client";
import { HttpMethodEnum } from "../enums/httpMethodEnum.ts";
import type { BullhubQueue } from "../models/BullhubQueue.ts";

export function useQueues() {
  return useQuery<BullhubQueue[]>({
    enabled: true,
    queryKey: ["queues"],
    queryFn: async () => {
      const { data } = await ApiClient.request<BullhubQueue[]>(HttpMethodEnum.GET, "queues");
      return data;
    },
  });
}
