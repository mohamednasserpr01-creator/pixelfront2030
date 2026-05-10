export type ItemType = 'lesson' | 'exam' | 'homework' | 'homework_lesson' | 'makeup_exam';

export interface LectureItem {
    id: string;
    type: ItemType;
    title: string;
    hasPdf?: boolean;
    hasRef?: boolean;
    viewsLimit?: number;
    passScore?: number;
    issueCertificate?: boolean;
    certificateMinScore?: number;
    requireRetake?: boolean;
    retakeThreshold?: number;
    showAnswers?: boolean;
    isRetakeOnly?: boolean;
    altExamId?: string;
    prerequisite?: {
        type: 'none' | 'prev' | 'specific_exam' | 'specific_hw';
        targetId?: string;
    };
}

export interface Lecture {
    id: string;
    title: string;
    items: LectureItem[];
    requirePrevious?: boolean;
    // 🚀 الخصائص اتنقلت هنا للمحاضرة عشان هي الوحدة البيعية
    publishDate?: string;
    expireAfterDays?: number;
    stopNewPurchases?: boolean;
    lockForAll?: boolean;
}

export type CurriculumAction = 
    | { type: 'ADD_LECTURE'; payload?: any } 
    | { type: 'UPDATE_LECTURE'; payload: { lectureId: string; updates: Partial<Lecture> } }
    | { type: 'REMOVE_LECTURE'; payload: { lectureId: string } } 
    | { type: 'ADD_ITEM'; payload: { lectureId: string; item: LectureItem } }
    | { type: 'UPDATE_ITEM'; payload: { lectureId: string; itemId: string; updates: Partial<LectureItem> } }
    | { type: 'REMOVE_ITEM'; payload: { lectureId: string; itemId: string } }
    | { type: 'REORDER_ITEMS'; payload: { lectureId: string; oldIndex: number; newIndex: number } }
    | { type: 'MOVE_ITEM_BETWEEN_LECTURES'; payload: { sourceLectureId: string; targetLectureId: string; itemId: string; newIndex: number } }
    | { type: 'SET_CURRICULUM'; payload: Lecture[] };