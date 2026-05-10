// FILE: lib/api/endpoints/broadcast.ts
import { fetchAPI } from '../client'; 

export const broadcastApi = {
    sendCampaign: async (data: any) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // 💡 السحر هنا: خلينا السيرفر يفهم الـ in_app مهما كان اسم المتغير اللي جاي من الفرونت!
                const isAppNotification = data.type === 'in_app' || data.msgType === 'in_app' || data.channel === 'in_app';
                const messageContent = data.message || data.messageBody || 'إشعار جديد من الإدارة';
                
                // لو الإشعار داخلي، هنرميه في قاعدة بيانات الطالب (localStorage)
                if (isAppNotification) {
                    const saved = localStorage.getItem('pixel_notifications');
                    const notifications = saved ? JSON.parse(saved) : [];
                    
                    const newNotification = {
                        id: Date.now().toString(),
                        title: 'إشعار هام 📢',
                        body: messageContent,
                        createdAt: 'الآن',
                        isRead: false,
                        type: 'info'
                    };
                    
                    // إضافة الإشعار الجديد في أول القائمة
                    localStorage.setItem('pixel_notifications', JSON.stringify([newNotification, ...notifications]));
                    
                    // إطلاق الحدث عشان الجرس يرن فوراً في كل الشاشات المفتوحة
                    if (typeof window !== 'undefined') {
                        window.dispatchEvent(new Event('pixel_new_notification'));
                    }
                }

                resolve({ campaignId: `CAMP-${Date.now()}`, status: "queued" });
            }, 1000);
        });
    },

    getCampaignStatus: async (id: string, currentProgress: number, targetCount: number) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newProgress = Math.min(currentProgress + Math.floor(Math.random() * 5) + 1, targetCount);
                const isSuccess = Math.random() > 0.1;
                resolve({
                    progress: newProgress,
                    sent: isSuccess ? 1 : 0,
                    failed: isSuccess ? 0 : 1,
                    logs: [{
                        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(),
                        phone: `01${Math.floor(Math.random() * 900000000)}`,
                        status: isSuccess ? 'success' : 'fail' as 'success'|'fail',
                        reason: isSuccess ? undefined : 'حساب الطالب غير مفعل'
                    }]
                });
            }, 800);
        });
    }
};