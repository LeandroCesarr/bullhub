import type { FC, PropsWithChildren } from "react";
import { Sidebar } from "../Sidebar.tsx";
import { Header } from "../Header.tsx";

export const DefaultLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <main className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Header />
        {children}
      </main>
    </main>
  );
};
