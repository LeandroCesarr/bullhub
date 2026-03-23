import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DefaultLayout } from "@/components/layouts/DefaultLayout";

const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <DefaultLayout>
        <Outlet />
        <TanStackRouterDevtools />
        <ReactQueryDevtools />
      </DefaultLayout>
    </QueryClientProvider>
  ),
});
