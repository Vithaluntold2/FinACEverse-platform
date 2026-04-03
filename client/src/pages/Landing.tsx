import { useState, useEffect } from "react";
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
  Zap,
  Shield,
  Users,
  TrendingUp,
  Building2,
  Scale,
  Briefcase,
  ExternalLink,
  Circle,
  ChevronRight,
  Sparkles,
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

  const phase1 = MODULE_REGISTRY.filter(m => m.phase === 1);
  const phase2 = MODULE_REGISTRY.filter(m => m.phase === 2);

  return (
    <div className="landing-page">
      <LandingNav />

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d0a14] via-[#111827] to-[#0d0a14]" />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(112,169,224,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(112,169,224,0.3) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }} />
        {/* Glow orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#70a9e0]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-[#c03d4c]/8 rounded-full blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left — content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#70a9e0]/20 bg-[#70a9e0]/5 px-4 py-1.5 text-sm text-[#70a9e0]">
                <Sparkles className="h-4 w-4" />
                10 AI Products for Accounting, Tax, Audit & Advisory
              </div>

              <h1 className="text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight">
                <span className="text-white">Powering the Path to </span>
                <span className="bg-gradient-to-r from-[#70a9e0] to-[#c03d4c] bg-clip-text text-transparent">
                  Autonomous Enterprises
                </span>
              </h1>

              <p className="text-lg text-[#9098a3] leading-relaxed max-w-xl">
                FinACEverse is an ecosystem of 10 AI-powered products that automate
                accounting, tax, audit, and advisory workflows — transforming manual
                processes into intelligent, self-operating systems.
              </p>

              <div className="flex flex-wrap gap-4">
                <a href="#products" className="inline-flex items-center gap-2 rounded-lg bg-[#70a9e0] px-6 py-3 text-sm font-semibold text-white hover:bg-[#5a93ca] transition-colors">
                  Explore Products
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a href="/admin" className="inline-flex items-center gap-2 rounded-lg border border-[#2a2540] px-6 py-3 text-sm font-semibold text-[#c0c8d1] hover:bg-[#1a1625] transition-colors">
                  Command Center
                  <ChevronRight className="h-4 w-4" />
                </a>
              </div>

              {/* Live stats */}
              <div className="flex gap-8 pt-4">
                <div>
                  <p className="text-3xl font-bold text-white">10</p>
                  <p className="text-xs text-[#9098a3] uppercase tracking-wider mt-1">AI Products</p>
                </div>
                <div className="border-l border-[#2a2540] pl-8">
                  <p className="text-3xl font-bold text-white">{liveCount}</p>
                  <p className="text-xs text-[#9098a3] uppercase tracking-wider mt-1">Live Now</p>
                </div>
                <div className="border-l border-[#2a2540] pl-8">
                  <p className="text-3xl font-bold text-emerald-400">{healthyCount}</p>
                  <p className="text-xs text-[#9098a3] uppercase tracking-wider mt-1">Healthy</p>
                </div>
              </div>
            </div>

            {/* Right — live status panel */}
            <div className="relative">
              <div className="rounded-2xl border border-[#2a2540] bg-[#0d0a14]/80 backdrop-blur-sm p-6 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-[#c0c8d1] uppercase tracking-wider">Live System Status</h3>
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    Real-time
                  </span>
                </div>
                {MODULE_REGISTRY.map((mod) => {
                  const health = healthMap.get(mod.slug);
                  const Icon = ICON_MAP[mod.icon] || Globe;
                  const statusColor = !health ? "bg-gray-600" :
                    health.status === "healthy" ? "bg-emerald-400" :
                    health.status === "degraded" ? "bg-amber-400" :
                    health.status === "down" ? "bg-red-400" : "bg-gray-600";
                  const statusText = !health ? "—" :
                    health.status === "healthy" ? `${health.latencyMs}ms` :
                    health.status;
                  return (
                    <div key={mod.slug} className="flex items-center gap-3 py-1.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md" style={{ backgroundColor: `${mod.color}15` }}>
                        <Icon className="h-3.5 w-3.5" style={{ color: mod.color }} />
                      </div>
                      <span className="flex-1 text-sm text-[#c0c8d1]">{mod.name}</span>
                      <span className={`h-2 w-2 rounded-full ${statusColor}`} />
                      <span className="text-xs text-[#9098a3] w-14 text-right font-mono">{statusText}</span>
                    </div>
                  );
                })}
              </div>
              {/* Decorative glow behind card */}
              <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-r from-[#6366F1]/5 to-[#c03d4c]/5 blur-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ PROBLEM STATEMENT ═══════════════ */}
      <section className="relative py-20 bg-[#0a0812]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Your Firm Runs on <span className="text-[#c03d4c]">Manual Work</span>
            </h2>
            <p className="text-[#9098a3] max-w-2xl mx-auto">
              Finance teams are drowning in repetitive tasks. Knowledge is trapped in people.
              Tools record — they don't think. FinACEverse changes that.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                title: "Knowledge Trapped in People",
                desc: "When your best people leave, decades of expertise walks out the door. AI should capture, retain, and amplify institutional knowledge.",
                stat: "67%",
                statLabel: "of firms lose critical knowledge during turnover",
              },
              {
                icon: Zap,
                title: "Tools Record, They Don't Think",
                desc: "Current software captures data but can't reason about it. You need systems that understand context, make judgments, and take action.",
                stat: "80%",
                statLabel: "of accounting time spent on non-cognitive tasks",
              },
              {
                icon: TrendingUp,
                title: "More Clients, Same Team",
                desc: "Growth means more work — not more people. AI agents can multiply your team's capacity without multiplying headcount.",
                stat: "2.5x",
                statLabel: "capacity uplift with AI workforce augmentation",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="group rounded-xl border border-[#2a2540] bg-[#0d0a14] p-6 hover:border-[#70a9e0]/30 transition-colors">
                  <Icon className="h-8 w-8 text-[#70a9e0] mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-[#9098a3] leading-relaxed mb-4">{item.desc}</p>
                  <div className="pt-4 border-t border-[#2a2540]">
                    <p className="text-2xl font-bold text-[#70a9e0]">{item.stat}</p>
                    <p className="text-xs text-[#9098a3] mt-1">{item.statLabel}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ PRODUCTS ═══════════════ */}
      <section id="products" className="relative py-20 bg-[#0d0a14]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              The Integrated <span className="bg-gradient-to-r from-[#70a9e0] to-[#c03d4c] bg-clip-text text-transparent">Ecosystem</span>
            </h2>
            <p className="text-[#9098a3] max-w-2xl mx-auto">
              10 products. One unified platform. Each product is powerful alone —
              together, they create an autonomous financial operating system.
            </p>
          </div>

          {/* Phase 1 — Available Now */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-flex items-center rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Phase 1 — Live
              </span>
              <span className="h-px flex-1 bg-[#2a2540]" />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {phase1.map((mod, i) => {
                const Icon = ICON_MAP[mod.icon] || Globe;
                const health = healthMap.get(mod.slug);
                return (
                  <div key={mod.slug} className={`group relative rounded-xl border border-[#2a2540] bg-[#111827]/50 p-6 hover:border-[${mod.color}]/40 transition-all ${i === 0 ? "md:col-span-2" : ""}`}>
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `${mod.color}15` }}>
                        <Icon className="h-6 w-6" style={{ color: mod.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-bold text-white">{mod.name}</h3>
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#70a9e0]/10 text-[#70a9e0]">
                            {mod.tagline}
                          </span>
                          {health && (
                            <span className={`ml-auto flex items-center gap-1.5 text-xs ${
                              health.status === "healthy" ? "text-emerald-400" :
                              health.status === "degraded" ? "text-amber-400" : "text-red-400"
                            }`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${
                                health.status === "healthy" ? "bg-emerald-400" :
                                health.status === "degraded" ? "bg-amber-400" : "bg-red-400"
                              }`} />
                              {health.status} · {health.latencyMs}ms
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[#9098a3] leading-relaxed mb-3">{mod.longDescription}</p>
                        <div className="flex flex-wrap gap-2">
                          {mod.features.map(f => (
                            <span key={f} className="inline-flex items-center gap-1 rounded-md bg-[#1a1625] px-2.5 py-1 text-xs text-[#c0c8d1]">
                              <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                              {f}
                            </span>
                          ))}
                          <a href={`https://${mod.domain}`} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-md bg-[#1a1625] px-2.5 py-1 text-xs text-[#70a9e0] hover:bg-[#70a9e0]/10 transition-colors">
                            {mod.domain} <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Phase 2 — Coming Soon */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-flex items-center rounded-full bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-400 uppercase tracking-wider">
                Phase 2 — Building
              </span>
              <span className="h-px flex-1 bg-[#2a2540]" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {phase2.map((mod) => {
                const Icon = ICON_MAP[mod.icon] || Globe;
                const health = healthMap.get(mod.slug);
                return (
                  <div key={mod.slug} className="group relative rounded-xl border border-[#2a2540] bg-[#111827]/30 p-5 hover:border-[#2a2540]/80 transition-all">
                    {mod.status === "planned" && (
                      <span className="absolute top-3 right-3 text-[10px] font-semibold uppercase tracking-wider text-[#c03d4c] bg-[#c03d4c]/10 px-2 py-0.5 rounded-full">
                        Coming Soon
                      </span>
                    )}
                    {mod.status === "development" && (
                      <span className="absolute top-3 right-3 text-[10px] font-semibold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">
                        In Dev
                      </span>
                    )}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: `${mod.color}15` }}>
                        <Icon className="h-5 w-5" style={{ color: mod.color }} />
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{mod.name}</h3>
                        <p className="text-xs text-[#70a9e0]">{mod.tagline}</p>
                      </div>
                    </div>
                    <p className="text-sm text-[#9098a3] leading-relaxed mb-3">{mod.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {mod.features.map(f => (
                        <span key={f} className="text-[10px] text-[#9098a3] bg-[#1a1625] px-2 py-0.5 rounded">
                          {f}
                        </span>
                      ))}
                    </div>
                    {health && health.status === "healthy" && (
                      <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Live · {health.latencyMs}ms
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ HOW THEY WORK TOGETHER ═══════════════ */}
      <section className="relative py-20 bg-[#0a0812]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              The Cognitive Cycle
            </h2>
            <p className="text-[#9098a3] max-w-2xl mx-auto">
              Every product has a role. Together, they form a continuous cycle that
              understands, processes, executes, and improves.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Understand",
                desc: "Ask Luca provides CPA-level financial reasoning. VAMN-70B (coming) adds deep language understanding.",
                products: ["Ask Luca"],
                color: "#8B5CF6",
              },
              {
                step: "02",
                title: "Ingest",
                desc: "Cyloid processes every financial document — invoices, receipts, tax forms — into structured, validated data.",
                products: ["Cyloid"],
                color: "#F59E0B",
              },
              {
                step: "03",
                title: "Execute",
                desc: "Accute orchestrates workflows. Fin(Ai)d Hub provides AI agents. TaxBlitz and Audric handle compliance.",
                products: ["Accute", "Fin(Ai)d Hub", "TaxBlitz", "Audric"],
                color: "#6366F1",
              },
              {
                step: "04",
                title: "Improve",
                desc: "EP-IQ mines processes for bottlenecks. ACSO adapts and learns. The system gets smarter every cycle.",
                products: ["EP-IQ", "ACSO"],
                color: "#EF4444",
              },
            ].map((item, i) => (
              <div key={item.step} className="relative">
                {i < 3 && (
                  <div className="hidden md:block absolute top-10 -right-3 w-6 text-[#2a2540]">
                    <ChevronRight className="h-6 w-6" />
                  </div>
                )}
                <div className="rounded-xl border border-[#2a2540] bg-[#0d0a14] p-6 h-full">
                  <div className="text-3xl font-extrabold mb-3" style={{ color: item.color }}>{item.step}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-[#9098a3] leading-relaxed mb-4">{item.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.products.map(p => (
                      <span key={p} className="text-xs px-2 py-0.5 rounded-full border border-[#2a2540] text-[#c0c8d1]">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ WHO IT'S FOR ═══════════════ */}
      <section id="solutions" className="relative py-20 bg-[#0d0a14]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Built for Finance Professionals
            </h2>
            <p className="text-[#9098a3] max-w-2xl mx-auto">
              Whether you're a solo practitioner or a 200-person firm, FinACEverse
              scales to your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Building2,
                title: "Accounting Firms",
                size: "5–200+ people",
                desc: "Automate bookkeeping, streamline multi-entity operations, and scale your practice with AI agents.",
              },
              {
                icon: Scale,
                title: "Tax Practitioners",
                size: "Solo to small teams",
                desc: "From return preparation to compliance checks — AI that handles the grunt work so you can focus on strategy.",
              },
              {
                icon: Briefcase,
                title: "Corporate Finance",
                size: "CFO offices & FP&A",
                desc: "Real-time financial intelligence, automated reporting, and process mining for your finance function.",
              },
              {
                icon: Shield,
                title: "Auditors",
                size: "Internal & external",
                desc: "Continuous auditing, automated risk assessment, and compliance mapping across standards.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-xl border border-[#2a2540] bg-[#111827]/30 p-6 hover:border-[#70a9e0]/20 transition-colors">
                  <Icon className="h-8 w-8 text-[#70a9e0] mb-4" />
                  <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-xs text-[#70a9e0] mb-3">{item.size}</p>
                  <p className="text-sm text-[#9098a3] leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ IMPACT STATS ═══════════════ */}
      <section className="relative py-20 bg-[#0a0812]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { value: "40%", label: "Efficiency Gain", desc: "Average reduction in time spent on repetitive financial tasks" },
              { value: "100%", label: "Audit Trail", desc: "Every transaction, decision, and AI action is fully traceable" },
              { value: "2.5x", label: "Capacity Uplift", desc: "Handle more clients without proportional team growth" },
            ].map((stat) => (
              <div key={stat.label} className="text-center py-8 px-6 rounded-xl border border-[#2a2540] bg-[#0d0a14]">
                <p className="text-5xl font-extrabold bg-gradient-to-r from-[#70a9e0] to-[#c03d4c] bg-clip-text text-transparent mb-2">{stat.value}</p>
                <p className="text-lg font-semibold text-white mb-2">{stat.label}</p>
                <p className="text-sm text-[#9098a3]">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="relative py-24 bg-[#0d0a14]">
        <div className="absolute inset-0 bg-gradient-to-t from-[#70a9e0]/5 to-transparent" />
        <div className="relative mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
            What Becomes Possible When the{" "}
            <span className="bg-gradient-to-r from-[#70a9e0] to-[#c03d4c] bg-clip-text text-transparent">
              Enterprise Becomes Intelligent?
            </span>
          </h2>
          <p className="text-lg text-[#9098a3] mb-10 max-w-2xl mx-auto">
            Join the firms already building autonomous financial operations with FinACEverse.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="mailto:hello@finaceverse.io" className="inline-flex items-center gap-2 rounded-lg bg-[#70a9e0] px-8 py-3.5 text-sm font-semibold text-white hover:bg-[#5a93ca] transition-colors">
              Request a Demo
              <ArrowRight className="h-4 w-4" />
            </a>
            <a href="mailto:pilots@finaceverse.io" className="inline-flex items-center gap-2 rounded-lg border border-[#2a2540] px-8 py-3.5 text-sm font-semibold text-[#c0c8d1] hover:bg-[#1a1625] transition-colors">
              Join Pilot Program
            </a>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
