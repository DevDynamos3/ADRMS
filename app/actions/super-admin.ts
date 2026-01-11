'use server'

import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { getSession } from '@/lib/session'
import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Since we are moving away from Prisma, we define a Role enum here if it's used
export enum Role {
    SUPER_ADMIN = 'SUPER_ADMIN',
    STANDARD_ADMIN = 'STANDARD_ADMIN'
}

const AdminSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    organizationName: z.string().min(2, 'Organization name is required'),
    passwordNumber: z.string().min(1, 'Password number is required'),
    role: z.nativeEnum(Role).default(Role.STANDARD_ADMIN),
})

export async function createAdmin(prevState: any, formData: FormData) {
    const session = await getSession()

    // Authorization check: Only SUPER_ADMIN can create new admins
    if (!session || session.user.role !== Role.SUPER_ADMIN) {
        return {
            success: false,
            message: 'Unauthorized: Only super admins can create new admins.',
        }
    }

    const result = AdminSchema.safeParse(Object.fromEntries(formData))

    if (!result.success) {
        return {
            success: false,
            errors: result.error.flatten().fieldErrors,
            message: 'Validation failed'
        }
    }

    const { name, organizationName, passwordNumber, role } = result.data

    try {
        const db = await getDb()
        // Password rule: Organization Name + any number
        const plainPassword = `${organizationName}${passwordNumber}`
        const hashedPassword = await bcrypt.hash(plainPassword, 10)

        // Generate email: orgname + number @ jamaat.com
        const email = `${organizationName.toLowerCase().replace(/\s+/g, '')}${passwordNumber}@jamaat.com`

        // Check/Create organization
        let org = await db.collection('Organization').findOne({ name: organizationName })

        if (!org) {
            const orgResult = await db.collection('Organization').insertOne({
                name: organizationName,
                createdAt: new Date(),
                updatedAt: new Date(),
            })
            org = { _id: orgResult.insertedId, name: organizationName } as any
        }

        // Check if user already exists
        const existingUser = await db.collection('User').findOne({ email })

        if (existingUser) {
            return {
                success: false,
                message: `An admin with the generated email (${email}) already exists.`,
            }
        }

        await db.collection('User').insertOne({
            email,
            password: hashedPassword,
            name,
            role,
            organizationId: org!._id,
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        revalidatePath('/dashboard/super-admin')
        return {
            success: true,
            message: `New admin created for ${organizationName}. Credentials: Email: ${email}, Password: ${plainPassword}`,
        }
    } catch (error) {
        console.error('Failed to create admin:', error)
        return {
            success: false,
            message: 'An unexpected error occurred.',
        }
    }
}

export async function deleteAdmin(id: string) {
    const session = await getSession()

    if (!session || session.user.role !== Role.SUPER_ADMIN) {
        throw new Error('Unauthorized')
    }

    // Prevent deleting self
    if (session.user.id === id) {
        throw new Error('Cannot delete your own account')
    }

    const db = await getDb()
    await db.collection('User').deleteOne({ _id: new ObjectId(id) })

    revalidatePath('/dashboard/super-admin')
}
