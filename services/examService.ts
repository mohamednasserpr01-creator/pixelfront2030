import { Exam } from '../types';

export const examService = {
    getExam: async (examId: string): Promise<Exam> => {
        // Mock API Call
        return {
            id: examId,
            titleAr: "امتحان العبور الإجباري 📝", 
            titleEn: "Mandatory Exam 📝",
            lectureAr: "المحاضرة الأولى: التأسيس الذهني والمنهجي", 
            lectureEn: "Lecture 1: Foundation",
            timeLimit: 15,
            questions: [
                { 
                    id: 1, type: 'mcq', 
                    textAr: "ما هو القانون الفيزيائي الذي يعبر عن مقاومة الجسم للتغيير؟", 
                    textEn: "Which physical law expresses a body's resistance to change?",
                    optionsAr: ["قانون نيوتن الأول", "قانون الجذب العام", "قانون نيوتن الثالث", "معادلة أينشتاين"],
                    optionsEn: ["Newton's First Law", "Law of Universal Gravitation", "Newton's Third Law", "Einstein's Equation"],
                    correctAns: 0, 
                    explanationAr: "قانون نيوتن الأول (القصور الذاتي).", 
                    explanationEn: "Newton's First Law (Inertia)."
                },
                { 
                    id: 2, type: 'essay', 
                    textAr: "اكتب باختصار استنتاج معادلة الحركة، أو ارفع صورة للحل.", 
                    textEn: "Briefly write the derivation of the equation of motion, or upload a picture.",
                    correctAns: "essay", 
                    explanationAr: "يجب ذكر معادلة التسارع وتكاملها بالنسبة للزمن للوصول لمعادلة الإزاحة كاملة.", 
                    explanationEn: "You must mention the acceleration equation and integrate it."
                }
            ]
        };
    }
};