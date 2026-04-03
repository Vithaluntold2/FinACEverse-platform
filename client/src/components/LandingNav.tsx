import { useState } from "react";
import { Menu, X, ChevronRight } from "lucide-react";

export default function LandingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: "#products", label: "Products" },
    { href: "#solutions", label: "Solutions" },
    { href: "/admin", label: "Command Center" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#2a2540]/50 bg-[#0d0a14]/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#70a9e0] to-[#3b7fb6] text-sm font-extrabold text-white">
              F
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight">FinACEverse</span>
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-[#9098a3] hover:text-white transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="mailto:hello@finaceverse.io"
              className="inline-flex items-center gap-2 rounded-lg bg-[#70a9e0] px-4 py-2 text-sm font-semibold text-white hover:bg-[#5a93ca] transition-colors"
            >
              Request Demo
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden rounded-lg p-2 text-[#9098a3] hover:bg-[#1a1625]"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#2a2540] bg-[#0d0a14]">
          <div className="space-y-1 px-6 py-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-[#c0c8d1] hover:bg-[#1a1625]"
              >
                {l.label}
                <ChevronRight className="h-4 w-4 text-[#9098a3]" />
              </a>
            ))}
            <a
              href="mailto:hello@finaceverse.io"
              className="mt-3 block rounded-lg bg-[#70a9e0] px-4 py-2.5 text-center text-sm font-semibold text-white"
            >
              Request Demo
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
