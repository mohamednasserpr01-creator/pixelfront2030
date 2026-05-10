export type QuestionType = 'mcq' | 'tf' | 'essay';
export type EssayFormat = 'text' | 'image' | 'both';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type HomeworkLanguage = 'ar' | 'en';

export interface Option {
    id: string; 
    text: string;
    image: File | null; 
    previewUrl: string | null; 
    isCorrect: boolean;
}

export interface Question {
    id: string;
    type: QuestionType;
    text: string;
    image: File | null;
    previewUrl: string | null;
    score: number;
    difficulty: Difficulty; 
    options?: Option[]; 
    isTrueFalseCorrect?: boolean; 
    essayFormat?: EssayFormat; 
}

export interface HomeworkState {
    title: string;
    language: HomeworkLanguage;
    dueDate: string; // 💡 تاريخ ووقت التسليم النهائي
    allowLateSubmission: boolean; // 💡 السماح للطلاب بحل الواجب بعد انتهاء الوقت
    questions: Question[];
}