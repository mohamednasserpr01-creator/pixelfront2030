export type QuestionType = 'mcq' | 'tf' | 'essay';
export type EssayFormat = 'text' | 'image' | 'both';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type ExamLanguage = 'ar' | 'en'; // 💡 نوع اللغة

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

export interface ExamRandomSettings {
    enabled: boolean;
    questionCount: number;
    shuffleQuestions: boolean;
    shuffleOptions: boolean;
    difficultyDistribution: { easy: number; medium: number; hard: number; };
}

export interface ExamState {
    title: string;
    stage: string; // 🚀 ضفنا المرحلة هنا
    language: ExamLanguage; 
    durationMinutes: number;
    randomSettings: ExamRandomSettings;
    questions: Question[];
}