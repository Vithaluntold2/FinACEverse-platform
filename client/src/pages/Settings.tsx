import { MODULE_REGISTRY } from "@shared/types";
import {
  Settings as SettingsIcon,
  Database,
  Globe,
  Server,
  Info,
} from "lucide-react";

export default function SettingsPage() {
  const dbConnected = false; // dev mode — no DB
  const envMode = "development";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">Settings</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          System configuration and environment overview
        </p>
      </div>

      {/* Environment */}
      <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Server className="h-5 w-5 text-[hsl(var(--primary))]" />
          <h2 className="font-semibold text-[hsl(var(--foreground))]">Environment</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-[hsl(var(--muted-foreground))]">Mode</p>
            <span className="inline-block rounded-full bg-amber-400/10 px-2.5 py-0.5 text-xs font-medium text-amber-400">
              {envMode}
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-[hsl(var(--muted-foreground))]">Database</p>
            <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${dbConnected ? "bg-emerald-400/10 text-emerald-400" : "bg-gray-500/10 text-gray-400"}`}>
              {dbConnected ? "PostgreSQL connected" : "In-memory (dev)"}
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-[hsl(var(--muted-foreground))]">Server</p>
            <p className="text-[hsl(var(--foreground))]">Express — port 5000</p>
          </div>
          <div className="space-y-1">
            <p className="text-[hsl(var(--muted-foreground))]">Frontend</p>
            <p className="text-[hsl(var(--foreground))]">React 19 + Vite HMR</p>
          </div>
        </div>
      </div>

      {/* Module Registry Overview */}
      <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-[hsl(var(--primary))]" />
          <h2 className="font-semibold text-[hsl(var(--foreground))]">
            Module Registry ({MODULE_REGISTRY.length} modules)
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {MODULE_REGISTRY.map((mod) => (
            <div key={mod.slug} className="flex items-center justify-between rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--secondary))] px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{mod.icon}</span>
                <div>
                  <p className="text-sm font-medium text-[hsl(var(--foreground))]">{mod.name}</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">{mod.domain}</p>
                </div>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                mod.status === "live"
                  ? "bg-emerald-400/10 text-emerald-400"
                  : mod.status === "development"
                  ? "bg-blue-400/10 text-blue-400"
                  : "bg-gray-500/10 text-gray-400"
              }`}>
                {mod.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Session & Auth Config */}
      <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-[hsl(var(--primary))]" />
          <h2 className="font-semibold text-[hsl(var(--foreground))]">Session Configuration</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-[hsl(var(--muted-foreground))]">Store</p>
            <p className="text-[hsl(var(--foreground))]">MemoryStore</p>
          </div>
          <div className="space-y-1">
            <p className="text-[hsl(var(--muted-foreground))]">Max Age</p>
            <p className="text-[hsl(var(--foreground))]">24 hours</p>
          </div>
          <div className="space-y-1">
            <p className="text-[hsl(var(--muted-foreground))]">Secure Cookies</p>
            <p className="text-[hsl(var(--foreground))]">Off (dev) / On (prod)</p>
          </div>
          <div className="space-y-1">
            <p className="text-[hsl(var(--muted-foreground))]">Password Hashing</p>
            <p className="text-[hsl(var(--foreground))]">bcrypt (12 rounds)</p>
          </div>
        </div>
      </div>

      {/* Dev mode notice */}
      <div className="flex items-start gap-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--secondary))] p-4">
        <Info className="mt-0.5 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
        <div className="text-sm text-[hsl(var(--muted-foreground))]">
          <p className="font-medium text-[hsl(var(--foreground))]">Development Mode</p>
          <p className="mt-1">
            Running with in-memory storage. Data resets on server restart.
            Connect a PostgreSQL database via <code className="rounded bg-black/30 px-1 py-0.5 text-xs">DATABASE_URL</code> for persistent storage.
          </p>
          <p className="mt-1">Dev credentials: <code className="rounded bg-black/30 px-1 py-0.5 text-xs">admin / admin123</code></p>
        </div>
      </div>
    </div>
  );
}
