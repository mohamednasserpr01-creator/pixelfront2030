// FILE: features/broadcast/types/index.ts
export type AudienceType = 'students' | 'parents' | 'both';
export type MsgType = 'whatsapp' | 'in_app';

// 💡 الشروط الجديدة الخاصة بالأدمن
export type SmartCondition = 'all' | 'new_course' | 'new_offer' | 'new_product' | 'new_bank' | 'new_library';

export interface CampaignState {
    step: 1 | 2 | 3 | 4;
    targetStage: string;
    targetMajor: string;
    targetAudience: AudienceType;
    condition: SmartCondition;
    
    // 💡 معرفات جديدة عشان نحفظ اختيار الأدمن (المدرس، الكورس، العرض، إلخ)
    selectedTeacherId: string;
    selectedEntityId: string; 

    targetCount: number;
    msgType: MsgType;
    messageBody: string;
    senderPhone: string;
    delaySeconds: number;
    isScheduled: boolean;
    scheduleDate: string;
    logs: any[];
}