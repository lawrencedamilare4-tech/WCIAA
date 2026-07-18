import { useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query';

interface OptimisticMutationOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  queryKey: QueryKey;
  optimisticUpdate: (oldData: TData | undefined, variables: TVariables) => TData | undefined;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: Error, variables: TVariables, context?: any) => void;
}

export function useOptimisticMutation<TData = unknown, TVariables = unknown>({
  mutationFn,
  queryKey,
  optimisticUpdate,
  onSuccess,
  onError,
}: OptimisticMutationOptions<TData, TVariables>) {
  const queryClient = useQueryClient();

  return useMutation<TData, Error, TVariables>({
    mutationFn,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData<TData>(queryKey);
      queryClient.setQueryData<TData | undefined>(queryKey, (old) => optimisticUpdate(old, variables));
      return { previousData };
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      onError?.(err, variables, context);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey });
      onSuccess?.(data, variables);
    },
  });
}