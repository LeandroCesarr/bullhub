import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "@/router.tsx";
import { Splashscreen } from "@/components/Splashscreen";
import { useState, useEffect, Fragment } from "react";
// oxlint-disable-next-line import/no-unassigned-import
import "@/styles/globals.css";

const SPLASH_DURATION = 2200;

function App() {
  const [splash, setSplash] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setSplash(false), SPLASH_DURATION);
    return () => clearTimeout(t);
  }, []);

  return (
    <Fragment>
      {splash && <Splashscreen />}
      <RouterProvider router={router} />
    </Fragment>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
