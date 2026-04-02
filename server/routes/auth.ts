import { Router } from "express";
import bcrypt from "bcryptjs";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

/** POST /api/auth/login */
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required" });
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, String(username)))
      .limit(1);

    if (!user || !user.isActive) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(String(password), user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id));

    req.login(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        displayName: user.displayName,
      },
      (err) => {
        if (err) return next(err);
        res.json({
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          displayName: user.displayName,
        });
      }
    );
  } catch (err) {
    next(err);
  }
});

/** POST /api/auth/logout */
router.post("/logout", (req, res) => {
  req.logout(() => {
    res.json({ ok: true });
  });
});

/** GET /api/auth/me */
router.get("/me", requireAuth, (req, res) => {
  res.json(req.user);
});

/** POST /api/auth/setup — one-time founder creation */
router.post("/setup", async (req, res, next) => {
  try {
    const { username, email, password, setupKey } = req.body;

    if (setupKey !== process.env.ADMIN_SETUP_KEY) {
      return res.status(403).json({ error: "Invalid setup key" });
    }

    const existing = await db.select().from(users).limit(1);
    if (existing.length > 0) {
      return res.status(400).json({ error: "Setup already completed" });
    }

    const passwordHash = await bcrypt.hash(String(password), 12);
    const [user] = await db
      .insert(users)
      .values({
        username: String(username),
        email: String(email),
        passwordHash,
        displayName: String(username),
        role: "founder",
      })
      .returning();

    res.json({ id: user.id, username: user.username, role: user.role });
  } catch (err) {
    next(err);
  }
});

export default router;
