'use server'

import { getSession } from "@/lib/session"

export async function getAuthStatus() {
    const session = await getSession()
    return !!session
}
