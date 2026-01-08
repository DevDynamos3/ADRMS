import { prisma } from '@/lib/db'
import { FileText, DollarSign, Calendar, TrendingUp, FileSpreadsheet, Plus } from 'lucide-react'
import Link from 'next/link'

async function getStats() {
    const totalRecords = await prisma.record.count()
    const totalAmount = await prisma.record.aggregate({
        _sum: {
            amount: true
        }
    })

    // Calculate monthly total
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthlyAmount = await prisma.record.aggregate({
        _sum: { amount: true },
        where: {
            date: {
                gte: firstDayOfMonth
            }
        }
    })

    return {
        totalRecords,
        totalAmount: totalAmount._sum.amount || 0,
        monthlyAmount: monthlyAmount._sum.amount || 0
    }
}

export default async function DashboardPage() {
    const stats = await getStats()

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">System Overview</h1>
                    <p className="text-gray-500 mt-1 max-w-2xl">
                        Welcome back. Here is a summary of the record management system's current performance and recent financial metrics.
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full uppercase tracking-wider">Live Updates</span>
                    <Link href="/dashboard/records" className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 text-sm font-semibold transition-all shadow-md hover:shadow-lg active:scale-95">
                        Manage Records
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    title="Total Records Collected"
                    description="Total number of receipts processed by the system to date."
                    value={stats.totalRecords.toLocaleString()}
                    icon={<FileText className="h-6 w-6 text-blue-600" />}
                    color="blue"
                />
                <StatsCard
                    title="Grand Total Amount"
                    description="The cumulative sum of all financial records stored in the database."
                    value={`₦${stats.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                    icon={<DollarSign className="h-6 w-6 text-emerald-600" />}
                    color="emerald"
                />
                <StatsCard
                    title="Current Month Total"
                    description="Total amount collected since the 1st of the current month."
                    value={`₦${stats.monthlyAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                    icon={<Calendar className="h-6 w-6 text-purple-600" />}
                    color="purple"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Quick Actions - Primary */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Operations Panel</h2>
                            <p className="text-sm text-gray-500">Quickly add new data or import existing sheets.</p>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center">
                            <TrendingUp className="h-4 w-4 text-gray-400" />
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Link href="/dashboard/records?action=new" className="flex items-center p-4 rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all group">
                                <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                    <Plus className="h-6 w-6 text-emerald-600" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-sm font-bold text-gray-900">New Record Entry</h3>
                                    <p className="text-xs text-gray-500">Manually input a new receipt into the system.</p>
                                </div>
                            </Link>

                            <Link href="/dashboard/upload" className="flex items-center p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group">
                                <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                    <FileSpreadsheet className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-sm font-bold text-gray-900">Excel Import</h3>
                                    <p className="text-xs text-gray-500">Bulk upload records from an XLSX file.</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* System Info / Tips */}
                <div className="bg-emerald-900 rounded-2xl p-6 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-lg font-bold mb-2">Cloud Syncying</h2>
                        <p className="text-emerald-100 text-sm mb-4 leading-relaxed">
                            Your records are securely stored on the cloud. Database snapshots are taken daily to ensure data integrity.
                        </p>
                        <ul className="space-y-2 mb-6">
                            <li className="flex items-center text-xs text-emerald-200">
                                <span className="h-1 w-1 bg-emerald-400 rounded-full mr-2"></span>
                                End-to-end encrypted sessions
                            </li>
                            <li className="flex items-center text-xs text-emerald-200">
                                <span className="h-1 w-1 bg-emerald-400 rounded-full mr-2"></span>
                                Instant Excel exports
                            </li>
                            <li className="flex items-center text-xs text-emerald-200">
                                <span className="h-1 w-1 bg-emerald-400 rounded-full mr-2"></span>
                                Role-based access control
                            </li>
                        </ul>
                    </div>
                    {/* Decorative element */}
                    <div className="absolute -bottom-10 -right-10 h-40 w-40 bg-white/10 rounded-full blur-3xl"></div>
                </div>
            </div>
        </div>
    )
}

function StatsCard({ title, description, value, icon, color }: { title: string, description: string, value: string, icon: React.ReactNode, color: string }) {
    const colors: Record<string, string> = {
        blue: 'text-blue-600 bg-blue-50 border-blue-100',
        emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
        purple: 'text-purple-600 bg-purple-50 border-purple-100'
    }

    return (
        <div className={`p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow`}>
            <div className="flex items-start justify-between">
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    {icon}
                </div>
                <TrendingUp className="h-4 w-4 text-gray-300" />
            </div>
            <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</h3>
                <p className="mt-1 text-3xl font-extrabold text-gray-900">{value}</p>
                <p className="mt-2 text-xs text-gray-400 leading-relaxed italic border-l-2 border-gray-100 pl-2">
                    {description}
                </p>
            </div>
        </div>
    )
}



