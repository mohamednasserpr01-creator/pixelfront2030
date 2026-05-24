"use client";
import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowRight, FaCog, FaListOl, FaPlus, FaSave, FaClock, FaCheckSquare, FaLayerGroup } from 'react-icons/fa';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';

import { useExamBuilder } from '@/features/teacherExams/hooks/useExamReducer';
import ExamSettings from '@/features/teacherExams/components/ExamSettings';
import { QuestionCard } from '@/features/teacherExams/components/QuestionCard';
import { examsService } from '@/features/teacherExams/services/examsService';

const API_BASE_URL = 'http://localhost:5290/api'; // 🚀 مسار الـ API

export default function ExamBuilderManager({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const { showToast } = useToast();
    
    const [activeTab, setActiveTab] = useState<'settings' | 'questions'>('settings');
    const { state, dispatch } = useExamBuilder();
    
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [stagesList, setStagesList] = useState<any[]>([]); // 🚀 حفظ المراحل

    // 🚀 جلب المراحل وبيانات الامتحان
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // 1. جلب المراحل الدراسية
                const token = localStorage.getItem('accessToken');
                const stagesRes = await fetch(`${API_BASE_URL}/educational-stages`, { headers: { 'Authorization': `Bearer ${token}` } });
                if (stagesRes.ok) {
                    const stagesResult = await stagesRes.json();
                    setStagesList(stagesResult.data || stagesResult.items || stagesResult || []);
                }

                // 2. جلب بيانات الامتحان
                if (resolvedParams.id && resolvedParams.id !== 'new') {
                    const examData = await examsService.getExamById(resolvedParams.id);
                    if (examData) {
                        dispatch({ type: 'SET_TITLE', payload: examData.title || '' });
                        if (examData.stage) dispatch({ type: 'SET_STAGE', payload: examData.stage }); // 🚀 تحميل المرحلة
                        if (examData.language) dispatch({ type: 'SET_LANGUAGE', payload: examData.language });
                        if (examData.durationMinutes !== undefined) dispatch({ type: 'SET_DURATION', payload: examData.durationMinutes });
                        if (examData.randomSettings) dispatch({ type: 'UPDATE_RANDOM_SETTINGS', payload: examData.randomSettings });
                    }
                }
            } catch (error) {
                console.error("Fetch Data Error:", error);
                showToast('فشل في تحميل البيانات', 'error');
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchInitialData();
    }, [resolvedParams.id, dispatch, showToast]);

    const totalScore = state.questions?.reduce((acc, q) => acc + (Number(q.score) || 0), 0) || 0;
    const mcqCount = state.questions?.filter(q => q.type === 'mcq').length || 0;
    const tfCount = state.questions?.filter(q => q.type === 'tf').length || 0;
    const essayCount = state.questions?.filter(q => q.type === 'essay').length || 0;

    const handleSaveExam = async () => {
        if (!state.title) {
            showToast('يجب إدخال اسم الامتحان أولاً', 'error');
            return;
        }

        setIsSaving(true);
        try {
            await examsService.updateExam(resolvedParams.id, state);
            showToast('تم حفظ الامتحان في قاعدة البيانات بنجاح! 🚀', 'success');
        } catch (error: any) {
            console.error("Save Error:", error);
            showToast(error.message || 'حدث خطأ أثناء الحفظ', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoadingData) {
        return <div style={{ padding: '50px', textAlign: 'center', color: 'var(--txt-mut)' }}>جاري تحميل الامتحان... ⏳</div>;
    }

    return (
        <div style={{ animation: 'fadeIn 0.5s ease', paddingBottom: '50px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                <Button variant="outline" size="sm" onClick={() => router.push('/teacher/exams')} icon={<FaArrowRight />}>الرجوع</Button>
                <h1 style={{ fontSize: '1.6rem', color: 'var(--txt)', fontWeight: 900, margin: 0 }}>مُنشئ الامتحانات: <span style={{ color: 'var(--p-purple)' }}>{state.title}</span></h1>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', background: 'rgba(0,0,0,0.2)', padding: '15px 20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '30px' }}>
                <div style={statBadgeStyle}><FaCheckSquare style={{color: '#2ecc71'}}/> إجمالي الدرجات: <strong>{totalScore}</strong></div>
                <div style={statBadgeStyle}><FaClock style={{color: '#f1c40f'}}/> الوقت: <strong>{state.durationMinutes === 0 ? 'بدون وقت' : `${state.durationMinutes} دقيقة`}</strong></div>
                <div style={statBadgeStyle}><FaLayerGroup style={{color: '#3498db'}}/> اختياري: <strong>{mcqCount}</strong></div>
                <div style={statBadgeStyle}><FaLayerGroup style={{color: '#e74c3c'}}/> صح/خطأ: <strong>{tfCount}</strong></div>
                <div style={statBadgeStyle}><FaLayerGroup style={{color: '#9b59b6'}}/> مقالي: <strong>{essayCount}</strong></div>
            </div>

            <div style={{ display: 'flex', gap: '25px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div style={{ width: '250px', background: 'var(--card)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', flexShrink: 0 }}>
                    <button onClick={() => setActiveTab('settings')} style={getTabStyle(activeTab === 'settings')}><FaCog /> إعدادات الامتحان</button>
                    <button onClick={() => setActiveTab('questions')} style={getTabStyle(activeTab === 'questions')}><FaListOl /> بناء الأسئلة</button>
                </div>

                <div style={{ flex: 1, minWidth: '300px', background: 'var(--card)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', padding: '30px' }}>
                    {/* 🚀 مررنا قائمة المراحل لملف الإعدادات */}
                    {activeTab === 'settings' && <ExamSettings state={state} dispatch={dispatch} stages={stagesList} />}
                    
                    {activeTab === 'questions' && (
                        <div style={{ animation: 'fadeIn 0.3s ease' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '10px' }}>
                                <h2 style={{ color: 'var(--txt)', margin: 0 }}>أسئلة الامتحان ({state.questions?.length || 0})</h2>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <Button variant="outline" size="sm" icon={<FaPlus />} onClick={() => dispatch({ type: 'ADD_QUESTION', payload: 'mcq' })}>اختياري</Button>
                                    <Button variant="outline" size="sm" icon={<FaPlus />} onClick={() => dispatch({ type: 'ADD_QUESTION', payload: 'tf' })}>صح وخطأ</Button>
                                    <Button variant="outline" size="sm" icon={<FaPlus />} onClick={() => dispatch({ type: 'ADD_QUESTION', payload: 'essay' })}>مقالي</Button>
                                </div>
                            </div>
                            {state.questions?.map((q, index) => <QuestionCard key={q.id} q={q} index={index} language={state.language} dispatch={dispatch} />)}
                            {(!state.questions || state.questions.length === 0) && <div style={{ textAlign: 'center', padding: '40px', color: 'var(--txt-mut)', background: 'rgba(0,0,0,0.2)', borderRadius: '15px' }}>لم يتم إضافة أي أسئلة بعد.</div>}
                        </div>
                    )}
                    
                    <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant="primary" icon={<FaSave />} onClick={handleSaveExam} disabled={isSaving} style={{ padding: '15px 30px' }}>
                            {isSaving ? 'جاري الحفظ...' : 'حفظ الامتحان نهائياً'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const statBadgeStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--txt)', background: 'rgba(255,255,255,0.05)', padding: '8px 15px', borderRadius: '8px', fontSize: '0.9rem' };

const getTabStyle = (isActive: boolean): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '18px 20px', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)', background: isActive ? 'rgba(108,92,231,0.1)' : 'transparent', color: isActive ? 'var(--p-purple)' : 'var(--txt-mut)', fontWeight: isActive ? 'bold' : 'normal', cursor: 'pointer', textAlign: 'right', transition: '0.2s', borderRight: isActive ? '4px solid var(--p-purple)' : '4px solid transparent'
});