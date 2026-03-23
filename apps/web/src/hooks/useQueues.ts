import { ApiClient } from "@/client";
import { useQuery } from "@tanstack/react-query";
import { HttpMethodEnum } from "@/enums/httpMethodEnum";
import type { BullhubQueue } from "@/models/BullhubQueue";

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
