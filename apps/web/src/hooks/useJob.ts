import { ApiClient } from "@/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { HttpMethodEnum } from "@/enums/httpMethodEnum";
import { BullhubJob, type JobActionType } from "@/models/BullhubJob";
import { sleep } from "@/utils/sleep";
import { useRefresh } from "@/hooks/useRefresh.ts";
import { useAction } from "@/hooks/useAction.ts";

interface IUseJobProps {
  queueName: string;
  jobId: string;
}

export function useJob({ queueName, jobId }: IUseJobProps) {
  const [refetchInterval] = useRefresh();
  const queryClient = useQueryClient();

  const queryKey = ["jobs", queueName, jobId] as const;

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey });
  }, [queryClient, queueName, jobId]);

  const query = useQuery<BullhubJob>({
    refetchInterval,
    enabled: !!queueName,
    queryKey,
    queryFn: async () => {
      await sleep(2000);
      const { data } = await ApiClient.request<BullhubJob>(
        HttpMethodEnum.GET,
        `queues/${queueName}/jobs/${jobId}`,
      );
      return BullhubJob.from(data);
    },
  });

  const can = useCallback(
    (action: JobActionType) => query.data?.can(action) ?? false,
    [query.data],
  );

  const retry = useAction(
    () => ApiClient.request(HttpMethodEnum.POST, `queues/${queueName}/jobs/${jobId}/retry`),
    { onSuccess: invalidate },
  );

  const promote = useAction(
    () => ApiClient.request(HttpMethodEnum.POST, `queues/${queueName}/jobs/${jobId}/promote`),
    { onSuccess: invalidate },
  );

  const cancel = useAction(
    () => ApiClient.request(HttpMethodEnum.DELETE, `queues/${queueName}/jobs/${jobId}`),
    { onSuccess: invalidate },
  );

  return { ...query, can, retry, promote, cancel };
}
