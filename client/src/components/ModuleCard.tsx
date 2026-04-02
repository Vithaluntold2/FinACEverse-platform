import type { ModuleDefinition } from "@shared/types";
import {
  Workflow,
  Brain,
  Globe,
  Store,
  FileSearch,
  BarChart3,
  Calculator,
  ShieldCheck,
  BookOpen,
  GraduationCap,
  ExternalLink,
  Circle,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Workflow,
  Brain,
  Globe,
  Store,
  FileSearch,
  BarChart3,
  Calculator,
  ShieldCheck,
  BookOpen,
  GraduationCap,
};

const STATUS_COLORS = {
  live: "text-emerald-400",
  development: "text-amber-400",
  planned: "text-[hsl(var(--muted-foreground))]",
};

const STATUS_BG = {
  live: "bg-emerald-400/10 border-emerald-400/20",
  development: "bg-amber-400/10 border-amber-400/20",
  planned: "bg-[hsl(var(--muted))]/50 border-[hsl(var(--border))]",
};

interface ModuleCardProps {
  module: ModuleDefinition & {
    isEnabled?: boolean;
    apiBaseUrl?: string | null;
  };
  healthStatus?: "healthy" | "degraded" | "down" | "unknown";
  onConfigure?: () => void;
}

export default function ModuleCard({ module, healthStatus, onConfigure }: ModuleCardProps) {
  const Icon = ICON_MAP[module.icon] || Globe;

  const healthDot = {
    healthy: "fill-emerald-400 text-emerald-400",
    degraded: "fill-amber-400 text-amber-400",
    down: "fill-red-400 text-red-400",
    unknown: "fill-gray-500 text-gray-500",
  };

  return (
    <div
      className={`group relative rounded-xl border p-5 transition-all hover:shadow-lg ${STATUS_BG[module.status]}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${module.color}20`, color: module.color }}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-[hsl(var(--foreground))]">{module.name}</h3>
            <a
              href={`https://${module.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))]"
            >
              {module.domain}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Health indicator */}
        {module.status === "live" && (
          <Circle
            className={`h-3 w-3 ${healthDot[healthStatus || "unknown"]}`}
          />
        )}
      </div>

      {/* Description */}
      <p className="mt-3 text-sm text-[hsl(var(--muted-foreground))]">
        {module.description}
      </p>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between">
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${STATUS_COLORS[module.status]}`}
        >
          {module.status}
        </span>

        <div className="flex gap-2">
          <span className="rounded-full bg-[hsl(var(--secondary))] px-2 py-0.5 text-[10px] text-[hsl(var(--muted-foreground))]">
            {module.category}
          </span>
          {onConfigure && (
            <button
              onClick={onConfigure}
              className="rounded-full bg-[hsl(var(--primary))]/10 px-2 py-0.5 text-[10px] text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/20 transition-colors"
            >
              Configure
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
