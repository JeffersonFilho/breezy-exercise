import { QueryClient } from '@tanstack/react-query';
import { ApiError } from './api-client';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 30_000,
    },
    mutations: {
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.statusCode === 409) return false;
        if ((error as any)?.name === 'AbortError') return false;
        return failureCount < 2;
      },
    },
  },
});
