import { PortfolioNavbar } from "@/components/PortfolioNavbar"
import { Footer } from "@/components/Footer"
import content from "@/data/content.json"
import Link from "next/link"
import { Check, ShieldCheck } from "lucide-react"

export default function BuildingCodePage() {
    const data = content.buildingCodeCompliancePage

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <PortfolioNavbar />

            <main className="pt-32 pb-16">
                <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200 text-slate-700 text-xs uppercase tracking-wider font-semibold mb-6">
                        <ShieldCheck size={14} />
                        Official Verification
                    </div>

                    <h1 className="text-4xl font-serif tracking-tight text-[#111A4A] sm:text-5xl mb-8 leading-tight">
                        Building Code Compliance
                    </h1>

                    <p className="text-xl leading-8 text-slate-600 mb-12 italic border-l-4 border-[#167E6C] pl-6 text-left bg-white p-6 rounded-r-lg shadow-sm">
                        "{data.definition}"
                    </p>

                    <div className="text-left bg-white rounded-2xl p-8 sm:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 mb-16">
                        <h2 className="text-2xl font-bold text-[#111A4A] mb-4">Our Approach</h2>
                        <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                            {data.whatWeDo}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {data.keywords.map((k, i) => (
                                <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 text-sm font-medium rounded-md border border-slate-200">
                                    {k}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-[#111A4A] py-24 text-white">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <h2 className="text-3xl font-bold mb-16 text-center">Comprehensive Service Offerings</h2>
                        <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                            {data.offerings.map((offering, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="w-6 h-6 rounded-full bg-[#167E6C] flex items-center justify-center shrink-0 mt-1">
                                        <Check className="w-3 h-3 text-white" />
                                    </div>
                                    <p className="text-lg text-slate-300">{offering}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-16 flex items-center justify-center gap-x-6">
                            <Link
                                href="/contact"
                                className="rounded-md bg-[#167E6C] px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-[#167E6C]/90 transition-all"
                            >
                                Request Compliance Review
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
