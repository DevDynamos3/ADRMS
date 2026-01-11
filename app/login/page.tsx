'use client'

import { useState, useActionState } from 'react'
import { loginAction } from '../actions/auth'
import { Key, Lock, Loader2, Eye, EyeOff } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from '../component/logo/Logo'

// Initial state for the form
const initialState = {
    message: '',
    errors: undefined
}

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(loginAction, initialState)
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="text-center">
                    <div className="flex items-center justify-center">
                        <Logo width={45} height={45} text="ADRMS" size="xl" />
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Admin Login
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign in to manage records
                    </p>
                </div>

                <form action={formAction} className="mt-8 space-y-6">
                    <div className="rounded-md -space-y-px">
                        <div className="relative">
                            <label htmlFor="identifier" className="sr-only">Email or Jamaat Name</label>
                            <input
                                id="identifier"
                                name="identifier"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                                placeholder="Email or Jamaat Name"
                            />
                        </div>
                        <div className="relative">
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm pr-10"
                                placeholder="Password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center z-20 cursor-pointer text-gray-400 hover:text-emerald-500 transition-colors"
                            >
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.div
                                        key={showPassword ? 'visible' : 'hidden'}
                                        initial={{ opacity: 0, scale: 0.8, rotate: -45 }}
                                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                        exit={{ opacity: 0, scale: 0.8, rotate: 45 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </button>
                        </div>
                    </div>

                    {state?.message && (
                        <div className="text-red-500 text-sm text-center">{state.message}</div>
                    )}
                    {state?.errors?.identifier && (
                        <div className="text-red-500 text-sm text-center">{state.errors.identifier[0]}</div>
                    )}
                    {state?.errors?.password && (
                        <div className="text-red-500 text-sm text-center">{state.errors.password[0]}</div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition-all"
                        >
                            {isPending ? (
                                <Loader2 className="animate-spin h-5 w-5" />
                            ) : (
                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    <Key className="h-5 w-5 text-emerald-500 group-hover:text-emerald-400" aria-hidden="true" />
                                </span>
                            )}
                            {isPending ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
