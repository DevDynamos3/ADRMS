import { prisma } from '@/lib/db'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import SuperAdminClient from '@/app/components/SuperAdminClient'

export default async function SuperAdminPage() {
    const session = await getSession()

    // Authorization: Only super_admin can access this page
    if (!session || session.user.role !== 'super_admin') {
        redirect('/dashboard')
    }

    const admins = await prisma.user.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    })

    return (
        <SuperAdminClient
            admins={JSON.parse(JSON.stringify(admins))}
            currentUserId={session.user.id}
        />
    )
}
