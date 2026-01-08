import { PortfolioNavbar } from "@/components/PortfolioNavbar"
import { Footer } from "@/components/Footer"
import { FeatureGrid } from "@/components/FeatureGrid"
import content from "@/data/content.json"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function ComplianceCenterPage() {
    const modules = content.modules.complianceCenter

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            <PortfolioNavbar />

            <main className="pt-32 pb-16">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-[#156d95] mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
                    </Link>

                    <div className="max-w-3xl">
                        <h1 className="text-4xl font-bold tracking-tight text-[#111A4A] sm:text-6xl mb-6">
                            Compliance Center
                        </h1>
                        <p className="text-xl leading-8 text-gray-600 mb-8">
                            Your central hub for permits, safety docs, QA/QC, and closeout packages.
                        </p>
                    </div>
                </div>

                <FeatureGrid
                    title="Tools & Record Keeping"
                    subtitle="Everything you need to stay audit-ready."
                    features={modules}
                />
            </main>

            <Footer />
        </div>
    )
}
