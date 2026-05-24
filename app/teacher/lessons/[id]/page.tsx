"use client";
import React, { useState, use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowRight, FaCog, FaVideo, FaFilePdf, FaLink, FaPlus, FaTrash, FaEye, FaEyeSlash, FaSave, FaUpload } from 'react-icons/fa';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/context/ToastContext';
import { useLessonBuilder } from '@/features/teacherLessons/hooks/useLessonBuilderReducer';
import { VideoPlatform } from '@/features/teacherLessons/types';
import { lessonsService } from '@/features/teacherLessons/services/lessonsService';

// 🚀 التعديل الأول: البورت اتظبط لـ 5290 عشان يقرأ المراحل صح
const API_BASE_URL = 'http://localhost:5290/api';

export default function LessonBuilderManager({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const { showToast } = useToast();
    const { state, dispatch } = useLessonBuilder();
    
    const [activeTab, setActiveTab] = useState<'settings' | 'videos' | 'pdfs' | 'references'>('settings');
    const [isSaving, setIsSaving] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [stages, setStages] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const stagesRes = await fetch(`${API_BASE_URL}/educational-stages`, { headers: { 'Authorization': `Bearer ${token}` }});
                if (stagesRes.ok) {
                    const stagesData = await stagesRes.json();
                    const stagesArray = stagesData.data || stagesData.items || stagesData;
                    setStages(Array.isArray(stagesArray) ? stagesArray : []);
                }

                const rawResponse = await lessonsService.getLessonById(resolvedParams.id);
                const lesson = rawResponse.data || rawResponse; 
                
                // 🚀 بنقرأ الفيديوهات من الموديل الجديد لو موجودة
                const loadedVideos = lesson.videos?.length > 0 ? lesson.videos : (lesson.videoUrl ? [{
                    id: Math.random().toString(36).substring(2, 15),
                    title: 'فيديو الشرح الأساسي',
                    url: lesson.videoUrl,
                    platform: (lesson.videoUrl.includes('youtube') ? 'youtube' : (lesson.videoUrl.includes('vimeo') ? 'vimeo' : 'bunny')) as VideoPlatform,
                    showPreview: false
                }] : []);

                dispatch({ 
                    type: 'SET_INITIAL_DATA', 
                    payload: { 
                        title: lesson.title || '', 
                        description: lesson.description && lesson.description !== "بدون وصف" ? lesson.description : '',
                        // 🚀 التعديل التاني: بنقرأ stage بشكل صحيح من الباك إند الجديد
                        stage: lesson.stage || lesson.educationalStageId || '', 
                        videos: loadedVideos,
                        pdfs: lesson.pdfs || [], 
                        references: lesson.references || []
                    } 
                });
                
            } catch (error) {
                console.error("Fetch Data Error:", error);
                showToast('فشل في تحميل البيانات', 'error');
            } finally {
                setIsLoadingData(false);
            }
        };

        if (resolvedParams.id) fetchData();
    }, [resolvedParams.id, dispatch, showToast]);

    const handleSaveLesson = async () => {
        // 🚀 أضفنا تحقق من المرحلة قبل الحفظ عشان نمنع الإيرور
        if (!state.title || !state.stage) {
            showToast('يجب إدخال اسم الحصة واختيار المرحلة', 'error');
            return;
        }
        
        setIsSaving(true);
        try {
            await lessonsService.updateLesson(resolvedParams.id, state);
            showToast('تم حفظ التعديلات بنجاح! 🚀', 'success');
        } catch (error: any) {
            showToast(error.message || 'حدث خطأ أثناء الحفظ', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const renderVideoPreview = (platform: VideoPlatform, url: string) => {
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
            if (platform === 'server') return <video src={url} controls style={{ width: '100%', height: '100%' }} />;
        } catch (e) {
            return <span style={{ color: 'var(--danger)' }}>الرابط غير صالح</span>;
        }
    };

    if (isLoadingData) return <div style={{ padding: '50px', textAlign: 'center', color: 'var(--txt-mut)' }}>جاري تحميل بيانات الحصة... ⏳</div>;

    return (
        <div style={{ animation: 'fadeIn 0.5s ease', paddingBottom: '50px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                <Button variant="outline" size="sm" onClick={() => router.push('/teacher/lessons')} icon={<FaArrowRight />}>الرجوع للجدول</Button>
                <h1 style={{ fontSize: '1.6rem', color: 'var(--txt)', fontWeight: 900, margin: 0 }}>مُنشئ الحصص: <span style={{ color: '#3498db' }}>{state.title || 'حصة جديدة'}</span></h1>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', background: 'rgba(0,0,0,0.2)', padding: '15px 20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '30px' }}>
                <div style={statBadgeStyle}><FaVideo style={{color: '#e74c3c'}}/> فيديوهات: <strong>{state.videos?.length || 0}</strong></div>
                <div style={statBadgeStyle}><FaFilePdf style={{color: '#3498db'}}/> ملفات PDF: <strong>{state.pdfs?.length || 0}</strong></div>
                <div style={statBadgeStyle}><FaLink style={{color: '#2ecc71'}}/> مراجع خارجية: <strong>{state.references?.length || 0}</strong></div>
            </div>

            <div style={{ display: 'flex', gap: '25px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                
                <div style={{ width: '250px', background: 'var(--card)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', flexShrink: 0 }}>
                    <div style={{ padding: '15px', color: 'var(--txt-mut)', fontSize: '0.8rem', fontWeight: 'bold', background: 'rgba(255,255,255,0.02)' }}>الإعدادات</div>
                    <button onClick={() => setActiveTab('settings')} style={getTabStyle(activeTab === 'settings', '#f39c12')}><FaCog /> بيانات الحصة</button>
                    
                    <div style={{ padding: '15px', color: 'var(--txt-mut)', fontSize: '0.8rem', fontWeight: 'bold', background: 'rgba(255,255,255,0.02)' }}>محتوى الحصة</div>
                    <button onClick={() => setActiveTab('videos')} style={getTabStyle(activeTab === 'videos', '#e74c3c')}><FaVideo /> الفيديوهات ({state.videos?.length || 0})</button>
                    <button onClick={() => setActiveTab('pdfs')} style={getTabStyle(activeTab === 'pdfs', '#3498db')}><FaFilePdf /> ملفات المرفقات ({state.pdfs?.length || 0})</button>
                    <button onClick={() => setActiveTab('references')} style={getTabStyle(activeTab === 'references', '#2ecc71')}><FaLink /> مراجع خارجية ({state.references?.length || 0})</button>
                </div>

                <div style={{ flex: 1, minWidth: '300px', background: 'var(--card)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', padding: '30px' }}>
                    
                    {activeTab === 'settings' && (
                        <div style={{ animation: 'fadeIn 0.3s ease' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ color: '#f39c12', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}><FaCog /> البيانات الأساسية للحصة</h3>
                            </div>
                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <Input label="اسم الحصة" value={state.title} onChange={e => dispatch({ type: 'SET_INFO', payload: { field: 'title', value: e.target.value } })} />
                                <Input label="وصف الحصة (يظهر للطلاب كنبذة)" value={state.description} onChange={e => dispatch({ type: 'SET_INFO', payload: { field: 'description', value: e.target.value } })} />
                                
                                <div>
                                    <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>المرحلة الدراسية</label>
                                    <select 
                                        value={(state as any).stage || ''} 
                                        onChange={e => dispatch({ type: 'SET_INFO', payload: { field: 'stage', value: e.target.value } })} 
                                        style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '10px', outline: 'none' }}
                                    >
                                        <option value="" style={{background: '#1e1e2d'}}>-- اختر المرحلة الدراسية --</option>
                                        {stages.map(s => (
                                            // 🚀 التعديل التالت: عشان نعرض الاسم صح
                                            <option key={s.id} value={s.id} style={{background: '#1e1e2d'}}>{s.name || s.title}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'videos' && (
                        <div style={{ animation: 'fadeIn 0.3s ease' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ color: '#e74c3c', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}><FaVideo /> فيديوهات الشرح</h3>
                                <Button variant="outline" size="sm" icon={<FaPlus />} onClick={() => dispatch({ type: 'ADD_VIDEO' })}>إضافة فيديو</Button>
                            </div>
                            {state.videos?.map((v: any) => (
                                <div key={v.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', marginBottom: '15px', border: '1px dashed rgba(231, 76, 60, 0.3)' }}>
                                    <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                                        <div style={{ flex: 1, minWidth: '150px' }}>
                                            <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>منصة العرض</label>
                                            <select value={v.platform} onChange={e => dispatch({ type: 'UPDATE_VIDEO', payload: { id: v.id, field: 'platform' as any, value: e.target.value as VideoPlatform } })} style={{ width: '100%', padding: '12px 15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none', fontWeight: 'bold' }}>
                                                <option value="bunny" style={{background: '#1e1e2d'}}>🐰 Bunny CDN</option><option value="youtube" style={{background: '#1e1e2d'}}>🔴 YouTube</option><option value="vimeo" style={{background: '#1e1e2d'}}>🔵 Vimeo</option><option value="server" style={{background: '#1e1e2d'}}>💾 سيرفر خاص</option>
                                            </select>
                                        </div>
                                        <div style={{ flex: 2, minWidth: '200px' }}><Input label="اسم الفيديو (مثال: الجزء الأول)" value={v.title} onChange={e => dispatch({ type: 'UPDATE_VIDEO', payload: { id: v.id, field: 'title' as any, value: e.target.value } })} /></div>
                                        <div style={{ flex: 3, minWidth: '250px' }}><Input label="الرابط أو الـ Embed Code" value={v.url} onChange={e => dispatch({ type: 'UPDATE_VIDEO', payload: { id: v.id, field: 'url' as any, value: e.target.value } })} /></div>
                                        
                                        <div style={{ display: 'flex', gap: '10px', marginTop: '28px' }}>
                                            <button onClick={() => dispatch({ type: 'TOGGLE_PREVIEW', payload: v.id })} style={{ background: v.showPreview ? '#e74c3c' : 'rgba(231, 76, 60, 0.1)', color: v.showPreview ? 'white' : '#e74c3c', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', transition: '0.2s' }} title="معاينة">{v.showPreview ? <FaEyeSlash /> : <FaEye />}</button>
                                            <button onClick={() => dispatch({ type: 'DELETE_VIDEO', payload: v.id })} style={{ background: 'rgba(231,76,60,0.1)', color: 'var(--danger)', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer' }} title="حذف"><FaTrash /></button>
                                        </div>
                                    </div>
                                    {v.showPreview && (
                                        <div style={{ marginTop: '20px', width: '100%', height: '350px', background: '#000', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--txt-mut)', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                                            {renderVideoPreview(v.platform, v.url)}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {(!state.videos || state.videos.length === 0) && <div style={{ textAlign: 'center', color: 'var(--txt-mut)', padding: '40px', background: 'rgba(0,0,0,0.1)', borderRadius: '15px' }}>لم تقم بإضافة أي فيديوهات حتى الآن.</div>}
                        </div>
                    )}

                    {activeTab === 'pdfs' && (
                        <div style={{ animation: 'fadeIn 0.3s ease' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ color: '#3498db', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}><FaFilePdf /> ملفات المرفقات (PDF)</h3>
                                <Button variant="outline" size="sm" icon={<FaPlus />} onClick={() => dispatch({ type: 'ADD_PDF' })}>إضافة ملف</Button>
                            </div>
                            {state.pdfs?.map((p: any) => (
                                <div key={p.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', marginBottom: '15px', border: '1px dashed rgba(52, 152, 219, 0.3)', display: 'flex', gap: '15px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                                    <div style={{ flex: 1, minWidth: '200px' }}>
                                        <Input label="اسم الملف" value={p.title} onChange={e => dispatch({ type: 'UPDATE_PDF', payload: { id: p.id, field: 'title' as any, value: e.target.value } })} />
                                    </div>
                                    <div style={{ flex: 2, minWidth: '250px' }}>
                                        <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>رفع الملف (PDF)</label>
                                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                            <input 
                                                type="file" 
                                                accept=".pdf"
                                                id={`pdf-upload-${p.id}`}
                                                style={{ display: 'none' }}
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        dispatch({ type: 'UPDATE_PDF', payload: { id: p.id, field: 'url' as any, value: file.name } });
                                                    }
                                                }}
                                            />
                                            <Button 
                                                variant="outline" 
                                                onClick={() => document.getElementById(`pdf-upload-${p.id}`)?.click()} 
                                                style={{ background: 'rgba(52, 152, 219, 0.1)', color: '#3498db', border: '1px solid rgba(52, 152, 219, 0.3)', padding: '10px 20px' }}
                                            >
                                                <FaUpload style={{ marginRight: '8px' }} /> اختر ملف
                                            </Button>
                                            
                                            <div style={{ color: '#2ecc71', fontSize: '0.9rem', fontWeight: 'bold', wordBreak: 'break-all' }}>
                                                {p.url ? `✔️ ${p.url}` : <span style={{color: 'var(--txt-mut)'}}>لم يتم اختيار ملف</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '28px' }}>
                                        <button onClick={() => dispatch({ type: 'DELETE_PDF', payload: p.id })} style={{ background: 'rgba(231,76,60,0.1)', color: 'var(--danger)', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}><FaTrash /></button>
                                    </div>
                                </div>
                            ))}
                            {(!state.pdfs || state.pdfs.length === 0) && <div style={{ textAlign: 'center', color: 'var(--txt-mut)', padding: '40px', background: 'rgba(0,0,0,0.1)', borderRadius: '15px' }}>لم تقم بإضافة أي ملفات حتى الآن.</div>}
                        </div>
                    )}

                    {activeTab === 'references' && (
                        <div style={{ animation: 'fadeIn 0.3s ease' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ color: '#2ecc71', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}><FaLink /> مراجع خارجية</h3>
                                <Button variant="outline" size="sm" icon={<FaPlus />} onClick={() => dispatch({ type: 'ADD_REFERENCE' })}>إضافة مرجع</Button>
                            </div>
                            {state.references?.map((r: any) => (
                                <div key={r.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', marginBottom: '15px', border: '1px dashed rgba(46, 204, 113, 0.3)', display: 'flex', gap: '15px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                                    <div style={{ flex: 1, minWidth: '200px' }}><Input label="اسم المرجع" value={r.title} onChange={e => dispatch({ type: 'UPDATE_REFERENCE', payload: { id: r.id, field: 'title' as any, value: e.target.value } })} /></div>
                                    <div style={{ flex: 2, minWidth: '250px' }}><Input label="الرابط" value={r.url} onChange={e => dispatch({ type: 'UPDATE_REFERENCE', payload: { id: r.id, field: 'url' as any, value: e.target.value } })} /></div>
                                    <div style={{ marginTop: '28px' }}>
                                        <button onClick={() => dispatch({ type: 'DELETE_REFERENCE', payload: r.id })} style={{ background: 'rgba(231,76,60,0.1)', color: 'var(--danger)', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}><FaTrash /></button>
                                    </div>
                                </div>
                            ))}
                            {(!state.references || state.references.length === 0) && <div style={{ textAlign: 'center', color: 'var(--txt-mut)', padding: '40px', background: 'rgba(0,0,0,0.1)', borderRadius: '15px' }}>لم تقم بإضافة أي مراجع خارجية حتى الآن.</div>}
                        </div>
                    )}
                    
                    <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant="primary" icon={<FaSave />} onClick={handleSaveLesson} disabled={isSaving} style={{ padding: '15px 30px', background: 'var(--p-purple)', color: '#fff', opacity: isSaving ? 0.7 : 1 }}>
                            {isSaving ? 'جاري الحفظ...' : 'حفظ التعديلات نهائياً'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const statBadgeStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--txt)', background: 'rgba(255,255,255,0.05)', padding: '8px 15px', borderRadius: '8px', fontSize: '0.9rem' };
const getTabStyle = (isActive: boolean, color: string): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '18px 20px', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)', background: isActive ? `${color}15` : 'transparent', color: isActive ? color : 'var(--txt-mut)', fontWeight: isActive ? 'bold' : 'normal', cursor: 'pointer', textAlign: 'right', transition: '0.2s', borderRight: isActive ? `4px solid ${color}` : '4px solid transparent'
});