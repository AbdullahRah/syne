import { PortfolioNavbar } from "@/components/PortfolioNavbar"
import { Footer } from "@/components/Footer"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import content from "@/data/content.json"
import Link from "next/link"
import { ArrowLeft, FileDown, Map } from "lucide-react"

export default function ResourcesPage() {
    const faqs = content.faq

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
                            Resources & FAQ
                        </h1>
                        <p className="text-xl leading-8 text-gray-600">
                            Answers to common questions and helpful downloads.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="md:col-span-2">
                            <h2 className="text-2xl font-bold text-[#111A4A] mb-6">Frequently Asked Questions</h2>
                            <Accordion type="single" collapsible className="w-full">
                                {faqs.map((faq, i) => (
                                    <AccordionItem key={i} value={`item-${i}`}>
                                        <AccordionTrigger className="text-left font-medium text-gray-900">{faq.q}</AccordionTrigger>
                                        <AccordionContent className="text-gray-600">
                                            {faq.a}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <h3 className="font-semibold text-[#111A4A] mb-4 flex items-center gap-2">
                                    <FileDown className="w-5 h-5 text-[#156d95]" /> Downloads
                                </h3>
                                <ul className="space-y-4">
                                    <li>
                                        <a href="#" className="block text-sm group">
                                            <span className="font-medium text-gray-900 group-hover:text-[#156d95]">Sample Approval Package</span>
                                            <span className="block text-gray-500 text-xs mt-1">PDF • 2.4 MB</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <h3 className="font-semibold text-[#111A4A] mb-4 flex items-center gap-2">
                                    <Map className="w-5 h-5 text-[#167E6C]" /> Launch Jurisdictions
                                </h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Currently onboarding partners in <strong>Alberta</strong> (Calgary, Edmonton). National expansion roadmap coming soon.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
