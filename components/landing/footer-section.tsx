"use client";

import { ArrowUpRight } from "lucide-react";
import { AnimatedWave } from "./animated-wave";

const footerLinks = {
  Products: [
    { name: "PIPEDA Compliance", href: "#features" },
    { name: "Insurance Readiness", href: "#features" },
    { name: "Incident Response", href: "#features" },
    { name: "Vendor Risk", href: "#features" },
  ],
  Solutions: [
    { name: "Financial Services", href: "#integrations" },
    { name: "Healthcare", href: "#integrations" },
    { name: "Professional Services", href: "#integrations" },
    { name: "Technology / SaaS", href: "#integrations" },
  ],
  Resources: [
    { name: "Blog", href: "#" },
    { name: "PIPEDA Checklist", href: "#" },
    { name: "Bill C-27 Guide", href: "#" },
    { name: "Free Assessment", href: "/assessment" },
  ],
  Company: [
    { name: "About", href: "#" },
    { name: "Pricing", href: "#pricing" },
    { name: "Contact", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "Disclaimer", href: "/disclaimer" },
  ],
};

const socialLinks = [
  { name: "Twitter", href: "https://x.com/syneautonomous" },
  { name: "LinkedIn", href: "https://www.linkedin.com/company/syneautonomous" },
];

export function FooterSection() {
  return (
    <footer className="relative border-t border-foreground/10">
      {/* Animated wave background */}
      <div className="absolute inset-0 h-64 opacity-20 pointer-events-none overflow-hidden">
        <AnimatedWave />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Main Footer */}
        <div className="py-16 lg:py-24">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-12 lg:gap-8">
            {/* Brand Column */}
            <div className="col-span-2">
              <a href="#" className="inline-flex items-center gap-2 mb-6">
                <span className="text-2xl font-display">syneOps</span>
              </a>

              <p className="text-muted-foreground leading-relaxed mb-8 max-w-xs">
                PIPEDA compliance and cyber insurance readiness for every Canadian business.
                Built by Staqtech, out of Calgary.
              </p>

              {/* Social Links */}
              <div className="flex gap-6">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="text-sm font-medium mb-6">{title}</h3>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; 2026 Staqtech Inc. All rights reserved.
          </p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <span className="text-foreground/20">|</span>
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <span className="text-foreground/20">|</span>
            <a href="#" className="hover:text-foreground transition-colors">Cookies</a>
            <span className="text-foreground/20">|</span>
            <a href="/disclaimer" className="hover:text-foreground transition-colors">Disclaimer</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
