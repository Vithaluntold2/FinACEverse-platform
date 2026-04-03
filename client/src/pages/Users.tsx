import { useAuth } from "../hooks/use-auth";
import {
  Users as UsersIcon,
  UserPlus,
  Shield,
  Clock,
} from "lucide-react";

export default function UsersPage() {
  const { user } = useAuth();

  // In dev mode with in-memory storage, we show the current user
  const currentUsers = user ? [user] : [];

  const ROLE_COLORS: Record<string, string> = {
    founder: "bg-red-400/10 text-red-400",
    financial_admin: "bg-amber-400/10 text-amber-400",
    technical_admin: "bg-blue-400/10 text-blue-400",
    security_admin: "bg-emerald-400/10 text-emerald-400",
    support_admin: "bg-purple-400/10 text-purple-400",
    team_member: "bg-gray-500/10 text-gray-400",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">Users</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            Manage Command Center administrators and team members
          </p>
        </div>
        {(user?.role === "founder" || user?.role === "technical_admin") && (
          <button className="flex items-center gap-2 rounded-lg bg-[hsl(var(--primary))] px-4 py-2 text-sm text-white hover:bg-[hsl(var(--primary))]/90 transition-colors">
            <UserPlus className="h-4 w-4" />
            Invite User
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[hsl(var(--muted-foreground))]">Total Users</p>
            <UsersIcon className="h-4 w-4 text-[hsl(var(--primary))]" />
          </div>
          <p className="mt-2 text-2xl font-bold text-[hsl(var(--foreground))]">{currentUsers.length}</p>
        </div>
        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[hsl(var(--muted-foreground))]">Admins</p>
            <Shield className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-[hsl(var(--foreground))]">
            {currentUsers.filter((u) => u.role !== "team_member").length}
          </p>
        </div>
        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[hsl(var(--muted-foreground))]">Active Sessions</p>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-[hsl(var(--foreground))]">1</p>
        </div>
      </div>

      {/* User table */}
      <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden">
        <div className="border-b border-[hsl(var(--border))] px-4 py-3">
          <h2 className="font-semibold text-[hsl(var(--foreground))]">All Users</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[hsl(var(--border))]">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[hsl(var(--muted-foreground))]">User</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Role</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((u) => (
              <tr key={u.id} className="border-b border-[hsl(var(--border))] last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--secondary))] text-xs font-medium text-[hsl(var(--foreground))]">
                      {u.displayName?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="font-medium text-[hsl(var(--foreground))]">{u.displayName}</p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">@{u.username}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-[hsl(var(--muted-foreground))]">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ROLE_COLORS[u.role] || "bg-gray-500/10 text-gray-400"}`}>
                    {u.role.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
                    Active
                  </span>
                </td>
              </tr>
            ))}
            {currentUsers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-[hsl(var(--muted-foreground))]">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
