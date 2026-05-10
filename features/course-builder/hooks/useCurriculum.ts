import { useReducer, useCallback } from 'react';
import { curriculumReducer } from '../reducers/curriculum.reducer';
import { Lecture, LectureItem, CurriculumAction } from '../types/curriculum.types';

export const useCurriculum = (initialState: Lecture[] = []) => {
    const [curriculum, dispatch] = useReducer(curriculumReducer, initialState);

    // 💡 تغليف الـ Actions في دوال سهلة الاستخدام (عشان منكتبش dispatch كتير في الـ UI)
    
    const addLecture = useCallback((title: string = 'محاضرة جديدة') => {
        dispatch({ type: 'ADD_LECTURE', payload: { title } });
    }, []);

    // 🚀 التعديل هنا: الدالة بقت عامة وبتقبل أي تعديلات (updates) للمحاضرة
    const updateLecture = useCallback((lectureId: string, updates: Partial<Lecture>) => {
        dispatch({ type: 'UPDATE_LECTURE', payload: { lectureId, updates } });
    }, []);

    const removeLecture = useCallback((lectureId: string) => {
        dispatch({ type: 'REMOVE_LECTURE', payload: { lectureId } });
    }, []);

    const addItem = useCallback((lectureId: string, item: LectureItem) => {
        dispatch({ type: 'ADD_ITEM', payload: { lectureId, item } });
    }, []);

    const updateItem = useCallback((lectureId: string, itemId: string, updates: Partial<LectureItem>) => {
        dispatch({ type: 'UPDATE_ITEM', payload: { lectureId, itemId, updates } });
    }, []);

    const removeItem = useCallback((lectureId: string, itemId: string) => {
        dispatch({ type: 'REMOVE_ITEM', payload: { lectureId, itemId } });
    }, []);

    const reorderItems = useCallback((lectureId: string, oldIndex: number, newIndex: number) => {
        dispatch({ type: 'REORDER_ITEMS', payload: { lectureId, oldIndex, newIndex } });
    }, []);

    const moveItemBetweenLectures = useCallback((sourceLectureId: string, targetLectureId: string, itemId: string, newIndex: number) => {
        dispatch({ type: 'MOVE_ITEM_BETWEEN_LECTURES', payload: { sourceLectureId, targetLectureId, itemId, newIndex } });
    }, []);

    const setCurriculum = useCallback((data: Lecture[]) => {
        dispatch({ type: 'SET_CURRICULUM', payload: data });
    }, []);

    return {
        curriculum,
        addLecture,
        updateLecture, // 🚀 التعديل هنا في الإرجاع
        removeLecture,
        addItem,
        updateItem,
        removeItem,
        reorderItems,
        moveItemBetweenLectures,
        setCurriculum
    };
};