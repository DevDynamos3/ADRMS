'use server'

import { prisma } from '@/lib/db'
import { getSession } from '@/lib/session'
import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const AdminSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2),
    role: z.enum(['admin', 'super_admin']).default('admin'),
})

export async function createAdmin(prevState: any, formData: FormData) {
    const session = await getSession()

    // Authorization check
    if (!session || session.user.role !== 'super_admin') {
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
        }
    }

    const { email, password, name, role } = result.data

    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return {
                success: false,
                message: 'User with this email already exists.',
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role,
            },
        })

        revalidatePath('/dashboard/super-admin')
        return {
            success: true,
            message: 'New admin created successfully!',
        }
    } catch (error) {
        console.error('Failed to create admin:', error)
        return {
            success: false,
            message: 'An unexpected error occurred.',
        }
    }
}

export async function deleteAdmin(id: any) {
    const session = await getSession()

    if (!session || session.user.role !== 'super_admin') {
        throw new Error('Unauthorized')
    }

    // Prevent deleting self
    if (session.user.id === id) {
        throw new Error('Cannot delete your own account')
    }

    await prisma.user.delete({
        where: { id },
    })

    revalidatePath('/dashboard/super-admin')
}
