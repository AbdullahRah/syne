import { PortfolioNavbar } from "@/components/PortfolioNavbar"
import { Footer } from "@/components/Footer"
import content from "@/data/content.json"
import Link from "next/link"
import { Check } from "lucide-react"

export default function PricingPage() {
    const { contractors, inspectors, addons } = content.pricing

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            <PortfolioNavbar />

            <main className="pt-32 pb-16">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-[#111A4A] sm:text-6xl mb-6">
                        Simple, transparent pricing
                    </h1>
                    <p className="text-xl leading-8 text-gray-600 mb-16">
                        Predictable costs for crews, sites, and municipalities.
                    </p>

                    {/* Contractors Grid */}
                    <div className="mb-20">
                        <h2 className="text-2xl font-bold text-[#156d95] mb-8">For Contractors</h2>
                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {contractors.map((plan, i) => (
                                <div key={i} className="rounded-3xl p-8 ring-1 ring-gray-200 bg-white shadow-lg flex flex-col items-start text-left hover:shadow-xl transition-shadow">
                                    <h3 className="text-lg font-semibold leading-8 text-gray-900">{plan.name}</h3>
                                    <p className="mt-4 text-3xl font-bold tracking-tight text-gray-900">{plan.price}</p>
                                    <ul className="mt-8 space-y-3 text-sm leading-6 text-gray-600 mb-8 flex-1">
                                        {plan.includes.map((feature, j) => (
                                            <li key={j} className="flex gap-x-3">
                                                <Check className="h-6 w-5 flex-none text-[#156d95]" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    <Link href="/contact" className="mt-8 block w-full rounded-md bg-[#156d95] px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-[#156d95]/90">
                                        Get started
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Inspectors Grid */}
                    <div className="mb-20">
                        <h2 className="text-2xl font-bold text-[#167E6C] mb-8">For Inspectors & Municipalities</h2>
                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {inspectors.map((plan, i) => (
                                <div key={i} className="rounded-3xl p-8 ring-1 ring-emerald-100 bg-emerald-50/30 flex flex-col items-start text-left">
                                    <h3 className="text-lg font-semibold leading-8 text-gray-900">{plan.name}</h3>
                                    <p className="mt-4 text-3xl font-bold tracking-tight text-gray-900">{plan.price}</p>
                                    <ul className="mt-8 space-y-3 text-sm leading-6 text-gray-600 mb-8 flex-1">
                                        {plan.includes.map((feature, j) => (
                                            <li key={j} className="flex gap-x-3">
                                                <Check className="h-6 w-5 flex-none text-[#167E6C]" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    <Link href="/contact" className="mt-8 block w-full rounded-md bg-[#167E6C] px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-[#167E6C]/90">
                                        Contact Sales
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Add-ons Table */}
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Expert Services & Add-ons</h2>
                        <div className="rounded-xl border border-gray-200 overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {addons.map((addon, i) => (
                                        <tr key={i}>
                                            <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-gray-900 text-left">{addon.name}</td>
                                            <td className="whitespace-nowrap py-4 pl-3 pr-6 text-sm text-gray-500 text-right">{addon.price}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    )
}
