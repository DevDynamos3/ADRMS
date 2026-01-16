import UploadClient from '@/app/components/UploadClient'

export default function UploadPage() {
    return (
        <div className="space-y-6">
            <div className="border-b border-gray-200 pb-5">
                <h3 className="text-xl leading-6 font-bold text-gray-900 tracking-tight">Upload Organization Records</h3>
                <p className="mt-2 max-w-4xl text-sm font-medium text-gray-500">
                    Securely import your organization's data. <span className="text-emerald-600 font-bold">Only Chanda Am and Tajnid records are accepted.</span> Ensure your Excel sheets strictly follow the required schema.
                </p>
            </div>
            <UploadClient />
        </div>
    )
}
