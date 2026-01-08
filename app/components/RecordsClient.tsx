'use client'

import { useState, useTransition } from 'react'
import { Record } from '@prisma/client'
import { Search, Plus, Download, Upload, Save, X, Edit2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createRecord, updateRecord } from '../actions/records'
import { Modal } from './ui/Modal'
import { useFormStatus } from 'react-dom'
import * as XLSX from 'xlsx'

export default function RecordsClient({
    records,
    total,
    searchParams
}: {
    records: Record[],
    total: number,
    searchParams: { q?: string, page?: string }
}) {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState(searchParams.q || '')
    const [isNewModalOpen, setIsNewModalOpen] = useState(false)

    // Debounced search
    const handleSearch = (term: string) => {
        setSearchTerm(term)
        const params = new URLSearchParams(window.location.search)
        if (term) {
            params.set('q', term)
        } else {
            params.delete('q')
        }
        params.set('page', '1') // Reset page
        router.replace(`?${params.toString()}`)
    }

    const exportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(records.map(r => ({
            "Serial No": r.serialNumber,
            "Receipt No": r.receiptNumber,
            "Name": r.name,
            "Amount": r.amount,
            "Date": new Date(r.date).toLocaleDateString(),
            "Description": r.description,
            "Type": r.type
        })))
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Records")
        XLSX.writeFile(wb, `Records_${new Date().toISOString().split('T')[0]}.xlsx`)
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="relative flex-1 max-w-md">
                    <input
                        type="text"
                        placeholder="Search records..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setIsNewModalOpen(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        New Record
                    </button>
                    <button
                        onClick={exportExcel}
                        className="inline-flex items-center px-4 py-2 border border-emerald-200 text-sm font-medium rounded-md text-emerald-700 bg-emerald-50 hover:bg-emerald-100 shadow-sm"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </button>
                </div>
            </div>

            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Serial</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Receipt #</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {records.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">
                                        No records found.
                                    </td>
                                </tr>
                            ) : (
                                records.map(record => (
                                    <RecordRow key={record.id} record={record} />
                                ))
                            )}
                        </tbody>
                        <tfoot className="bg-gray-50 font-medium">
                            <tr>
                                <td colSpan={5} className="px-6 py-3 text-right text-sm text-gray-900">Total Page Amount:</td>
                                <td className="px-6 py-3 text-right text-sm text-emerald-700 font-bold">
                                    ₦{records.reduce((sum, r) => sum + r.amount, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            <Modal isOpen={isNewModalOpen} onClose={() => setIsNewModalOpen(false)} title="New Record">
                <RecordForm onClose={() => setIsNewModalOpen(false)} />
            </Modal>
        </div>
    )
}

function RecordRow({ record }: { record: Record }) {
    const [isEditing, setIsEditing] = useState(false)
    const [isPending, startTransition] = useTransition()

    // Local state for immediate feedback/handling
    // In a real robust app we might use full form handling here too

    if (isEditing) {
        return (
            <tr className="bg-yellow-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.serialNumber}</td>
                <td colSpan={6} className="px-0 py-0">
                    <form action={async (formData) => {
                        startTransition(async () => {
                            await updateRecord(record.id, formData)
                            setIsEditing(false)
                        })
                    }} className="flex items-center w-full">
                        <input name="date" type="date" defaultValue={new Date(record.date).toISOString().split('T')[0]} className="px-2 py-3 border-r w-32 focus:outline-none focus:bg-white bg-yellow-50" required />
                        <input name="receiptNumber" defaultValue={record.receiptNumber} className="px-2 py-3 border-r w-32 focus:outline-none focus:bg-white bg-yellow-50" required />
                        <input name="name" defaultValue={record.name} className="px-2 py-3 border-r flex-1 focus:outline-none focus:bg-white bg-yellow-50" required />
                        <input name="type" defaultValue={record.type} className="px-2 py-3 border-r w-32 focus:outline-none focus:bg-white bg-yellow-50" required />
                        <input name="amount" type="number" step="0.01" defaultValue={record.amount} className="px-2 py-3 border-r w-32 text-right focus:outline-none focus:bg-white bg-yellow-50" required />
                        <div className="flex px-2 space-x-1">
                            <button type="submit" disabled={isPending} className="p-1 text-green-600 hover:text-green-800">
                                <Save className="h-4 w-4" />
                            </button>
                            <button type="button" onClick={() => setIsEditing(false)} className="p-1 text-gray-500 hover:text-gray-700">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </form>
                </td>
            </tr>
        )
    }

    return (
        <tr className="hover:bg-gray-50 transition-colors group">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.serialNumber}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(record.date).toLocaleDateString()}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">{record.receiptNumber}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{record.name}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">{record.type}</span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                ₦{record.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button onClick={() => setIsEditing(true)} className="text-emerald-600 hover:text-emerald-900 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Edit2 className="h-4 w-4" />
                </button>
            </td>
        </tr>
    )
}

function RecordForm({ onClose }: { onClose: () => void }) {
    const [state, formAction] = useActionState(createRecord, { message: '', success: false })

    useEffect(() => {
        if (state.success) {
            onClose()
        }
    }, [state.success, onClose])

    return (
        <form action={formAction} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <input type="date" name="date" required defaultValue={new Date().toISOString().split('T')[0]} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Receipt No</label>
                    <input type="text" name="receiptNumber" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" name="name" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <input type="text" name="type" required list="types" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" />
                    <datalist id="types">
                        <option value="Chanda Aam" />
                        <option value="Chanda Wasiyyat" />
                        <option value="Jalsa Salana" />
                        <option value="Tahrik Jadid" />
                        <option value="Waqf Jadid" />
                    </datalist>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Amount</label>
                    <input type="number" name="amount" step="0.01" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea name="description" rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" />
            </div>

            {state.message && (
                <div className={`text-sm text-center ${state.success ? 'text-green-600' : 'text-red-600'}`}>
                    {state.message}
                </div>
            )}

            <div className="flex justify-end pt-4">
                <SubmitButton />
            </div>
        </form>
    )
}

import { useActionState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button type="submit" disabled={pending} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50">
            {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Save Record'}
        </button>
    )
}
