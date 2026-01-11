'use client'

import { useState, useTransition } from 'react'
import {
    Search,
    Plus,
    Download,
    Users,
    Receipt,
    Building2,
    Eye,
    ChevronLeft,
    ChevronRight,
    Filter,
    X,
    Loader2,
    CheckCircle2
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import * as XLSX from 'xlsx'
import { motion, AnimatePresence } from 'framer-motion'
import { createChandaAmRecord, createTajnidRecord } from '../actions/records'

export default function RecordsClient({
    records,
    total,
    searchParams
}: {
    records: any[],
    total: number,
    searchParams: { q?: string, page?: string, type?: string, month?: string, majlis?: string }
}) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const currentType = searchParams.type || 'chanda'
    const currentPage = Number(searchParams.page) || 1
    const totalPages = Math.ceil(total / 20)

    const [searchTerm, setSearchTerm] = useState(searchParams.q || '')
    const [isNewModalOpen, setIsNewModalOpen] = useState(false)
    const [selectedMember, setSelectedMember] = useState<any>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const updateParams = (updates: Record<string, string | null>) => {
        const params = new URLSearchParams(window.location.search)
        Object.entries(updates).forEach(([key, value]) => {
            if (value === null) params.delete(key)
            else params.set(key, value)
        })
        startTransition(() => {
            router.replace(`?${params.toString()}`)
        })
    }

    const handleSearch = (term: string) => {
        setSearchTerm(term)
        updateParams({ q: term || null, page: '1' })
    }

    const setType = (type: string) => {
        setSearchTerm('')
        updateParams({ type, page: '1', q: null, month: null, majlis: null })
    }

    const handleFilterChange = (key: string, value: string) => {
        updateParams({ [key]: value || null, page: '1' })
    }

    const handlePageChange = (page: number) => {
        updateParams({ page: String(page) })
    }

    const exportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(records)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Export")
        XLSX.writeFile(wb, `${currentType}_export_${new Date().toISOString().split('T')[0]}.xlsx`)
    }

    const tabs = [
        { id: 'chanda', name: 'ChandaAm', icon: Receipt },
        { id: 'tajnid', name: 'Tajnid', icon: Users },
    ]

    const majlisOptions = ['ATFAL', 'KHUDDAM', 'ANSARULLAH', 'LAJNAH', 'NASIRAT']
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    return (
        <div className="space-y-8">
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 p-2 bg-gray-100/80 backdrop-blur-sm rounded-2xl w-fit border border-gray-200">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setType(tab.id)}
                        className={`flex items-center space-x-2 px-8 py-3 rounded-xl text-sm font-black transition-all duration-300 ${currentType === tab.id
                            ? 'bg-white text-emerald-600 shadow-lg shadow-emerald-500/10'
                            : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
                            }`}
                    >
                        <tab.icon className={`w-4 h-4 ${currentType === tab.id ? 'text-emerald-500' : ''}`} />
                        <span>{tab.name}</span>
                    </button>
                ))}
            </div>

            {/* Header / Sub-actions */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
                    <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full lg:max-w-3xl">
                        <div className="relative flex-[2]">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder={`Search ${currentType === 'chanda' ? 'Chanda Am' : 'Tajnid'} records...`}
                                className="w-full pl-14 pr-6 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-medium placeholder:text-gray-400"
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>

                        <div className="relative flex-1">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <select
                                className="w-full pl-11 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-bold text-sm appearance-none cursor-pointer"
                                onChange={(e) => handleFilterChange(currentType === 'chanda' ? 'month' : 'majlis', e.target.value)}
                                value={currentType === 'chanda' ? (searchParams.month || '') : (searchParams.majlis || '')}
                            >
                                <option value="">All {currentType === 'chanda' ? 'Months' : 'Majlis'}</option>
                                {(currentType === 'chanda' ? months : majlisOptions).map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 w-full lg:w-auto">
                        <button
                            onClick={() => setIsNewModalOpen(true)}
                            className="flex-1 lg:flex-none inline-flex items-center justify-center px-8 py-4 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition-all font-bold text-sm shadow-xl shadow-emerald-600/20 active:scale-95"
                        >
                            <Plus className="w-4 h-4 mr-2 stroke-[3]" />
                            Add New
                        </button>
                        <button
                            onClick={exportExcel}
                            className="flex-1 lg:flex-none inline-flex items-center justify-center px-8 py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all font-bold text-sm"
                        >
                            <Download className="w-4 h-4 mr-2 text-emerald-600" />
                            Export
                        </button>
                    </div>
                </div>
            </div>

            {/* Table Area */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-md overflow-hidden transition-all duration-500">
                <div className="overflow-x-auto relative">
                    {isPending && (
                        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
                            <Loader2 className="animate-spin h-8 w-8 text-emerald-600" />
                        </div>
                    )}
                    {currentType === 'chanda' && <ChandaTable records={records} onView={setSelectedMember} />}
                    {currentType === 'tajnid' && <TajnidTable records={records} onView={setSelectedMember} />}
                </div>

                {records.length === 0 && !isPending && (
                    <div className="py-24 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-gray-100">
                            <Search className="w-10 h-10 text-gray-200" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900">No records found</h4>
                        <p className="text-gray-500 text-sm mt-2 max-w-xs mx-auto italic">We couldn't find any {currentType} records matching your current filters.</p>
                    </div>
                )}

                {/* Pagination */}
                {total > 20 && (
                    <div className="px-8 py-6 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/30">
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                            Showing <span className="text-emerald-600">{(currentPage - 1) * 20 + 1} - {Math.min(currentPage * 20, total)}</span> of {total}
                        </p>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-2 rounded-xl border border-gray-200 bg-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => handlePageChange(i + 1)}
                                    className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${currentPage === i + 1
                                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/10'
                                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                >
                                    {i + 1}
                                </button>
                            )).slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-xl border border-gray-200 bg-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
                            >
                                <ChevronRight className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <AnimatePresence>
                {isNewModalOpen && (
                    <NewRecordModal
                        type={currentType}
                        onClose={() => setIsNewModalOpen(false)}
                        refresh={() => router.refresh()}
                    />
                )}
                {selectedMember && (
                    <MemberDetailModal
                        record={selectedMember}
                        type={currentType}
                        onClose={() => setSelectedMember(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

function ChandaTable({ records, onView }: { records: any[], onView: (r: any) => void }) {
    return (
        <table className="min-w-full divide-y divide-gray-50">
            <thead className="bg-gray-50/50">
                <tr>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Contributor Details</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">ID & Receipt</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Month</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Organization</th>
                    <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Amount Paid</th>
                    <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Action</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
                {records.map((r, i) => (
                    <tr key={r._id || i} className="hover:bg-emerald-50/20 transition-colors group">
                        <td className="px-8 py-5 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 font-bold group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                                    {r.name?.charAt(0) || 'C'}
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900">{r.name}</div>
                                    <div className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{new Date(r.date || r.createdAt).toLocaleDateString()}</div>
                                </div>
                            </div>
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap">
                            <div className="text-sm font-bold text-gray-700">#{r.chandaNumber || 'N/A'}</div>
                            <div className="text-[11px] font-mono text-gray-400">{r.receiptNo || 'NO RECEIPT'}</div>
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap">
                            <span className="px-3 py-1 bg-gray-50 text-gray-500 rounded-lg text-[10px] font-black uppercase tracking-wider group-hover:bg-white transition-colors">{r.monthPaidFor || '---'}</span>
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-500 font-medium">
                                <Building2 className="w-3.5 h-3.5 mr-2 text-gray-300" />
                                {r.organization?.name || '---'}
                            </div>
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap text-right">
                            <div className="font-black text-emerald-600 text-lg">
                                ₦{Number(r.totalNgn).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </div>
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap text-right">
                            <button
                                onClick={() => onView(r)}
                                className="p-2 bg-gray-50 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                            >
                                <Eye className="w-4 h-4" />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

function TajnidTable({ records, onView }: { records: any[], onView: (m: any) => void }) {
    return (
        <table className="min-w-full divide-y divide-gray-50">
            <thead className="bg-gray-50/50">
                <tr>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Member Info</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">IDS & Wasiyyat</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Majlis / Status</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Election / Academic</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
                {records.map((r, i) => (
                    <tr key={r._id || i} className="hover:bg-blue-50/20 transition-colors group">
                        <td className="px-8 py-5 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 font-bold group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                    {(r.surname?.charAt(0) || 'T').toUpperCase()}
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900">{r.surname} {r.otherNames}</div>
                                    <div className="text-[10px] text-gray-400 uppercase font-black tracking-widest flex items-center">
                                        <span className="bg-gray-200 px-1.5 py-0.5 rounded mr-2 text-[8px]">{r.sn || 'SN-NA'}</span>
                                        {r.title || 'MEMBER'}
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap">
                            <div className="text-sm font-bold text-gray-700">C#: {r.chandaNo || '---'}</div>
                            <div className="text-[11px] font-mono text-gray-400">W: {r.wasiyyatNo || 'NO'}</div>
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap">
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest block w-fit mb-1">{r.majlis || '---'}</span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase">{r.presence || 'ACTIVE'}</span>
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap">
                            <div className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-1">E: {r.election || 'NA'}</div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase">{r.academicStatus || 'NA'}</div>
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap">
                            <button
                                onClick={() => onView(r)}
                                className="p-2 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            >
                                <Eye className="w-4 h-4" />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

function MemberDetailModal({ record, onClose, type }: { record: any, onClose: () => void, type: string }) {
    const isTajnid = type === 'tajnid'

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
                <div className={`px-10 py-12 text-white relative flex-shrink-0 ${isTajnid ? 'bg-gradient-to-r from-blue-600 to-indigo-700' : 'bg-gradient-to-r from-emerald-600 to-teal-700'}`}>
                    <button onClick={onClose} className="absolute right-8 top-8 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all">
                        <X className="w-5 h-5" />
                    </button>
                    <div className="flex items-center space-x-6">
                        <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center text-3xl font-black backdrop-blur-md">
                            {(isTajnid ? record.surname : record.name)?.charAt(0)}
                        </div>
                        <div>
                            <h3 className="text-3xl font-black tracking-tight">
                                {isTajnid ? `${record.surname} ${record.otherNames}` : record.name}
                            </h3>
                            <p className="text-blue-100 font-bold uppercase tracking-widest text-sm mt-1">
                                {isTajnid ? `${record.title || 'MEMBER'} • ${record.majlis}` : `Financial Record • ${record.monthPaidFor || '---'}`}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-10 overflow-y-auto bg-gray-50/50 flex-1">
                    {isTajnid ? (
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4">Identification</label>
                                <div className="space-y-6">
                                    <DetailRow label="S/N" value={record.sn} />
                                    <DetailRow label="Chanda #" value={record.chandaNo} />
                                    <DetailRow label="Wasiyyat #" value={record.wasiyyatNo} />
                                    <DetailRow label="Election Status" value={record.election} />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4">Member Context</label>
                                <div className="space-y-6">
                                    <DetailRow label="Presence" value={record.presence} />
                                    <DetailRow label="Academic Status" value={record.academicStatus} />
                                    <DetailRow label="Date of Birth" value={record.dateOfBirth ? new Date(record.dateOfBirth).toLocaleDateString() : 'N/A'} />
                                </div>
                            </div>
                            <div className="col-span-2 pt-8 border-t border-gray-100">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4">Contact Info</label>
                                <div className="grid grid-cols-2 gap-8">
                                    <DetailRow label="Phone" value={record.phone} />
                                    <DetailRow label="Email" value={record.email} />
                                    <div className="col-span-2">
                                        <DetailRow label="Address / Jama'at" value={record.address} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div className="grid grid-cols-3 gap-6">
                                <DetailRow label="Total Amount" value={`₦${Number(record.totalNgn).toLocaleString()}`} highlight />
                                <DetailRow label="Chanda Number" value={record.chandaNumber} />
                                <DetailRow label="Receipt #" value={record.receiptNo} />
                            </div>

                            <div className="pt-8 border-t border-gray-100">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-6">Financial Breakdown</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-6">
                                    <DetailRow label="Chanda Aam" value={`₦${record.chandaAam || 0}`} />
                                    <DetailRow label="Wasiyyat" value={`₦${record.chandaWasiyyat || 0}`} />
                                    <DetailRow label="Jalsa Salana" value={`₦${record.jalsaSalana || 0}`} />
                                    <DetailRow label="Tariki Jadid" value={`₦${record.tarikiJadid || 0}`} />
                                    <DetailRow label="Waqfi Jadid" value={`₦${record.waqfiJadid || 0}`} />
                                    <DetailRow label="Welfare Fund" value={`₦${record.welfareFund || 0}`} />
                                    <DetailRow label="Zakat" value={`₦${record.zakat || 0}`} />
                                    <DetailRow label="Fitrana" value={`₦${record.fitrana || 0}`} />
                                    <DetailRow label="Mosque Donation" value={`₦${record.mosqueDonation || 0}`} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="px-10 py-6 bg-white border-t border-gray-100 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center text-gray-400 text-xs font-bold uppercase tracking-widest">
                        <Building2 className="w-4 h-4 mr-2" />
                        {record.organization?.name}
                    </div>
                    <span className="text-[9px] text-gray-300 font-black uppercase tracking-widest">Recorded: {new Date(record.createdAt).toLocaleDateString()}</span>
                </div>
            </motion.div>
        </div>
    )
}

function DetailRow({ label, value, highlight }: { label: string, value: any, highlight?: boolean }) {
    return (
        <div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter mb-0.5">{label}</p>
            <p className={`font-bold transition-all ${highlight ? 'text-2xl text-emerald-600 font-black' : 'text-gray-900 group-hover:text-blue-600'}`}>
                {value || '---'}
            </p>
        </div>
    )
}

function NewRecordModal({ type, onClose, refresh }: { type: string, onClose: () => void, refresh: () => void }) {
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setSubmitting(true)
        setError('')

        const formData = new FormData(e.currentTarget)
        const res = type === 'chanda' ? await createChandaAmRecord(formData) : await createTajnidRecord(formData)

        if (res.success) {
            setSuccess(true)
            setTimeout(() => {
                refresh()
                onClose()
            }, 1500)
        } else {
            setError(res.message || 'Something went wrong')
            setSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
                {success ? (
                    <div className="p-20 text-center space-y-6">
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-12 h-12" />
                        </motion.div>
                        <h2 className="text-3xl font-black text-gray-900">Successfully Recorded</h2>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Synchronizing with blockchain database...</p>
                    </div>
                ) : (
                    <>
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900">New {type === 'chanda' ? 'Chanda Am' : 'Tajnid'} Entry</h3>
                                <p className="text-sm text-gray-500 font-medium">Record a manual administrative entry.</p>
                            </div>
                            <button onClick={onClose} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-6">
                            {error && <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100">{error}</div>}

                            {type === 'chanda' ? (
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <Input label="Full Name" name="name" required placeholder="Member Name" />
                                    </div>
                                    <Input label="Chanda Number" name="chandaNumber" placeholder="e.g. 1234" />
                                    <Input label="Receipt Number" name="receiptNo" placeholder="REC-001" />
                                    <Input label="Month" name="monthPaidFor" placeholder="January" />
                                    <Input label="Date" name="date" type="date" />
                                    <div className="col-span-2">
                                        <Input label="Total Amount (NGN)" name="totalNgn" type="number" required placeholder="0.00" />
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-6">
                                    <Input label="S/N" name="sn" placeholder="e.g. 11" />
                                    <Input label="Title" name="title" placeholder="BRO / MR" />
                                    <Input label="Surname" name="surname" required placeholder="Last Name" />
                                    <Input label="Other Names" name="otherNames" placeholder="First & Middle Names" />
                                    <div className="col-span-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Majlis</label>
                                        <select name="majlis" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 outline-none font-bold">
                                            <option value="ATFAL">ATFAL</option>
                                            <option value="KHUDDAM">KHUDDAM</option>
                                            <option value="ANSARULLAH">ANSARULLAH</option>
                                            <option value="LAJNAH">LAJNAH</option>
                                            <option value="NASIRAT">NASIRAT</option>
                                        </select>
                                    </div>
                                    <Input label="Presence" name="presence" placeholder="LOCAL" />
                                    <Input label="Election" name="election" placeholder="NA / APV" />
                                    <Input label="Academic Status" name="academicStatus" placeholder="GRAD / UNDERGRAD" />
                                    <Input label="Chanda #" name="chandaNo" />
                                    <Input label="Wasiyyat #" name="wasiyyatNo" />
                                    <Input label="Phone" name="phone" />
                                    <Input label="Email" name="email" type="email" />
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-sm hover:bg-emerald-600 transition-all disabled:opacity-50 flex items-center justify-center"
                            >
                                {submitting ? <Loader2 className="animate-spin h-5 w-5" /> : 'SAVE RECORD'}
                            </button>
                        </form>
                    </>
                )}
            </motion.div>
        </div>
    )
}

function Input({ label, ...props }: any) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">{label}</label>
            <input
                {...props}
                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-bold placeholder:text-gray-300"
            />
        </div>
    )
}
