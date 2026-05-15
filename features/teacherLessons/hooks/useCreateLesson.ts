// FILE: features/teacherLessons/hooks/useCreateLesson.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { lessonsService } from '../services/lessonsService';

export const useCreateLesson = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: lessonsService.createLesson,
        onSuccess: () => {
            // 💡 أول ما الحصة تترمي في الداتا بيز، بنعمل Invalidate عشان الجدول يسحب الجديد فوراً!
            queryClient.invalidateQueries({ queryKey: ['teacherLessons'] });
        }
    });
};