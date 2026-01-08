import { getSession } from '@/lib/session'
import DashboardHeader from '@/app/components/DashboardHeader'
import BackNavigator from '@/app/components/BackNavigator'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getSession()

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-sans antialiased">
            <DashboardHeader session={session} />
            <BackNavigator />

            {/* Main Content Area */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {children}
                </div>
            </main>

            {/* Simple Footer */}
            <footer className="mt-auto border-t border-gray-200 bg-white py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 gap-4">
                        <p>© {new Date().getFullYear()} Ahmadiyyah Record Management System. All rights reserved.</p>
                        <div className="flex space-x-6">
                            <span className="hover:text-emerald-600 cursor-pointer transition-colors">Documentation</span>
                            <span className="hover:text-emerald-600 cursor-pointer transition-colors">Support</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

