// FILE: features/teacherExams/hooks/useTeacherExams.ts
import { useQuery } from '@tanstack/react-query';
import { examsService } from '../services/examsService';

export const useTeacherExams = (page: number, search: string, stage: string) => {
    return useQuery({
        queryKey: ['teacherExams', page, search, stage], 
        queryFn: () => examsService.getExams(page, search, stage),
        staleTime: 60000, 
    });
};