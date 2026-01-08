'use client'

import { useState } from 'react'
import * as XLSX from 'xlsx'
import { Upload, Check, AlertTriangle, FileSpreadsheet } from 'lucide-react'
import { createRecord } from '../actions/records'
// We might want a bulk create action, but loop for now or add bulk action later. 
// Ideally bulk create for performance. I'll add bulkCreate to actions.

export default function UploadClient() {
    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<any[]>([])
    const [headers, setHeaders] = useState<string[]>([])
    const [uploading, setUploading] = useState(false)
    const [result, setResult] = useState<{ success: number, failed: number } | null>(null)

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setFile(file)

        const reader = new FileReader()
        reader.onload = (evt) => {
            const bstr = evt.target?.result
            const wb = XLSX.read(bstr, { type: 'binary' })
            const wsname = wb.SheetNames[0]
            const ws = wb.Sheets[wsname]
            const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][]

            if (data.length > 0) {
                setHeaders(data[0] as string[])
                const rows = data.slice(1).map((row, idx) => {
                    // Simple mapping based on index or header name logic could go here
                    // For now assuming: ReceiptNo, Name, Amount, Date, Type, Description
                    // Or trying to find columns
                    return {
                        rowId: idx,
                        raw: row
                    }
                })
                setPreview(rows.slice(0, 10)) // Preview first 10
            }
        }
        reader.readAsBinaryString(file)
    }

    const processImport = async () => {
        if (!file) return
        setUploading(true)
        setResult(null)

        // Re-read full data
        const reader = new FileReader()
        reader.onload = async (evt) => {
            const bstr = evt.target?.result
            const wb = XLSX.read(bstr, { type: 'binary' })
            const ws = wb.Sheets[wb.SheetNames[0]]
            const jsonData = XLSX.utils.sheet_to_json(ws) as any[]

            // We'll call a server action locally or via API
            // For simplicity, let's assume we map standard keys: 
            // 'Receipt Number', 'Name', 'Amount', 'Date', 'Type'

            let successCount = 0
            let failedCount = 0

            for (const row of jsonData) {
                // Normalize keys
                const normalized: any = {}
                Object.keys(row).forEach(k => {
                    const key = k.toLowerCase().replace(/[^a-z]/g, '')
                    if (key.includes('receipt')) normalized.receiptNumber = String(row[k])
                    else if (key.includes('name')) normalized.name = row[k]
                    else if (key.includes('amount')) normalized.amount = row[k]
                    else if (key.includes('date')) normalized.date = row[k]
                    else if (key.includes('type')) normalized.type = row[k]
                    else if (key.includes('desc')) normalized.description = row[k]
                })

                if (normalized.receiptNumber && normalized.name && normalized.amount && normalized.type) {
                    const formData = new FormData()
                    formData.append('receiptNumber', normalized.receiptNumber)
                    formData.append('name', normalized.name)
                    formData.append('amount', String(normalized.amount))
                    // Handle Date parsing carefully
                    let dateVal = new Date()
                    if (normalized.date) {
                        // Excel dates are weird sometimes (numbers), XLSX handles it if configured, 
                        // or it returns serial. check if number
                        if (typeof normalized.date === 'number') {
                            dateVal = new Date((normalized.date - (25567 + 2)) * 86400 * 1000) // approx
                        } else {
                            dateVal = new Date(normalized.date)
                        }
                    }
                    formData.append('date', dateVal.toISOString())
                    formData.append('type', normalized.type)
                    if (normalized.description) formData.append('description', normalized.description)

                    const res = await createRecord(null, formData)
                    if (res.success) successCount++
                    else failedCount++
                } else {
                    failedCount++
                }
            }
            setResult({ success: successCount, failed: failedCount })
            setUploading(false)
            setFile(null)
            setPreview([])
        }
        reader.readAsBinaryString(file)
    }

    return (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 max-w-4xl mx-auto">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:bg-gray-50 transition-colors">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Upload Spreadsheet</h3>
                <p className="mt-1 text-sm text-gray-500">XLSX or CSV files</p>
                <div className="mt-6">
                    <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700">
                        <span>Select File</span>
                        <input type="file" className="hidden" accept=".xlsx,.csv" onChange={handleFileUpload} />
                    </label>
                </div>
                {file && <p className="mt-2 text-sm text-gray-600">{file.name}</p>}
            </div>

            {preview.length > 0 && (
                <div className="mt-8">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Preview (First 10 rows)</h4>
                    <div className="overflow-x-auto border border-gray-200 rounded-md">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {headers.map((h, i) => <th key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>)}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {preview.map((row, i) => (
                                    <tr key={i}>
                                        {row.raw.map((cell: any, ci: number) => <td key={ci} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cell}</td>)}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={processImport}
                            disabled={uploading}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                        >
                            {uploading ? 'Importing...' : 'Confirm Import'}
                        </button>
                    </div>
                </div>
            )}

            {result && (
                <div className={`mt-6 p-4 rounded-md ${result.failed === 0 ? 'bg-green-50' : 'bg-yellow-50'} border ${result.failed === 0 ? 'border-green-200' : 'border-yellow-200'}`}>
                    <div className="flex">
                        <div className="flex-shrink-0">
                            {result.failed === 0 ? <Check className="h-5 w-5 text-green-400" /> : <AlertTriangle className="h-5 w-5 text-yellow-400" />}
                        </div>
                        <div className="ml-3">
                            <h3 className={`text-sm font-medium ${result.failed === 0 ? 'text-green-800' : 'text-yellow-800'}`}>Import Complete</h3>
                            <div className={`mt-2 text-sm ${result.failed === 0 ? 'text-green-700' : 'text-yellow-700'}`}>
                                <p>Successfully imported {result.success} records.</p>
                                {result.failed > 0 && <p>Failed to import {result.failed} records (duplicates or invalid data).</p>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
