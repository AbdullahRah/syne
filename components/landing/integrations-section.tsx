"use client";

import { useEffect, useState, useRef } from "react";

const industries = [
  { name: "Financial Services", category: "Banks, credit unions, fintechs" },
  { name: "Healthcare", category: "Clinics, pharmacies, health tech" },
  { name: "Professional Services", category: "Law firms, accounting, consultancies" },
  { name: "Technology / SaaS", category: "Software companies, startups" },
  { name: "Energy & Resources", category: "Oil and gas, mining, utilities" },
  { name: "Construction & Trades", category: "Contractors, trades businesses" },
  { name: "Retail & E-Commerce", category: "Online and brick-and-mortar stores" },
  { name: "Education", category: "Schools, universities, ed-tech" },
  { name: "Insurance & Brokerage", category: "Brokers, underwriters, MGAs" },
  { name: "Real Estate", category: "Brokerages, property management" },
  { name: "Non-Profit", category: "Charities, foundations, NGOs" },
  { name: "Government", category: "Municipal, provincial services" },
];

export function IntegrationsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="integrations" ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div
          className={`text-center max-w-3xl mx-auto mb-16 lg:mb-24 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
            <span className="w-8 h-px bg-foreground/30" />
            Solutions
            <span className="w-8 h-px bg-foreground/30" />
          </span>
          <h2 className="text-4xl lg:text-6xl font-display tracking-tight mb-6">
            Built for every Canadian
            <br />
            business that handles
            <br />
            personal data.
          </h2>
          <p className="text-xl text-muted-foreground">
            PIPEDA compliance and cyber insurance readiness for every industry.
          </p>
        </div>

      </div>

      {/* Full-width marquees outside container */}
      <div className="w-full mb-6">
        <div className="flex gap-6 marquee">
          {[...Array(2)].map((_, setIndex) => (
            <div key={setIndex} className="flex gap-6 shrink-0">
              {industries.map((industry) => (
                <div
                  key={`${industry.name}-${setIndex}`}
                  className="shrink-0 px-8 py-6 border border-foreground/10 hover:border-foreground/30 hover:bg-foreground/[0.02] transition-all duration-300 group"
                >
                  <div className="text-lg font-medium group-hover:translate-x-1 transition-transform">
                    {industry.name}
                  </div>
                  <div className="text-sm text-muted-foreground">{industry.category}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Reverse marquee */}
      <div className="w-full">
        <div className="flex gap-6 marquee-reverse">
          {[...Array(2)].map((_, setIndex) => (
            <div key={setIndex} className="flex gap-6 shrink-0">
              {[...industries].reverse().map((industry) => (
                <div
                  key={`${industry.name}-reverse-${setIndex}`}
                  className="shrink-0 px-8 py-6 border border-foreground/10 hover:border-foreground/30 hover:bg-foreground/[0.02] transition-all duration-300 group"
                >
                  <div className="text-lg font-medium group-hover:translate-x-1 transition-transform">
                    {industry.name}
                  </div>
                  <div className="text-sm text-muted-foreground">{industry.category}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
