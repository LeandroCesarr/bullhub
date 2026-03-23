import type { FC } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/Input";
import { usePageTitle } from "@/hooks/usePageTitle";
import { RefreshSelect } from "@/components/RefreshSelect";

export const Header: FC = () => {
  const title = usePageTitle();
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">BullMQ Dashboard • {currentDate}</p>
        </div>

        <div className="flex items-center gap-3">
          <Input startIcon={Search} />
          <RefreshSelect />
        </div>
      </div>
    </header>
  );
};
