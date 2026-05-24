"use client";
import React, { useState, useEffect } from 'react';
import { useDebounce } from '../../../hooks/useDebounce';
import { useTeacherExams } from '../../../features/teacherExams/hooks/useTeacherExams';
import { examsService } from '../../../features/teacherExams/services/examsService';
import { useToast } from '@/context/ToastContext';
import { useQueryClient } from '@tanstack/react-query';

import ExamsHeader from '../../../features/teacherExams/components/ExamsHeader';
import ExamsFilters from '../../../features/teacherExams/components/ExamsFilters';
import ExamsTable from '../../../features/teacherExams/components/ExamsTable';
import ExamsPagination from '../../../features/teacherExams/components/ExamsPagination';
import CreateExamModal from '../../../features/teacherExams/components/CreateExamModal';

const API_BASE_URL = 'http://localhost:5290/api';

export default function TeacherExamsPage() {
    const { showToast } = useToast();
    const queryClient = useQueryClient();

    const [search, setSearch] = useState('');
    const [activeStage, setActiveStage] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [stagesList, setStagesList] = useState<any[]>([]);
    const [stagesMap, setStagesMap] = useState<Record<string, string>>({});

    const debouncedSearch = useDebounce(search, 500);
    const { data, isLoading } = useTeacherExams(currentPage, debouncedSearch, activeStage);

    useEffect(() => {
        const fetchStages = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const res = await fetch(`${API_BASE_URL}/educational-stages`, { headers: { 'Authorization': `Bearer ${token}` } });
                if (res.ok) {
                    const result = await res.json();
                    const stagesArray = result.data || result.items || result || [];
                    const map: Record<string, string> = {};
                    stagesArray.forEach((s: any) => { map[s.id] = s.name; });
                    setStagesMap(map);
                    setStagesList([{ id: 'all', name: 'جميع المراحل' }, ...stagesArray]);
                }
            } catch (error) { console.error("Error fetching stages:", error); }
        };
        fetchStages();
    }, []);

    const handleDeleteExam = async (id: string) => {
        if (!window.confirm('هل أنت متأكد من مسح هذا الامتحان نهائياً؟')) return;
        try {
            await examsService.deleteExam(id);
            showToast('تم مسح الامتحان بنجاح 🗑️', 'success');
            queryClient.invalidateQueries({ queryKey: ['teacherExams'] });
        } catch (error: any) { showToast(error.message || 'حدث خطأ أثناء المسح', 'error'); }
    };

    return (
        /* 🚀 الكود الجذري لمنع خروج التصميم عن الشاشة */
        <div style={{ display: 'block', width: '100%', maxWidth: '100%', minWidth: 0, overflowX: 'hidden', boxSizing: 'border-box', animation: 'fadeIn 0.5s ease' }}>
            <ExamsHeader onCreateClick={() => setIsCreateModalOpen(true)} />

            <div style={{ background: 'var(--card)', padding: 'clamp(10px, 3vw, 20px)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', width: '100%', maxWidth: '100%', minWidth: 0, overflowX: 'hidden', boxSizing: 'border-box' }}>
                <ExamsFilters stages={stagesList} activeStage={activeStage} onStageChange={(s) => { setActiveStage(s); setCurrentPage(1); }} searchValue={search} onSearchChange={(v) => { setSearch(v); setCurrentPage(1); }} />
                
                <ExamsTable exams={data?.data || []} isLoading={isLoading} stagesMap={stagesMap} onDelete={handleDeleteExam} />

                {!isLoading && data?.totalPages && data.totalPages > 1 && (
                    <ExamsPagination currentPage={currentPage} totalPages={data.totalPages} totalItems={data.total} onPageChange={setCurrentPage} />
                )}
            </div>

            <CreateExamModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} stages={stagesList.filter(s => s.id !== 'all')} />
        </div>
    );
}