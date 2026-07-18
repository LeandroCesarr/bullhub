import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "@/client";
import { HttpMethodEnum } from "@/enums/httpMethodEnum";
import { useAction } from "@/hooks/useAction";
import { useQueues } from "@/hooks/useQueues";
import type { BullhubQueue } from "@/models/BullhubQueue";

export function useQueue(queueName: string) {
  const queryClient = useQueryClient();
  const { data: queues, ...rest } = useQueues();

  const queue = queues?.find((q) => q.name === queueName) ?? null;

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["queues"] });
  }, [queryClient]);

  const pause = useAction(
    () => ApiClient.request(HttpMethodEnum.POST, `queues/${queueName}/pause`),
    { onSuccess: invalidate },
  );

  const resume = useAction(
    () => ApiClient.request(HttpMethodEnum.POST, `queues/${queueName}/resume`),
    { onSuccess: invalidate },
  );

  const drain = useAction(
    () => ApiClient.request(HttpMethodEnum.DELETE, `queues/${queueName}/drain`),
    { onSuccess: invalidate },
  );

  return { ...rest, data: queue as BullhubQueue | null, pause, resume, drain };
}
