"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react"; // ✅ Add this
import { ReactNode, useState } from "react";

export default function QueryProvider({ children }: { children: ReactNode }) {
  // Recommendation: Initialize QueryClient inside the component with useState
  // to avoid cache sharing issues in some Next.js environments.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 10,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        {" "}
        {/* ✅ Wrap children here */}
        {children}
      </SessionProvider>
    </QueryClientProvider>
  );
}
