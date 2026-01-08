
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const key = new TextEncoder().encode(process.env.NEXTAUTH_SECRET)

export async function encrypt(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(key)
}

export async function decrypt(input: string): Promise<any> {
    const { payload } = await jwtVerify(input, key, {
        algorithms: ['HS256'],
    })
    return payload
}

export async function login(formData: FormData) {
    // This is handled in API/Server Action usually, but helper here
}

export async function getSession() {
    const cookieStore = await cookies()
    const session = cookieStore.get('session')
    if (!session) return null
    try {
        return await decrypt(session.value)
    } catch (error) {
        return null
    }
}

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete('session')
}
