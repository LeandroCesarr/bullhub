import { Outlet, createRootRoute } from "@tanstack/react-router";
import { DefaultLayout } from "../components/layouts/DefaultLayout.tsx";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: () => (
    <DefaultLayout>
      <Outlet />
      <TanStackRouterDevtools />
    </DefaultLayout>
  ),
});
