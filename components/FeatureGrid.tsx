"use client"

import { CheckCircle2 } from "lucide-react"

interface Feature {
    name: string
    desc: string
}

interface FeatureGridProps {
    title: string
    subtitle: string
    features: Feature[]
}

export const FeatureGrid = ({ title, subtitle, features }: FeatureGridProps) => {
    return (
        <section className="py-24 bg-white">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center mb-16">
                    <h2 className="text-base font-semibold leading-7 text-emerald-600 uppercase tracking-widest text-[10px]">Capabilities</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        {title}
                    </p>
                    <p className="mt-6 text-lg leading-8 text-slate-600">
                        {subtitle}
                    </p>
                </div>
                <div className="mx-auto max-w-2xl lg:max-w-none">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                        {features.map((feature) => (
                            <div key={feature.name} className="flex flex-col">
                                <dt className="flex items-center gap-x-3 text-base font-bold leading-7 text-slate-900 uppercase tracking-tight">
                                    <CheckCircle2 className="h-5 w-5 flex-none text-emerald-600" aria-hidden="true" />
                                    {feature.name}
                                </dt>
                                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                                    <p className="flex-auto">{feature.desc}</p>
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </section>
    )
}
