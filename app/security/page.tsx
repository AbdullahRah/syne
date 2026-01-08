import { PortfolioNavbar } from "@/components/PortfolioNavbar"
import { Footer } from "@/components/Footer"
import Link from "next/link"
import { Lock, Server, Shield, ArrowLeft } from "lucide-react"

export default function SecurityPage() {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            <PortfolioNavbar />

            <main className="pt-32 pb-16">
                <div className="mx-auto max-w-4xl px-6 lg:px-8">
                    <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-[#156d95] mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
                    </Link>

                    <h1 className="text-3xl font-bold tracking-tight text-[#111A4A] sm:text-5xl mb-6">
                        Security & Data Integrity
                    </h1>
                    <p className="text-xl leading-8 text-gray-600 mb-16">
                        Your project data is yours. We ensure it remains secure, verifiable, and available.
                    </p>

                    <div className="grid gap-8 md:grid-cols-3 mb-16">
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                            <Shield className="w-10 h-10 text-[#167E6C] mb-4" />
                            <h3 className="text-lg font-bold text-[#111A4A] mb-2">Audit Trails</h3>
                            <p className="text-gray-600 text-sm">Every action is logged with timestamp, user ID, and associated evidence. Inspect the history of any record.</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                            <Lock className="w-10 h-10 text-[#156d95] mb-4" />
                            <h3 className="text-lg font-bold text-[#111A4A] mb-2">Access Control</h3>
                            <p className="text-gray-600 text-sm">Role-based permissions ensure contractors see their jobs, and inspectors see only relevant compliance data.</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                            <Server className="w-10 h-10 text-purple-600 mb-4" />
                            <h3 className="text-lg font-bold text-[#111A4A] mb-2">Data Ownership</h3>
                            <p className="text-gray-600 text-sm">You retain full ownership of your project data. Export standard formats (PDF, CSV, JSON) at any time.</p>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                        <h2 className="text-xl font-bold text-[#111A4A] mb-4">Compliance Confidence</h2>
                        <p className="text-gray-600 mb-4">
                            Syne is built to meet the rigorous documentation standards of municipal building departments. Our "Defensible Documentation" standard ensures that every approved checkpoint can be traced back to a specific code rule and visual evidence.
                        </p>
                        <p className="text-gray-600">
                            Questions about security reviews? <Link href="/contact" className="text-[#156d95] underline">Contact our security team</Link>.
                        </p>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    )
}
