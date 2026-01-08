"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle2, FileText, HardHat } from "lucide-react"
import Link from "next/link"
import content from "@/data/content.json"

export const SyneHero = () => {
    const [isVisible, setIsVisible] = useState(false)
    const [typingComplete, setTypingComplete] = useState(false)

    useEffect(() => {
        setIsVisible(true)
        const timer = setTimeout(() => setTypingComplete(true), 1000)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="w-full overflow-hidden bg-white relative">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 pt-32 sm:py-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Text Content */}
                    <div className="relative z-10">
                        <div
                            className="relative h-6 inline-flex items-center font-mono uppercase text-xs text-[#167E6C] mb-8"
                            style={{
                                fontFamily: "var(--font-geist-mono), 'Geist Mono', ui-monospace, monospace",
                            }}
                        >
                            <div className="flex items-center gap-2 overflow-hidden bg-[#167E6C]/10 px-3 py-1 rounded-full">
                                <span className="block whitespace-nowrap overflow-hidden text-[#167E6C] font-semibold">
                                    {content.brand.tagline}
                                </span>
                            </div>
                        </div>

                        <h1
                            className="text-[42px] leading-[1.1] sm:text-[56px] font-bold tracking-tight text-[#111A4A] mb-6"
                            style={{
                                fontFamily: "var(--font-figtree), Figtree",
                            }}
                        >
                            {content.hero.headlineOptions[0]}
                        </h1>

                        <p
                            className="text-lg leading-7 text-[#111A4A] opacity-70 mt-0 mb-8 max-w-xl"
                            style={{
                                fontFamily: "var(--font-figtree), Figtree",
                            }}
                        >
                            {content.hero.subheadline}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href={content.hero.primaryCta.href}
                                className="relative inline-flex justify-center items-center leading-4 text-center cursor-pointer whitespace-nowrap outline-none font-semibold h-12 text-white bg-[#156d95] rounded-xl px-6 transition-all duration-200 ease-in-out hover:bg-[#156d95]/90 shadow-sm hover:shadow-md"
                            >
                                {content.hero.primaryCta.label}
                            </Link>
                            <Link
                                href={content.hero.secondaryCta.href}
                                className="relative inline-flex justify-center items-center leading-4 text-center cursor-pointer whitespace-nowrap outline-none font-medium h-12 text-[#232730] bg-white border border-gray-200 rounded-xl px-6 transition-all duration-200 ease-in-out hover:bg-gray-50 hover:border-gray-300"
                            >
                                {content.hero.secondaryCta.label}
                            </Link>
                        </div>

                        <div className="mt-10 flex items-center gap-4 text-sm text-gray-500">
                            {content.brand.credibilityCues.map((cue, i) => (
                                <div key={i} className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#167E6C]" />
                                    {cue}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Visual Content */}
                    <div className="relative h-[400px] lg:h-[600px] w-full bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden shadow-2xl shadow-gray-200/50 flex items-center justify-center">
                        {/* Abstract Construction UI representation */}
                        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative z-10 bg-white rounded-xl shadow-xl border border-gray-200 w-3/4 max-w-sm p-4"
                        >
                            <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-3">
                                <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
                                    <HardHat size={18} />
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-gray-900">Site Inspection</div>
                                    <div className="text-xs text-gray-500 max-w-[12px] truncate">102 - Framing Check</div>
                                </div>
                                <div className="ml-auto text-xs font-mono bg-green-50 text-green-700 px-2 py-1 rounded">PASS</div>
                            </div>

                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex gap-2 items-start">
                                        <CheckCircle2 className="w-4 h-4 text-[#167E6C] mt-0.5 shrink-0" />
                                        <div className="space-y-1">
                                            <div className="h-2 w-32 bg-gray-100 rounded"></div>
                                            <div className="h-2 w-20 bg-gray-100 rounded"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="absolute -right-12 bottom-20 bg-white rounded-xl shadow-lg border border-gray-200 p-4 w-48"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <FileText className="w-4 h-4 text-blue-500" />
                                <span className="text-xs font-semibold">Audit Trail</span>
                            </div>
                            <div className="space-y-2">
                                <div className="h-1.5 w-full bg-gray-100 rounded"></div>
                                <div className="h-1.5 w-3/4 bg-gray-100 rounded"></div>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>
        </div>
    )
}
