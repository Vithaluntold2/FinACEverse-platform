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
  description: string;
  category: "ai" | "compliance" | "finance" | "platform" | "learning";
  color: string;
  icon: string;
  status: "live" | "development" | "planned";
  healthEndpoint?: string;
}

/** Canonical registry of all 10 FinACEverse products */
export const MODULE_REGISTRY: ModuleDefinition[] = [
  {
    slug: "accute",
    name: "Accute",
    domain: "accute.io",
    description: "AI-native workflow orchestration for financial operations",
    category: "ai",
    color: "#6366F1",
    icon: "Workflow",
    status: "live",
    healthEndpoint: "https://accute.io/api/health",
  },
  {
    slug: "askluca",
    name: "Ask Luca",
    domain: "askluca.io",
    description: "AI-powered financial reasoning and advisory assistant",
    category: "ai",
    color: "#8B5CF6",
    icon: "Brain",
    status: "live",
  },
  {
    slug: "finaceverse",
    name: "FinACEverse",
    domain: "finaceverse.io",
    description: "Unified financial ecosystem hub and command center",
    category: "platform",
    color: "#0EA5E9",
    icon: "Globe",
    status: "live",
    healthEndpoint: "https://finaceverse.io/api/health",
  },
  {
    slug: "finaidhub",
    name: "FinAid Hub",
    domain: "finaidhub.io",
    description: "AI agent marketplace for financial services automation",
    category: "finance",
    color: "#10B981",
    icon: "Store",
    status: "live",
  },
  {
    slug: "cyloid",
    name: "Cyloid",
    domain: "cyloid.io",
    description: "Intelligent document processing and verification platform",
    category: "compliance",
    color: "#F59E0B",
    icon: "FileSearch",
    status: "live",
    healthEndpoint: "https://web-production-df94c.up.railway.app/api/health",
  },
  {
    slug: "ep-iq",
    name: "EP-IQ",
    domain: "ep-iq.io",
    description: "Enterprise performance intelligence and financial reporting",
    category: "finance",
    color: "#EF4444",
    icon: "BarChart3",
    status: "planned",
  },
  {
    slug: "taxblitz",
    name: "TaxBlitz",
    domain: "taxblitz.io",
    description: "AI-powered tax computation and compliance automation",
    category: "compliance",
    color: "#EC4899",
    icon: "Calculator",
    status: "planned",
  },
  {
    slug: "audric",
    name: "Audric",
    domain: "audric.io",
    description: "Immutable audit trail and verification system",
    category: "compliance",
    color: "#14B8A6",
    icon: "ShieldCheck",
    status: "development",
  },
  {
    slug: "sumbuddy",
    name: "Sumbuddy",
    domain: "sumbuddy.io",
    description: "AI-assisted bookkeeping and reconciliation companion",
    category: "finance",
    color: "#F97316",
    icon: "BookOpen",
    status: "planned",
  },
  {
    slug: "acso",
    name: "ACSO",
    domain: "acso.io",
    description: "Accounting standards observatory and compliance tracker",
    category: "learning",
    color: "#7C3AED",
    icon: "GraduationCap",
    status: "planned",
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
