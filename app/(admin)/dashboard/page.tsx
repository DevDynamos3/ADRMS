import { prisma } from '@/lib/db'
import { FileText, DollarSign, Calendar, TrendingUp, FileSpreadsheet } from 'lucide-react'
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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Overview</h1>
                <Link href="/dashboard/records" className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 text-sm font-medium transition-colors shadow-sm">
                    Manage Records
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    title="Total Records"
                    value={stats.totalRecords.toLocaleString()}
                    icon={<FileText className="h-6 w-6 text-blue-600" />}
                    bg="bg-blue-50"
                    border="border-blue-100"
                />
                <StatsCard
                    title="Total Amount"
                    value={`₦${stats.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                    icon={<DollarSign className="h-6 w-6 text-emerald-600" />}
                    bg="bg-emerald-50"
                    border="border-emerald-100"
                />
                <StatsCard
                    title="Monthly Total"
                    value={`₦${stats.monthlyAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                    icon={<Calendar className="h-6 w-6 text-purple-600" />}
                    bg="bg-purple-50"
                    border="border-purple-100"
                />
            </div>

            {/* Recent Activity or Quick Actions could go here */}
            <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link href="/dashboard/records?action=new" className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-emerald-500 hover:bg-emerald-50 transition-all cursor-pointer group">
                        <div className="h-10 w-10 rounded-full bg-gray-100 group-hover:bg-emerald-100 flex items-center justify-center mb-2 transition-colors">
                            <span className="text-2xl text-gray-500 group-hover:text-emerald-600">+</span>
                        </div>
                        <span className="text-sm font-medium text-gray-600 group-hover:text-emerald-700">New Record</span>
                    </Link>
                    <Link href="/dashboard/upload" className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer group">
                        <div className="h-10 w-10 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center mb-2 transition-colors">
                            <FileSpreadsheet className="text-gray-500 group-hover:text-blue-600 h-5 w-5" />
                        </div>
                        <span className="text-sm font-medium text-gray-600 group-hover:text-blue-700">Upload Excel</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}

function StatsCard({ title, value, icon, bg, border }: { title: string, value: string, icon: React.ReactNode, bg: string, border: string }) {
    return (
        <div className={`rounded-xl p-6 shadow-sm border ${bg} ${border}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
                </div>
                <div className="p-3 bg-white rounded-lg shadow-sm">
                    {icon}
                </div>
            </div>
        </div>
    )
}
