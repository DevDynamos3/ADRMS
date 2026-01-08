import { getRecords } from '@/app/actions/records'
import RecordsClient from '@/app/components/RecordsClient'
import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'

export default async function RecordsPage({
    searchParams,
}: {
    searchParams: { q?: string; page?: string }
}) {
    const query = searchParams?.q || ''
    const page = Number(searchParams?.page) || 1

    const { records, total } = await getRecords(query, page)

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Records Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage and track all financial records.</p>
                </div>
            </div>

            <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-emerald-600" /></div>}>
                <RecordsClient records={records} total={total} searchParams={searchParams} />
            </Suspense>
        </div>
    )
}
