// FILE: features/teacherExams/hooks/useCreateExam.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { examsService } from '../services/examsService';

export const useCreateExam = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: examsService.createExam,
        onSuccess: () => {
            // 💡 تحديث جدول الامتحانات فوراً بعد الإضافة
            queryClient.invalidateQueries({ queryKey: ['teacherExams'] });
        }
    });
};