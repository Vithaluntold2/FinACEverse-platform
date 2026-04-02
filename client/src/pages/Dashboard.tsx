import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../lib/utils";
import { MODULE_REGISTRY } from "@shared/types";
import type { ModuleHealth } from "@shared/types";
import ModuleCard from "../components/ModuleCard";
import {
  Boxes,
  Rocket,
  HeartPulse,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

export default function Dashboard() {
  const { data: healthData, isLoading: healthLoading, refetch } = useQuery<ModuleHealth[]>({
    queryKey: ["module-health"],
    queryFn: () => apiRequest("/api/health/modules"),
    refetchInterval: 60_000,
  });

  const healthMap = new Map(healthData?.map((h) => [h.slug, h]) || []);

  const totalModules = MODULE_REGISTRY.length;
  const liveModules = MODULE_REGISTRY.filter((m) => m.status === "live").length;
  const healthyCount = healthData?.filter((h) => h.status === "healthy").length ?? 0;
  const downCount = healthData?.filter((h) => h.status === "down").length ?? 0;

  const stats = [
    { label: "Total Modules", value: totalModules, icon: Boxes, color: "text-[hsl(var(--primary))]" },
    { label: "Live", value: liveModules, icon: Rocket, color: "text-emerald-400" },
    { label: "Healthy", value: healthyCount, icon: HeartPulse, color: "text-emerald-400" },
    { label: "Issues", value: downCount, icon: AlertTriangle, color: downCount > 0 ? "text-red-400" : "text-[hsl(var(--muted-foreground))]" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">Command Center</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            FinACEverse ecosystem overview — {totalModules} modules across {new Set(MODULE_REGISTRY.map((m) => m.category)).size} categories
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={healthLoading}
          className="flex items-center gap-2 rounded-lg bg-[hsl(var(--secondary))] px-4 py-2 text-sm text-[hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))]/80 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${healthLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs text-[hsl(var(--muted-foreground))]">{stat.label}</p>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <p className="mt-2 text-2xl font-bold text-[hsl(var(--foreground))]">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Module Grid */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-[hsl(var(--foreground))]">
          Ecosystem Modules
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {MODULE_REGISTRY.map((mod) => {
            const health = healthMap.get(mod.slug);
            return (
              <ModuleCard
                key={mod.slug}
                module={mod}
                healthStatus={health?.status}
              />
            );
          })}
        </div>
      </div>

      {/* Health Timeline (live modules) */}
      {healthData && healthData.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-[hsl(var(--foreground))]">
            Health Status
          </h2>
          <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[hsl(var(--border))]">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                    Module
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                    Latency
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                    Last Checked
                  </th>
                </tr>
              </thead>
              <tbody>
                {healthData.map((h) => {
                  const mod = MODULE_REGISTRY.find((m) => m.slug === h.slug);
                  const statusColor = {
                    healthy: "text-emerald-400",
                    degraded: "text-amber-400",
                    down: "text-red-400",
                    unknown: "text-gray-500",
                  }[h.status];
                  return (
                    <tr key={h.slug} className="border-b border-[hsl(var(--border))] last:border-0">
                      <td className="px-4 py-3 font-medium text-[hsl(var(--foreground))]">
                        {mod?.name || h.slug}
                      </td>
                      <td className={`px-4 py-3 font-medium uppercase text-xs ${statusColor}`}>
                        {h.status}
                      </td>
                      <td className="px-4 py-3 text-[hsl(var(--muted-foreground))]">
                        {h.latencyMs !== null ? `${h.latencyMs}ms` : "—"}
                      </td>
                      <td className="px-4 py-3 text-[hsl(var(--muted-foreground))]">
                        {new Date(h.lastChecked).toLocaleTimeString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
