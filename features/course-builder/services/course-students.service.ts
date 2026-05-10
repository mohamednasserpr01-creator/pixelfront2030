import { EnrolledStudent, SubscriptionType } from '../types/course-students.types';

// 🚀 توليد الداتا باستخدام أنواع الاشتراك الجديدة (SubscriptionType)
export const generateMockStudents = (count: number): EnrolledStudent[] => {
    const subs: SubscriptionType[] = ['manual_teacher', 'wallet', 'offer_code', 'course_code', 'lecture_code'];
    
    return Array.from({ length: count }).map((_, i) => ({
        id: `STU-${i + 1}`,
        serialNumber: `100${i + 1}`,
        name: `طالب تجريبي رقم ${i + 1}`,
        phone: `010${Math.floor(10000000 + Math.random() * 90000000)}`,
        parentPhone: `011${Math.floor(10000000 + Math.random() * 90000000)}`,
        governorate: i % 2 === 0 ? 'الإسكندرية' : 'القاهرة',
        address: 'شارع المعسكر، متفرع من كذا...',
        enrolledAt: '2023-10-01 10:00',
        paymentMethod: subs[i % subs.length], // 👈 حل الإيرور الأول
        paymentDetails: i % 3 === 0 ? 'خصم رصيد' : 'كود: X9Y8Z',
        isBlocked: i === 5,
        progress: Math.floor(Math.random() * 100),
        accessibleLectures: ['lec-1'],
        trackingDetails: [
            { itemId: 'item-1', type: 'lesson', status: 'completed', watchPercentage: 100, viewsCount: 2 },
            { itemId: 'item-2', type: 'homework', status: 'submitted', score: 9, maxScore: 10 },
            { itemId: 'item-3', type: 'exam', status: 'failed', score: 8, maxScore: 20 },
            { itemId: 'item-makeup', type: 'makeup_exam', status: 'passed', score: 18, maxScore: 20 },
        ]
    }));
};

export const CourseStudentsService = {
    fetchEnrolledStudents: async (courseId: string): Promise<EnrolledStudent[]> => {
        return new Promise((resolve) => setTimeout(() => resolve(generateMockStudents(120)), 1000));
    },
    toggleStudentBlock: async (studentId: string, isBlocked: boolean) => {
        return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 500));
    },
    updateStudentLectures: async (studentId: string, lectureIds: string[]) => {
        return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 500));
    }
};