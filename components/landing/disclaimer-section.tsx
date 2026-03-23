"use client";

import { useEffect, useState, useRef } from "react";
import { FileText, BarChart3, Scale, ArrowRight } from "lucide-react";

const disclaimerPoints = [
  {
    icon: FileText,
    title: "Compliance Documents",
    description:
      "syneOps generates documentation frameworks customized to your business. These documents are designed to take you from zero to a strong working draft — the kind of foundation that saves weeks of work. They are not legal opinions, and they are not a substitute for qualified legal counsel.",
  },
  {
    icon: BarChart3,
    title: "Readiness Scores",
    description:
      "Your PIPEDA compliance score reflects where your business stands relative to the 10 fair information principles. Your insurance readiness score indicates whether you are likely to meet underwriting requirements. Both are directional assessments — not audits, not certifications, and not guarantees of any outcome.",
  },
  {
    icon: Scale,
    title: "Regulated Industries",
    description:
      "If your business operates in a regulated sector — financial services, healthcare, or similar — you may need a privacy lawyer to review the output. That said, even legal professionals prefer reviewing a solid, structured draft over starting from scratch. syneOps gives you that draft.",
  },
];

export function DisclaimerSection() {
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
    <section
      id="disclaimer"
      ref={sectionRef}
      className="relative py-24 lg:py-32 border-t border-foreground/10"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div
          className={`transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
            <span className="w-8 h-px bg-foreground/30" />
            Important information
          </span>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
            <div>
              <h2 className="text-3xl lg:text-5xl font-display tracking-tight mb-6 leading-[0.95]">
                What syneOps is.
                <br />
                And what it is not.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We built syneOps to close the gap between where most Canadian
                businesses are on privacy compliance and where they need to be. Our
                platform gets you most of the way there — fast. But we believe in
                being upfront about what that means.
              </p>

              <a
                href="/disclaimer"
                className="inline-flex items-center gap-2 mt-8 text-sm font-mono text-foreground hover:text-muted-foreground transition-colors group"
              >
                Read full disclaimer
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            <div className="grid gap-6">
              {disclaimerPoints.map((point, index) => (
                <div
                  key={point.title}
                  className={`p-6 border border-foreground/10 hover:border-foreground/20 transition-all duration-500 group ${
                    isVisible
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-8"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-10 h-10 flex items-center justify-center border border-foreground/10 group-hover:bg-foreground group-hover:text-background transition-colors duration-300">
                      <point.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1 group-hover:translate-x-1 transition-transform duration-300">
                        {point.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {point.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
