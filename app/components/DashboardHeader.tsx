'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    LayoutDashboard,
    FileSpreadsheet,
    LogOut,
    User,
    ShieldAlert,
    Settings,
    ChevronDown,
    Menu,
    X
} from 'lucide-react'
import { logoutAction } from '@/app/actions/auth'

interface UserSession {
    id: number
    name: string | null
    email: string
    role: string
}

export default function DashboardHeader({ session }: { session: any }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const pathname = usePathname()

    const user: UserSession = session?.user
    const isSuperAdmin = user?.role === 'super_admin'

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const navLinks = [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/dashboard/records', label: 'Records', icon: FileSpreadsheet },
    ]

    const dropdownLinks = [
        ...(isSuperAdmin ? [{ href: '/dashboard/super-admin', label: 'Super Admin', icon: ShieldAlert }] : []),
        // { href: '/dashboard/settings', label: 'Settings', icon: Settings },
    ]

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Left: Logo & Desktop Nav */}
                    <div className="flex items-center space-x-10">
                        <Link href="/dashboard" className="flex items-center space-x-3 group">
                            <div className="relative h-9 w-9 overflow-hidden rounded-lg bg-emerald-50 p-1 flex items-center justify-center border border-emerald-100 group-hover:border-emerald-200 transition-colors">
                                <Image
                                    src="/logo.png"
                                    alt="ADRMS Logo"
                                    width={32}
                                    height={32}
                                    className="object-contain"
                                />
                            </div>
                            <span className="font-bold text-xl tracking-tight text-emerald-800">ADRMS</span>
                        </Link>

                        <div className="hidden md:flex space-x-1">
                            {navLinks.map((link) => {
                                const Icon = link.icon
                                const isActive = pathname === link.href
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${isActive
                                                ? 'bg-emerald-50 text-emerald-700'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-emerald-600'
                                            }`}
                                    >
                                        <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-600' : 'text-gray-400'}`} />
                                        <span>{link.label}</span>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>

                    {/* Right: User Profile & Mobile Toggle */}
                    <div className="flex items-center space-x-4">
                        {/* Profile Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center space-x-3 p-1 pl-3 rounded-full border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                            >
                                <div className="flex flex-col items-end mr-1 hidden sm:flex">
                                    <span className="text-xs font-semibold text-gray-900 leading-none">{user?.name || 'Admin'}</span>
                                    <span className="text-[10px] text-gray-500 mt-0.5 capitalize">{user?.role?.replace('_', ' ')}</span>
                                </div>
                                <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-sm">
                                    <User className="h-4.5 w-4.5" />
                                </div>
                                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                        className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden"
                                    >
                                        <div className="px-4 py-3 border-b border-gray-50">
                                            <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || 'Administrator'}</p>
                                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                        </div>

                                        <div className="p-1">
                                            {dropdownLinks.map((link) => {
                                                const Icon = link.icon
                                                return (
                                                    <Link
                                                        key={link.href}
                                                        href={link.href}
                                                        onClick={() => setIsDropdownOpen(false)}
                                                        className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors group"
                                                    >
                                                        <Icon className="h-4 w-4 text-gray-400 group-hover:text-emerald-600" />
                                                        <span>{link.label}</span>
                                                    </Link>
                                                )
                                            })}
                                        </div>

                                        <div className="p-1 border-t border-gray-50 mt-1">
                                            <form action={logoutAction}>
                                                <button
                                                    type="submit"
                                                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
                                                >
                                                    <LogOut className="h-4 w-4 text-red-400 group-hover:text-red-600" />
                                                    <span>Sign Out</span>
                                                </button>
                                            </form>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden border-t border-gray-100 bg-white overflow-hidden"
                    >
                        <div className="px-4 py-4 space-y-1">
                            {navLinks.map((link) => {
                                const Icon = link.icon
                                const isActive = pathname === link.href
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium ${isActive
                                                ? 'bg-emerald-50 text-emerald-700'
                                                : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <Icon className="h-5 w-5" />
                                        <span>{link.label}</span>
                                    </Link>
                                )
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}
