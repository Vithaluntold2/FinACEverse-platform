import { MODULE_REGISTRY } from "@shared/types";
import {
  Shield,
  Lock,
  Eye,
  Server,
  Globe,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";

const SECURITY_LAYERS = [
  { name: "Edge Protection", desc: "CDN + WAF + DDoS mitigation", status: "active" },
  { name: "API Gateway", desc: "Rate limiting, JWT validation, request routing", status: "active" },
  { name: "Authentication", desc: "Session-based auth with bcrypt + role hierarchy", status: "active" },
  { name: "Authorization", desc: "Role-based access control (RBAC) — 6 role levels", status: "active" },
  { name: "Input Validation", desc: "Zod schemas, parameterized queries, XSS prevention", status: "active" },
  { name: "Encryption", desc: "AES-256-GCM at rest, TLS 1.3 in transit", status: "planned" },
  { name: "Audit Logging", desc: "Immutable trail for all admin actions", status: "active" },
  { name: "Tenant Isolation", desc: "Database-level multi-tenant separation", status: "planned" },
  { name: "Key Management", desc: "Azure Key Vault HSM (FIPS 140-2 Level 2)", status: "planned" },
  { name: "Anomaly Detection", desc: "Statistical monitoring + impossible travel detection", status: "planned" },
] as const;

const ROLE_HIERARCHY = [
  { role: "Founder", level: 0, perms: "Full system access, security config, approve L1 admins", color: "text-red-400" },
  { role: "Financial Admin", level: 1, perms: "Billing, subscriptions, refunds", color: "text-amber-400" },
  { role: "Technical Admin", level: 1, perms: "Deployments, feature flags, module config", color: "text-blue-400" },
  { role: "Security Admin", level: 1, perms: "Threat monitoring, incident response", color: "text-emerald-400" },
  { role: "Support Admin", level: 1, perms: "Tickets, customer communication", color: "text-purple-400" },
  { role: "Team Member", level: 2, perms: "View-only access to assigned modules", color: "text-gray-400" },
];

export default function Security() {
  const liveModules = MODULE_REGISTRY.filter((m) => m.status === "live").length;
  const activeLayers = SECURITY_LAYERS.filter((l) => l.status === "active").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">Security</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          Security posture, role hierarchy, and compliance status for the FinACEverse ecosystem
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[hsl(var(--muted-foreground))]">Security Layers</p>
            <Shield className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-[hsl(var(--foreground))]">{activeLayers}/{SECURITY_LAYERS.length}</p>
          <p className="text-xs text-emerald-400">Active</p>
        </div>
        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[hsl(var(--muted-foreground))]">Protected Modules</p>
            <Server className="h-4 w-4 text-[hsl(var(--primary))]" />
          </div>
          <p className="mt-2 text-2xl font-bold text-[hsl(var(--foreground))]">{liveModules}</p>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">of {MODULE_REGISTRY.length} total</p>
        </div>
        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[hsl(var(--muted-foreground))]">Auth Method</p>
            <Lock className="h-4 w-4 text-amber-400" />
          </div>
          <p className="mt-2 text-lg font-bold text-[hsl(var(--foreground))]">Session + RBAC</p>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">bcrypt / 12 rounds</p>
        </div>
        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[hsl(var(--muted-foreground))]">Domains Covered</p>
            <Globe className="h-4 w-4 text-purple-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-[hsl(var(--foreground))]">10</p>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">.io domains</p>
        </div>
      </div>

      {/* Security layers */}
      <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden">
        <div className="border-b border-[hsl(var(--border))] px-4 py-3">
          <h2 className="font-semibold text-[hsl(var(--foreground))]">Defense Layers</h2>
        </div>
        <div className="divide-y divide-[hsl(var(--border))]">
          {SECURITY_LAYERS.map((layer, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                layer.status === "active" ? "bg-emerald-400/10" : "bg-gray-500/10"
              }`}>
                {layer.status === "active" ? (
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[hsl(var(--foreground))]">{layer.name}</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">{layer.desc}</p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                layer.status === "active"
                  ? "bg-emerald-400/10 text-emerald-400"
                  : "bg-gray-500/10 text-gray-500"
              }`}>
                {layer.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Role hierarchy */}
      <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden">
        <div className="border-b border-[hsl(var(--border))] px-4 py-3">
          <h2 className="font-semibold text-[hsl(var(--foreground))]">Role Hierarchy</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[hsl(var(--border))]">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Role</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Level</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Permissions</th>
            </tr>
          </thead>
          <tbody>
            {ROLE_HIERARCHY.map((r) => (
              <tr key={r.role} className="border-b border-[hsl(var(--border))] last:border-0">
                <td className={`px-4 py-3 font-medium ${r.color}`}>{r.role}</td>
                <td className="px-4 py-3 text-[hsl(var(--muted-foreground))]">L{r.level}</td>
                <td className="px-4 py-3 text-[hsl(var(--muted-foreground))]">{r.perms}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
