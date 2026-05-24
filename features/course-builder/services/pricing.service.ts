// FILE: features/course-builder/services/pricing.service.ts
import { codeService } from '../../../services/codeService';

export interface GeneratedCodePayload {
    code: string;
    serial: string;
    price: number;
    targetId: string;
    targetType: 'full_course' | 'lecture';
    createdBy: string;
    isUsed: boolean;
}

export const PricingService = {
    saveGeneratedCodes: async (codes: GeneratedCodePayload[]) => {
        console.log(`🚀 جاري إرسال ${codes.length} كود لقاعدة البيانات...`);
        
        // 💡 تحويل شكل الداتا عشان تطابق الـ DTO الجديد اللي عملناه في الباك إند
        const payloadToSave = codes.map(c => ({
            serial: c.serial,
            code: c.code,
            type: 'course', // نحدد إنها كورس مش محفظة
            value: c.targetId,
            batchId: new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true })
        }));

        try {
            await codeService.saveCodes(payloadToSave);
            console.log("✅ تم حفظ الأكواد بنجاح!");
            return { success: true };
        } catch (error) {
            console.error("❌ فشل حفظ الأكواد:", error);
            throw error;
        }
    }
};