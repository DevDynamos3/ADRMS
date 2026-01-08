'use server'

import { prisma } from '@/lib/db'
import { encrypt } from '@/lib/session'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
})

export async function loginAction(prevState: any, formData: FormData) {
    const result = LoginSchema.safeParse(Object.fromEntries(formData))

    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors,
        }
    }

    const { email, password } = result.data

    const user = await prisma.user.findUnique({
        where: { email },
    })

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return {
            message: 'Invalid credentials',
        }
    }

    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const session = await encrypt({ user: { id: user.id, email: user.email, name: user.name } })

    const cookieStore = await cookies()
    cookieStore.set('session', session, { expires, httpOnly: true })

    redirect('/dashboard')
}

export async function logoutAction() {
    const cookieStore = await cookies()
    cookieStore.delete('session')
    redirect('/')
}
