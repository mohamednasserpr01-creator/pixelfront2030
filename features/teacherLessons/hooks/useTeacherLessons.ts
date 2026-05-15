// FILE: features/teacherLessons/hooks/useTeacherLessons.ts
import { useQuery } from '@tanstack/react-query';
import { lessonsService } from '../services/lessonsService';

export const useTeacherLessons = (page: number, search: string, stage: string) => {
    return useQuery({
        queryKey: ['teacherLessons', page, search, stage], // 💡 هيعمل Cache و Refetch
        queryFn: () => lessonsService.getLessons(page, search, stage),
        staleTime: 60000, 
    });
};