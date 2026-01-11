'use server'

import { getDb } from '@/lib/mongodb'
import { encrypt } from '@/lib/session'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const LoginSchema = z.object({
    identifier: z.string().min(1, 'Email or Organization Name is required'),
    password: z.string().min(1, 'Password is required'),
})

export async function loginAction(prevState: any, formData: FormData) {
    const result = LoginSchema.safeParse(Object.fromEntries(formData))

    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors,
        }
    }

    const { identifier, password } = result.data
    const db = await getDb()

    // Find user by email OR find organization by name and then users belonging to it
    // Using aggregation to mimic the Prisma include behavior
    const users = await db.collection('User').aggregate([
        {
            $lookup: {
                from: 'Organization',
                localField: 'organizationId',
                foreignField: '_id',
                as: 'organization'
            }
        },
        { $unwind: { path: '$organization', preserveNullAndEmptyArrays: true } },
        {
            $match: {
                $or: [
                    { email: identifier },
                    { 'organization.name': identifier }
                ]
            }
        }
    ]).toArray()

    const user = users[0] as any

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return {
            message: 'Invalid credentials',
        }
    }

    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const session = await encrypt({
        user: {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            organizationId: user.organizationId?.toString(),
            organizationName: user.organization?.name
        }
    })

    const cookieStore = await cookies()
    cookieStore.set('session', session, { expires, httpOnly: true })

    redirect('/dashboard')
}

export async function logoutAction() {
    const cookieStore = await cookies()
    cookieStore.delete('session')
    redirect('/')
}
