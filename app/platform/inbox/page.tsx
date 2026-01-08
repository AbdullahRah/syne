import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Mic, Image as ImageIcon, Send } from "lucide-react"

export default function InboxPage() {
    return (
        <div className="h-[calc(100vh-8rem)] flex gap-4">
            {/* Thread List */}
            <div className="w-80 bg-white rounded-lg border border-gray-200 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                            className="w-full bg-slate-50 border border-gray-200 rounded-md pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#156d95]"
                            placeholder="Search messages..."
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {[
                        { name: "John - Project Alpha", msg: "Photo: Framing update", time: "2m", active: true },
                        { name: "Sarah - City Inspector", msg: "Permit approved #4492", time: "1h", active: false },
                        { name: "Mike - Concrete", msg: "Voice note (0:34)", time: "3h", active: false },
                        { name: "Project Beta Group", msg: "Material delivery delayed", time: "1d", active: false },
                    ].map((thread, i) => (
                        <div key={i} className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-slate-50 ${thread.active ? 'bg-blue-50/50' : ''}`}>
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-semibold text-sm text-[#111A4A]">{thread.name}</span>
                                <span className="text-xs text-gray-400">{thread.time}</span>
                            </div>
                            <p className="text-xs text-gray-500 truncate">{thread.msg}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat View */}
            <div className="flex-1 bg-white rounded-lg border border-gray-200 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="font-bold text-[#111A4A]">John - Project Alpha</h2>
                        <p className="text-xs text-gray-500">Contractor • +1 403-555-0192</p>
                    </div>
                    <button className="text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-md font-medium text-gray-600 hover:bg-gray-50">View Job Details</button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <div className="flex justify-end">
                        <div className="bg-[#156d95] text-white rounded-lg rounded-tr-none px-4 py-2 max-w-[80%] text-sm">
                            Hey John, any update on the west wall framing?
                        </div>
                    </div>
                    <div className="flex justify-start">
                        <div className="bg-gray-100 text-gray-800 rounded-lg rounded-tl-none px-4 py-2 max-w-[80%] text-sm">
                            Just finishing up. Here's a pic.
                        </div>
                    </div>
                    <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-lg rounded-tl-none overflow-hidden max-w-[60%] border border-gray-200">
                            <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                                [Photo Placeholder]
                            </div>
                        </div>
                    </div>

                    {/* System Message */}
                    <div className="flex justify-center my-4">
                        <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100">
                            System: Extracted "Framing Complete" • Logged to Daily Report
                        </span>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50/30">
                    <div className="flex gap-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"><ImageIcon size={20} /></button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"><Mic size={20} /></button>
                        <input
                            className="flex-1 bg-white border border-gray-200 rounded-full px-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#156d95]"
                            placeholder="Type a message..."
                        />
                        <button className="p-2 bg-[#156d95] text-white rounded-full hover:bg-[#156d95]/90"><Send size={18} /></button>
                    </div>
                </div>
            </div>
        </div>
    )
}
