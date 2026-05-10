// FILE: services/courseService.ts
import { fetchAPI } from '../lib/api/client';
import { Course, LectureData } from '../types';

export const courseService = {
    // جلب كل الكورسات
    getAllCourses: async (): Promise<Course[]> => {
        // لما الباك إند يجهز هنشغل السطر ده:
        // return fetchAPI<Course[]>('/courses');
        
        // 💡 مؤقتاً لحد ما الباك إند يجهز، بنرجع Mock Data بس منسقة ومطابقة للـ Type
        return [
            { id: 1, img: '/course1.jpg', titleAr: 'فيزياء 3 ثانوي', titleEn: 'Physics 3rd Sec', descAr: 'شرح كامل', descEn: 'Full course', price: 250 },
            { id: 2, img: '/course2.jpg', titleAr: 'كيمياء 3 ثانوي', titleEn: 'Chemistry 3rd Sec', descAr: 'مراجعة', descEn: 'Revision', price: 200 },
        ];
    },

    // جلب تفاصيل كورس واحد
    getCourseById: async (id: string | number): Promise<Course> => {
        // return fetchAPI<Course>(`/courses/${id}`);
        return { id, img: '/course1.jpg', titleAr: 'فيزياء 3 ثانوي', titleEn: 'Physics 3rd', descAr: 'شرح', descEn: 'Desc', price: 250 };
    },

    // جلب محاضرات كورس معين
    getCourseLectures: async (courseId: string | number): Promise<LectureData[]> => {
        // return fetchAPI<LectureData[]>(`/courses/${courseId}/lectures`);
        
        // 💡 تم تحديث الـ Mock Data هنا عشان تتطابق مع نوع LectureData الجديد (نظام الـ Playlist)
        return [
            { 
                id: 'l1', 
                courseId, 
                titleAr: 'الفصل الأول', 
                titleEn: 'Chapter 1', 
                descAr: 'مقدمة الفصل الأول',
                descEn: 'Chapter 1 Intro',
                studentName: 'Pixel_Student',
                playlist: [
                    { id: 'p1', type: 'video', titleAr: 'مقدمة', titleEn: 'Intro', status: 'active' }
                ]
            },
        ];
    }
};