import UploadClient from '@/app/components/UploadClient'

export default function UploadPage() {
    return (
        <div className="space-y-6">
            <div className="border-b border-gray-200 pb-5">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Upload Records</h3>
                <p className="mt-2 max-w-4xl text-sm text-gray-500">
                    Import records from Excel spreadsheet. Ensure the sheet has columns for Receipt Number, Name, Amount, Date, and Type.
                </p>
            </div>
            <UploadClient />
        </div>
    )
}
