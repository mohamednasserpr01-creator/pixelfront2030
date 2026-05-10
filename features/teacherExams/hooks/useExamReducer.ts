// FILE: features/teacherExams/hooks/useExamReducer.ts
import { useReducer } from 'react';
import { ExamState, Question, QuestionType, ExamRandomSettings, ExamLanguage } from '../types';

const generateId = () => crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);

const AR_LABELS = ['أ', 'ب', 'ج', 'د', 'هـ', 'و'];
const EN_LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];

type Action = 
    | { type: 'SET_TITLE'; payload: string }
    | { type: 'SET_DURATION'; payload: number }
    | { type: 'SET_LANGUAGE'; payload: ExamLanguage }
    | { type: 'UPDATE_RANDOM_SETTINGS'; payload: Partial<ExamRandomSettings> }
    | { type: 'ADD_QUESTION'; payload: QuestionType }
    | { type: 'DELETE_QUESTION'; payload: string }
    | { type: 'UPDATE_QUESTION'; payload: { id: string; field: keyof Question; value: any } }
    | { type: 'ADD_OPTION'; payload: { questionId: string } }
    | { type: 'UPDATE_OPTION'; payload: { questionId: string; optionId: string; field: string; value: any } }
    | { type: 'DELETE_OPTION'; payload: { questionId: string; optionId: string } };

const initialState: ExamState = {
    title: 'امتحان الباب الأول',
    language: 'ar', 
    durationMinutes: 60,
    randomSettings: {
        enabled: false, questionCount: 20, shuffleQuestions: true, shuffleOptions: true,
        difficultyDistribution: { easy: 10, medium: 5, hard: 5 }
    },
    questions: []
};

function examReducer(state: ExamState, action: Action): ExamState {
    switch (action.type) {
        case 'SET_TITLE': return { ...state, title: action.payload };
        case 'SET_DURATION': return { ...state, durationMinutes: action.payload };
        
        case 'SET_LANGUAGE': 
            const newLang = action.payload;
            const oldLang = state.language;
            // 💡 السحر: تغيير الحروف أوتوماتيك لو المدرس غير اللغة
            const updatedQuestions = state.questions.map(q => {
                if (q.type === 'mcq' && q.options) {
                    const newOptions = q.options.map((opt, idx) => {
                        if (oldLang === 'ar' && opt.text === AR_LABELS[idx]) return { ...opt, text: EN_LABELS[idx] || opt.text };
                        if (oldLang === 'en' && opt.text === EN_LABELS[idx]) return { ...opt, text: AR_LABELS[idx] || opt.text };
                        return opt;
                    });
                    return { ...q, options: newOptions };
                }
                return q;
            });
            return { ...state, language: newLang, questions: updatedQuestions };

        case 'UPDATE_RANDOM_SETTINGS': return { ...state, randomSettings: { ...state.randomSettings, ...action.payload } };
        
        case 'ADD_QUESTION':
            const newQ: Question = { id: generateId(), type: action.payload, text: '', image: null, previewUrl: null, score: 1, difficulty: 'medium' };
            if (action.payload === 'mcq') {
                // 💡 إضافة الحروف أوتوماتيك كنص للاختيار
                const labels = state.language === 'en' ? EN_LABELS : AR_LABELS;
                newQ.options = [0, 1, 2, 3].map((idx) => ({
                    id: generateId(),
                    text: labels[idx], 
                    image: null, 
                    previewUrl: null, 
                    isCorrect: idx === 0
                }));
            }
            if (action.payload === 'tf') newQ.isTrueFalseCorrect = true;
            if (action.payload === 'essay') newQ.essayFormat = 'both';
            return { ...state, questions: [...state.questions, newQ] };
            
        case 'DELETE_QUESTION':
            const qToDelete = state.questions.find(q => q.id === action.payload);
            if (qToDelete?.previewUrl) URL.revokeObjectURL(qToDelete.previewUrl);
            qToDelete?.options?.forEach(opt => opt.previewUrl && URL.revokeObjectURL(opt.previewUrl));
            return { ...state, questions: state.questions.filter(q => q.id !== action.payload) };
            
        case 'UPDATE_QUESTION':
            return { ...state, questions: state.questions.map(q => q.id === action.payload.id ? { ...q, [action.payload.field]: action.payload.value } : q) };
            
        default: return state;
    }
}

export function useExamBuilder() {
    const [state, dispatch] = useReducer(examReducer, initialState);
    return { state, dispatch };
}