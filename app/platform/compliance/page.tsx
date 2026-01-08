import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Book, CheckCircle2 } from "lucide-react"

export default function CompliancePage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-[#111A4A]">Building Code Engine</h1>
                <p className="text-gray-500">Jurisdiction-aware rule library and verification.</p>
            </div>

            <div className="flex gap-4 items-center bg-white p-4 rounded-lg border border-gray-200">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                        className="w-full bg-slate-50 border border-gray-200 rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#167E6C]"
                        placeholder="Search code sections (e.g. 9.36.2.1)..."
                    />
                </div>
                <select className="bg-slate-50 border border-gray-200 rounded-md px-3 py-2 text-sm">
                    <option>Alberta Building Code 2019</option>
                    <option>National Building Code 2020</option>
                    <option>BC Building Code 2024</option>
                </select>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Recent Verifications</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { code: "9.36.2.7", section: "Air Intake & Outlet", status: "Pass", project: "Project Alpha", time: "10m ago" },
                                { code: "9.10.14", section: "Spatial Separation", status: "Flagged", project: "Project Beta", time: "2h ago" },
                                { code: "9.7.2.3", section: "Window Standards", status: "Pass", project: "Project Alpha", time: "5h ago" },
                                { code: "9.26.4.1", section: "Eaves Protection", status: "Pass", project: "Downtown Office", time: "1d ago" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                                    <div className="flex items-start gap-4">
                                        <div className={`mt-1 w-2 h-2 rounded-full ${item.status === 'Pass' ? 'bg-green-500' : 'bg-red-500'}`} />
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-xs font-semibold bg-slate-100 px-1.5 rounded">{item.code}</span>
                                                <span className="font-medium text-[#111A4A] text-sm">{item.section}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-0.5">{item.project} • {item.time}</p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className={item.status === 'Pass' ? 'text-green-700 bg-green-50 border-green-200' : 'text-red-700 bg-red-50 border-red-200'}>
                                        {item.status}
                                    </Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Rule Traceability</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
                                <div className="flex items-center gap-2 text-sm font-semibold text-[#111A4A]">
                                    <Book className="h-4 w-4" />
                                    <span>ABC 2019 Div B 9.36.2.7.(1)</span>
                                </div>
                                <p className="text-sm text-gray-600 font-mono text-xs leading-relaxed bg-white p-2 border border-gray-100 rounded">
                                    "The intake and outlet of a ventilation system... shall be protected to prevent the entry of rain, snow, and rodents..."
                                </p>
                                <div className="flex items-center justify-center py-2">
                                    <div className="h-8 w-px bg-slate-300"></div>
                                </div>
                                <div className="bg-white p-3 rounded border border-gray-200 flex items-center gap-3">
                                    <div className="bg-emerald-100 p-1.5 rounded-full text-emerald-700">
                                        <CheckCircle2 size={16} />
                                    </div>
                                    <div className="text-sm">
                                        <span className="font-semibold block">Mapped Verification Checkpoint</span>
                                        <span className="text-gray-500 text-xs">"Verify intake/outlet screens installed and weather protected."</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="bg-[#111A4A] text-white">
                        <CardHeader>
                            <CardTitle className="text-white">Coverage Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="text-3xl font-bold">12,402</div>
                                <div className="text-xs text-slate-400">Total Rules Indexed</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-[#167E6C]">100%</div>
                                <div className="text-xs text-slate-400">Alberta Building Code</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
