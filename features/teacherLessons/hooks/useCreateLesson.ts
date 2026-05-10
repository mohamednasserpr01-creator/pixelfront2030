// FILE: features/teacherLessons/hooks/useCreateLesson.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { lessonsService } from '../services/lessonsService';

export const useCreateLesson = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: lessonsService.createLesson,
        onSuccess: () => {
            // 💡 أول ما الحصة تتكريت، بنعمل Invalidate عشان الجدول يعمل ريفريش لوحده!
            queryClient.invalidateQueries({ queryKey: ['teacherLessons'] });
        }
    });
};