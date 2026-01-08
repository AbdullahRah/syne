"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { Check, ArrowRight } from "lucide-react"
import content from "@/data/content.json"
import Link from "next/link"

export const AudienceSplit = () => {
    return (
        <section className="py-24 bg-gray-50/50">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                        Built for the entire project lifecycle
                    </h2>
                    <p className="mt-4 text-lg text-slate-600">
                        From the jobsite to the inspector's desk, Syne connects the dots.
                    </p>
                </div>

                <Tabs defaultValue="contractors" className="w-full max-w-5xl mx-auto">
                    <div className="flex justify-center mb-12">
                        <TabsList className="grid w-full max-w-md grid-cols-2 h-auto p-1 bg-gray-200/50 rounded-full">
                            <TabsTrigger
                                value="contractors"
                                className="rounded-full py-3 text-sm font-medium data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
                            >
                                Contractors & Trades
                            </TabsTrigger>
                            <TabsTrigger
                                value="inspectors"
                                className="rounded-full py-3 text-sm font-medium data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
                            >
                                Inspectors & Municipalities
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="contractors" className="outline-none">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/40">
                                <h3 className="text-2xl font-bold text-[#111A4A] mb-2">{content.audiences[0].title}</h3>
                                <p className="text-gray-600 mb-8">Reduce admin, capture every extra, and never fail an inspection twice.</p>

                                <ul className="space-y-4 mb-8">
                                    {content.audiences[0].bullets.map((bullet, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <Check className="w-5 h-5 text-[#156d95] mt-0.5 shrink-0" />
                                            <span className="text-gray-700 text-sm leading-6">{bullet}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Link href="/solutions/contractors" className="text-black hover:underline transition-all font-bold flex items-center gap-1 hover:gap-2 transition-all">
                                    See contractor solutions <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>

                            <div className="space-y-6">
                                {/* ROI Cards */}
                                <div className="grid grid-cols-2 gap-4">
                                    {content.audiences[0].roi.map((item, i) => (
                                        <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                                            <div className="font-medium text-gray-900 text-sm leading-tight">{item}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="inspectors" className="outline-none">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/40">
                                <h3 className="text-2xl font-bold text-[#111A4A] mb-2">{content.audiences[1].title}</h3>
                                <p className="text-gray-600 mb-8">Machine-readable code compliance that augments your expertise, not replaces it.</p>

                                <ul className="space-y-4 mb-8">
                                    {content.audiences[1].bullets.map((bullet, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <Check className="w-5 h-5 text-[#167E6C] mt-0.5 shrink-0" />
                                            <span className="text-gray-700 text-sm leading-6">{bullet}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Link href="/solutions/inspectors" className="text-[#167E6C] font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                                    See inspector solutions <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>

                            <div className="space-y-6">
                                {/* ROI Cards */}
                                <div className="grid grid-cols-2 gap-4">
                                    {content.audiences[1].roi.map((item, i) => (
                                        <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                                            <div className="font-medium text-gray-900 text-sm leading-tight">{item}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    )
}
