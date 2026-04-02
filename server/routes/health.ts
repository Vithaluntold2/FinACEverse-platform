import { Router } from "express";
import { db } from "../db/index.js";
import { healthChecks } from "../db/schema.js";
import { MODULE_REGISTRY } from "../../shared/types.js";
import type { ModuleHealth } from "../../shared/types.js";
import { eq, desc } from "drizzle-orm";

const router = Router();

/** GET /api/health — Command Center health */
router.get("/", (_req, res) => {
  res.json({ status: "ok", service: "finaceverse-admin", timestamp: new Date().toISOString() });
});

/** GET /api/health/modules — check all modules */
router.get("/modules", async (_req, res, next) => {
  try {
    const results: ModuleHealth[] = [];

    for (const mod of MODULE_REGISTRY) {
      if (!mod.healthEndpoint) {
        results.push({
          slug: mod.slug,
          status: "unknown",
          latencyMs: null,
          lastChecked: new Date().toISOString(),
        });
        continue;
      }

      const start = Date.now();
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(mod.healthEndpoint, {
          signal: controller.signal,
        });
        clearTimeout(timeout);

        const latencyMs = Date.now() - start;
        const status = response.ok ? "healthy" : "degraded";

        await db.insert(healthChecks).values({
          moduleSlug: mod.slug,
          status,
          latencyMs,
          statusCode: response.status,
        });

        results.push({
          slug: mod.slug,
          status,
          latencyMs,
          lastChecked: new Date().toISOString(),
        });
      } catch (err) {
        const latencyMs = Date.now() - start;
        const error = err instanceof Error ? err.message : "Unknown error";

        await db.insert(healthChecks).values({
          moduleSlug: mod.slug,
          status: "down",
          latencyMs,
          error,
        });

        results.push({
          slug: mod.slug,
          status: "down",
          latencyMs,
          lastChecked: new Date().toISOString(),
          error,
        });
      }
    }

    res.json(results);
  } catch (err) {
    next(err);
  }
});

/** GET /api/health/modules/:slug — single module health history */
router.get("/modules/:slug", async (req, res, next) => {
  try {
    const { slug } = req.params;
    const checks = await db
      .select()
      .from(healthChecks)
      .where(eq(healthChecks.moduleSlug, slug))
      .orderBy(desc(healthChecks.checkedAt))
      .limit(100);

    res.json(checks);
  } catch (err) {
    next(err);
  }
});

export default router;
