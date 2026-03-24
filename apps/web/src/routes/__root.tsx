import { Outlet, createRootRoute, HeadContent } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DefaultLayout } from "@/components/layouts/DefaultLayout";
import { Toaster } from "sonner";
import { Fragment } from "react";

const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: () => (
    <Fragment>
      <HeadContent />
      <QueryClientProvider client={queryClient}>
        <DefaultLayout>
          <Outlet />
          <TanStackRouterDevtools />
          <ReactQueryDevtools />
        </DefaultLayout>
        <Toaster
          position="bottom-right"
          toastOptions={{
            classNames: {
              toast: "!bg-popover border !border-border !text-muted-foreground rounded-lg text-sm",
              error: "border-l-2 !border-l-red-destructive",
              title: "!text-foreground font-medium",
            },
          }}
        />
      </QueryClientProvider>
    </Fragment>
  ),
});
