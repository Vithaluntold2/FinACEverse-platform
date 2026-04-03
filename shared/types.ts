/** All FinACEverse product modules */
export const MODULE_SLUGS = [
  "accute",
  "askluca",
  "finaceverse",
  "finaidhub",
  "cyloid",
  "ep-iq",
  "taxblitz",
  "audric",
  "sumbuddy",
  "acso",
] as const;

export type ModuleSlug = (typeof MODULE_SLUGS)[number];

export interface ModuleDefinition {
  slug: ModuleSlug;
  name: string;
  domain: string;
  tagline: string;
  description: string;
  longDescription: string;
  category: "ai" | "compliance" | "finance" | "platform" | "learning";
  phase: 1 | 2;
  color: string;
  icon: string;
  status: "live" | "development" | "planned";
  healthEndpoint?: string;
  features: string[];
}

/** Canonical registry of all 10 FinACEverse products */
export const MODULE_REGISTRY: ModuleDefinition[] = [
  {
    slug: "accute",
    name: "Accute",
    domain: "accute.io",
    tagline: "Workflow Orchestration",
    description: "AI-native workflow orchestration for financial operations",
    longDescription: "The master conductor of your financial workflows. Accute connects all FinACEverse products into a unified operating system, routing work between AI agents, humans, and systems with full audit trails.",
    category: "platform",
    phase: 1,
    color: "#6366F1",
    icon: "Workflow",
    status: "live",
    healthEndpoint: "https://accute.io/api/health",
    features: ["Workflow Automation", "Multi-entity Support", "Real-time Sync"],
  },
  {
    slug: "askluca",
    name: "Ask Luca",
    domain: "askluca.io",
    tagline: "AI Domain Expert",
    description: "AI-powered financial reasoning and advisory assistant",
    longDescription: "Your AI tax and accounting advisor with CPA-level expertise. Luca understands Indian accounting standards, tax law, and audit practices — trained on decades of financial domain knowledge.",
    category: "ai",
    phase: 1,
    color: "#8B5CF6",
    icon: "Brain",
    status: "live",
    features: ["Tax Intelligence", "Historical Analysis", "Predictive Insights"],
  },
  {
    slug: "finaceverse",
    name: "FinACEverse",
    domain: "finaceverse.io",
    tagline: "Unified Ecosystem Hub",
    description: "Unified financial ecosystem hub and command center",
    longDescription: "The ecosystem gateway. FinACEverse is the unified platform that ties all 10 AI products together — providing single sign-on, unified billing, cross-product analytics, and a command center for your entire financial operations.",
    category: "platform",
    phase: 1,
    color: "#0EA5E9",
    icon: "Globe",
    status: "live",
    healthEndpoint: "https://finaceverse.io/api/health",
    features: ["Unified Dashboard", "Cross-product SSO", "Ecosystem Analytics"],
  },
  {
    slug: "finaidhub",
    name: "Fin(Ai)d Hub",
    domain: "finaidhub.io",
    tagline: "AI Workforce Multiplier",
    description: "AI-powered accounting workforce that handles bookkeeping",
    longDescription: "Your AI-powered accounting workforce. Handles bookkeeping, reconciliation, journal entries, and financial close — like having 50 accountants that never sleep, never make mistakes, and learn from every transaction.",
    category: "finance",
    phase: 1,
    color: "#10B981",
    icon: "Store",
    status: "live",
    features: ["AI Agents", "Task Automation", "Resource Optimization"],
  },
  {
    slug: "cyloid",
    name: "Cyloid",
    domain: "cyloid.io",
    tagline: "Document Intelligence",
    description: "Intelligent document processing and financial data extraction",
    longDescription: "The input layer of FinACEverse. Cyloid processes invoices, receipts, bank statements, tax forms, and any financial document — extracting structured data with 99%+ accuracy using purpose-built AI.",
    category: "ai",
    phase: 2,
    color: "#F59E0B",
    icon: "FileSearch",
    status: "live",
    healthEndpoint: "https://web-production-df94c.up.railway.app/api/health",
    features: ["OCR + AI Extraction", "Multi-format Support", "Validation Engine"],
  },
  {
    slug: "ep-iq",
    name: "EP-IQ",
    domain: "ep-iq.io",
    tagline: "Enterprise Process Mining",
    description: "Process mining that analyzes how work really happens",
    longDescription: "Process mining module that analyzes how work really happens in your firm. EP-IQ discovers bottlenecks, measures efficiency, and provides actionable insights — turning your firm's operations into a data-driven advantage.",
    category: "finance",
    phase: 1,
    color: "#EF4444",
    icon: "BarChart3",
    status: "planned",
    features: ["Performance Dashboards", "Predictive Analytics", "Custom Reports"],
  },
  {
    slug: "taxblitz",
    name: "TaxBlitz",
    domain: "taxblitz.io",
    tagline: "AI Tax Preparation",
    description: "AI-powered tax computation and compliance automation",
    longDescription: "End-to-end AI tax preparation. From data collection to computation to filing — TaxBlitz handles individual, corporate, and GST returns with built-in compliance checks and automatic optimization.",
    category: "compliance",
    phase: 2,
    color: "#EC4899",
    icon: "Calculator",
    status: "planned",
    features: ["Auto Computation", "Compliance Checks", "Multi-regime Support"],
  },
  {
    slug: "audric",
    name: "Audric",
    domain: "audric.io",
    tagline: "Audit Automation",
    description: "AI-powered audit automation and verification system",
    longDescription: "AI-powered audit automation. Audric performs continuous auditing, risk assessment, and compliance verification — transforming audit from a periodic event into an always-on assurance layer.",
    category: "compliance",
    phase: 2,
    color: "#14B8A6",
    icon: "ShieldCheck",
    status: "development",
    features: ["Continuous Auditing", "Risk Assessment", "Compliance Mapping"],
  },
  {
    slug: "sumbuddy",
    name: "Sumbuddy",
    domain: "sumbuddy.io",
    tagline: "Client Marketplace",
    description: "AI-matched marketplace connecting clients with professionals",
    longDescription: "The intelligent marketplace. Sumbuddy uses AI to match businesses with the right accounting, tax, and advisory professionals — based on industry, complexity, budget, and expertise requirements.",
    category: "finance",
    phase: 2,
    color: "#F97316",
    icon: "BookOpen",
    status: "planned",
    features: ["AI Matching", "Professional Profiles", "Project Management"],
  },
  {
    slug: "acso",
    name: "ACSO",
    domain: "acso.io",
    tagline: "Adaptive Cognitive ERP",
    description: "Cognitive ERP that learns and adapts to your business",
    longDescription: "The adaptive cognitive ERP. ACSO learns your business patterns, automates routine decisions, and evolves with your firm — moving beyond traditional ERP into intelligent, self-optimizing operations.",
    category: "learning",
    phase: 2,
    color: "#7C3AED",
    icon: "GraduationCap",
    status: "planned",
    features: ["Adaptive Learning", "Smart Automation", "Business Intelligence"],
  },
];

/** User roles in the Command Center */
export type UserRole = "founder" | "financial_admin" | "technical_admin" | "security_admin" | "support_admin" | "team_member";

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  displayName: string;
  createdAt: string;
}

export interface ModuleHealth {
  slug: ModuleSlug;
  status: "healthy" | "degraded" | "down" | "unknown";
  latencyMs: number | null;
  lastChecked: string;
  error?: string;
}

export interface DashboardMetrics {
  totalModules: number;
  liveModules: number;
  healthyModules: number;
  totalUsers: number;
  moduleHealth: ModuleHealth[];
}
