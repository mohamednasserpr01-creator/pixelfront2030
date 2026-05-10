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
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log("✅ تم حفظ الأكواد بنجاح!");
                resolve({ success: true });
            }, 1500); // محاكاة وقت السيرفر
        });
    }
};