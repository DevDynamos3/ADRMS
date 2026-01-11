import { getDb } from '@/lib/mongodb'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import SuperAdminClient from '@/app/components/SuperAdminClient'

export default async function SuperAdminPage() {
    const session = await getSession()

    // Authorization: Only SUPER_ADMIN can access this page
    if (!session || session.user.role !== 'SUPER_ADMIN') {
        redirect('/dashboard')
    }

    const db = await getDb()
    const admins = await db.collection('User').aggregate([
        {
            $lookup: {
                from: 'Organization',
                localField: 'organizationId',
                foreignField: '_id',
                as: 'organization'
            }
        },
        { $unwind: { path: '$organization', preserveNullAndEmptyArrays: true } },
        { $sort: { createdAt: -1 as const } }
    ]).toArray()

    return (
        <div className="max-w-7xl mx-auto">
            <SuperAdminClient
                admins={JSON.parse(JSON.stringify(admins))}
                currentUserId={session.user.id}
            />
        </div>
    )
}
