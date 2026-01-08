'use client'

import { useRouter, usePathname } from 'next/navigation'
import { ChevronLeft, Home } from 'lucide-react'
import Link from 'next/link'

export default function BackNavigator() {
    const router = useRouter()
    const pathname = usePathname()

    // Don't show on the main dashboard root
    const isMainDashboard = pathname === '/dashboard'

    return (
        <div className="bg-white border-b border-gray-200 py-2">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    {!isMainDashboard ? (
                        <button
                            onClick={() => router.back()}
                            className="flex items-center space-x-1 text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors group"
                        >
                            <div className="p-1 rounded-md bg-gray-50 group-hover:bg-emerald-50 transition-colors">
                                <ChevronLeft className="h-4 w-4" />
                            </div>
                            <span>Back</span>
                        </button>
                    ) : (
                        <Link
                            href="/"
                            className="flex items-center space-x-1 text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors group"
                        >
                            <div className="p-1 rounded-md bg-gray-50 group-hover:bg-emerald-50 transition-colors">
                                <Home className="h-4 w-4" />
                            </div>
                            <span>Back to Home</span>
                        </Link>
                    )}

                    <div className="h-4 w-[1px] bg-gray-200 hidden sm:block"></div>

                    <div className="hidden sm:flex items-center space-x-2 text-[10px] text-gray-400 font-mono uppercase tracking-widest">
                        <Link href="/dashboard" className="hover:text-emerald-600 transition-colors">Workspace</Link>
                        <span>/</span>
                        <span className="text-emerald-600 font-bold">
                            {pathname.split('/').pop()?.replace('-', ' ') || 'Main'}
                        </span>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <span className="flex items-center space-x-1.5 text-[10px] text-gray-400 font-mono uppercase tracking-widest leading-none">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>System Online</span>
                    </span>
                </div>
            </div>
        </div>
    )
}
