"use client";
import React, { useState } from 'react';

import { useDebounce } from '@/hooks/useDebounce';
import { useTeacherLessons } from '@/features/teacherLessons/hooks/useTeacherLessons';

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

                <LessonsTable 
                    lessons={data?.data || []} 
                    isLoading={isLoading} 
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