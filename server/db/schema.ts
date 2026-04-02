import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  boolean,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";

/** Admin users who can access the Command Center */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).unique().notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  displayName: varchar("display_name", { length: 100 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("team_member"),
  isActive: boolean("is_active").notNull().default(true),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/** Module configuration and overrides per-tenant/global */
export const moduleConfigs = pgTable("module_configs", {
  id: serial("id").primaryKey(),
  moduleSlug: varchar("module_slug", { length: 50 }).unique().notNull(),
  isEnabled: boolean("is_enabled").notNull().default(true),
  healthEndpoint: text("health_endpoint"),
  apiBaseUrl: text("api_base_url"),
  customDomain: varchar("custom_domain", { length: 255 }),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  updatedBy: integer("updated_by").references(() => users.id),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/** Health check results history */
export const healthChecks = pgTable("health_checks", {
  id: serial("id").primaryKey(),
  moduleSlug: varchar("module_slug", { length: 50 }).notNull(),
  status: varchar("status", { length: 20 }).notNull(),
  latencyMs: integer("latency_ms"),
  statusCode: integer("status_code"),
  error: text("error"),
  checkedAt: timestamp("checked_at").notNull().defaultNow(),
});

/** Audit trail for all admin actions */
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  action: varchar("action", { length: 100 }).notNull(),
  resource: varchar("resource", { length: 100 }).notNull(),
  resourceId: varchar("resource_id", { length: 255 }),
  details: jsonb("details").$type<Record<string, unknown>>(),
  ipAddress: varchar("ip_address", { length: 45 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
export type InsertModuleConfig = typeof moduleConfigs.$inferInsert;
export type SelectModuleConfig = typeof moduleConfigs.$inferSelect;
export type InsertHealthCheck = typeof healthChecks.$inferInsert;
export type InsertAuditLog = typeof auditLogs.$inferInsert;
