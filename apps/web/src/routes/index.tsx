import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/components/sections/Dashboard";

export const Route = createFileRoute("/")({
  component: Dashboard,
  head: () => ({
    meta: [{ title: "Bullhub | Dashboard" }],
  }),
  staticData: {
    title: "Dashboard",
  },
});
