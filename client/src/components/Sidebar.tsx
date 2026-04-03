import { useLocation } from "wouter";
import { useAuth } from "../hooks/use-auth";
import type { User } from "@shared/types";
import {
  LayoutDashboard,
  Boxes,
  Shield,
  Activity,
  Users,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  currentPath: string;
  user: User;
}

const NAV_ITEMS = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/modules", label: "Modules", icon: Boxes },
  { path: "/admin/health", label: "Health Monitor", icon: Activity },
  { path: "/admin/users", label: "Users", icon: Users },
  { path: "/admin/security", label: "Security", icon: Shield },
  { path: "/admin/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ currentPath, user }: SidebarProps) {
  const [, setLocation] = useLocation();
  const { logout } = useAuth();

  return (
    <aside className="flex w-64 flex-col border-r border-[hsl(var(--border))] bg-[hsl(var(--card))]">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-[hsl(var(--border))] px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--primary))] text-sm font-bold text-white">
          F
        </div>
        <div>
          <h1 className="text-sm font-semibold text-[hsl(var(--foreground))]">FinACEverse</h1>
          <p className="text-[10px] uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
            Command Center
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map((item) => {
          const isActive = currentPath === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => setLocation(item.path)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-[hsl(var(--primary))] text-white"
                  : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--foreground))]"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="flex-1 text-left">{item.label}</span>
              {isActive && <ChevronRight className="h-3 w-3" />}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-[hsl(var(--border))] p-3">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--secondary))] text-xs font-medium text-[hsl(var(--foreground))]">
            {user.displayName?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-[hsl(var(--foreground))]">
              {user.displayName}
            </p>
            <p className="truncate text-[10px] uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
              {user.role.replace("_", " ")}
            </p>
          </div>
          <button
            onClick={() => logout()}
            className="rounded p-1 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--foreground))]"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
