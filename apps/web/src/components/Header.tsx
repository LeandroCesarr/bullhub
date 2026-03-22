import type { FC } from "react";
import { usePageTitle } from "../hooks/usePageTitle.ts";
import { Search } from "lucide-react";
import { Input } from "./Input.tsx";
import { RefreshSelect } from "./RefreshSelect.tsx";

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
          <div className="relative">
            <Input startIcon={Search} />
          </div>

          <div>
            <RefreshSelect />
          </div>

          {/*<Button*/}
          {/*    variant="outline"*/}
          {/*    size="sm"*/}
          {/*    onClick={handleRefresh}*/}
          {/*    disabled={isRefreshing}*/}
          {/*    className="gap-2"*/}
          {/*>*/}
          {/*  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}/>*/}
          {/*  Atualizar*/}
          {/*</Button>*/}
        </div>
      </div>
    </header>
  );
};
