"use client";

import { useEffect, useState, useRef } from "react";

const overlapItems = [
  { pipeda: "Privacy Policy", insurer: "Acceptable Use Policy", syneops: "Policy Generator" },
  { pipeda: "Breach Notification Procedure", insurer: "Incident Response Plan", syneops: "IRP Builder + OPC Templates" },
  { pipeda: "Consent Documentation", insurer: "Access Control Documentation", syneops: "Consent Tracker + Audit Log" },
  { pipeda: "Privacy Officer Designation", insurer: "Security Training Records", syneops: "Officer Registry + Training Log" },
  { pipeda: "Data Security Safeguards", insurer: "MFA, EDR, Backup Proof", syneops: "Controls Checklist + Evidence Upload" },
  { pipeda: "Breach Record Keeping (24mo)", insurer: "Audit Trail / Evidence Pack", syneops: "Automated Breach Log" },
];

export function InfrastructureSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveItem((prev) => (prev + 1) % overlapItems.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left: Content */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
              <span className="w-8 h-px bg-foreground/30" />
              Why these belong together
            </span>
            <h2 className="text-4xl lg:text-6xl font-display tracking-tight mb-8">
              PIPEDA compliance
              <br />
              and cyber insurance
              <br />
              require the same
              <br />
              documentation.
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-12">
              Insurers use PIPEDA adherence as a proxy for risk scoring. One platform eliminates the duplication.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8">
              <div>
                <div className="text-4xl lg:text-5xl font-display mb-2">1</div>
                <div className="text-sm text-muted-foreground">Assessment</div>
              </div>
              <div>
                <div className="text-4xl lg:text-5xl font-display mb-2">2</div>
                <div className="text-sm text-muted-foreground">Scores</div>
              </div>
              <div>
                <div className="text-4xl lg:text-5xl font-display mb-2">30m</div>
                <div className="text-sm text-muted-foreground">To compliant</div>
              </div>
            </div>
          </div>

          {/* Right: Overlap comparison */}
          <div
            className={`transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            <div className="border border-foreground/10">
              {/* Header */}
              <div className="px-6 py-4 border-b border-foreground/10 flex items-center justify-between">
                <span className="text-sm font-mono text-muted-foreground">Compliance Overlap</span>
                <span className="flex items-center gap-2 text-xs font-mono text-green-600">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  syneOps delivers both
                </span>
              </div>

              {/* Items */}
              <div>
                {overlapItems.map((item, index) => (
                  <div
                    key={item.pipeda}
                    className={`px-6 py-5 border-b border-foreground/5 last:border-b-0 flex items-center justify-between transition-all duration-300 ${
                      activeItem === index ? "bg-foreground/[0.02]" : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                          activeItem === index ? "bg-foreground" : "bg-foreground/20"
                        }`}
                      />
                      <div>
                        <div className="font-medium">{item.pipeda}</div>
                        <div className="text-sm text-muted-foreground">{item.insurer}</div>
                      </div>
                    </div>
                    <span className="font-mono text-sm text-muted-foreground">{item.syneops}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
