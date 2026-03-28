import { type FC, useEffect, useState } from "react";
import { useIsFetching } from "@tanstack/react-query";
import { cn } from "@/utils/css.ts";
import { Loader } from "lucide-react";

const MIN_DISPLAY_MS = 1500;

export const RefreshIndicator: FC = () => {
  const isFetching = useIsFetching();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isFetching) {
      setVisible(true);
      return;
    }

    const timer = setTimeout(() => setVisible(false), MIN_DISPLAY_MS);
    return () => clearTimeout(timer);
  }, [isFetching]);

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 flex items-center gap-2 px-3 py-2 rounded-full border border-border bg-card text-xs text-muted-foreground shadow-md",
        "transition-all duration-300",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none",
      )}
    >
      <Loader className="w-3 h-3 animate-spin" />
      Refreshing...
    </div>
  );
};
