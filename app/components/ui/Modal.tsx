'use client'
import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

export function Modal({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) {
    const dialogRef = useRef<HTMLDialogElement>(null)

    useEffect(() => {
        const dialog = dialogRef.current
        if (isOpen) {
            dialog?.showModal()
        } else {
            dialog?.close()
        }
    }, [isOpen])

    return (
        <dialog
            ref={dialogRef}
            onClose={onClose}
            className="rounded-lg shadow-xl backdrop:bg-gray-900/50 p-0 w-full max-w-2xl open:animate-fade-in"
        >
            <div className="bg-white">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </dialog>
    )
}
