'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import * as XLSX from 'xlsx'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Upload,
    CheckCircle2,
    AlertCircle,
    FileSpreadsheet,
    Loader2,
    X,
    FileCheck,
    Users,
    Receipt,
    ChevronRight,
    Search,
    Check
} from 'lucide-react'
import {
    bulkInsertChandaAmRecords,
    bulkInsertTajnidRecords
} from '../actions/import'

interface SheetResult {
    name: string
    success: number
    failed: number
    status: 'pending' | 'processing' | 'completed' | 'error'
    message?: string
}

type ImportType = 'CHANDA' | 'TAJNID'

export default function UploadClient() {
    const router = useRouter()
    const [file, setFile] = useState<File | null>(null)
    const [sheets, setSheets] = useState<{ name: string; rows: any[]; headerIdx: number }[]>([])
    const [isUploading, setIsUploading] = useState(false)
    const [sheetResults, setSheetResults] = useState<SheetResult[]>([])
    const [selectedType, setSelectedType] = useState<ImportType | null>(null)
    const [selectedSheetNames, setSelectedSheetNames] = useState<string[]>([])
    const [showInstructionModal, setShowInstructionModal] = useState(false)
    const [notification, setNotification] = useState<{
        show: boolean;
        title: string;
        message: string;
        type: 'success' | 'info' | 'error';
    }>({ show: false, title: '', message: '', type: 'info' })
    const fileInputRef = useRef<HTMLInputElement>(null)

    const findHeaderRow = (rows: any[][]) => {
        for (let i = 0; i < Math.min(rows.length, 10); i++) {
            if (rows[i] && rows[i].filter(cell => cell).length > 5) {
                return i
            }
        }
        return 0
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (!selectedFile) return

        setFile(selectedFile)
        setSheetResults([])
        setSelectedType(null)

        const reader = new FileReader()
        reader.onload = (evt) => {
            const bstr = evt.target?.result
            const wb = XLSX.read(bstr, { type: 'binary', cellDates: true })

            const extractedSheets = wb.SheetNames.map(name => {
                const ws = wb.Sheets[name]
                const rawRows = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][]
                const headerIdx = findHeaderRow(rawRows)
                const data = XLSX.utils.sheet_to_json(ws, { range: headerIdx })
                return { name, rows: data, headerIdx }
            })

            setSheets(extractedSheets)
            const names = wb.SheetNames
            setSelectedSheetNames([]) // Deselect all by default
            setSheetResults(names.map(name => ({
                name,
                success: 0,
                failed: 0,
                status: 'pending'
            })))
        }
        reader.readAsBinaryString(selectedFile)
    }

    const toggleSheetSelection = (name: string) => {
        setSelectedSheetNames(prev =>
            prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
        )
    }

    const toggleSelectAll = () => {
        if (selectedSheetNames.length === sheets.length) {
            setSelectedSheetNames([])
        } else {
            setSelectedSheetNames(sheets.map(s => s.name))
        }
    }

    const mapChandaRow = (row: any) => {
        return {
            chandaNumber: String(row['Chanda Number'] || row['CHANDA ID#'] || row['Chanda No'] || ''),
            name: row['NAMES'] || row['Names'] || row['Name'] || '',
            receiptNo: String(row['RECEIPT NO'] || row['Receipt No'] || ''),
            date: row['DATE'] || row['Date'],
            monthPaidFor: row['MonthPaidFor'] || '',
            chandaAam: parseFloat(row['Chanda Aam']) || 0,
            chandaWasiyyat: parseFloat(row['Chanda Wasiyyat']) || 0,
            jalsaSalana: parseFloat(row['Jalsa Salana']) || 0,
            tarikiJadid: parseFloat(row['Tariki Jadid']) || 0,
            waqfiJadid: parseFloat(row['Waqfi Jadid']) || 0,
            welfareFund: parseFloat(row['Welfare Fund']) || 0,
            scholarship: parseFloat(row['Scholarship']) || 0,
            zakatulFitr: parseFloat(row['Zakatul-Fitr']) || 0,
            tabligh: parseFloat(row['Tabligh']) || 0,
            zakat: parseFloat(row['Zakat']) || 0,
            sadakat: parseFloat(row['Sadakat']) || 0,
            fitrana: parseFloat(row['Fitrana']) || 0,
            mosqueDonation: parseFloat(row['Moaque Donation']) || parseFloat(row['Mosque Donation']) || 0,
            mta: parseFloat(row['MTA']) || 0,
            centinaryKhilafat: parseFloat(row['Centinary Khilafat']) || 0,
            wasiyyatHissanJaidad: parseFloat(row['Wasiyyat_Hissan_Jaidad']) || 0,
            bilalFund: parseFloat(row['Bilal Fund']) || 0,
            yatamaFund: parseFloat(row['Yatama Fund']) || 0,
            localFund: parseFloat(row['Local Fund']) || 0,
            miscellaneous: parseFloat(row['Miscellaneous']) || 0,
            maryamFund: parseFloat(row['Maryam Fund']) || 0,
            totalNgn: parseFloat(row['TOTAL (NGN)'] || row['Sub Total']) || 0,
        }
    }

    const mapTajnidRow = (row: any) => {
        return {
            sn: String(row['S/N'] || ''),
            surname: row['SURNAME'] || '',
            otherNames: row['OTHER NAMES'] || '',
            title: row['TITLE'] || '',
            majlis: row['MAJLIS'] || '',
            refName: row['Ref Name'] || '',
            chandaNo: String(row['CHANDA #'] || ''),
            wasiyyatNo: String(row['WASIYYAT #'] || ''),
            presence: row['PRESENCE'] || '',
            family: row['FAMILY'] || '',
            election: row['election'] || '',
            updatedOnPortal: row['Updated on portal'] || '',
            academicStatus: row['acada'] || '',
            dateOfBirth: row['DoB'],
            email: row['Email'] || '',
            address: row["Jama'at"] || '',
        }
    }

    const startImport = async () => {
        if (!selectedType) return
        setIsUploading(true)
        let totalAdded = 0
        let hasErrors = false

        // Filter sheets based on selection
        const sheetsToProcess = sheets.filter(s => selectedSheetNames.includes(s.name))

        for (const sheet of sheetsToProcess) {
            const i = sheets.findIndex(s => s.name === sheet.name) // Get original index for updating state
            setSheetResults(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'processing' } : s))

            try {
                let result
                if (selectedType === 'CHANDA') {
                    const mapped = sheet.rows.map(mapChandaRow)
                    result = await bulkInsertChandaAmRecords(mapped)
                } else {
                    const mapped = sheet.rows.map(mapTajnidRow)
                    result = await bulkInsertTajnidRecords(mapped)
                }

                if (result.success) {
                    const count = result.count || 0
                    totalAdded += count
                    setSheetResults(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'completed', success: count } : s))
                } else {
                    hasErrors = true
                    setSheetResults(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'error', message: result.error } : s))
                }
            } catch (err) {
                console.error(err)
                hasErrors = true
                setSheetResults(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'error', message: 'System Error' } : s))
            }
        }

        setIsUploading(false)

        if (totalAdded > 0) {
            setNotification({
                show: true,
                title: 'Data Import Successful',
                message: `Successfully processed and added ${totalAdded} new records to the database. Redirecting you to the records dashboard...`,
                type: 'success'
            })
            setTimeout(() => {
                router.push('/dashboard/records')
            }, 3000)
        } else if (!hasErrors) {
            setNotification({
                show: true,
                title: 'No New Records',
                message: 'The uploaded file was processed successfully, but all records already exist in the database. No new entries were created.',
                type: 'info'
            })
        } else {
            setNotification({
                show: true,
                title: 'Import Completed with Errors',
                message: 'Some sheets could not be processed correctly. Please check the status indicators for details.',
                type: 'error'
            })
        }
    }

    const reset = () => {
        setFile(null)
        setSheets([])
        setSheetResults([])
        setSelectedSheetNames([])
        setSelectedType(null)
        setIsUploading(false)
    }

    return (
        <div className="max-w-6xl mx-auto space-y-10">
            {!file ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative group cursor-pointer"
                    onClick={() => setShowInstructionModal(true)}
                >
                    <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-emerald-500/10 md:rounded-[2.5rem] rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
                    <div className="relative bg-white border-2 border-dashed border-gray-100 md:rounded-[2.5rem] rounded-2xl md:p-16 p-8 text-center hover:border-emerald-400 hover:bg-emerald-50/20 transition-all duration-500">
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".xlsx,.xls,.csv"
                            onChange={handleFileChange}
                        />
                        <div className="mx-auto w-24 h-24 bg-emerald-100 rounded-3xl flex items-center justify-center mb-8 shadow-inner">
                            <Upload className="h-12 w-12 text-emerald-600" />
                        </div>
                        <h3 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Upload Master Registry</h3>
                        <p className="text-gray-500 max-w-sm mx-auto mb-10 text-lg font-medium leading-relaxed">
                            Bring your spreadsheet to life. We support multi-sheet Excel files for Chanda Am and Tajnid records.
                        </p>

                        <div className="flex items-center justify-center space-x-8">
                            <div className="flex items-center text-sm font-black text-gray-400 uppercase tracking-widest">
                                <FileCheck className="w-5 h-5 mr-2 text-emerald-500" />
                                XLSX Only
                            </div>
                            <div className="flex items-center text-sm font-black text-gray-400 uppercase tracking-widest">
                                <Search className="w-5 h-5 mr-2 text-blue-500" />
                                Smart Parsing
                            </div>
                        </div>
                    </div>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left Panel: File Info & Type Selection */}
                    <div className="lg:col-span-4 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white md:rounded-[2.5rem] rounded-2xl md:p-8 p-6 border border-gray-100"
                        >
                            <div className="flex items-start justify-between mb-8">
                                <div className="p-4 bg-emerald-50 rounded-2xl">
                                    <FileSpreadsheet className="h-8 w-8 text-emerald-600" />
                                </div>
                                {!isUploading && (
                                    <button onClick={reset} className="p-2 text-gray-400 hover:text-red-500 bg-gray-50 rounded-xl transition-all">
                                        <X className="h-5 w-5" />
                                    </button>
                                )}
                            </div>
                            <h4 className="font-black text-xl text-gray-900 truncate mb-1">{file.name}</h4>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{(file.size / 1024).toFixed(1)} KB • {sheets.length} Sheets</p>

                            <div className="mt-10 space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 block">Select Record Category</label>

                                <button
                                    onClick={() => setSelectedType('CHANDA')}
                                    className={`w-full flex items-center p-5 rounded-2xl border-2 transition-all group ${selectedType === 'CHANDA'
                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-md shadow-emerald-500/10'
                                        : 'border-gray-50 bg-gray-50/50 text-gray-500 hover:border-emerald-200'}`}
                                >
                                    <div className={`p-3 rounded-xl mr-4 ${selectedType === 'CHANDA' ? 'bg-emerald-500 text-white' : 'bg-white text-gray-400'}`}>
                                        <Receipt className="h-5 w-5" />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-bold text-base">Chanda Am</div>
                                        <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Financial Returns</div>
                                    </div>
                                    {selectedType === 'CHANDA' && <CheckCircle2 className="ml-auto h-5 w-5 text-emerald-600" />}
                                </button>

                                <button
                                    onClick={() => setSelectedType('TAJNID')}
                                    className={`w-full flex items-center p-5 rounded-2xl border-2 transition-all group ${selectedType === 'TAJNID'
                                        ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-md shadow-blue-500/10'
                                        : 'border-gray-50 bg-gray-50/50 text-gray-500 hover:border-blue-200'}`}
                                >
                                    <div className={`p-3 rounded-xl mr-4 ${selectedType === 'TAJNID' ? 'bg-blue-500 text-white' : 'bg-white text-gray-400'}`}>
                                        <Users className="h-5 w-5" />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-bold text-base">Tajnid Records</div>
                                        <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Membership Records</div>
                                    </div>
                                    {selectedType === 'TAJNID' && <CheckCircle2 className="ml-auto h-5 w-5 text-blue-600" />}
                                </button>
                            </div>

                            <button
                                onClick={startImport}
                                disabled={isUploading || !selectedType || selectedSheetNames.length === 0}
                                className="w-full mt-10 flex items-center justify-center px-8 py-5 bg-gray-900 text-white md:rounded-[2rem] rounded-xl font-black text-sm hover:bg-emerald-600 disabled:opacity-30 disabled:hover:bg-gray-900 transition-all active:scale-95 group"
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                                        COMMITTING...
                                    </>
                                ) : (
                                    <>
                                        IMPORT SELECTED ({selectedSheetNames.length})
                                        <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </motion.div>
                    </div>

                    {/* Right Panel: Sheet Progress */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h5 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center">
                                <span className="bg-gray-100 w-6 h-6 rounded-full flex items-center justify-center mr-2 text-gray-500 border border-gray-200 shadow-inner">
                                    {selectedSheetNames.length}
                                </span>
                                Sheets Selected
                            </h5>
                            <div className="flex items-center space-x-3">
                                {sheets.length > 1 && (
                                    <button
                                        onClick={toggleSelectAll}
                                        className={`flex items-center px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedSheetNames.length === sheets.length
                                            ? 'bg-gray-900 text-white shadow-lg hover:bg-gray-700'
                                            : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 shadow-sm'
                                            }`}
                                    >
                                        <div className={`w-3 h-3 rounded-full border-2 mr-2 flex items-center justify-center ${selectedSheetNames.length === sheets.length ? 'border-emerald-400 bg-emerald-400' : 'border-gray-400'
                                            }`}>
                                            {selectedSheetNames.length === sheets.length && <Check className="w-2 h-2 text-white stroke-[4]" />}
                                        </div>
                                        {selectedSheetNames.length === sheets.length ? 'All Selected' : 'Select All'}
                                    </button>
                                )}
                            </div>
                        </div>
                        <AnimatePresence mode='popLayout'>
                            {sheetResults.map((res, i) => (
                                <motion.div
                                    key={res.name}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => !isUploading && toggleSheetSelection(res.name)}
                                    className={`relative p-6 md:rounded-[2rem] rounded-2xl border-2 transition-all duration-300 cursor-pointer ${selectedSheetNames.includes(res.name)
                                        ? res.status === 'processing'
                                            ? 'bg-emerald-50 border-emerald-500 ring-4 ring-emerald-500/5'
                                            : 'bg-white border-emerald-500 shadow-xl shadow-emerald-500/5'
                                        : 'bg-gray-50 border-gray-100 opacity-60 hover:opacity-100'
                                        } ${res.status === 'error' ? '!bg-red-50 !border-red-200' : ''
                                        }`}
                                >
                                    {/* Selection Indicator */}
                                    <div className={`absolute top-6 right-6 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedSheetNames.includes(res.name)
                                        ? 'bg-emerald-500 border-emerald-500'
                                        : 'bg-transparent border-gray-300'
                                        }`}>
                                        {selectedSheetNames.includes(res.name) && <Check className="w-4 h-4 text-white stroke-[3]" />}
                                    </div>

                                    <div className="flex items-center justify-between pr-10">
                                        <div className="flex items-center space-x-6">
                                            <div className={`p-4 rounded-2xl transition-all duration-500 ${res.status === 'completed' ? 'bg-emerald-600 text-white' :
                                                res.status === 'processing' ? 'bg-emerald-100 text-emerald-600 animate-pulse' :
                                                    res.status === 'error' ? 'bg-red-600 text-white' : 'bg-gray-50/50 text-gray-300'
                                                }`}>
                                                {res.status === 'completed' ? <FileCheck className="h-7 w-7" /> : <FileSpreadsheet className="h-7 w-7" />}
                                            </div>
                                            <div>
                                                <p className={`font-black text-lg tracking-tight transition-colors ${selectedSheetNames.includes(res.name) ? 'text-gray-900' : 'text-gray-400'}`}>{res.name}</p>
                                                <div className="flex items-center space-x-3 mt-1">
                                                    <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded uppercase tracking-tighter">{sheets[i]?.rows.length} ROWS</span>
                                                    {res.status === 'completed' && <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">SUCCESSFUL</span>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            {res.status === 'processing' && (
                                                <div className="flex items-center space-x-4">
                                                    <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest animate-pulse">Syncing...</div>
                                                    <Loader2 className="h-6 w-6 text-emerald-500 animate-spin" />
                                                </div>
                                            )}
                                            {res.status === 'completed' && (
                                                <div className="flex flex-col items-end">
                                                    <div className="text-2xl font-black text-emerald-600 tabular-nums">+{res.success}</div>
                                                    <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">ENTRIES REIFIED</div>
                                                </div>
                                            )}
                                            {res.status === 'error' && (
                                                <div className="flex items-center bg-red-100 px-4 py-2 rounded-xl text-red-600 font-black text-[10px]">
                                                    <AlertCircle className="h-4 w-4 mr-2" />
                                                    <span className="uppercase tracking-widest truncate max-w-[150px]">{res.message}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            )}

            <AnimatePresence>
                {notification.show && (
                    <NotificationModal
                        config={notification}
                        onClose={() => setNotification(prev => ({ ...prev, show: false }))}
                    />
                )}
            </AnimatePresence>

            {/* Instruction Modal */}
            <AnimatePresence>
                {showInstructionModal && (
                    <InstructionModal
                        onClose={() => setShowInstructionModal(false)}
                        onProceed={() => {
                            setShowInstructionModal(false)
                            setTimeout(() => fileInputRef.current?.click(), 100)
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

function InstructionModal({ onClose, onProceed }: { onClose: () => void, onProceed: () => void }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-gray-900/80 backdrop-blur-md"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                className="relative bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/50 border border-white/10"
            >
                {/* Decorative Elements */}
                <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-br from-slate-900 via-slate-800 to-black" />
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Receipt className="w-40 h-40 text-white transform rotate-12" />
                </div>

                <div className="relative p-8 pt-12">
                    {/* Icon Header */}
                    <div className="relative mx-auto w-24 h-24 mb-6">
                        <div className="absolute inset-0 bg-white/20 backdrop-blur-xl rounded-3xl transform rotate-6"></div>
                        <div className="absolute inset-0 bg-white shadow-xl rounded-3xl flex items-center justify-center border-4 border-slate-50 z-10">
                            <AlertCircle className="w-10 h-10 text-emerald-600" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-2 rounded-xl shadow-lg z-20 border-2 border-white">
                            <FileCheck className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Strict Upload Policy</h3>
                        <p className="text-slate-500 font-medium leading-relaxed">
                            To maintain database integrity, you are restricted to uploading only specific record types.
                        </p>
                    </div>

                    <div className="space-y-3 mb-8">
                        <div className="bg-emerald-50 rounded-2xl p-4 flex items-center border border-emerald-100 group hover:border-emerald-300 transition-colors">
                            <div className="bg-white p-2 rounded-xl shadow-sm mr-4 text-emerald-600">
                                <Receipt className="w-5 h-5" />
                            </div>
                            <div>
                                <h5 className="font-bold text-slate-900 text-sm">Chanda Am Records</h5>
                                <p className="text-xs text-slate-500 font-medium">Financial returns and contributions</p>
                            </div>
                            <div className="ml-auto">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>

                        <div className="bg-blue-50 rounded-2xl p-4 flex items-center border border-blue-100 group hover:border-blue-300 transition-colors">
                            <div className="bg-white p-2 rounded-xl shadow-sm mr-4 text-blue-600">
                                <Users className="w-5 h-5" />
                            </div>
                            <div>
                                <h5 className="font-bold text-slate-900 text-sm">Tajnid Records</h5>
                                <p className="text-xs text-slate-500 font-medium">Membership and census data</p>
                            </div>
                            <div className="ml-auto">
                                <CheckCircle2 className="w-5 h-5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    </div>

                    <div className="text-center p-4 bg-red-50 rounded-2xl border border-red-100 mb-8">
                        <p className="text-xs font-bold text-red-500 uppercase tracking-widest flex items-center justify-center">
                            <AlertCircle className="w-3 h-3 mr-2" />
                            Invalid formats are rejected
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={onClose}
                            className="w-full py-4 text-slate-400 font-bold text-sm tracking-wide hover:bg-slate-50 hover:text-slate-600 rounded-2xl transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onProceed}
                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm tracking-wide hover:bg-emerald-600 shadow-xl shadow-emerald-500/20 transition-all active:scale-95 flex items-center justify-center group"
                        >
                            I Understand
                            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

function NotificationModal({ config, onClose }: { config: any, onClose: () => void }) {
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
                className="relative bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-gray-100 p-8 text-center"
            >
                <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${config.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                    config.type === 'error' ? 'bg-red-100 text-red-600' :
                        'bg-blue-100 text-blue-600'
                    }`}>
                    {config.type === 'success' ? <CheckCircle2 className="w-8 h-8" /> :
                        config.type === 'error' ? <AlertCircle className="w-8 h-8" /> :
                            <CheckCircle2 className="w-8 h-8" />}
                </div>

                <h3 className="text-xl font-black text-gray-900 mb-2">{config.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed mb-8">{config.message}</p>

                <button
                    onClick={onClose}
                    className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-sm tracking-wide hover:bg-gray-800 transition-all active:scale-95"
                >
                    Dismiss Message
                </button>
            </motion.div>
        </div>
    )
}
