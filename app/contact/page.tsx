import { PortfolioNavbar } from "@/components/PortfolioNavbar"
import { Footer } from "@/components/Footer"
import content from "@/data/content.json"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function ContactPage() {
    const { fields } = content.leadForm

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <PortfolioNavbar />

            <main className="pt-32 pb-16">
                <div className="mx-auto max-w-xl px-6 lg:px-8">
                    <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-[#156d95] mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
                    </Link>

                    <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                        <div className="px-8 py-10 sm:px-12">
                            <h1 className="text-3xl font-bold tracking-tight text-[#111A4A] mb-2">
                                Book a Demo
                            </h1>
                            <p className="text-gray-600 mb-8">
                                See how Syne can streamline your compliance and closeout process.
                            </p>

                            <form className="space-y-6">
                                {fields.map((field) => (
                                    <div key={field}>
                                        <label htmlFor={field} className="block text-sm font-medium leading-6 text-gray-900">
                                            {field}
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                name={field}
                                                id={field}
                                                className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#156d95] sm:text-sm sm:leading-6 bg-white"
                                            />
                                        </div>
                                    </div>
                                ))}

                                <div>
                                    <button
                                        type="submit"
                                        className="flex w-full justify-center rounded-md bg-[#156d95] px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#156d95]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#156d95] transition-all"
                                    >
                                        Request Demo
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="bg-gray-50 px-8 py-6 sm:px-12 border-t border-gray-100">
                            <p className="text-xs text-center text-gray-500">
                                By submitting this form, you agree to our <Link href="#" className="underline">Terms</Link> and <Link href="/security" className="underline">Privacy Policy</Link>.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
