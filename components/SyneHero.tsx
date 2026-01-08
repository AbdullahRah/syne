"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle2, FileText, HardHat } from "lucide-react"
import Link from "next/link"
import content from "@/data/content.json"

export const SyneHero = () => {
    const isVisible = true
    const { productName, tagline } = content.brand
    const { subheadline, primaryCta } = content.hero

    useEffect(() => {
        setIsVisible(true)
    }, [])

    return (
        <div className="w-full overflow-hidden bg-white relative">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 pt-32 sm:py-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Text Content */}
                    <div className="relative z-10">
                        <div className="mb-8">
                            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-800 ring-1 ring-inset ring-slate-200">
                                {tagline}
                            </span>
                        </div>

                        <h1 className="text-5xl font-bold tracking-tight text-slate-900 sm:text-7xl mb-6">
                            {productName}
                        </h1>

                        <p className="text-xl leading-8 text-slate-600 mb-10 max-w-xl">
                            {subheadline}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/contact"
                                className="inline-flex justify-center items-center h-12 text-white bg-black rounded-full px-8 text-base font-semibold hover:bg-black/90 shadow-sm transition-all"
                            >
                                Book a Demo
                            </Link>
                            <Link
                                href="/platform/dashboard"
                                className="inline-flex justify-center items-center h-12 text-slate-900 bg-white border border-slate-200 rounded-full px-8 text-base font-semibold hover:bg-slate-50 transition-all"
                            >
                                Go to Dashboard <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </div>

                        <div className="mt-12 flex flex-wrap gap-6 text-sm text-slate-500">
                            {content.brand.credibilityCues.map((cue, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    {cue}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Visual Content */}
                    <div className="relative">
                        <div className="relative h-[500px] w-full bg-slate-50 rounded-3xl border border-slate-200 overflow-hidden shadow-2xl flex items-center justify-center">
                            <img
                                src="/construction_hero.jpg"
                                alt="Modern Construction Site"
                                className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply"
                            />

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="relative z-10 bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-sm p-6 transform -rotate-1"
                            >
                                <div className="flex items-center gap-4 mb-4 border-b border-slate-50 pb-4">
                                    <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                                        <HardHat size={20} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-900">Site Inspection</div>
                                        <div className="text-xs text-slate-500">Lot 42 - Structural Review</div>
                                    </div>
                                    <div className="ml-auto">
                                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full border border-emerald-100">VERIFIED</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        "Foundation anchors matching plan",
                                        "Rebar spacing verified (6\" O.C.)",
                                        "Verticality checked within tolerance"
                                    ].map((text, i) => (
                                        <div key={i} className="flex gap-3 items-center">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                            <span className="text-sm text-slate-700 font-medium">{text}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                                transition={{ duration: 0.8, delay: 0.5 }}
                                className="absolute bottom-10 right-10 bg-black text-white rounded-2xl shadow-xl p-5 w-56 transform rotate-2"
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <FileText className="w-4 h-4 text-emerald-400" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Compliance Log</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-1.5 w-full bg-slate-800 rounded-full"></div>
                                    <div className="h-1.5 w-2/3 bg-slate-800 rounded-full"></div>
                                    <div className="h-1.5 w-full bg-slate-800 rounded-full"></div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
