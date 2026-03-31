import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/redux/store";
import { routeTree } from "./routeTree.gen";
import { ToastProvider } from "@/components/ui/Toast";
import ErrorBoundary from "@/components/error/ErrorBoundary";
import { QUERY_CONFIG } from "@/constants/queryConfig";
import "@/i18n";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_CONFIG.STALE_TIME,
      gcTime: QUERY_CONFIG.GC_TIME,
      retry: QUERY_CONFIG.RETRY,
    },
  },
});

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ReduxProvider store={store}>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <RouterProvider router={router} />
          </ToastProvider>
        </QueryClientProvider>
      </ReduxProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
