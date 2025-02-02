import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      throwOnError: true,
      meta: {
        errorMessage: 'Failed to fetch data'
      }
    },
    mutations: {
      retry: 1,
      meta: {
        successMessage: 'Operation completed successfully',
        errorMessage: 'Operation failed'
      },
      onError: (error: Error) => {
        console.error('Mutation error:', error);
        toast.error('Operation failed', {
          description: error.message,
          duration: 5000,
        });
      },
    },
  },
});

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};