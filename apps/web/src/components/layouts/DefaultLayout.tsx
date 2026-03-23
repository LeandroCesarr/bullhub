import type { FC, PropsWithChildren } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

export const DefaultLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <main className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Header />
        <div className="p-6">{children}</div>
      </main>
    </main>
  );
};
