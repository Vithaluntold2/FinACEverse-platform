import { useQuery } from "@tanstack/react-query";
import { MODULE_REGISTRY } from "@shared/types";
import type { ModuleHealth } from "@shared/types";
import LandingNav from "../components/LandingNav";
import LandingFooter from "../components/LandingFooter";
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
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Link2,
  Layers,
  Lock,
  LayoutDashboard,
  Activity,
  Database,
  GitMerge,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Workflow, Brain, Globe, Store, FileSearch,
  BarChart3, Calculator, ShieldCheck, BookOpen, GraduationCap,
};

export default function Landing() {
  const { data: healthData } = useQuery<ModuleHealth[]>({
    queryKey: ["public-health"],
    queryFn: async () => {
      const res = await fetch("/api/health/modules");
      if (!res.ok) return [];
      return res.json();
    },
    refetchInterval: 60_000,
    staleTime: 30_000,
  });

  const healthMap = new Map(healthData?.map((h) => [h.slug, h]) || []);
  const liveCount = MODULE_REGISTRY.filter(m => m.status === "live").length;
  const healthyCount = healthData?.filter(h => h.status === "healthy").length ?? 0;

  return (
    <div className="landing-page">
      <LandingNav />

      {/* ═══════════ HERO — THE CONSOLIDATION PITCH ═══════════ */}
      <section className="relative overflow-hidden pt-32 pb-24 lg:pt-40 lg:pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d0a14] via-[#111827] to-[#0d0a14]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(112,169,224,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(112,169,224,0.3) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }} />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#70a9e0]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-[#c03d4c]/8 rounded-full blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#70a9e0]/20 bg-[#70a9e0]/5 px-4 py-1.5 text-sm text-[#70a9e0]">
              <Layers className="h-4 w-4" />
              One platform. 10 products. Zero fragmentation.
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight">
              <span className="text-white">Every financial AI tool</span>
              <br />
              <span className="text-white">your firm needs, </span>
              <span className="bg-gradient-to-r from-[#70a9e0] to-[#c03d4c] bg-clip-text text-transparent">
                unified.
              </span>
            </h1>

            <p className="text-xl text-[#9098a3] leading-relaxed max-w-2xl mx-auto">
              Accute. Cyloid. Ask Luca. Fin(Ai)d Hub. EP-IQ. TaxBlitz. Audric. Sumbuddy. ACSO. — <br />
              <span className="text-white font-medium">They already exist.</span> FinACEverse consolidates them into
              one platform with shared data, unified auth, cross-product workflows, and a single command center.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <a href="#platform" className="inline-flex items-center gap-2 rounded-lg bg-[#70a9e0] px-7 py-3.5 text-sm font-semibold text-white hover:bg-[#5a93ca] transition-colors">
                See the Platform
                <ArrowRight className="h-4 w-4" />
              </a>
              <a href="/admin" className="inline-flex items-center gap-2 rounded-lg border border-[#2a2540] px-7 py-3.5 text-sm font-semibold text-[#c0c8d1] hover:bg-[#1a1625] transition-colors">
                Open Command Center
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Live product strip */}
          <div className="mt-16 mx-auto max-w-5xl">
            <div className="rounded-2xl border border-[#2a2540] bg-[#0d0a14]/80 backdrop-blur-sm p-5">
              <div className="flex items-center justify-between mb-4 px-1">
                <span className="text-xs font-semibold text-[#9098a3] uppercase tracking-widest">Consolidated Products</span>
                <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  {healthyCount} of {liveCount} healthy — live data
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {MODULE_REGISTRY.map((mod) => {
                  const health = healthMap.get(mod.slug);
                  const Icon = ICON_MAP[mod.icon] || Globe;
                  const isLive = health?.status === "healthy";
                  const isDown = health?.status === "down";
                  return (
                    <div key={mod.slug} className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 border transition-colors ${
                      isLive ? "border-emerald-500/20 bg-emerald-500/5" :
                      isDown ? "border-red-500/20 bg-red-500/5" :
                      "border-[#2a2540] bg-[#111827]/50"
                    }`}>
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md" style={{ backgroundColor: `${mod.color}15` }}>
                        <Icon className="h-3.5 w-3.5" style={{ color: mod.color }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{mod.name}</p>
                        <p className="text-[10px] text-[#9098a3] font-mono">
                          {isLive ? `${health!.latencyMs}ms` : isDown ? "down" : mod.status === "live" ? "checking..." : mod.status}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ THE PROBLEM: FRAGMENTATION ═══════════ */}
      <section className="relative py-24 bg-[#0a0812]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                10 products on{" "}
                <span className="text-[#c03d4c]">10 different islands</span>{" "}
                is not a platform.
              </h2>
              <p className="text-[#9098a3] leading-relaxed">
                Each FinACEverse product was built to solve a real problem — tax
                advisory, document processing, workflow orchestration, audit automation.
                They work. But separately, they force your team to:
              </p>
              <div className="space-y-3">
                {[
                  "Log into 5 different apps to complete one workflow",
                  "Re-enter the same client data across every tool",
                  "Manually move documents between systems",
                  "Track compliance in spreadsheets because nothing talks to anything",
                  "Maintain separate user accounts, billing, and permissions",
                ].map((pain, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#c03d4c]/15 text-[10px] font-bold text-[#c03d4c]">✕</span>
                    <p className="text-sm text-[#c0c8d1]">{pain}</p>
                  </div>
                ))}
              </div>
              <p className="text-white font-semibold pt-2">
                FinACEverse is the consolidation layer that fixes all of this.
              </p>
            </div>

            {/* Before / After visual */}
            <div className="space-y-6">
              {/* Before */}
              <div className="rounded-xl border border-[#c03d4c]/20 bg-[#c03d4c]/5 p-5">
                <p className="text-xs font-bold text-[#c03d4c] uppercase tracking-widest mb-3">Before — Fragmented</p>
                <div className="grid grid-cols-5 gap-2">
                  {MODULE_REGISTRY.slice(0, 5).map((mod) => {
                    const Icon = ICON_MAP[mod.icon] || Globe;
                    return (
                      <div key={mod.slug} className="flex flex-col items-center gap-1.5 rounded-lg border border-[#c03d4c]/10 bg-[#0d0a14] py-3 px-1">
                        <Icon className="h-4 w-4" style={{ color: mod.color }} />
                        <span className="text-[9px] text-[#9098a3] text-center leading-tight">{mod.name}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-2 grid grid-cols-5 gap-2">
                  {MODULE_REGISTRY.slice(5).map((mod) => {
                    const Icon = ICON_MAP[mod.icon] || Globe;
                    return (
                      <div key={mod.slug} className="flex flex-col items-center gap-1.5 rounded-lg border border-[#c03d4c]/10 bg-[#0d0a14] py-3 px-1">
                        <Icon className="h-4 w-4" style={{ color: mod.color }} />
                        <span className="text-[9px] text-[#9098a3] text-center leading-tight">{mod.name}</span>
                      </div>
                    );
                  })}
                </div>
                <p className="text-[10px] text-[#c03d4c]/60 text-center mt-3">10 logins · 10 data silos · 0 integration</p>
              </div>

              {/* After */}
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">After — FinACEverse Platform</p>
                <div className="rounded-lg border border-emerald-500/10 bg-[#0d0a14] p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-[#70a9e0]/15">
                      <Layers className="h-3.5 w-3.5 text-[#70a9e0]" />
                    </div>
                    <span className="text-xs font-bold text-white">FinACEverse Platform</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {MODULE_REGISTRY.map((mod) => {
                      const Icon = ICON_MAP[mod.icon] || Globe;
                      return (
                        <div key={mod.slug} className="flex items-center gap-1 rounded-md bg-emerald-500/5 border border-emerald-500/10 px-2 py-1">
                          <Icon className="h-3 w-3" style={{ color: mod.color }} />
                          <span className="text-[10px] text-[#c0c8d1]">{mod.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <p className="text-[10px] text-emerald-400/60 text-center mt-3">1 login · 1 data layer · fully integrated</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ WHAT THE PLATFORM DOES ═══════════ */}
      <section id="platform" className="relative py-24 bg-[#0d0a14]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              What consolidation actually{" "}
              <span className="bg-gradient-to-r from-[#70a9e0] to-[#c03d4c] bg-clip-text text-transparent">means</span>
            </h2>
            <p className="text-[#9098a3] max-w-2xl mx-auto">
              Not just a dashboard with links. Real integration — shared identity, shared data,
              cross-product workflows, unified monitoring.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Lock,
                title: "Unified Authentication",
                desc: "One login across all 10 products. SSO, role-based access, and centralized user management. Your team doesn't need 10 accounts anymore.",
                badge: "Live",
              },
              {
                icon: Database,
                title: "Shared Data Layer",
                desc: "Client data entered in Accute is available in Cyloid, Ask Luca, and TaxBlitz. No re-entry. No CSV exports. One source of truth.",
                badge: "Building",
              },
              {
                icon: GitMerge,
                title: "Cross-Product Workflows",
                desc: "A document scanned in Cyloid triggers a tax computation in TaxBlitz, reviewed by Audric, orchestrated by Accute. One continuous pipeline.",
                badge: "Building",
              },
              {
                icon: LayoutDashboard,
                title: "Command Center",
                desc: "One admin panel to configure, monitor, and manage all 10 products. Health checks, user management, module configs — all in one place.",
                badge: "Live",
                link: "/admin",
              },
              {
                icon: Activity,
                title: "Unified Health Monitoring",
                desc: "Real-time health status of every product from a single view. Latency, uptime, error rates — all products, one dashboard.",
                badge: "Live",
              },
              {
                icon: Link2,
                title: "Integration Bus",
                desc: "Publish-subscribe event system between products. When something happens in one product, others can react. No point-to-point spaghetti.",
                badge: "Planned",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="group rounded-xl border border-[#2a2540] bg-[#111827]/30 p-6 hover:border-[#70a9e0]/20 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <Icon className="h-7 w-7 text-[#70a9e0]" />
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      item.badge === "Live" ? "bg-emerald-400/10 text-emerald-400" :
                      item.badge === "Building" ? "bg-amber-400/10 text-amber-400" :
                      "bg-[#2a2540] text-[#9098a3]"
                    }`}>
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-[#9098a3] leading-relaxed">{item.desc}</p>
                  {item.link && (
                    <a href={item.link} className="inline-flex items-center gap-1 mt-3 text-xs text-[#70a9e0] hover:text-white transition-colors">
                      Open <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ THE 10 PRODUCTS ═══════════ */}
      <section id="products" className="relative py-24 bg-[#0a0812]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              10 products, one platform
            </h2>
            <p className="text-[#9098a3] max-w-2xl mx-auto">
              Each product handles a specific domain of financial operations. Together under
              FinACEverse, they share clients, data, and workflows.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {MODULE_REGISTRY.map((mod) => {
              const Icon = ICON_MAP[mod.icon] || Globe;
              const health = healthMap.get(mod.slug);
              const isHealthy = health?.status === "healthy";
              return (
                <div key={mod.slug} className="flex items-start gap-4 rounded-xl border border-[#2a2540] bg-[#0d0a14] p-5 hover:border-[#2a2540]/80 transition-colors">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `${mod.color}12` }}>
                    <Icon className="h-5 w-5" style={{ color: mod.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-white">{mod.name}</h3>
                      <span className="text-[10px] font-medium text-[#70a9e0] bg-[#70a9e0]/8 px-1.5 py-0.5 rounded">{mod.tagline}</span>
                      {isHealthy && (
                        <span className="ml-auto flex items-center gap-1 text-[10px] text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          {health!.latencyMs}ms
                        </span>
                      )}
                      {health?.status === "down" && (
                        <span className="ml-auto text-[10px] text-red-400">down</span>
                      )}
                      {mod.status !== "live" && (
                        <span className={`ml-auto text-[10px] font-medium uppercase ${
                          mod.status === "development" ? "text-amber-400" : "text-[#9098a3]"
                        }`}>
                          {mod.status === "development" ? "in dev" : "coming soon"}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#9098a3] leading-relaxed">{mod.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] text-[#9098a3]">{mod.domain}</span>
                      {mod.features.map(f => (
                        <span key={f} className="text-[10px] text-[#9098a3]/60">· {f}</span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ HOW DATA FLOWS THROUGH ═══════════ */}
      <section className="relative py-24 bg-[#0d0a14]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              How work flows through the platform
            </h2>
            <p className="text-[#9098a3] max-w-2xl mx-auto">
              This is the integration in action. A single client engagement touches
              multiple products — seamlessly, without manual handoffs.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {[
              {
                step: "01",
                product: "Cyloid",
                action: "Client uploads invoices, receipts, bank statements",
                output: "Structured financial data extracted with 99%+ accuracy",
                color: "#F59E0B",
                icon: "FileSearch",
              },
              {
                step: "02",
                product: "Accute",
                action: "Orchestrates the processing workflow automatically",
                output: "Routes data to the right products, tracks progress, manages deadlines",
                color: "#6366F1",
                icon: "Workflow",
              },
              {
                step: "03",
                product: "Ask Luca",
                action: "Applies financial reasoning to the extracted data",
                output: "Tax treatment recommendations, compliance flags, advisory insights",
                color: "#8B5CF6",
                icon: "Brain",
              },
              {
                step: "04",
                product: "Fin(Ai)d Hub",
                action: "AI agents execute bookkeeping and reconciliation",
                output: "Journal entries posted, accounts reconciled, close checklist updated",
                color: "#10B981",
                icon: "Store",
              },
              {
                step: "05",
                product: "EP-IQ",
                action: "Analyzes the entire process for optimization",
                output: "Bottleneck reports, efficiency scores, capacity planning data",
                color: "#EF4444",
                icon: "BarChart3",
              },
            ].map((item, i) => {
              const Icon = ICON_MAP[item.icon] || Globe;
              return (
                <div key={item.step} className="flex gap-4 items-start">
                  {/* Timeline line */}
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2" style={{ borderColor: item.color, backgroundColor: `${item.color}10` }}>
                      <Icon className="h-4 w-4" style={{ color: item.color }} />
                    </div>
                    {i < 4 && <div className="w-px h-full min-h-[24px] bg-[#2a2540]" />}
                  </div>
                  {/* Content */}
                  <div className="rounded-xl border border-[#2a2540] bg-[#111827]/30 p-4 flex-1 mb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono text-[#9098a3]">{item.step}</span>
                      <span className="text-sm font-bold text-white">{item.product}</span>
                      <span className="text-[10px] text-[#9098a3]">→ {item.action}</span>
                    </div>
                    <p className="text-xs text-[#70a9e0]">{item.output}</p>
                  </div>
                </div>
              );
            })}
            <div className="flex gap-4 items-center pt-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-emerald-500 bg-emerald-500/10">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              </div>
              <p className="text-sm text-emerald-400 font-semibold">
                Done. One client engagement. Five products. Zero manual handoffs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="relative py-24 bg-[#0a0812]">
        <div className="absolute inset-0 bg-gradient-to-t from-[#70a9e0]/5 to-transparent" />
        <div className="relative mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
            Stop switching between tools.{" "}
            <br />
            <span className="bg-gradient-to-r from-[#70a9e0] to-[#c03d4c] bg-clip-text text-transparent">
              Start running a platform.
            </span>
          </h2>
          <p className="text-lg text-[#9098a3] mb-10 max-w-2xl mx-auto">
            FinACEverse brings your entire financial operations stack under one roof.
            Unified data, unified workflows, unified control.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="mailto:hello@finaceverse.io" className="inline-flex items-center gap-2 rounded-lg bg-[#70a9e0] px-8 py-3.5 text-sm font-semibold text-white hover:bg-[#5a93ca] transition-colors">
              Request a Demo
              <ArrowRight className="h-4 w-4" />
            </a>
            <a href="/admin" className="inline-flex items-center gap-2 rounded-lg border border-[#2a2540] px-8 py-3.5 text-sm font-semibold text-[#c0c8d1] hover:bg-[#1a1625] transition-colors">
              Explore Command Center
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
