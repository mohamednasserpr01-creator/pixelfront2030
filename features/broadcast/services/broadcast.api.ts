// FILE: features/broadcast/services/broadcast.api.ts
import { CampaignState } from '../types';

export interface CampaignResponse {
    campaignId: string;
    status: 'queued' | 'sending' | 'completed';
}

export interface CampaignStatusResponse {
    progress: number;
    sent: number;
    failed: number;
    logs: { id: string; phone: string; status: 'success' | 'fail'; reason?: string }[];
}

export const broadcastApi = {
    // 1. إرسال بيانات الحملة للسيرفر لبدء الإرسال
    startCampaign: async (payload: CampaignState): Promise<CampaignResponse> => {
        console.log("🚀 [API] Payload sent to backend:", payload);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ campaignId: `CAMP-${Date.now()}`, status: 'queued' });
            }, 1000);
        });
    },

    // 2. سؤال السيرفر عن حالة الحملة (Polling)
    getCampaignStatus: async (campaignId: string, currentProgress: number, targetCount: number): Promise<CampaignStatusResponse> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // 💡 هنا بنحاكي إن السيرفر بيرد علينا بتقدم جديد ولوجز جديدة
                const newProgress = Math.min(currentProgress + Math.floor(Math.random() * 5) + 1, targetCount);
                const isSuccess = Math.random() > 0.1;
                
                const newLog = {
                    id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(),
                    phone: `01${Math.floor(Math.random() * 900000000)}`,
                    status: isSuccess ? 'success' : 'fail' as 'success'|'fail',
                    reason: isSuccess ? undefined : 'الرقم مغلق أو محظور'
                };

                resolve({
                    progress: newProgress,
                    sent: isSuccess ? 1 : 0,
                    failed: isSuccess ? 0 : 1,
                    logs: [newLog]
                });
            }, 800); // سرعة الرد من السيرفر
        });
    }
};