import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: () => <div className="h-[1000px]">Home</div>,
  staticData: {
    title: "Dashboard",
  },
});
