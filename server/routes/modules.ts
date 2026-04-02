import { Router } from "express";
import { db } from "../db/index.js";
import { moduleConfigs, healthChecks } from "../db/schema.js";
import { MODULE_REGISTRY } from "../../shared/types.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { eq, desc } from "drizzle-orm";

const router = Router();

/** GET /api/modules — list all modules with config overrides */
router.get("/", requireAuth, async (_req, res, next) => {
  try {
    const configs = await db.select().from(moduleConfigs);
    const configMap = new Map(configs.map((c) => [c.moduleSlug, c]));

    const modules = MODULE_REGISTRY.map((mod) => {
      const config = configMap.get(mod.slug);
      return {
        ...mod,
        isEnabled: config?.isEnabled ?? true,
        apiBaseUrl: config?.apiBaseUrl ?? null,
        customDomain: config?.customDomain ?? null,
        metadata: config?.metadata ?? null,
      };
    });

    res.json(modules);
  } catch (err) {
    next(err);
  }
});

/** PUT /api/modules/:slug — update module config */
router.put(
  "/:slug",
  requireRole("founder", "technical_admin"),
  async (req, res, next) => {
    try {
      const { slug } = req.params;
      const valid = MODULE_REGISTRY.find((m) => m.slug === slug);
      if (!valid) {
        return res.status(404).json({ error: "Module not found" });
      }

      const { isEnabled, apiBaseUrl, customDomain, metadata } = req.body;
      const user = req.user as { id: number };

      const [existing] = await db
        .select()
        .from(moduleConfigs)
        .where(eq(moduleConfigs.moduleSlug, slug))
        .limit(1);

      if (existing) {
        const [updated] = await db
          .update(moduleConfigs)
          .set({
            isEnabled: isEnabled ?? existing.isEnabled,
            apiBaseUrl: apiBaseUrl ?? existing.apiBaseUrl,
            customDomain: customDomain ?? existing.customDomain,
            metadata: metadata ?? existing.metadata,
            updatedBy: user.id,
            updatedAt: new Date(),
          })
          .where(eq(moduleConfigs.moduleSlug, slug))
          .returning();
        return res.json(updated);
      }

      const [created] = await db
        .insert(moduleConfigs)
        .values({
          moduleSlug: slug,
          isEnabled: isEnabled ?? true,
          apiBaseUrl,
          customDomain,
          metadata,
          updatedBy: user.id,
        })
        .returning();

      res.json(created);
    } catch (err) {
      next(err);
    }
  }
);

/** GET /api/modules/:slug/health — latest health checks */
router.get("/:slug/health", requireAuth, async (req, res, next) => {
  try {
    const { slug } = req.params;
    const checks = await db
      .select()
      .from(healthChecks)
      .where(eq(healthChecks.moduleSlug, slug))
      .orderBy(desc(healthChecks.checkedAt))
      .limit(50);

    res.json(checks);
  } catch (err) {
    next(err);
  }
});

export default router;
