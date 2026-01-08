import { PortfolioNavbar } from "@/components/PortfolioNavbar"
import { Footer } from "@/components/Footer"
import content from "@/data/content.json"
import Link from "next/link"
import { ArrowLeft, Plug } from "lucide-react"

export default function IntegrationsPage() {
    const integrations = content.modules.integrations

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            <PortfolioNavbar />

            <main className="pt-32 pb-16">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-[#156d95] mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
                    </Link>

                    <div className="max-w-3xl mb-16">
                        <h1 className="text-4xl font-bold tracking-tight text-[#111A4A] sm:text-6xl mb-6">
                            Connect your existing tools
                        </h1>
                        <p className="text-xl leading-8 text-gray-600">
                            Syne plays nice with the software you already use.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {integrations.map((item, i) => (
                            <div key={i} className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow shadow-slate-200 border border-slate-100 p-6 flex items-start gap-4 hover:shadow-md transition-shadow">
                                <div className="bg-blue-50 p-2 rounded-lg text-[#156d95] shrink-0">
                                    <Plug size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-[#111A4A]">{item.name}</h3>
                                    <p className="mt-1 text-sm text-gray-500">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 bg-gray-50 rounded-2xl p-8 text-center">
                        <p className="text-gray-600 mb-4">Don't see your tool?</p>
                        <Link href="/contact" className="text-[#156d95] font-semibold hover:underline">Request an integration &rarr;</Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
