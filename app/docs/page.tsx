'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
    BookOpen,
    LogIn,
    LayoutDashboard,
    Database,
    Upload,
    Shield,
    Search,
    ArrowLeft,
    ChevronRight,
    Users,
    Receipt,
    CheckCircle2
} from 'lucide-react'
import Link from 'next/link'
import Logo from '../component/logo/Logo'

const sections = [
    {
        id: 'getting-started',
        title: 'Getting Started',
        icon: <BookOpen className="w-6 h-6" />,
        content: [
            {
                title: 'Introduction',
                text: 'Ahmadiyya Record Management System (ADRMS) is a modern, secure platform designed to centralize and automate the management of Jama\'at records. It bridges the gap between traditional spreadsheets and interactive database management.'
            },
            {
                title: 'Accessing the Platform',
                text: 'The system is accessible via authorized credentials. You can access the login portal from the home page using the "Admin Login" button.'
            }
        ]
    },
    {
        id: 'authentication',
        title: 'Authentication',
        icon: <LogIn className="w-6 h-6" />,
        content: [
            {
                title: 'Dual-Mode Login',
                text: 'ADRMS supports two ways to identify yourself: (1) Your official administrator email address, or (2) Your Organization (Jama\'at) Name. Both methods lead to the same secure dashboard.'
            },
            {
                title: 'Default Credentials',
                text: 'For Standard Admins, the initial password follows a set pattern: Your Organization Name + a specific number assigned by the Super Admin (e.g., Lagos123). Please change this after your first successful login.'
            },
            {
                title: 'Session Security',
                text: 'Your session is encrypted using industry-standard protocols. Sessions naturally expire to ensure data security. Always remember to log out after your administrative duties.'
            }
        ]
    },
    {
        id: 'account-roles',
        title: 'Account Roles',
        icon: <Shield className="w-6 h-6" />,
        content: [
            {
                title: 'Super Admin',
                text: 'Super Admins have full oversight of the entire system. They are responsible for provisioning new Standard Admins, creating Organizations, and monitoring aggregate statistics across all branches.'
            },
            {
                title: 'Standard Admin',
                text: 'Standard Admins are linked to a specific Organization (Jama\'at). They manage local records, perform bulk uploads for their branch, and view statistics relevant to their specific jurisdiction.'
            }
        ]
    },
    {
        id: 'records-management',
        title: 'Record Management',
        icon: <Database className="w-6 h-6" />,
        content: [
            {
                title: 'Chanda Am Records',
                text: 'Manage financial returns including Chanda Aam, Wasiyyat, and various funds. Each record tracks contributor name, chanda number, receipt number, and a full breakdown of the contribution.'
            },
            {
                title: 'Tajnid Management',
                text: 'Comprehensive member records including Majlis, Election status, Academic status, and contact details. Use the "Eye" icon to view a detailed member profile.'
            }
        ]
    },
    {
        id: 'bulk-imports',
        title: 'Bulk Imports',
        icon: <Upload className="w-6 h-6" />,
        content: [
            {
                title: 'Excel Integration',
                text: 'Save hours of manual data entry by uploading Excel spreadsheets directly. Our intelligent mapping system reads Chanda and Tajnid sheets and processes them instantly.'
            },
            {
                title: 'Data Validation',
                text: 'The system checks for data integrity during upload. Ensure your Excel columns match the expected headers (Name, Chanda No, Amount, etc.) for a smooth import process.'
            }
        ]
    },
    {
        id: 'reporting-stats',
        title: 'Reporting & Stats',
        icon: <LayoutDashboard className="w-6 h-6" />,
        content: [
            {
                title: 'Interactive Dashboard',
                text: 'Visualize your organization\'s health at a glance. The dashboard provides real-time counts of members, total contributions, and monthly growth trends.'
            },
            {
                title: 'Exporting Data',
                text: 'Need to present records offline? Use the "Export" button on the Records page to generate a clean, formatted Excel file of your filtered data.'
            }
        ]
    }
]

export default function DocsPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <Logo width={40} height={40} text="ADRMS" size="md" />
                        <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">DOCS</span>
                    </Link>
                    <Link href="/" className="flex items-center text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                </div>
            </header>

            <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Sidebar Nav */}
                <aside className="hidden lg:block space-y-2 sticky top-32 h-fit">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Documentation</p>
                    {sections.map(section => (
                        <a
                            key={section.id}
                            href={`#${section.id}`}
                            className="flex items-center space-x-3 p-3 rounded-2xl text-gray-500 hover:bg-white hover:text-emerald-600 hover:shadow-sm transition-all group font-bold text-sm"
                        >
                            <span className="p-2 bg-gray-100 rounded-xl group-hover:bg-emerald-50 transition-colors">
                                {React.cloneElement(section.icon as React.ReactElement, { className: 'w-4 h-4' } as any)}
                            </span>
                            <span>{section.title}</span>
                        </a>
                    ))}
                </aside>

                {/* Content */}
                <div className="lg:col-span-3 space-y-24 pb-20">
                    <section className="space-y-6">
                        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full font-black text-[10px] uppercase tracking-widest">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>v1.2.0 Official Guide</span>
                        </div>
                        <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-tight">
                            Mastering the <span className="text-emerald-600">ADRMS</span> Platform
                        </h1>
                        <p className="text-xl text-gray-500 max-w-2xl leading-relaxed font-medium">
                            Welcome to the official documentation. This guide will help you understand the architecture,
                            administrative workflows, and advanced features of your record management system.
                        </p>
                    </section>

                    {sections.map((section, idx) => (
                        <motion.section
                            key={section.id}
                            id={section.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="space-y-10"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="p-4 bg-emerald-600 text-white rounded-[2rem] shadow-xl shadow-emerald-600/20">
                                    {section.icon}
                                </div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight">{section.title}</h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                {section.content.map((item, i) => (
                                    <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                                        <div className="flex items-start justify-between mb-4">
                                            <h3 className="text-xl font-black text-gray-900 group-hover:text-emerald-600 transition-colors">{item.title}</h3>
                                            <ChevronRight className="w-5 h-5 text-gray-200 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                                        </div>
                                        <p className="text-gray-500 leading-relaxed font-medium">
                                            {item.text}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </motion.section>
                    ))}

                    {/* Footer Guide CTA */}
                    <section className="bg-gray-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 p-12 opacity-5">
                            <Logo width={300} height={300} text="" />
                        </div>
                        <div className="relative z-10 space-y-6">
                            <h2 className="text-3xl font-black tracking-tight italic">Ready to start management?</h2>
                            <p className="text-gray-400 max-w-xl font-medium">
                                If you still have questions after reading this guide, please reach out to the
                                National Headquarters technical support team for further assistance.
                            </p>
                            <div className="flex flex-wrap gap-4 pt-4">
                                <Link
                                    href="/login"
                                    className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20"
                                >
                                    Proceed to Login
                                </Link>
                                <Link
                                    href="/"
                                    className="px-8 py-4 bg-white/10 text-white rounded-2xl font-black text-sm hover:bg-white/20 transition-all backdrop-blur-md"
                                >
                                    Contact Support
                                </Link>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <footer className="bg-white border-t border-gray-100 py-12">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-sm font-bold text-gray-400">© 2026 ADRMS Platform. Built for Excellence.</p>
                    <div className="flex items-center space-x-8">
                        <Link href="#" className="text-sm font-bold text-gray-400 hover:text-emerald-600">Privacy</Link>
                        <Link href="#" className="text-sm font-bold text-gray-400 hover:text-emerald-600">Terms</Link>
                        <Link href="#" className="text-sm font-bold text-gray-400 hover:text-emerald-600">Security</Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}
