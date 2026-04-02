import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../lib/utils";
import { MODULE_REGISTRY } from "@shared/types";
import type { ModuleHealth } from "@shared/types";
import ModuleCard from "../components/ModuleCard";
import { useState } from "react";
import { Search, Filter } from "lucide-react";

type CategoryFilter = "all" | "ai" | "compliance" | "finance" | "platform" | "learning";
type StatusFilter = "all" | "live" | "development" | "planned";

export default function Modules() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("all");

  const { data: healthData } = useQuery<ModuleHealth[]>({
    queryKey: ["module-health"],
    queryFn: () => apiRequest("/api/health/modules"),
    refetchInterval: 60_000,
  });

  const healthMap = new Map(healthData?.map((h) => [h.slug, h]) || []);

  const filtered = MODULE_REGISTRY.filter((mod) => {
    if (search && !mod.name.toLowerCase().includes(search.toLowerCase()) && !mod.domain.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (category !== "all" && mod.category !== category) return false;
    if (status !== "all" && mod.status !== status) return false;
    return true;
  });

  const categories: CategoryFilter[] = ["all", "ai", "compliance", "finance", "platform", "learning"];
  const statuses: StatusFilter[] = ["all", "live", "development", "planned"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">Modules</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          Manage and configure all FinACEverse ecosystem modules
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search modules..."
            className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--input))] py-2 pl-10 pr-4 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--primary))] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          <div className="flex rounded-lg border border-[hsl(var(--border))] overflow-hidden">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-1.5 text-xs capitalize transition-colors ${
                  category === c
                    ? "bg-[hsl(var(--primary))] text-white"
                    : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--secondary))]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="flex rounded-lg border border-[hsl(var(--border))] overflow-hidden">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3 py-1.5 text-xs capitalize transition-colors ${
                status === s
                  ? "bg-[hsl(var(--primary))] text-white"
                  : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--secondary))]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <p className="text-xs text-[hsl(var(--muted-foreground))]">
        Showing {filtered.length} of {MODULE_REGISTRY.length} modules
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((mod) => {
          const health = healthMap.get(mod.slug);
          return (
            <ModuleCard
              key={mod.slug}
              module={mod}
              healthStatus={health?.status}
              onConfigure={() => {
                // TODO: open config dialog
              }}
            />
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-[hsl(var(--border))]">
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            No modules match your filters
          </p>
        </div>
      )}
    </div>
  );
}
