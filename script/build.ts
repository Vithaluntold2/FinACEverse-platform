import * as esbuild from "esbuild";

async function build() {
  await esbuild.build({
    entryPoints: ["server/index.ts"],
    outfile: "dist/index.cjs",
    platform: "node",
    format: "cjs",
    bundle: true,
    external: ["pg-native", "better-sqlite3"],
    target: "node20",
    sourcemap: true,
  });
  console.log("✅ Server built to dist/index.cjs");

  const { execSync } = await import("child_process");
  execSync("npx vite build", { stdio: "inherit" });
  console.log("✅ Client built to dist/public/");
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
