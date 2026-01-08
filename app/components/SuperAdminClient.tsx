'use client'

import { useState, useActionState, useEffect } from 'react'
import { Plus, Trash2, Shield, User, Mail, Lock, Loader2 } from 'lucide-react'
import { createAdmin, deleteAdmin } from '../actions/super-admin'
import { Modal } from './ui/Modal'
import { User as UserType } from '@prisma/client'

export default function SuperAdminClient({
    admins,
    currentUserId
}: {
    admins: any[],
    currentUserId: number
}) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [state, formAction] = useActionState(createAdmin, { success: false, message: '' })

    useEffect(() => {
        if (state.success) {
            setIsModalOpen(false)
        }
    }, [state.success])

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this admin? This action cannot be undone.')) {
            try {
                await deleteAdmin(id)
            } catch (error: any) {
                alert(error.message)
            }
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Access Control</h1>
                    <p className="text-gray-500 mt-1 max-w-2xl">
                        Manage administrative credentials and security roles. Super admins can create, update, or revoke access for all team members.
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg active:scale-95 text-sm font-semibold whitespace-nowrap"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    New Administrator
                </button>
            </div>

            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {admins.map((admin) => (
                            <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                                            {admin.name?.charAt(0) || 'A'}
                                        </div>
                                        <div className="ml-4 text-sm font-medium text-gray-900">{admin.name}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{admin.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${admin.role === 'super_admin' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'
                                        }`}>
                                        {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {admin.id !== currentUserId && (
                                        <button
                                            onClick={() => handleDelete(admin.id)}
                                            className="text-red-600 hover:text-red-900 transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Admin Account">
                <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                    <p className="text-xs text-blue-700 leading-relaxed">
                        <strong>Security Note:</strong> All new administrators will have the ability to view and manage financial records. Please ensure you assign roles correctly based on team responsibility.
                    </p>
                </div>
                <form action={formAction} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <div className="mt-1 relative">
                            <input
                                name="name"
                                type="text"
                                required
                                placeholder="John Doe"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                            />
                            <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <div className="mt-1 relative">
                            <input
                                name="email"
                                type="email"
                                required
                                placeholder="admin@example.com"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                            />
                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <div className="mt-1 relative">
                            <input
                                name="password"
                                type="password"
                                required
                                minLength={6}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                            />
                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <div className="mt-1 relative">
                            <select
                                name="role"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm appearance-none"
                            >
                                <option value="admin">Standard Admin</option>
                                <option value="super_admin">Super Admin</option>
                            </select>
                            <Shield className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        </div>
                    </div>

                    {state.message && (
                        <div className={`text-sm p-3 rounded-md ${state.success ? 'bg-green-50 text-green-700 font-medium' : 'bg-red-50 text-red-700'}`}>
                            {state.message}
                        </div>
                    )}

                    <div className="flex justify-end pt-4">
                        <SubmitButton />
                    </div>
                </form>
            </Modal>
        </div>
    )
}

function SubmitButton() {
    // Note: useFormStatus must be in a component inside the form
    const { pending } = require('react-dom').useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 min-w-[120px]"
        >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Account'}
        </button>
    )
}
