// FILE: app/teacher/exams/page.tsx
"use client";
import React, { useState } from 'react';
import { useDebounce } from '../../../hooks/useDebounce';
import { useTeacherExams } from '../../../features/teacherExams/hooks/useTeacherExams';

// Components
import ExamsHeader from '../../../features/teacherExams/components/ExamsHeader';
import ExamsFilters from '../../../features/teacherExams/components/ExamsFilters';
import ExamsTable from '../../../features/teacherExams/components/ExamsTable';
import ExamsPagination from '../../../features/teacherExams/components/ExamsPagination';
import CreateExamModal from '../../../features/teacherExams/components/CreateExamModal';

export default function TeacherExamsPage() {
    // 1. States (UI فقط)
    const [search, setSearch] = useState('');
    const [activeStage, setActiveStage] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // 2. Debounce (لتأخير البحث وتقليل الضغط على السيرفر)
    const debouncedSearch = useDebounce(search, 500);

    // 3. Data Fetching (React Query)
    const { data, isLoading, isError } = useTeacherExams(currentPage, debouncedSearch, activeStage);

    // 4. Handlers
    const handleFilterChange = (stage: string) => {
        setActiveStage(stage);
        setCurrentPage(1); // تصفير الصفحة عند تغيير الفلتر
    };

    const handleSearchChange = (val: string) => {
        setSearch(val);
        setCurrentPage(1); // تصفير الصفحة عند البحث
    };

    return (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
            {/* الهيدر وزرار الإضافة */}
            <ExamsHeader onCreateClick={() => setIsCreateModalOpen(true)} />

            <div style={{ background: 'var(--card)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                
                {/* الفلاتر والبحث */}
                <ExamsFilters 
                    activeStage={activeStage} 
                    onStageChange={handleFilterChange} 
                    searchValue={search} 
                    onSearchChange={handleSearchChange} 
                />

                {/* الجدول */}
                <ExamsTable 
                    exams={data?.data || []} 
                    isLoading={isLoading} 
                />

                {/* Pagination */}
                {!isLoading && data?.totalPages && data.totalPages > 1 && (
                    <ExamsPagination 
                        currentPage={currentPage} 
                        totalPages={data.totalPages} 
                        totalItems={data.total}
                        onPageChange={setCurrentPage} 
                    />
                )}
            </div>

            {/* مودال الإنشاء */}
            <CreateExamModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
            />
        </div>
    );
}