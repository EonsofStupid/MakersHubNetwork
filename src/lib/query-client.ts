import { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
      meta: {
        errorMessage: "Failed to fetch data",
      },
    },
    mutations: {
      retry: 1,
      meta: {
        successMessage: "Operation completed successfully",
        errorMessage: "Operation failed",
      },
      onError: (error: Error, variables: unknown, context: unknown) => {
        const meta = (context as any)?.meta;
        console.error('Mutation error:', error);
        toast.error(
          meta?.errorMessage || "An error occurred",
          {
            description: error.message
          }
        );
        return { error, variables, context };
      },
      onSuccess: (data: unknown, variables: unknown, context: unknown) => {
        const meta = (context as any)?.meta;
        if (meta?.successMessage) {
          toast.success(meta.successMessage);
        }
        return { data, variables, context };
      },
    },
  },
});