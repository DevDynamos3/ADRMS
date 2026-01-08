import Link from 'next/link'
import { logoutAction } from '@/app/actions/auth'
import { LayoutDashboard, FileSpreadsheet, LogOut, User } from 'lucide-react'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Top Navigation Bar - Excel Style */}
            <nav className="bg-emerald-700 text-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-14 items-center">
                        <div className="flex items-center space-x-8">
                            <Link href="/dashboard" className="flex items-center space-x-2 font-bold text-xl tracking-tight">
                                <FileSpreadsheet className="h-6 w-6" />
                                <span>ADRMS</span>
                            </Link>

                            <div className="hidden md:flex space-x-1">
                                <Link
                                    href="/dashboard"
                                    className="px-3 py-2 rounded-t-md text-sm font-medium hover:bg-emerald-600 transition-colors flex items-center space-x-1 bg-emerald-800/50"
                                >
                                    <LayoutDashboard className="h-4 w-4" />
                                    <span>Dashboard</span>
                                </Link>
                                <Link
                                    href="/dashboard/records"
                                    className="px-3 py-2 rounded-t-md text-sm font-medium hover:bg-emerald-600 transition-colors flex items-center space-x-1"
                                >
                                    <FileSpreadsheet className="h-4 w-4" />
                                    <span>Records</span>
                                </Link>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 text-sm">
                                <div className="h-8 w-8 rounded-full bg-emerald-800 flex items-center justify-center">
                                    <User className="h-4 w-4" />
                                </div>
                                <span className="hidden sm:inline">Admin</span>
                            </div>
                            <form action={logoutAction}>
                                <button type="submit" className="text-emerald-100 hover:text-white p-1 rounded hover:bg-emerald-600 transition-colors">
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Toolbar / Actions Bar (Optional, can be per page) */}
            <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8 flex items-center space-x-2 text-sm text-gray-600 overflow-x-auto">
                    {/* This area can be populated by page specific portals or just static common tools if needed */}
                    <span className="font-mono text-xs text-gray-400">Ready</span>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {children}
            </main>
        </div>
    )
}
