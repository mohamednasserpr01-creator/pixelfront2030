export type SubscriptionType = 'manual_teacher' | 'wallet' | 'offer_code' | 'course_code' | 'lecture_code' | 'full_course' | 'specific_items';

export interface TrackingDetail {
    itemId: string;
    type: 'lesson' | 'exam' | 'homework' | 'homework_lesson' | 'makeup_exam' | string;
    status: 'completed' | 'pending' | 'failed' | 'passed' | string;
    itemTitle?: string; 
    watchPercentage?: number;
    viewsCount?: number;
    score?: number;
    maxScore?: number;
    views?: number;
    date?: string;
    [key: string]: any;
}

export interface EnrolledStudent {
    id: string;
    serialNumber: string;
    name: string;
    phone: string;
    parentPhone: string;
    governorate: string;
    address: string;
    enrolledAt: string;
    paymentMethod: SubscriptionType;
    paymentDetails?: any;
    isBlocked: boolean;
    purchasedItems?: string[];
    trackingDetails: TrackingDetail[];
    progress?: number; 
    
    // 🚀 الخاصية الجديدة اللي بتحدد المحاضرات المفتوحة للطالب
    accessibleLectures?: string[]; 
    
    enrollmentDate?: string;
    subscriptionType?: SubscriptionType;
    isSuspended?: boolean;
    tracking?: TrackingDetail[];
}