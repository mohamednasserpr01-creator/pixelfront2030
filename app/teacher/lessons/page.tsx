"use client";
import React, { useState } from 'react';

import { useDebounce } from '@/hooks/useDebounce';
import { useTeacherLessons } from '@/features/teacherLessons/hooks/useTeacherLessons';
import { useToast } from '@/context/ToastContext'; // 🚀 استيراد التوست للإشعارات
import { lessonsService } from '@/features/teacherLessons/services/lessonsService'; // 🚀 استيراد السيرفيس للمسح

import LessonsHeader from '@/features/teacherLessons/components/LessonsHeader';
import LessonsFilters from '@/features/teacherLessons/components/LessonsFilters';
import LessonsTable from '@/features/teacherLessons/components/LessonsTable';
import LessonsPagination from '@/features/teacherLessons/components/LessonsPagination';
import CreateLessonModal from '@/features/teacherLessons/components/CreateLessonModal';

export default function TeacherLessonsPage() {
    const [search, setSearch] = useState('');
    const [activeStage, setActiveStage] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { showToast } = useToast();
    const debouncedSearch = useDebounce(search, 500);
    const { data, isLoading, isError } = useTeacherLessons(currentPage, debouncedSearch, activeStage);

    const handleFilterChange = (stage: string) => {
        setActiveStage(stage);
        setCurrentPage(1); 
    };

    const handleSearchChange = (val: string) => {
        setSearch(val);
        setCurrentPage(1); 
    };

    // 🚀 دالة المسح اللي هتبعت للجدول
    const handleDeleteLesson = async (id: string) => {
        if (!window.confirm('هل أنت متأكد من مسح هذه الحصة بشكل نهائي؟')) return;
        
        try {
            await lessonsService.deleteLesson(id);
            showToast('تم مسح الحصة بنجاح 🗑️', 'success');
            // ريفريش بسيط عشان الحصة تختفي من الجدول فوراً
            window.location.reload(); 
        } catch (error: any) {
            console.error("Delete Error:", error);
            showToast(error.message || 'حدث خطأ أثناء المسح', 'error');
        }
    };

    return (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <LessonsHeader onCreateClick={() => setIsCreateModalOpen(true)} />

            <div style={{ background: 'var(--card)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <LessonsFilters 
                    activeStage={activeStage} 
                    onStageChange={handleFilterChange} 
                    searchValue={search} 
                    onSearchChange={handleSearchChange} 
                />

                {/* 🚀 بعتنا دالة المسح كـ prop للجدول */}
                <LessonsTable 
                    lessons={data?.data || []} 
                    isLoading={isLoading} 
                    onDelete={handleDeleteLesson} 
                />

                {!isLoading && data?.totalPages && data.totalPages > 1 && (
                    <LessonsPagination 
                        currentPage={currentPage} 
                        totalPages={data.totalPages} 
                        totalItems={data.total}
                        onPageChange={setCurrentPage} 
                    />
                )}
            </div>

            <CreateLessonModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
            />
        </div>
    );
}