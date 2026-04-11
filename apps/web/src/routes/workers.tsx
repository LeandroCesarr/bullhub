import { createFileRoute } from "@tanstack/react-router";
import { WorkersPage } from "@/components/sections/workersList";

export const Route = createFileRoute("/workers")({
  component: WorkersPage,
  head: () => ({
    meta: [{ title: "Bullhub | Workers" }],
  }),
  staticData: {
    title: "Workers",
  },
});
