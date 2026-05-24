// FILE: services/codeService.ts
import { fetchAPI } from '../lib/api/client';

export interface ChargeCodePayload {
    serial: string;
    code: string;
    type: string;
    value: string;
    batchId: string;
}

export const codeService = {
    // 1. جلب كل أكواد المدرس
    getAllCodes: async () => {
        return fetchAPI<any[]>('/charge-codes', { method: 'GET' });
    },

    // 2. حفظ دفعة جديدة من الأكواد
    saveCodes: async (codes: ChargeCodePayload[]) => {
        return fetchAPI<any>('/charge-codes/generate', {
            method: 'POST',
            body: JSON.stringify(codes)
        });
    },

    // 3. مسح كود واحد
    deleteCode: async (id: string) => {
        return fetchAPI<any>(`/charge-codes/${id}`, { method: 'DELETE' });
    },

    // 4. مسح دفعة كاملة (بناءً على وقت التوليد)
    bulkDelete: async (batchId: string) => {
        // تشفير الـ BatchId عشان لو فيه مسافات في التاريخ
        const encodedBatchId = encodeURIComponent(batchId);
        return fetchAPI<any>(`/charge-codes/bulk/${encodedBatchId}`, { method: 'DELETE' });
    }
};