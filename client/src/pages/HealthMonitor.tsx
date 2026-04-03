import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../lib/utils";
import { MODULE_REGISTRY } from "@shared/types";
import type { ModuleHealth, ModuleSlug } from "@shared/types";
import { useState } from "react";
import {
  Activity,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Clock,
  Zap,
} from "lucide-react";

const STATUS_CONFIG = {
  healthy: { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/10", label: "Healthy" },
  degraded: { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-400/10", label: "Degraded" },
  down: { icon: XCircle, color: "text-red-400", bg: "bg-red-400/10", label: "Down" },
  unknown: { icon: HelpCircle, color: "text-gray-500", bg: "bg-gray-500/10", label: "Unknown" },
} as const;

export default function HealthMonitor() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const { data: healthData, isLoading, refetch, isFetching } = useQuery<ModuleHealth[]>({
    queryKey: ["module-health"],
    queryFn: () => apiRequest("/api/health/modules"),
    refetchInterval: 30_000,
  });

  const healthMap = new Map(healthData?.map((h) => [h.slug, h]) || []);

  const counts = {
    healthy: healthData?.filter((h) => h.status === "healthy").length ?? 0,
    degraded: healthData?.filter((h) => h.status === "degraded").length ?? 0,
    down: healthData?.filter((h) => h.status === "down").length ?? 0,
    unknown: healthData?.filter((h) => h.status === "unknown").length ?? 0,
  };

  const avgLatency = healthData?.length
    ? Math.round(
        healthData.reduce((sum, h) => sum + (h.latencyMs ?? 0), 0) /
          healthData.filter((h) => h.latencyMs !== null).length || 0
      )
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">Health Monitor</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            Real-time health status across all FinACEverse modules
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2 rounded-lg bg-[hsl(var(--secondary))] px-4 py-2 text-sm text-[hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))]/80 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          Check Now
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-5 gap-4">
        {(Object.entries(counts) as [keyof typeof STATUS_CONFIG, number][]).map(([status, count]) => {
          const cfg = STATUS_CONFIG[status];
          const Icon = cfg.icon;
          return (
            <div key={status} className={`rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4`}>
              <div className="flex items-center justify-between">
                <p className="text-xs text-[hsl(var(--muted-foreground))]">{cfg.label}</p>
                <Icon className={`h-4 w-4 ${cfg.color}`} />
              </div>
              <p className="mt-2 text-2xl font-bold text-[hsl(var(--foreground))]">{count}</p>
            </div>
          );
        })}
        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[hsl(var(--muted-foreground))]">Avg Latency</p>
            <Zap className="h-4 w-4 text-[hsl(var(--primary))]" />
          </div>
          <p className="mt-2 text-2xl font-bold text-[hsl(var(--foreground))]">{avgLatency}ms</p>
        </div>
      </div>

      {/* Module health grid */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {MODULE_REGISTRY.map((mod) => {
          const health = healthMap.get(mod.slug);
          const status = health?.status ?? "unknown";
          const cfg = STATUS_CONFIG[status];
          const Icon = cfg.icon;
          const isSelected = selectedSlug === mod.slug;

          return (
            <button
              key={mod.slug}
              onClick={() => setSelectedSlug(isSelected ? null : mod.slug)}
              className={`flex items-center gap-4 rounded-xl border p-4 text-left transition-all ${
                isSelected
                  ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/5"
                  : "border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:border-[hsl(var(--primary))]/50"
              }`}
            >
              {/* Status dot */}
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${cfg.bg}`}>
                <Icon className={`h-5 w-5 ${cfg.color}`} />
              </div>

              {/* Module info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[hsl(var(--foreground))]">{mod.name}</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">{mod.domain}</p>
              </div>

              {/* Latency */}
              <div className="text-right">
                <p className={`text-sm font-medium ${cfg.color}`}>{cfg.label}</p>
                {health?.latencyMs !== null && health?.latencyMs !== undefined ? (
                  <p className="flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))]">
                    <Clock className="h-3 w-3" />
                    {health.latencyMs}ms
                  </p>
                ) : (
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">—</p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected module detail */}
      {selectedSlug && (
        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
          <h3 className="mb-4 text-lg font-semibold text-[hsl(var(--foreground))]">
            {MODULE_REGISTRY.find((m) => m.slug === selectedSlug)?.name} — Details
          </h3>
          {(() => {
            const mod = MODULE_REGISTRY.find((m) => m.slug === selectedSlug);
            const health = healthMap.get(selectedSlug as ModuleSlug);
            return (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[hsl(var(--muted-foreground))]">Domain</p>
                  <p className="font-medium text-[hsl(var(--foreground))]">{mod?.domain}</p>
                </div>
                <div>
                  <p className="text-[hsl(var(--muted-foreground))]">Health Endpoint</p>
                  <p className="font-medium text-[hsl(var(--foreground))]">{mod?.healthEndpoint ?? "Not configured"}</p>
                </div>
                <div>
                  <p className="text-[hsl(var(--muted-foreground))]">Status</p>
                  <p className={`font-medium ${STATUS_CONFIG[health?.status ?? "unknown"].color}`}>
                    {STATUS_CONFIG[health?.status ?? "unknown"].label}
                  </p>
                </div>
                <div>
                  <p className="text-[hsl(var(--muted-foreground))]">Last Checked</p>
                  <p className="font-medium text-[hsl(var(--foreground))]">
                    {health?.lastChecked ? new Date(health.lastChecked).toLocaleString() : "Never"}
                  </p>
                </div>
                {health?.error && (
                  <div className="col-span-2">
                    <p className="text-[hsl(var(--muted-foreground))]">Error</p>
                    <p className="font-mono text-xs text-red-400 bg-red-400/10 rounded p-2 mt-1">{health.error}</p>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Activity className="h-8 w-8 animate-pulse text-[hsl(var(--primary))]" />
        </div>
      )}
    </div>
  );
}
