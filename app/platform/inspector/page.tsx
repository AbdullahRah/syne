import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Search, Filter } from "lucide-react"

export default function InspectorPortalPage() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-[#111A4A]">Inspector Portal</h1>
                    <p className="text-gray-500">Review queue and approval packages.</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50">
                        <Filter size={16} /> Filter
                    </button>
                    <button className="bg-[#167E6C] text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-[#167E6C]/90 shadow-sm">
                        Start Review Session
                    </button>
                </div>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
                <div className="md:col-span-1 space-y-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                        <h3 className="font-semibold text-gray-900 mb-3">Queue</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center p-2 bg-slate-50 rounded border border-slate-200 cursor-pointer">
                                <span className="text-sm font-medium">Pending Review</span>
                                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">14</Badge>
                            </div>
                            <div className="flex justify-between items-center p-2 hover:bg-slate-50 rounded cursor-pointer transition-colors">
                                <span className="text-sm text-gray-600">Returned</span>
                                <Badge variant="outline" className="text-gray-600">3</Badge>
                            </div>
                            <div className="flex justify-between items-center p-2 hover:bg-slate-50 rounded cursor-pointer transition-colors">
                                <span className="text-sm text-gray-600">Approved</span>
                                <Badge variant="outline" className="text-gray-600">128</Badge>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-3 space-y-4">
                    {[
                        { id: "REV-2931", project: "Project Alpha", type: "Framing Inspection", status: "Ready", time: "Submitted 2h ago" },
                        { id: "REV-2930", project: "Downtown Office", type: "Rough-In Plumbing", status: "Ready", time: "Submitted 4h ago" },
                        { id: "REV-2928", project: "Westside Complex", type: "Final Walkthrough", status: "Returned", time: "Action required by contractor" },
                    ].map((item, i) => (
                        <Card key={i} className="hover:shadow-md transition-shadow cursor-pointer">
                            <CardContent className="p-0">
                                <div className="flex flex-col sm:flex-row gap-4 p-6">
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono text-xs text-gray-400">#{item.id}</span>
                                            <h3 className="font-bold text-[#111A4A] text-lg">{item.project}</h3>
                                            {item.status === 'Ready' && <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Ready for Review</Badge>}
                                            {item.status === 'Returned' && <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Returned</Badge>}
                                        </div>
                                        <p className="font-medium text-gray-700">{item.type}</p>
                                        <p className="text-xs text-gray-500">{item.time}</p>
                                    </div>
                                    <div className="flex items-center gap-2 border-l border-gray-100 pl-6">
                                        <button className="p-2 rounded-full hover:bg-green-50 text-gray-300 hover:text-green-600 transition-colors">
                                            <CheckCircle2 size={24} />
                                        </button>
                                        <button className="p-2 rounded-full hover:bg-red-50 text-gray-300 hover:text-red-600 transition-colors">
                                            <XCircle size={24} />
                                        </button>
                                    </div>
                                </div>
                                <div className="bg-slate-50 px-6 py-2 border-t border-gray-100 flex gap-4 text-xs font-medium text-gray-500">
                                    <span>32 Photos</span>
                                    <span>4 PDFs</span>
                                    <span>12 Checkpoints</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
