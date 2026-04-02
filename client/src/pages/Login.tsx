import { useState } from "react";
import { useAuth } from "../hooks/use-auth";
import { Globe, Lock, User, AlertCircle } from "lucide-react";

export default function Login() {
  const { login, loginError, isLoggingIn } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ username, password });
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel — branding */}
      <div className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-[hsl(var(--primary))] to-indigo-900 p-12 lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-lg font-bold text-white">
            F
          </div>
          <span className="text-xl font-bold text-white">FinACEverse</span>
        </div>

        <div className="space-y-6">
          <h2 className="text-4xl font-bold leading-tight text-white">
            Command Center
          </h2>
          <p className="text-lg text-white/70">
            Unified administration portal for the entire FinACEverse ecosystem.
            Monitor, configure, and manage all 10 modules from a single pane of glass.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              "accute.io",
              "askluca.io",
              "cyloid.io",
              "finaidhub.io",
              "ep-iq.io",
              "taxblitz.io",
              "audric.io",
              "sumbuddy.io",
              "acso.io",
              "finaceverse.io",
            ].map((domain) => (
              <div
                key={domain}
                className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm text-white/80"
              >
                <Globe className="h-3 w-3" />
                {domain}
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-white/40">
          © {new Date().getFullYear()} FinACEverse. All rights reserved.
        </p>
      </div>

      {/* Right panel — login form */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">
              Sign in
            </h1>
            <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
              Access the FinACEverse Command Center
            </p>
          </div>

          {loginError && (
            <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {loginError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[hsl(var(--foreground))]">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                  className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--input))] py-2.5 pl-10 pr-4 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--primary))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-[hsl(var(--foreground))]">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--input))] py-2.5 pl-10 pr-4 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--primary))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full rounded-lg bg-[hsl(var(--primary))] py-2.5 text-sm font-medium text-white hover:bg-[hsl(var(--primary))]/90 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:ring-offset-2 focus:ring-offset-[hsl(var(--background))] disabled:opacity-50 transition-colors"
            >
              {isLoggingIn ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
