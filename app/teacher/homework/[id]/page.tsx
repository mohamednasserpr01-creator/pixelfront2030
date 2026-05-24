"use client";
import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowRight, FaCog, FaListOl, FaPlus, FaSave, FaCheckSquare, FaLayerGroup, FaCalendarCheck } from 'react-icons/fa';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';
import { useHomeworkBuilder } from '@/features/teacherHomeworks/hooks/useHomeworkReducer';
import HomeworkSettings from '@/features/teacherHomeworks/components/HomeworkSettings';
import { QuestionCard } from '@/features/teacherHomeworks/components/QuestionCard';
import { homeworkService } from '@/features/teacherHomeworks/services/homeworkService';

const API_BASE_URL = 'http://localhost:5290/api';

export default function HomeworkBuilderManager({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const { showToast } = useToast();
    
    const [activeTab, setActiveTab] = useState<'settings' | 'questions'>('settings');
    const { state, dispatch } = useHomeworkBuilder();
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [stagesList, setStagesList] = useState<any[]>([]); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const stagesRes = await fetch(`${API_BASE_URL}/educational-stages`, { headers: { 'Authorization': `Bearer ${token}` } });
                if (stagesRes.ok) {
                    const stagesData = await stagesRes.json();
                    setStagesList(stagesData.data || stagesData.items || stagesData || []);
                }
                if (!resolvedParams.id || resolvedParams.id === 'new') { setIsLoadingData(false); return; }

                const hwData = await homeworkService.getById(resolvedParams.id);
                if (hwData) {
                    dispatch({ type: 'SET_TITLE', payload: hwData.title || '' });
                    if (hwData.stage) dispatch({ type: 'SET_STAGE', payload: hwData.stage }); 
                    if (hwData.language) dispatch({ type: 'SET_LANGUAGE', payload: hwData.language });
                    if (hwData.dueDate) dispatch({ type: 'SET_DUE_DATE', payload: hwData.dueDate });
                    if (hwData.allowLateSubmission !== undefined) dispatch({ type: 'SET_ALLOW_LATE', payload: hwData.allowLateSubmission });
                    if (hwData.questions?.length > 0) dispatch({ type: 'SET_FULL_STATE', payload: hwData });
                }
            } catch (error) {
                showToast('فشل تحميل الواجب', 'error');
            } finally {
                setIsLoadingData(false);
            }
        };
        fetchData();
    }, [resolvedParams.id, dispatch, showToast]);

    const totalScore = state.questions.reduce((acc, q) => acc + (Number(q.score) || 0), 0);
    const mcqCount = state.questions.filter(q => q.type === 'mcq').length;
    const tfCount = state.questions.filter(q => q.type === 'tf').length;
    const essayCount = state.questions.filter(q => q.type === 'essay').length;

    const handleSaveHomework = async () => {
        if (!state.title) { showToast('يجب تحديد اسم الواجب', 'error'); return; }
        setIsSaving(true);
        try {
            await homeworkService.update(resolvedParams.id, state);
            showToast('تم حفظ الواجب نهائياً! 🚀', 'success');
        } catch (error: any) {
            showToast(error.message || 'خطأ أثناء الحفظ', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoadingData) return <div style={{ padding: '50px', textAlign: 'center', color: 'var(--txt-mut)' }}>جاري تحميل الواجب... ⏳</div>;

    return (
        /* 🚀 تأمين الحاوية الرئيسية للموبايل */
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '100vw', boxSizing: 'border-box', overflowX: 'hidden', padding: '10px', animation: 'fadeIn 0.5s ease', paddingBottom: '50px' }}>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '15px', marginBottom: '20px', width: '100%' }}>
                <Button variant="outline" size="sm" onClick={() => router.push('/teacher/homework')} icon={<FaArrowRight />}>الرجوع</Button>
                <h1 style={{ fontSize: '1.2rem', color: 'var(--txt)', fontWeight: 900, margin: 0 }}>مُنشئ الواجبات: <span style={{ color: '#f39c12' }}>{state.title}</span></h1>
            </div>

            {/* 🚀 مربعات الإحصائيات (خليناها مرنة جداً للموبايل) */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '20px', width: '100%', boxSizing: 'border-box' }}>
                <div style={statBadgeStyle}><FaCheckSquare style={{color: '#2ecc71'}}/> الدرجة: <strong>{totalScore}</strong></div>
                <div style={statBadgeStyle}><FaCalendarCheck style={{color: '#f39c12'}}/> الديدلاين: <strong>{state.dueDate ? new Date(state.dueDate).toLocaleDateString('ar-EG') : 'لم يُحدد'}</strong></div>
                <div style={statBadgeStyle}><FaLayerGroup style={{color: '#3498db'}}/> اختياري: <strong>{mcqCount}</strong></div>
                <div style={statBadgeStyle}><FaLayerGroup style={{color: '#e74c3c'}}/> صح/خطأ: <strong>{tfCount}</strong></div>
                <div style={statBadgeStyle}><FaLayerGroup style={{color: '#9b59b6'}}/> مقالي: <strong>{essayCount}</strong></div>
            </div>

            {/* 🚀 تقسيم الشاشة بشكل ريسبونسف (تحت بعض في الموبايل، جنب بعض في الكمبيوتر) */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', width: '100%', boxSizing: 'border-box' }}>
                
                {/* القائمة الجانبية */}
                <div style={{ flex: '1 1 100%', minWidth: '200px', maxWidth: '300px', background: 'var(--card)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                    <button onClick={() => setActiveTab('settings')} style={getTabStyle(activeTab === 'settings')}><FaCog /> إعدادات الواجب</button>
                    <button onClick={() => setActiveTab('questions')} style={getTabStyle(activeTab === 'questions')}><FaListOl /> بناء الأسئلة</button>
                </div>

                {/* مساحة العمل */}
                <div style={{ flex: '3 1 250px', background: 'var(--card)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', padding: '15px', width: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
                    
                    {activeTab === 'settings' && <HomeworkSettings state={state} dispatch={dispatch} stagesList={stagesList} />}
                    
                    {activeTab === 'questions' && (
                        <div style={{ animation: 'fadeIn 0.3s ease', width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                                <h2 style={{ color: 'var(--txt)', margin: 0, fontSize: '1.2rem' }}>أسئلة الواجب ({state.questions.length})</h2>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    <Button variant="outline" size="sm" icon={<FaPlus />} onClick={() => dispatch({ type: 'ADD_QUESTION', payload: 'mcq' })}>اختياري</Button>
                                    <Button variant="outline" size="sm" icon={<FaPlus />} onClick={() => dispatch({ type: 'ADD_QUESTION', payload: 'tf' })}>صح/خطأ</Button>
                                    <Button variant="outline" size="sm" icon={<FaPlus />} onClick={() => dispatch({ type: 'ADD_QUESTION', payload: 'essay' })}>مقالي</Button>
                                </div>
                            </div>
                            {state.questions.map((q, index) => <QuestionCard key={q.id} q={q} index={index} language={state.language} dispatch={dispatch} />)}
                            {state.questions.length === 0 && <div style={{ textAlign: 'center', padding: '40px', color: 'var(--txt-mut)', background: 'rgba(0,0,0,0.2)', borderRadius: '15px' }}>لم يتم إضافة أي أسئلة.</div>}
                        </div>
                    )}
                    
                    <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                        <Button variant="primary" icon={<FaSave />} onClick={handleSaveHomework} disabled={isSaving} style={{ padding: '12px 25px', background: '#f39c12', color: '#fff', border: 'none', width: '100%', justifyContent: 'center' }}>
                            {isSaving ? 'جاري الحفظ...' : 'حفظ الواجب نهائياً'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// 🚀 تصغير الإحصائيات لتناسب الموبايل
const statBadgeStyle: React.CSSProperties = { flex: '1 1 auto', minWidth: '100px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--txt)', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem' };

const getTabStyle = (isActive: boolean): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '15px', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)', background: isActive ? 'rgba(243, 156, 18, 0.1)' : 'transparent', color: isActive ? '#f39c12' : 'var(--txt-mut)', fontWeight: isActive ? 'bold' : 'normal', cursor: 'pointer', textAlign: 'right', transition: '0.2s', borderRight: isActive ? '4px solid #f39c12' : '4px solid transparent'
});