import { useCallback, useTransition } from "react";

interface UseActionOptions<TResult> {
  onSuccess?: (result: TResult) => void | Promise<void>;
  onError?: (error: Error) => void | Promise<void>;
}

export function useAction<TArgs extends unknown[], TResult>(
  action: (...args: TArgs) => Promise<TResult>,
  options?: UseActionOptions<TResult>,
) {
  const [isPending, startTransition] = useTransition();

  const execute = useCallback(
    (...args: TArgs) => {
      startTransition(async () => {
        try {
          const result = await action(...args);

          await options?.onSuccess?.(result);
        } catch (error) {
          await options?.onError?.(error as Error);
        }
      });
    },
    [action, options],
  );

  return {
    execute,
    isPending,
  };
}
