import { Router } from "express";
import bcrypt from "bcryptjs";
import { db, hasDB } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

/**
 * In-memory user store for local development without PostgreSQL.
 * Seeded with a default founder account on startup.
 */
interface MemUser {
  id: number;
  username: string;
  email: string;
  passwordHash: string;
  displayName: string;
  role: string;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
}

const memUsers: MemUser[] = [];
let memIdSeq = 1;

// Seed a default dev user so the portal is usable without DB
(async () => {
  if (!hasDB) {
    const hash = await bcrypt.hash("admin123", 12);
    memUsers.push({
      id: memIdSeq++,
      username: "admin",
      email: "admin@finaceverse.io",
      passwordHash: hash,
      displayName: "Founder",
      role: "founder",
      isActive: true,
      lastLoginAt: null,
      createdAt: new Date(),
    });
    console.log("  Dev mode: seeded admin/admin123 (no PostgreSQL)");
  }
})();

/** POST /api/auth/login */
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required" });
    }

    let user: MemUser | undefined;

    if (hasDB) {
      const [row] = await db
        .select()
        .from(users)
        .where(eq(users.username, String(username)))
        .limit(1);
      if (row) user = row as unknown as MemUser;
    } else {
      user = memUsers.find((u) => u.username === String(username));
    }

    if (!user || !user.isActive) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(String(password), user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (hasDB) {
      await db
        .update(users)
        .set({ lastLoginAt: new Date() })
        .where(eq(users.id, user.id));
    } else {
      user.lastLoginAt = new Date();
    }

    const sessionUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      displayName: user.displayName,
    };

    req.login(sessionUser, (err) => {
      if (err) return next(err);
      res.json(sessionUser);
    });
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

    if (hasDB) {
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

      return res.json({ id: user.id, username: user.username, role: user.role });
    }

    // In-memory fallback
    if (memUsers.length > 0) {
      return res.status(400).json({ error: "Setup already completed" });
    }
    const passwordHash = await bcrypt.hash(String(password), 12);
    const newUser: MemUser = {
      id: memIdSeq++,
      username: String(username),
      email: String(email),
      passwordHash,
      displayName: String(username),
      role: "founder",
      isActive: true,
      lastLoginAt: null,
      createdAt: new Date(),
    };
    memUsers.push(newUser);
    res.json({ id: newUser.id, username: newUser.username, role: newUser.role });
  } catch (err) {
    next(err);
  }
});

export default router;
