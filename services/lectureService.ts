// FILE: services/lectureService.ts
import { LectureData } from '../types'; // 💡 استدعينا النوع الصارم

export const lectureService = {
    // 💡 أجبرنا الدالة إنها ترجع LectureData
    getLecture: async (courseId: string, lectureId: string): Promise<LectureData> => {
        // Mock API Call
        return {
            id: lectureId, courseId: courseId,
            titleAr: "المحاضرة الأولى: التأسيس الذهني والمنهجي", titleEn: "Lecture 1: Foundation",
            descAr: "في هذه المحاضرة سنناقش أساسيات المنهج وكيفية وضع خطة للمذاكرة الذكية لضمان الدرجة النهائية.",
            descEn: "In this lecture, we discuss the basics of the curriculum and smart study plans.",
            studentName: "Mahmoud_2026", 
            playlist: [
                { id: 'item1', type: 'exam', titleAr: "امتحان شامل على الباب السابق", titleEn: "Previous Chapter Exam", status: 'completed', isReq: true, questions: 20, timeLimit: 30 },
                { id: 'item2', type: 'video', titleAr: "الجزء الأول: المفاهيم الأساسية", titleEn: "Part 1: Basic Concepts", status: 'active', time: "15:20", videoSrc: "https://www.w3schools.com/html/mov_bbb.mp4", poster: "https://images.unsplash.com/photo-1434031211128-095490e7e73b?w=1200" },
                { id: 'item3', type: 'video', titleAr: "الجزء الثاني: التطبيق العملي", titleEn: "Part 2: Practical Application", status: 'available', time: "22:10", videoSrc: "https://www.w3schools.com/html/mov_bbb.mp4", poster: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200" },
                { id: 'item4', type: 'pdf', titleAr: "ملزمة الشرح الأساسية (PDF)", titleEn: "Main Explanation PDF", status: 'available', link: "#" },
                { id: 'item5', type: 'pdf', titleAr: "ملخص القوانين (PDF)", titleEn: "Formulas Summary PDF", status: 'available', link: "#" },
                { id: 'item6', type: 'homework', titleAr: "واجب المحاضرة الأولى", titleEn: "Lecture 1 Homework", status: 'locked', isReq: true, questions: 15 },
                { id: 'item7', type: 'video', titleAr: "فيديو حل الواجب (يفتح بعد التسليم)", titleEn: "Homework Solution Video", status: 'locked', time: "30:00", videoSrc: "https://www.w3schools.com/html/mov_bbb.mp4", poster: "" },
                { id: 'item8', type: 'exam', titleAr: "كويز سريع نهاية الحصة", titleEn: "Quick End-of-class Quiz", status: 'locked', isReq: true, questions: 5, timeLimit: 10 }
            ]
        };
    }
};