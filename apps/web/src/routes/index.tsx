import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: () => <div className="h-250">Home</div>,
  staticData: {
    title: "Dashboard",
  },
});
