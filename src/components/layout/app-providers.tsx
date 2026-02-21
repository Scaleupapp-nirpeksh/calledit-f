"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { SocketProvider } from "./socket-provider";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { OfflineIndicator } from "@/components/shared/offline-indicator";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <SocketProvider>
          <OfflineIndicator />
          {children}
        </SocketProvider>
      </ErrorBoundary>
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );
}
