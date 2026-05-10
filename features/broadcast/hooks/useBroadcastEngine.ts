// FILE: features/broadcast/hooks/useBroadcastEngine.ts
import { useState, useEffect, useRef } from 'react';
import { useBroadcastStore } from '../store/useBroadcastStore';
import { broadcastApi } from '../services/broadcast.api';

export const useBroadcastEngine = (onFinish: () => void) => {
    // 💡 بنسحب اللي محتاجينه من المخزن
    const { targetCount, logs, updateField, ...campaignData } = useBroadcastStore();
    
    // Local States للتحكم في الواجهة
    const [isSending, setIsSending] = useState(false);
    const [campaignId, setCampaignId] = useState<string | null>(null);
    const [progress, setProgress] = useState(logs.length);

    const progressRef = useRef(progress);
    useEffect(() => { progressRef.current = progress; }, [progress]);

    // 🚀 دالة بدء الإرسال
    const startEngine = async () => {
        setIsSending(true);
        // لو دي أول مرة نبعت، نكلم السيرفر يدينا ID للحملة
        if (!campaignId) {
            const res = await broadcastApi.startCampaign(campaignData as any);
            setCampaignId(res.campaignId);
        }
    };

    const stopEngine = () => setIsSending(false);

    const resetEngine = () => {
        setIsSending(false);
        setProgress(0);
        setCampaignId(null);
        updateField('logs', []);
    };

    // 🚀 نظام الـ Polling (سؤال السيرفر كل X ثواني)
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isSending && campaignId) {
            interval = setInterval(async () => {
                // 1. لو خلصنا
                if (progressRef.current >= targetCount) {
                    setIsSending(false);
                    clearInterval(interval);
                    setTimeout(() => onFinish(), 1000);
                    return;
                }

                // 2. جلب التحديث من الباك إند
                const statusRes = await broadcastApi.getCampaignStatus(campaignId, progressRef.current, targetCount);
                
                // 3. تحديث الـ UI والمخزن
                setProgress(statusRes.progress);
                updateField('logs', [...statusRes.logs.map(l => ({...l, name: 'طالب مستهدف'})), ...useBroadcastStore.getState().logs]);

                if (statusRes.progress >= targetCount) {
                    setIsSending(false);
                    clearInterval(interval);
                    setTimeout(() => onFinish(), 1000);
                }

            }, 2000); // 👈 Polling every 2 seconds (قابل للتعديل)
        }

        return () => clearInterval(interval);
    }, [isSending, campaignId, targetCount, onFinish, updateField]);

    return {
        isSending,
        progress,
        startEngine,
        stopEngine,
        resetEngine
    };
};