import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "@/router.tsx";
import "@/styles/globals.css";

createRoot(document.getElementById("root")!).render(<RouterProvider router={router} />);
