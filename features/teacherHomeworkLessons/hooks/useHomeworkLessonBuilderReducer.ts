import { useReducer } from 'react';
import { HomeworkLessonBuilderState, HomeworkLessonVideo, HomeworkLessonPDF, HomeworkLessonReference } from '../types';

const generateId = () => crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);

type Action = 
    | { type: 'LOAD_LESSON'; payload: Partial<HomeworkLessonBuilderState> } 
    | { type: 'SET_INFO'; payload: { field: keyof HomeworkLessonBuilderState; value: string } }
    // Videos
    | { type: 'ADD_VIDEO' }
    | { type: 'UPDATE_VIDEO'; payload: { id: string; field: keyof HomeworkLessonVideo; value: any } }
    | { type: 'DELETE_VIDEO'; payload: string }
    | { type: 'TOGGLE_PREVIEW'; payload: string }
    // PDFs
    | { type: 'ADD_PDF' }
    | { type: 'UPDATE_PDF'; payload: { id: string; field: keyof HomeworkLessonPDF; value: any } }
    | { type: 'DELETE_PDF'; payload: string }
    // References
    | { type: 'ADD_REFERENCE' }
    | { type: 'UPDATE_REFERENCE'; payload: { id: string; field: keyof HomeworkLessonReference; value: string } }
    | { type: 'DELETE_REFERENCE'; payload: string };

const initialState: HomeworkLessonBuilderState = {
    title: '',
    description: '',
    videos: [],
    pdfs: [],
    references: []
};

function homeworkLessonBuilderReducer(state: HomeworkLessonBuilderState, action: Action): HomeworkLessonBuilderState {
    switch (action.type) {
        case 'LOAD_LESSON': return { ...state, ...action.payload };
        case 'SET_INFO': return { ...state, [action.payload.field]: action.payload.value };
        
        case 'ADD_VIDEO': return { ...state, videos: [...state.videos, { id: generateId(), title: '', url: '', platform: 'bunny', showPreview: false }] };
        case 'UPDATE_VIDEO': return { ...state, videos: state.videos.map(v => v.id === action.payload.id ? { ...v, [action.payload.field]: action.payload.value } : v) };
        case 'DELETE_VIDEO': return { ...state, videos: state.videos.filter(v => v.id !== action.payload) };
        case 'TOGGLE_PREVIEW': return { ...state, videos: state.videos.map(v => v.id === action.payload ? { ...v, showPreview: !v.showPreview } : v) };

        case 'ADD_PDF': return { ...state, pdfs: [...state.pdfs, { id: generateId(), title: '', file: null, previewUrl: null }] };
        case 'UPDATE_PDF': return { ...state, pdfs: state.pdfs.map(p => p.id === action.payload.id ? { ...p, [action.payload.field]: action.payload.value } : p) };
        case 'DELETE_PDF': 
            const pdfToDel = state.pdfs.find(p => p.id === action.payload);
            if (pdfToDel?.previewUrl) URL.revokeObjectURL(pdfToDel.previewUrl);
            return { ...state, pdfs: state.pdfs.filter(p => p.id !== action.payload) };

        case 'ADD_REFERENCE': return { ...state, references: [...state.references, { id: generateId(), title: '', url: '' }] };
        case 'UPDATE_REFERENCE': return { ...state, references: state.references.map(r => r.id === action.payload.id ? { ...r, [action.payload.field]: action.payload.value } : r) };
        case 'DELETE_REFERENCE': return { ...state, references: state.references.filter(r => r.id !== action.payload) };

        default: return state;
    }
}

export function useHomeworkLessonBuilder() {
    const [state, dispatch] = useReducer(homeworkLessonBuilderReducer, initialState);
    return { state, dispatch };
}