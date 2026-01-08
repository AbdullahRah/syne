import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, MoreHorizontal } from "lucide-react"

export default function JobsPage() {
    const jobs = [
        { name: "Project Alpha", address: "123 Main St, Calgary", status: "Active", progress: 65, next: "Framing Inspection" },
        { name: "Project Beta", address: "456 4th Ave, Edmonton", status: "Active", progress: 20, next: "Rough-in Plumbing" },
        { name: "Downtown Office Reno", address: "789 1st St, Calgary", status: "On Hold", progress: 90, next: "Final Walkthrough" },
        { name: "Westside Complex", address: "321 West Blvd, Calgary", status: "Completed", progress: 100, next: "Archived" },
    ]

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-[#111A4A]">Jobs</h1>
                    <p className="text-gray-500">Manage your active sites and projects.</p>
                </div>
                <button className="bg-[#156d95] text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-[#156d95]/90 shadow-sm">
                    + New Job
                </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {jobs.map((job, i) => (
                    <Card key={i} className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div className="space-y-1">
                                <CardTitle className="text-base font-bold text-[#111A4A]">{job.name}</CardTitle>
                                <div className="flex items-center text-xs text-gray-500 gap-1">
                                    <MapPin size={12} /> {job.address}
                                </div>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={16} /></button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4 pt-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Status</span>
                                    <Badge variant="outline" className={
                                        job.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' :
                                            job.status === 'On Hold' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-gray-50'
                                    }>{job.status}</Badge>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>Progress</span>
                                        <span>{job.progress}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#156d95]" style={{ width: `${job.progress}%` }}></div>
                                    </div>
                                </div>
                                <div className="pt-3 border-t border-gray-50 flex items-center justify-between text-xs">
                                    <span className="text-gray-500 flex items-center gap-1"><Calendar size={12} /> Next Up</span>
                                    <span className="font-medium text-[#111A4A]">{job.next}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
