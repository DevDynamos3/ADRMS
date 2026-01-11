import { getChandaAmRecords, getTajnidRecords } from '@/app/actions/records'
import RecordsClient from '@/app/components/RecordsClient'
import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import { getSession } from '@/lib/session'

export default async function RecordsPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; page?: string; type?: string; month?: string; majlis?: string; orgId?: string }>
}) {
    const session = await getSession()
    const filters = await searchParams
    const query = filters?.q || ''
    const page = Number(filters?.page) || 1
    const type = filters?.type || 'chanda'
    const month = filters?.month || undefined
    const majlis = filters?.majlis || undefined
    const orgId = filters?.orgId || undefined

    let data
    if (type === 'tajnid') {
        data = await getTajnidRecords(query, page, 20, { majlis, orgId })
    } else {
        data = await getChandaAmRecords(query, page, 20, { month, orgId })
    }

    const { records, total } = data

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Records Management</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Viewing records for <span className="text-emerald-600 font-bold">{session?.user?.organizationName || 'Your Organization'}</span>
                    </p>
                </div>
            </div>

            <Suspense fallback={<div className="flex justify-center p-4"><Loader2 className="animate-spin h-8 w-8 text-emerald-600" /></div>}>
                <RecordsClient
                    records={records}
                    total={total}
                    searchParams={filters}
                />
            </Suspense>
        </div>
    )
}
