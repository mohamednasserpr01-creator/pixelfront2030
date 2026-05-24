"use client";
import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowRight, FaCog, FaVideo, FaFilePdf, FaLink, FaPlus, FaTrash, FaEye, FaEyeSlash, FaSave, FaUpload } from 'react-icons/fa';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/context/ToastContext';

import { useHomeworkLessonBuilder } from '@/features/teacherHomeworkLessons/hooks/useHomeworkBuilderReducer';
import { homeworkLessonsService } from '@/features/teacherHomeworkLessons/services/homeworkLessonsService';

const API_BASE_URL = 'http://localhost:5290/api';

export default function HomeworkBuilderManager({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const { showToast } = useToast();
    const { state, dispatch } = useHomeworkLessonBuilder();
    
    const [activeTab, setActiveTab] = useState<'settings' | 'videos' | 'pdfs' | 'references'>('settings');
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [stages, setStages] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const stagesRes = await fetch(`${API_BASE_URL}/educational-stages`, { headers: { 'Authorization': `Bearer ${token}` }});
                if (stagesRes.ok) {
                    const stagesData = await stagesRes.json();
                    setStages(stagesData.data || stagesData.items || stagesData || []);
                }

                if (resolvedParams.id && resolvedParams.id !== 'new') {
                    const lesson = await homeworkLessonsService.getHomeworkById(resolvedParams.id);
                    dispatch({ 
                        type: 'LOAD_LESSON', 
                        payload: { 
                            title: lesson.title || '', 
                            description: lesson.description && lesson.description !== "بدون وصف" ? lesson.description : '',
                            stage: lesson.stage || lesson.educationalStageId || '', 
                            videos: lesson.videos || [],
                            pdfs: lesson.pdfs || [], 
                            references: lesson.references || []
                        } as any 
                    });
                }
            } catch (error) {
                console.error("Fetch Data Error:", error);
                showToast('فشل في تحميل البيانات', 'error');
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchData();
    }, [resolvedParams.id, dispatch, showToast]);

    const handleSaveLesson = async () => {
        if (!state.title) {
            showToast('يجب إدخال اسم الواجب أولاً', 'error');
            return;
        }

        try {
            if (resolvedParams.id && resolvedParams.id !== 'new') {
                showToast('جاري الحفظ...', 'success');
                await homeworkLessonsService.updateHomework(resolvedParams.id, { ...state, stage: (state as any).stage });
                showToast('تم حفظ حصة الواجب بنجاح! 🚀', 'success');
            } else {
                showToast('يجب إنشاء الحصة من الجدول أولاً', 'error');
            }
        } catch (error: any) {
            console.error("Save Error:", error);
            showToast(error.message || 'حدث خطأ أثناء الحفظ', 'error');
        }
    };

    const renderVideoPreview = (platform: string, url: string) => {
        if (!url) return <span style={{ color: 'var(--txt-mut)' }}>برجاء إدخال الرابط لمعاينة الفيديو</span>;
        try {
            if (platform === 'youtube') {
                let embedUrl = url;
                if (url.includes('watch?v=')) embedUrl = url.replace('watch?v=', 'embed/');
                else if (url.includes('youtu.be/')) embedUrl = url.replace('youtu.be/', 'youtube.com/embed/');
                return <iframe width="100%" height="100%" src={embedUrl} frameBorder="0" allowFullScreen></iframe>;
            }
            if (platform === 'vimeo') {
                let embedUrl = url;
                if (url.includes('vimeo.com/') && !url.includes('player.vimeo.com')) {
                    embedUrl = url.replace('vimeo.com/', 'player.vimeo.com/video/');
                }
                return <iframe width="100%" height="100%" src={embedUrl} frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen></iframe>;
            }
            if (platform === 'bunny') return <iframe width="100%" height="100%" src={url} frameBorder="0" allowFullScreen></iframe>;
            if (platform === 'server') return <video src={url} controls style={{ width: '100%', height: '100%', objectFit: 'contain' }} />;
        } catch (e) {
            return <span style={{ color: 'var(--danger)' }}>الرابط غير صالح</span>;
        }
    };

    if (isLoadingData) return <div style={{ padding: '50px', textAlign: 'center', color: 'var(--txt-mut)' }}>جاري تحميل بيانات الواجب... ⏳</div>;

    return (
        <div style={{ animation: 'fadeIn 0.5s ease', paddingBottom: '50px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                <Button variant="outline" size="sm" onClick={() => router.push('/teacher/homework-lessons')} icon={<FaArrowRight />}>الرجوع للجدول</Button>
                <h1 style={{ fontSize: '1.6rem', color: 'var(--txt)', fontWeight: 900, margin: 0 }}>مُنشئ الواجب: <span style={{ color: '#1abc9c' }}>{state.title || 'واجب جديد'}</span></h1>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', background: 'rgba(0,0,0,0.2)', padding: '15px 20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '30px' }}>
                <div style={statBadgeStyle}><FaVideo style={{color: '#e74c3c'}}/> فيديوهات: <strong>{state.videos.length}</strong></div>
                <div style={statBadgeStyle}><FaFilePdf style={{color: '#3498db'}}/> مذكرات PDF: <strong>{state.pdfs.length}</strong></div>
                <div style={statBadgeStyle}><FaLink style={{color: '#2ecc71'}}/> مراجع خارجية: <strong>{state.references.length}</strong></div>
            </div>

            <div style={{ display: 'flex', gap: '25px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                
                <div style={{ width: '250px', background: 'var(--card)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', flexShrink: 0 }}>
                    <div style={{ padding: '15px', color: 'var(--txt-mut)', fontSize: '0.8rem', fontWeight: 'bold', background: 'rgba(255,255,255,0.02)' }}>الإعدادات</div>
                    <button onClick={() => setActiveTab('settings')} style={getTabStyle(activeTab === 'settings', '#f39c12')}><FaCog /> بيانات الواجب</button>
                    
                    <div style={{ padding: '15px', color: 'var(--txt-mut)', fontSize: '0.8rem', fontWeight: 'bold', background: 'rgba(255,255,255,0.02)' }}>محتوى الواجب</div>
                    <button onClick={() => setActiveTab('videos')} style={getTabStyle(activeTab === 'videos', '#e74c3c')}><FaVideo /> الفيديوهات ({state.videos.length})</button>
                    <button onClick={() => setActiveTab('pdfs')} style={getTabStyle(activeTab === 'pdfs', '#3498db')}><FaFilePdf /> مذكرات PDF ({state.pdfs.length})</button>
                    <button onClick={() => setActiveTab('references')} style={getTabStyle(activeTab === 'references', '#2ecc71')}><FaLink /> مراجع خارجية ({state.references.length})</button>
                </div>

                <div style={{ flex: 1, minWidth: '300px', background: 'var(--card)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', padding: '30px' }}>
                    
                    {activeTab === 'settings' && (
                        <div style={{ animation: 'fadeIn 0.3s ease' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ color: '#f39c12', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}><FaCog /> البيانات الأساسية للواجب</h3>
                            </div>
                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <Input label="اسم الواجب" value={state.title} onChange={e => dispatch({ type: 'SET_INFO', payload: { field: 'title', value: e.target.value } })} />
                                
                                <div>
                                    <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>المرحلة الدراسية</label>
                                    <select 
                                        value={(state as any).stage || ''} 
                                        onChange={e => dispatch({ type: 'SET_INFO', payload: { field: 'stage', value: e.target.value } })} 
                                        style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '10px', outline: 'none' }}
                                    >
                                        <option value="" style={{background: '#1e1e2d'}}>-- اختر المرحلة الدراسية --</option>
                                        {stages.map(s => (
                                            <option key={s.id} value={s.id} style={{background: '#1e1e2d'}}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'videos' && (
                        <div style={{ animation: 'fadeIn 0.3s ease' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ color: '#e74c3c', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}><FaVideo /> فيديوهات الشرح والحل</h3>
                                <Button variant="outline" size="sm" icon={<FaPlus />} onClick={() => dispatch({ type: 'ADD_VIDEO' })}>إضافة فيديو</Button>
                            </div>
                            {state.videos.map((v: any) => (
                                <div key={v.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', marginBottom: '15px', border: '1px dashed rgba(231, 76, 60, 0.3)' }}>
                                    <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                                        <div style={{ flex: 1, minWidth: '150px' }}>
                                            <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>منصة العرض</label>
                                            <select value={v.platform} onChange={e => dispatch({ type: 'UPDATE_VIDEO', payload: { id: v.id, field: 'platform', value: e.target.value } })} style={{ width: '100%', padding: '12px 15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none', fontWeight: 'bold' }}>
                                                <option value="bunny" style={{background: '#1e1e2d'}}>🐰 Bunny CDN</option><option value="youtube" style={{background: '#1e1e2d'}}>🔴 YouTube</option><option value="vimeo" style={{background: '#1e1e2d'}}>🔵 Vimeo</option><option value="server" style={{background: '#1e1e2d'}}>💾 سيرفر خاص</option>
                                            </select>
                                        </div>
                                        <div style={{ flex: 2, minWidth: '200px' }}><Input label="اسم الفيديو (مثال: حل الاختياري)" value={v.title} onChange={e => dispatch({ type: 'UPDATE_VIDEO', payload: { id: v.id, field: 'title', value: e.target.value } })} /></div>
                                        <div style={{ flex: 3, minWidth: '250px' }}><Input label="الرابط" value={v.url} onChange={e => dispatch({ type: 'UPDATE_VIDEO', payload: { id: v.id, field: 'url', value: e.target.value } })} /></div>
                                        
                                        <div style={{ display: 'flex', gap: '10px', marginTop: '28px' }}>
                                            <button onClick={() => dispatch({ type: 'TOGGLE_PREVIEW', payload: v.id })} style={{ background: v.showPreview ? '#e74c3c' : 'rgba(231, 76, 60, 0.1)', color: v.showPreview ? 'white' : '#e74c3c', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', transition: '0.2s' }}><FaEye /></button>
                                            <button onClick={() => dispatch({ type: 'DELETE_VIDEO', payload: v.id })} style={{ background: 'rgba(231,76,60,0.1)', color: 'var(--danger)', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}><FaTrash /></button>
                                        </div>
                                    </div>
                                    {v.showPreview && (
                                        <div style={{ marginTop: '20px', width: '100%', height: '350px', background: '#000', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--txt-mut)', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                                            {renderVideoPreview(v.platform, v.url)}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {state.videos.length === 0 && <div style={{ textAlign: 'center', color: 'var(--txt-mut)', padding: '40px', background: 'rgba(0,0,0,0.1)', borderRadius: '15px' }}>لم تقم بإضافة أي فيديوهات حتى الآن.</div>}
                        </div>
                    )}

                    {/* 🚀 قسم رفع الملفات بعد التعديل الأنيق */}
                    {activeTab === 'pdfs' && (
                        <div style={{ animation: 'fadeIn 0.3s ease' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ color: '#3498db', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}><FaFilePdf /> مذكرات وملفات (PDF)</h3>
                                <Button variant="outline" size="sm" icon={<FaPlus />} onClick={() => dispatch({ type: 'ADD_PDF' })}>إضافة ملف</Button>
                            </div>
                            {state.pdfs.map((p: any) => (
                                <div key={p.id} style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '12px', marginBottom: '10px', border: '1px dashed rgba(52, 152, 219, 0.3)', flexWrap: 'wrap' }}>
                                    
                                    <div style={{ flex: 1, minWidth: '200px' }}>
                                        <Input label="اسم الملف" value={p.title} onChange={e => dispatch({ type: 'UPDATE_PDF', payload: { id: p.id, field: 'title' as any, value: e.target.value } })} />
                                    </div>
                                    
                                    <div style={{ flex: 1, minWidth: '200px', marginTop: '28px' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: p.file ? 'rgba(46, 204, 113, 0.1)' : 'rgba(52, 152, 219, 0.1)', color: p.file ? '#2ecc71' : '#3498db', padding: '12px', borderRadius: '8px', cursor: 'pointer', border: p.file ? '1px dashed #2ecc71' : '1px dashed #3498db', fontWeight: 'bold', transition: '0.2s', width: '100%' }}>
                                            <FaUpload /> {p.file ? p.file.name.substring(0, 20) + '...' : 'اضغط لرفع ملف PDF'}
                                            <input 
                                                type="file" 
                                                accept=".pdf" 
                                                style={{ display: 'none' }} 
                                                onChange={(e) => { 
                                                    const f = e.target.files?.[0]; 
                                                    if(f) dispatch({ type: 'UPDATE_PDF', payload: { id: p.id, field: 'file' as any, value: f } }); 
                                                }} 
                                            />
                                        </label>
                                    </div>

                                    <button onClick={() => dispatch({ type: 'DELETE_PDF', payload: p.id })} style={{ background: 'rgba(231,76,60,0.1)', color: 'var(--danger)', border: 'none', padding: '12px', marginTop: '28px', borderRadius: '8px', cursor: 'pointer' }}><FaTrash /></button>
                                </div>
                            ))}
                            {state.pdfs.length === 0 && <div style={{ textAlign: 'center', color: 'var(--txt-mut)', padding: '40px', background: 'rgba(0,0,0,0.1)', borderRadius: '15px' }}>لم تقم بإرفاق أي ملفات PDF حتى الآن.</div>}
                        </div>
                    )}

                    {activeTab === 'references' && (
                        <div style={{ animation: 'fadeIn 0.3s ease' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ color: '#2ecc71', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}><FaLink /> مراجع خارجية</h3>
                                <Button variant="outline" size="sm" icon={<FaPlus />} onClick={() => dispatch({ type: 'ADD_REFERENCE' })}>إضافة رابط</Button>
                            </div>
                            {state.references.map((r: any) => (
                                <div key={r.id} style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '12px', marginBottom: '10px', border: '1px dashed rgba(46, 204, 113, 0.3)', flexWrap: 'wrap' }}>
                                    <div style={{ flex: 1, minWidth: '200px' }}><Input label="اسم المرجع" value={r.title} onChange={e => dispatch({ type: 'UPDATE_REFERENCE', payload: { id: r.id, field: 'title', value: e.target.value } })} /></div>
                                    <div style={{ flex: 2, minWidth: '250px' }}><Input label="الرابط (URL)" value={r.url} onChange={e => dispatch({ type: 'UPDATE_REFERENCE', payload: { id: r.id, field: 'url', value: e.target.value } })} /></div>
                                    <button onClick={() => dispatch({ type: 'DELETE_REFERENCE', payload: r.id })} style={{ background: 'rgba(231,76,60,0.1)', color: 'var(--danger)', border: 'none', padding: '12px', marginTop: '28px', borderRadius: '8px', cursor: 'pointer' }}><FaTrash /></button>
                                </div>
                            ))}
                            {state.references.length === 0 && <div style={{ textAlign: 'center', color: 'var(--txt-mut)', padding: '40px', background: 'rgba(0,0,0,0.1)', borderRadius: '15px' }}>لم تقم بإرفاق أي روابط خارجية حتى الآن.</div>}
                        </div>
                    )}
                    
                    <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant="primary" icon={<FaSave />} onClick={handleSaveLesson} style={{ padding: '15px 30px', background: '#1abc9c', color: '#fff' }}>حفظ التعديلات نهائياً</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const statBadgeStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--txt)', background: 'rgba(255,255,255,0.05)', padding: '8px 15px', borderRadius: '8px', fontSize: '0.9rem' };

const getTabStyle = (isActive: boolean, color: string): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '18px 20px', 
    border: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)', background: isActive ? `${color}15` : 'transparent', color: isActive ? color : 'var(--txt-mut)', fontWeight: isActive ? 'bold' : 'normal', cursor: 'pointer', textAlign: 'right', transition: '0.2s', borderRight: isActive ? `4px solid ${color}` : '4px solid transparent'
});