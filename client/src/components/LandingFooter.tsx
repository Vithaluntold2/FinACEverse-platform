import { MODULE_REGISTRY } from "@shared/types";

export default function LandingFooter() {
  return (
    <footer className="border-t border-[#2a2540] bg-[#0a0812] py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#70a9e0] to-[#3b7fb6] text-sm font-extrabold text-white">
                F
              </div>
              <span className="text-lg font-bold text-white">FinACEverse</span>
            </div>
            <p className="text-sm text-[#9098a3] leading-relaxed max-w-md mb-4">
              AI-Powered Products for Finance Professionals. FinACEverse is an ecosystem
              of 10 AI products by Futurus FinACE Consulting Private Limited that automate
              accounting, tax, audit, and advisory workflows.
            </p>
            <div className="flex gap-3">
              {["LinkedIn", "X"].map(social => (
                <span key={social} className="text-xs text-[#9098a3] border border-[#2a2540] rounded-md px-2.5 py-1 hover:text-white hover:border-[#70a9e0]/30 transition-colors cursor-default">
                  {social}
                </span>
              ))}
            </div>
          </div>

          {/* Ecosystem */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Ecosystem</h4>
            <ul className="space-y-2.5">
              {MODULE_REGISTRY.slice(0, 6).map(mod => (
                <li key={mod.slug}>
                  <a href={`https://${mod.domain}`} target="_blank" rel="noopener noreferrer"
                    className="text-sm text-[#9098a3] hover:text-[#70a9e0] transition-colors">
                    {mod.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5">
              {["About", "Pilot Programs", "Expert Consultation", "Blog", "Careers"].map(item => (
                <li key={item}>
                  <span className="text-sm text-[#9098a3] cursor-default">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#2a2540] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#9098a3]">
            © {new Date().getFullYear()} Futurus FinACE Consulting Pvt Ltd. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-[#9098a3]">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
