// FILE: services/homeworkService.ts
import { Homework } from '../types';

export const homeworkService = {
    getHomework: async (hwId: string): Promise<Homework> => {
        // محاكاة الاتصال بالباك إند (Mock API)
        return {
            id: hwId,
            titleAr: "واجب المحاضرة الأولى: التأسيس الذهني", 
            titleEn: "Lecture 1 Homework",
            descAr: "هذا الواجب يحتوي على 3 أسئلة متنوعة. يمكنك حفظ الإجابات والعودة للمحاضرة في أي وقت، لكن يجب التسليم النهائي لفتح المحاضرة الثانية.",
            descEn: "This homework contains 3 questions. You can save progress and return anytime. Final submission is required to unlock the next lecture.",
            isMandatory: true,
            totalScore: 10,
            questions: [
                { 
                    id: 'q1', type: 'mcq', score: 2, 
                    textAr: "ما هو القانون الفيزيائي المعبر عن القصور الذاتي؟", textEn: "Which law expresses inertia?", 
                    optionsAr: ["قانون نيوتن الأول", "قانون نيوتن الثاني"], optionsEn: ["Newton's First Law", "Newton's Second Law"], 
                    correctAns: 0, reviewAr: "قانون نيوتن الأول.", reviewEn: "Newton's First Law." 
                },
                { 
                    id: 'q2', type: 'tf', score: 3, 
                    textAr: "السرعة المتجهة هي كمية قياسية لا تعتمد على الاتجاه.", textEn: "Velocity is a scalar quantity that does not depend on direction.", 
                    correctAns: 'false', reviewAr: "خطأ.", reviewEn: "False." 
                },
                { 
                    id: 'q3', type: 'essay', score: 5, 
                    textAr: "بأسلوبك الخاص، اذكر تطبيقات على قانون نيوتن. (يمكنك كتابة الحل أو رفع صورة)", textEn: "Mention applications of Newton's law. (You can write or upload an image)", 
                    correctAns: "essay", reviewAr: "يجب ذكر اندفاع الركاب للأمام، وأيضاً حركة الصواريخ.", reviewEn: "Mention passenger inertia and rocket motion." 
                }
            ]
        };
    }
};