'use server'

import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/session'

/**
 * Bulk insert Chanda Am records with organization and admin context.
 */
export async function bulkInsertChandaAmRecords(data: any[]) {
    const session = await getSession();
    if (!session || !session.user.organizationId) {
        return { success: false, error: 'Unauthorized: No organization context' };
    }

    try {
        const db = await getDb()
        const items = data.map(item => ({
            organizationId: new ObjectId(session.user.organizationId),
            adminId: new ObjectId(session.user.id),
            chandaNumber: String(item.chandaNumber || ''),
            name: String(item.name || ''),
            receiptNo: String(item.receiptNo || ''),
            date: item.date ? new Date(item.date) : null,
            monthPaidFor: item.monthPaidFor || null,
            chandaAam: Number(item.chandaAam || 0),
            chandaWasiyyat: Number(item.chandaWasiyyat || 0),
            jalsaSalana: Number(item.jalsaSalana || 0),
            tarikiJadid: Number(item.tarikiJadid || 0),
            waqfiJadid: Number(item.waqfiJadid || 0),
            welfareFund: Number(item.welfareFund || 0),
            scholarship: Number(item.scholarship || 0),
            zakatulFitr: Number(item.zakatulFitr || 0),
            tabligh: Number(item.tabligh || 0),
            zakat: Number(item.zakat || 0),
            sadakat: Number(item.sadakat || 0),
            fitrana: Number(item.fitrana || 0),
            mosqueDonation: Number(item.mosqueDonation || 0),
            mta: Number(item.mta || 0),
            centinaryKhilafat: Number(item.centinaryKhilafat || 0),
            wasiyyatHissanJaidad: Number(item.wasiyyatHissanJaidad || 0),
            bilalFund: Number(item.bilalFund || 0),
            yatamaFund: Number(item.yatamaFund || 0),
            localFund: Number(item.localFund || 0),
            miscellaneous: Number(item.miscellaneous || 0),
            maryamFund: Number(item.maryamFund || 0),
            totalNgn: Number(item.totalNgn || 0),
            createdAt: new Date(),
            updatedAt: new Date(),
        })).filter(item => {
            // Filter out empty rows where key fields are missing
            const hasName = item.name && item.name.trim() !== '';
            const hasChandaNo = item.chandaNumber && item.chandaNumber.trim() !== '';
            const hasReceipt = item.receiptNo && item.receiptNo.trim() !== '';
            // Record is valid if it has at least one identifying field
            return hasName || hasChandaNo || hasReceipt;
        })

        // Create bulk operations for idempotent insert
        const bulkOps = items.map(item => {
            let filter: any = {
                organizationId: item.organizationId
            };

            // Use Receipt No as primary unique identifier if available
            if (item.receiptNo && item.receiptNo.trim() !== '') {
                filter.receiptNo = item.receiptNo;
            } else {
                // Fallback composite key for records without receipt numbers
                filter.chandaNumber = item.chandaNumber;
                filter.monthPaidFor = item.monthPaidFor;
                filter.date = item.date;
                filter.totalNgn = item.totalNgn;
            }

            return {
                updateOne: {
                    filter,
                    update: { $setOnInsert: item },
                    upsert: true
                }
            };
        });

        if (bulkOps.length === 0) {
            return { success: true, count: 0 };
        }

        const result = await db.collection('ChandaAm').bulkWrite(bulkOps);

        revalidatePath('/dashboard/records');
        return { success: true, count: result.upsertedCount };
    } catch (error) {
        console.error('Bulk Chanda Am Import Error:', error);
        return { success: false, error: 'Failed to insert Chanda Am records' };
    }
}

/**
 * Bulk insert Tajnid records with organization and admin context.
 */
export async function bulkInsertTajnidRecords(data: any[]) {
    const session = await getSession();
    if (!session || !session.user.organizationId) {
        return { success: false, error: 'Unauthorized: No organization context' };
    }

    try {
        const db = await getDb()
        const items = data.map(item => ({
            organizationId: new ObjectId(session.user.organizationId),
            adminId: new ObjectId(session.user.id),
            sn: String(item.sn || ''),
            surname: String(item.surname || ''),
            otherNames: String(item.otherNames || ''),
            title: String(item.title || ''),
            majlis: String(item.majlis || ''),
            refName: String(item.refName || ''),
            chandaNo: String(item.chandaNo || ''),
            wasiyyatNo: String(item.wasiyyatNo || ''),
            presence: String(item.presence || ''),
            family: String(item.family || ''),
            election: String(item.election || ''),
            updatedOnPortal: String(item.updatedOnPortal || ''),
            academicStatus: String(item.academicStatus || ''),
            dateOfBirth: item.dateOfBirth ? new Date(item.dateOfBirth) : null,
            email: String(item.email || ''),
            address: String(item.address || ''),
            phone: String(item.phone || ''),
            createdAt: new Date(),
            updatedAt: new Date(),
        })).filter(item => {
            // Filter out empty rows where key fields are missing
            const hasSurname = item.surname && item.surname.trim() !== '';
            const hasOtherNames = item.otherNames && item.otherNames.trim() !== '';
            const hasChandaNo = item.chandaNo && item.chandaNo.trim() !== '';
            // Record is valid if it has at least one identifying field
            return hasSurname || hasOtherNames || hasChandaNo;
        })

        // Create bulk operations for idempotent insert
        const bulkOps = items.map(item => {
            let filter: any = {
                organizationId: item.organizationId
            };

            // Use Chanda No as primary unique identifier if available
            if (item.chandaNo && item.chandaNo.trim() !== '') {
                filter.chandaNo = item.chandaNo;
            } else {
                // Fallback composite key for records without chanda numbers
                // Using name combination to prevent duplicates
                filter.surname = item.surname;
                filter.otherNames = item.otherNames;
                if (item.phone) filter.phone = item.phone;
            }

            return {
                updateOne: {
                    filter,
                    update: { $setOnInsert: item },
                    upsert: true
                }
            };
        });

        if (bulkOps.length === 0) {
            return { success: true, count: 0 };
        }

        const result = await db.collection('TajnidRecord').bulkWrite(bulkOps);

        revalidatePath('/dashboard/records');
        return { success: true, count: result.upsertedCount };
    } catch (error) {
        console.error('Bulk Tajnid Import Error:', error);
        return { success: false, error: 'Failed to insert Tajnid records' };
    }
}
