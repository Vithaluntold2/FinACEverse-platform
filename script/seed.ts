import pg from "pg";
import bcrypt from "bcryptjs";

const { Pool } = pg;

async function seed() {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    console.error("❌ DATABASE_URL is required");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: DATABASE_URL });

  try {
    console.log("🔄 Seeding FinACEverse Command Center database...\n");

    // 1. Create tables if they don't exist (idempotent)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        display_name VARCHAR(100) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'team_member',
        is_active BOOLEAN NOT NULL DEFAULT true,
        last_login_at TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS module_configs (
        id SERIAL PRIMARY KEY,
        module_slug VARCHAR(50) UNIQUE NOT NULL,
        is_enabled BOOLEAN NOT NULL DEFAULT true,
        health_endpoint TEXT,
        api_base_url TEXT,
        custom_domain VARCHAR(255),
        metadata JSONB,
        updated_by INTEGER REFERENCES users(id),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS health_checks (
        id SERIAL PRIMARY KEY,
        module_slug VARCHAR(50) NOT NULL,
        status VARCHAR(20) NOT NULL,
        latency_ms INTEGER,
        status_code INTEGER,
        error TEXT,
        checked_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        action VARCHAR(100) NOT NULL,
        resource VARCHAR(100) NOT NULL,
        resource_id VARCHAR(255),
        details JSONB,
        ip_address VARCHAR(45),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    console.log("✅ Tables created/verified");

    // 2. Upsert founder user (idempotent — safe to run multiple times)
    const passwordHash = await bcrypt.hash("admin123", 12);
    await pool.query(
      `INSERT INTO users (username, email, password_hash, display_name, role)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (username) DO UPDATE SET
         email = EXCLUDED.email,
         display_name = EXCLUDED.display_name,
         role = EXCLUDED.role,
         updated_at = NOW()`,
      ["admin", "admin@finaceverse.io", passwordHash, "Founder", "founder"]
    );
    console.log("✅ Founder user upserted: admin / admin123");

    // 3. Upsert module configs for all 10 products
    const modules = [
      { slug: "accute", endpoint: "https://accute.io/api/health" },
      { slug: "askluca", endpoint: null },
      { slug: "finaceverse", endpoint: "https://finaceverse.io/api/health" },
      { slug: "finaidhub", endpoint: null },
      { slug: "cyloid", endpoint: "https://web-production-df94c.up.railway.app/api/health" },
      { slug: "ep-iq", endpoint: null },
      { slug: "taxblitz", endpoint: null },
      { slug: "audric", endpoint: null },
      { slug: "sumbuddy", endpoint: null },
      { slug: "acso", endpoint: null },
    ];

    for (const mod of modules) {
      await pool.query(
        `INSERT INTO module_configs (module_slug, is_enabled, health_endpoint)
         VALUES ($1, $2, $3)
         ON CONFLICT (module_slug) DO UPDATE SET
           health_endpoint = COALESCE(EXCLUDED.health_endpoint, module_configs.health_endpoint),
           updated_at = NOW()`,
        [mod.slug, true, mod.endpoint]
      );
    }
    console.log("✅ Module configs upserted: 10 modules");

    // 4. Seed an initial audit log entry
    await pool.query(
      `INSERT INTO audit_logs (action, resource, details)
       SELECT 'system.seed', 'database', '{"message": "Initial database seed"}'::jsonb
       WHERE NOT EXISTS (
         SELECT 1 FROM audit_logs WHERE action = 'system.seed' AND resource = 'database'
       )`
    );
    console.log("✅ Audit log seed entry verified");

    console.log("\n🎉 Database seeding complete!");
    console.log("   Login: admin / admin123");
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
