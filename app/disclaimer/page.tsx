import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer - syneOps",
  description:
    "Important information about syneOps compliance documents, readiness scores, and the scope of our platform.",
};

export default function DisclaimerPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden noise-overlay">
      <Navigation />

      {/* Hero */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
            <span className="w-8 h-px bg-foreground/30" />
            Legal
          </span>
          <h1 className="text-5xl lg:text-7xl font-display tracking-tight mb-8">
            Disclaimer
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
            syneOps exists to make PIPEDA compliance and cyber insurance
            readiness accessible to every Canadian business. Here is what you
            should know about how our platform works and the boundaries of what
            we provide.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24 border-t border-foreground/10">
        <div className="max-w-[800px] mx-auto px-6 lg:px-12">
          <div className="space-y-16">
            {/* Section 1 */}
            <div>
              <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-4">
                <span className="w-8 h-px bg-foreground/30" />
                01
              </span>
              <h2 className="text-2xl lg:text-3xl font-display mb-6">
                Our documents are a starting point — not legal advice
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  syneOps generates compliance documentation frameworks that are
                  customized to your business based on the information you
                  provide. These documents are built to give you a structured,
                  comprehensive foundation — the kind of draft that would
                  otherwise take weeks to assemble from scratch.
                </p>
                <p>
                  They are not legal opinions. They do not constitute legal
                  advice. And they should not be treated as a replacement for
                  working with qualified legal counsel where your situation
                  requires it.
                </p>
                <p>
                  What they do is take your business from having nothing
                  documented to having a solid working draft that covers the
                  essentials. For the vast majority of Canadian businesses, that
                  gap — from zero to a structured compliance package — is the
                  hardest part. syneOps closes it.
                </p>
              </div>
            </div>

            {/* Section 2 */}
            <div>
              <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-4">
                <span className="w-8 h-px bg-foreground/30" />
                02
              </span>
              <h2 className="text-2xl lg:text-3xl font-display mb-6">
                Scores are directional, not certified
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  When you complete a syneOps assessment, you receive two scores:
                  a PIPEDA compliance score and a cyber insurance readiness
                  score. These scores tell you where you stand — and where the
                  gaps are.
                </p>
                <p>
                  Your PIPEDA compliance score measures your business against the
                  10 fair information principles outlined in the Act. It is a
                  readiness assessment. It is not an audit. It does not certify
                  compliance, and it should not be represented as such to
                  regulators, partners, or customers.
                </p>
                <p>
                  Your insurance readiness score indicates how likely your
                  business is to meet the requirements that cyber insurers
                  evaluate during underwriting. It is based on common underwriting
                  criteria, but every insurer has its own process. A strong score
                  means you are well-positioned — it does not guarantee approval,
                  specific coverage terms, or premium rates.
                </p>
                <p>
                  Both scores are tools to help you understand your position and
                  prioritize action. They are directional indicators, not
                  certified outcomes.
                </p>
              </div>
            </div>

            {/* Section 3 */}
            <div>
              <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-4">
                <span className="w-8 h-px bg-foreground/30" />
                03
              </span>
              <h2 className="text-2xl lg:text-3xl font-display mb-6">
                Regulated industries may need additional review
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  If your business operates in financial services, healthcare, or
                  another regulated sector, the compliance landscape is more
                  complex. Provincial regulations, sector-specific requirements,
                  and evolving federal legislation like Bill C-27 may introduce
                  obligations beyond what a general PIPEDA framework covers.
                </p>
                <p>
                  In these cases, we recommend having a privacy lawyer review the
                  documentation syneOps produces. The output is designed to make
                  that review faster and more productive — legal professionals
                  consistently tell us they would rather start with a solid,
                  organized draft than build everything from the ground up.
                </p>
                <p>
                  syneOps gets you to roughly 80% of where you need to be. For
                  many businesses, that is enough to operate confidently. For
                  others, it is the foundation that makes the remaining 20% far
                  more manageable.
                </p>
              </div>
            </div>

            {/* Section 4 */}
            <div>
              <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-4">
                <span className="w-8 h-px bg-foreground/30" />
                04
              </span>
              <h2 className="text-2xl lg:text-3xl font-display mb-6">
                Your responsibility
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  By using syneOps, you acknowledge that the compliance documents,
                  readiness scores, and recommendations provided through our
                  platform are informational tools. They are intended to support
                  your compliance efforts, not replace professional judgement.
                </p>
                <p>
                  You are responsible for ensuring that your business meets all
                  applicable legal and regulatory obligations. syneOps provides the
                  framework. How you implement it, and whether you seek
                  additional professional advice, is your decision.
                </p>
                <p>
                  Staqtech Inc. and syneOps shall not be held liable for any
                  decisions made, actions taken, or outcomes resulting from the
                  use of our platform, documents, or scores.
                </p>
              </div>
            </div>

            {/* Section 5 */}
            <div>
              <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-4">
                <span className="w-8 h-px bg-foreground/30" />
                05
              </span>
              <h2 className="text-2xl lg:text-3xl font-display mb-6">
                Changes to this disclaimer
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  We may update this disclaimer from time to time as our platform
                  evolves and as Canadian privacy legislation changes. When we do,
                  the revised version will be posted here with an updated
                  effective date. We encourage you to review this page
                  periodically.
                </p>
                <p className="text-sm font-mono text-foreground/50 pt-4 border-t border-foreground/10">
                  Last updated: March 2026
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
