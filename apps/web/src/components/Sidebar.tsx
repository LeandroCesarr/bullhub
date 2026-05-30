import { LayoutDashboard, ListTodo, type LucideIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { FC } from "react";
import Logo from '@/assets/logo.svg'

const items = [
  { id: "dashboard", href: "/", icon: LayoutDashboard, label: "Dashboard" },
  // { id: "queues", href: "/queues", icon: Layers, label: "Queues" },
  { id: "jobs", href: "/jobs", icon: ListTodo, label: "Jobs" },
  // { id: "scheduled", href: "/scheduled", icon: Clock, label: "Scheduled" },
  // { id: "workers", href: "/workers", icon: Users, label: "Workers" },
];

interface ISidebarProps {
  data: {
    id: string;
    label: string;
    icon: LucideIcon;
    href: string;
  };
}

const SidebarItem: FC<ISidebarProps> = ({ data }) => {
  const { id, label, icon: Icon } = data;

  return (
    <Link
      key={id}
      to={data.href}
      className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 group relative"
      activeProps={{
        className: "bg-primary text-primary-foreground",
      }}
      inactiveProps={{
        className: "text-muted-foreground hover:bg-secondary hover:text-foreground",
      }}
      title={label}
    >
      <Icon className="w-5 h-5" />
      <span className="absolute left-full ml-3 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
        {label}
      </span>
    </Link>
  );
};

export function Sidebar() {
  return (
    <aside className="px-4 py-6 bg-card flex flex-col items-center gap-2 border-r border-border">
      <div className="mb-8">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 group relative bg-primary">
          <span className="text-primary-foreground font-bold text-lg">
            <img src={Logo} className="w-7 h-7" alt="Bullhub"  />
          </span>
        </div>
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        {items.map((item) => (
          <SidebarItem key={item.id} data={item} />
        ))}
      </nav>

      <button
        className="w-12 h-12 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-200"
        title="Configurações"
      >
        {/*<Settings className="w-5 h-5" />*/}
      </button>
    </aside>
  );
}
