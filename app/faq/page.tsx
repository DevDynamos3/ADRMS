'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    HelpCircle,
    ChevronDown,
    Search,
    MessageCircle,
    ArrowLeft,
    Shield,
    FileText,
    Settings,
    UserPlus
} from 'lucide-react'
import Link from 'next/link'
import Logo from '../component/logo/Logo'

const faqs = [
    {
        category: 'Getting Started',
        questions: [
            {
                q: "How do I login as a Standard Admin?",
                a: "To login as a Standard Admin, you can use either your assigned administrator email or your Organization Name. Your initial password is typically generated as your Organization Name followed by a numeric sequence (e.g., 'Lagos123')."
            },
            {
                q: "How do I get my login credentials?",
                a: "Login credentials are provided by the National Headquarters. If you are a local administrator, contact your regional Super Admin to have an account provisioned for your organization."
            },
            {
                q: "Can I use the system on my mobile device?",
                a: "Yes, ADRMS is fully responsive and optimized for mobile, tablet, and desktop use. You can manage records from anywhere with an active internet connection."
            }
        ]
    },
    {
        category: 'Data Management',
        questions: [
            {
                q: "What format should my Excel files be in for bulk upload?",
                a: "The system supports .xlsx and .xls formats. For the best experience, ensure your column headers match the templates provided in the documentation (e.g., 'Contributor Name', 'Chanda No', 'Amount')."
            },
            {
                q: "Is there a limit to how many records I can upload?",
                a: "There is no strict limit on the number of records, but for optimal performance during upload, we recommend splitting files larger than 5,000 entries."
            }
        ]
    },
    {
        category: 'Security & Privacy',
        questions: [
            {
                q: "Who can see the data I upload?",
                a: "Standard Admins can only see data belonging to their specific Organization. Super Admins have visibility across the platform for reporting purposes. Your data is encrypted and never shared externally."
            },
            {
                q: "What happens if I lose my password?",
                a: "For security reasons, ADRMS does not have an automated reset for admin accounts. Please contact your Super Admin to have your password reset manually."
            }
        ]
    },
    {
        category: 'Accounting',
        questions: [
            {
                q: "Does the system calculate totals automatically?",
                a: "Yes. When you enter financial returns, the system automatically sums the breakdown (Chanda Aam, Jalsa Salana, etc.) and updates the dashboard statistics in real-time."
            },
            {
                q: "Can I export records back to Excel?",
                a: "Absolutely. On the Records page, you can filter data by date or type and use the 'Export' button to generate a clean Excel file for offline reporting."
            }
        ]
    }
]

export default function FAQPage() {
    const [activeQuestion, setActiveQuestion] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')

    const filteredFaqs = faqs.map(cat => ({
        ...cat,
        questions: cat.questions.filter(q =>
            q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(cat => cat.questions.length > 0)

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <Logo width={40} height={40} text="ADRMS" size="md" />
                        <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">FAQ</span>
                    </Link>
                    <Link href="/docs" className="flex items-center text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
                        Documentation
                        <ChevronDown className="w-4 h-4 ml-1 -rotate-90" />
                    </Link>
                </div>
            </header>

            <main className="flex-grow max-w-4xl mx-auto w-full px-6 py-12 lg:py-20">
                <div className="text-center space-y-6 mb-16">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-20 h-20 bg-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20"
                    >
                        <HelpCircle className="w-10 h-10 text-white" />
                    </motion.div>
                    <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">How can we help?</h1>
                    <p className="text-lg text-gray-500 font-medium">Find answers to common questions about the ADRMS platform.</p>

                    <div className="max-w-2xl mx-auto relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search for questions, keywords, etc..."
                            className="w-full pl-16 pr-8 py-5 bg-white border border-gray-100 rounded-[2rem] shadow-sm outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-12">
                    {filteredFaqs.map((category, catIdx) => (
                        <div key={catIdx} className="space-y-6">
                            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4">{category.category}</h2>
                            <div className="space-y-4">
                                {category.questions.map((faq, idx) => {
                                    const isOpen = activeQuestion === `${catIdx}-${idx}`
                                    return (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`bg-white rounded-[2rem] border transition-all duration-300 ${isOpen ? 'border-emerald-500 shadow-emerald-500/5' : 'border-gray-100'}`}
                                        >
                                            <button
                                                onClick={() => setActiveQuestion(isOpen ? null : `${catIdx}-${idx}`)}
                                                className="w-full text-left p-8 flex items-center justify-between group"
                                            >
                                                <span className={`text-lg font-black transition-colors ${isOpen ? 'text-emerald-600' : 'text-gray-900 group-hover:text-emerald-600'}`}>
                                                    {faq.q}
                                                </span>
                                                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-500' : ''}`} />
                                            </button>
                                            <AnimatePresence>
                                                {isOpen && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="px-8 pb-8 text-gray-500 font-medium leading-relaxed">
                                                            {faq.a}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}

                    {filteredFaqs.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-200">
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No matching questions found</p>
                        </div>
                    )}
                </div>

                {/* Contact CTA */}
                <section className="mt-24 bg-gray-900 rounded-[3rem] p-12 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                        <Logo width={400} height={400} text="" />
                    </div>
                    <h2 className="text-3xl font-black mb-4">Still have questions?</h2>
                    <p className="text-gray-400 max-w-lg mx-auto mb-8 font-medium">We're here to help you get the most out of ADRMS. Reach out to our technical support team.</p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <button className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20 flex items-center">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Live Chat
                        </button>
                        <button className="px-8 py-4 bg-white/10 text-white rounded-2xl font-black text-sm hover:bg-white/20 transition-all backdrop-blur-md">
                            Contact Specialist
                        </button>
                    </div>
                </section>
            </main>

            <footer className="bg-white border-t border-gray-100 py-12">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-sm font-bold text-gray-400">© 2026 ADRMS Support. Official Resource.</p>
                    <div className="flex items-center space-x-8">
                        <Link href="/" className="text-sm font-bold text-gray-400 hover:text-emerald-600 flex items-center">
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Home
                        </Link>
                        <Link href="/docs" className="text-sm font-bold text-gray-400 hover:text-blue-600">Guides</Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}
