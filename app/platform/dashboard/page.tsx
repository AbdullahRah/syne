import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Clock, AlertTriangle, MessageSquare } from "lucide-react"

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-[#111A4A]">Dashboard</h1>
                <p className="text-gray-500">Welcome back, Site Super.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">+2 from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Inspections</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-muted-foreground">Due this week</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-[#167E6C]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#167E6C]">98.5%</div>
                        <p className="text-xs text-muted-foreground">+1.2% since Code Update</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Inbox Items</CardTitle>
                        <MessageSquare className="h-4 w-4 text-[#156d95]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">8</div>
                        <p className="text-xs text-muted-foreground">4 unread WhatsApps</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center gap-4 border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-500">
                                        JD
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none">Photo uploaded to Project Alpha</p>
                                        <p className="text-xs text-muted-foreground">Framing detail - wall A</p>
                                    </div>
                                    <div className="text-xs text-muted-foreground">2m ago</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Compliance Risks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 bg-red-50 p-3 rounded-lg border border-red-100">
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                                <div>
                                    <p className="text-sm font-medium text-red-900">Missing Fire Stop</p>
                                    <p className="text-xs text-red-700">Project Beta • Unit 402</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-amber-50 p-3 rounded-lg border border-amber-100">
                                <Clock className="h-5 w-5 text-amber-600" />
                                <div>
                                    <p className="text-sm font-medium text-amber-900">Inspection Overdue</p>
                                    <p className="text-xs text-amber-700">Rough-in Plumbing • Lot 88</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
