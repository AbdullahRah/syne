import { PortfolioNavbar } from "@/components/PortfolioNavbar"
import { Footer } from "@/components/Footer"
import { FeatureGrid } from "@/components/FeatureGrid"
import content from "@/data/content.json"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function ContractorsPage() {
    const data = content.audiences.find(a => a.key === 'contractors')!
    const modules = content.modules.jobsiteOperations

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
                            {data.title}
                        </h1>
                        <p className="text-xl leading-8 text-gray-600 mb-8">
                            Stop chasing paper and losing billables. Syne turns your jobsite chaos into a clean system of record.
                        </p>

                        <div className="flex flex-wrap gap-4 mb-12">
                            {data.roi.map((item, i) => (
                                <span key={i} className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-sm font-medium text-[#156d95] ring-1 ring-inset ring-blue-700/10">
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <FeatureGrid
                    title="Jobsite Operations"
                    subtitle="Automate the field work that slows you down."
                    features={modules}
                />

                <div className="bg-[#111A4A] py-24 sm:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Ready to streamline your sites?
                        </h2>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link
                                href="/contact"
                                className="rounded-md bg-[#167E6C] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#167E6C]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#167E6C]"
                            >
                                Get Started
                            </Link>
                            <Link href="/pricing" className="text-sm font-semibold leading-6 text-white">
                                View Pricing <span aria-hidden="true">→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
