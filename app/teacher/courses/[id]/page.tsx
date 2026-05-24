"use client";
import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowRight, FaSave, FaCheck, FaPlus, FaCog } from 'react-icons/fa';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';

import { useCurriculum } from '@/features/course-builder/hooks/useCurriculum';
import { LectureCard } from '@/features/course-builder/components/LectureCard';
import { ItemSettingsDrawer } from '@/features/course-builder/components/ItemSettingsDrawer';
import { ContentPickerModal } from '@/features/course-builder/components/ContentPickerModal';
import { PricingTab } from '@/features/course-builder/components/PricingTab'; 
import { StudentsTab } from '@/features/course-builder/components/StudentsTab'; 
import { NotificationsTab } from '@/features/course-builder/components/NotificationsTab';
import { LectureSettingsModal } from '@/features/course-builder/components/LectureSettingsModal';
import { useToast } from '@/context/ToastContext';
import { courseService } from '@/features/teacherCourses/services/courseService';

import { Lecture, LectureItem as LectureItemType } from '@/features/course-builder/types/curriculum.types';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button'; // 🚀 تم إضافة الـ Button هنا بنجاح

export default function CourseBuilderPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const { showToast } = useToast();
    
    const [activeTab, setActiveTab] = useState<'settings' | 'curriculum' | 'pricing' | 'students' | 'notifications'>('curriculum');
    const [courseMeta, setCourseMeta] = useState({ title: '', description: '', category: '', price: 0, status: 'Draft' });

    const { curriculum, addLecture, updateLecture, addItem, updateItem, reorderItems, moveItemBetweenLectures, setCurriculum } = useCurriculum([]);

    const [activeLectureId, setActiveLectureId] = useState<string | null>(null);
    const [settingsItem, setSettingsItem] = useState<{ lectureId: string, item: LectureItemType } | null>(null);
    const [settingsLecture, setSettingsLecture] = useState<Lecture | null>(null);
    
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const loadCourseData = async () => {
            try {
                const res = await courseService.getBuilderData(resolvedParams.id);
                if (res) {
                    setCourseMeta(res.meta);
                    setCurriculum(res.curriculum || []);
                }
            } catch (error) { showToast('فشل في جلب بيانات الكورس', 'error'); }
            finally { setIsLoading(false); }
        };
        loadCourseData();
    }, [resolvedParams.id, setCurriculum, showToast]);

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const activeId = active.id as string;
        const overId = over.id as string;

        let sourceLectureId = '', sourceIndex = -1, targetLectureId = '', targetIndex = -1;
        curriculum.forEach((lec: Lecture) => {
            const idx = lec.items.findIndex(i => i.id === activeId);
            if (idx !== -1) { sourceLectureId = lec.id; sourceIndex = idx; }
            const oIdx = lec.items.findIndex(i => i.id === overId);
            if (oIdx !== -1) { targetLectureId = lec.id; targetIndex = oIdx; }
        });

        if (sourceLectureId === targetLectureId) reorderItems(sourceLectureId, sourceIndex, targetIndex);
        else if (sourceLectureId && targetLectureId) moveItemBetweenLectures(sourceLectureId, targetLectureId, activeId, targetIndex);
    };

    const handleGlobalSave = async () => {
        setIsSaving(true);
        try {
            await courseService.saveMeta(resolvedParams.id, courseMeta);
            await courseService.saveCurriculum(resolvedParams.id, curriculum);
            showToast('تم حفظ الكورس والمنهج بنجاح! 🚀', 'success');
        } catch (error) { showToast('حدث خطأ أثناء الحفظ', 'error'); }
        finally { setIsSaving(false); }
    };

    if (isLoading) return <div style={{ padding: '50px', textAlign: 'center', color: 'var(--txt-mut)' }}>جاري تحميل بيانات الكورس... ⏳</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '100vw', boxSizing: 'border-box', overflowX: 'hidden', padding: '10px', paddingBottom: '50px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px', width: '100%' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button onClick={() => router.push('/teacher/courses')} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'white', width: '40px', height: '40px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaArrowRight /></button>
                    <div>
                        <h1 style={{ fontSize: '1.2rem', margin: 0, color: 'white', fontWeight: 'bold' }}>{courseMeta.title}</h1>
                        <span style={{ color: '#2ecc71', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}><FaCheck size={10}/> {courseMeta.status === 'Published' ? 'منشور' : 'مسودة'}</span>
                    </div>
                </div>
                <Button variant="primary" icon={<FaSave />} onClick={handleGlobalSave} disabled={isSaving} style={{ background: 'var(--p-purple)', border: 'none', color: '#fff', width: '100%', justifyContent: 'center' }}>
                    {isSaving ? 'جاري الحفظ...' : 'حفظ الكورس'}
                </Button>
            </div>

            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', WebkitOverflowScrolling: 'touch', width: '100%' }}>
                {[ { id: 'settings', label: 'الإعدادات' }, { id: 'curriculum', label: 'المنهج' }, { id: 'pricing', label: 'التسعير' }, { id: 'students', label: 'الطلاب' }, { id: 'notifications', label: 'الإشعارات' }].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                        style={{ background: 'transparent', border: 'none', padding: '10px 15px', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '0.9rem', fontWeight: activeTab === tab.id ? 'bold' : 'normal', color: activeTab === tab.id ? 'var(--p-purple)' : 'var(--txt-mut)', borderBottom: activeTab === tab.id ? '3px solid var(--p-purple)' : '3px solid transparent' }}>{tab.label}</button>
                ))}
            </div>

            <div style={{ width: '100%', boxSizing: 'border-box' }}>
                {activeTab === 'settings' && (
                    <div style={{ background: 'var(--card)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', width: '100%' }}>
                        <h3 style={{ margin: '0 0 15px 0', color: 'white', fontSize: '1.1rem' }}><FaCog color="var(--p-purple)"/> البيانات الأساسية للكورس</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <Input label="اسم الكورس" value={courseMeta.title} onChange={e => setCourseMeta({...courseMeta, title: e.target.value})} />
                            <div>
                                <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '5px', fontSize: '0.85rem', fontWeight: 'bold' }}>وصف الكورس</label>
                                <textarea value={courseMeta.description} onChange={e => setCourseMeta({...courseMeta, description: e.target.value})} style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none', minHeight: '80px', fontFamily: 'inherit' }} />
                            </div>
                            <Input label="سعر الكورس بالكامل (ج.م)" type="number" value={courseMeta.price.toString()} onChange={e => setCourseMeta({...courseMeta, price: parseFloat(e.target.value) || 0})} />
                            <div>
                                <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '5px', fontSize: '0.85rem', fontWeight: 'bold' }}>حالة الكورس</label>
                                <select value={courseMeta.status} onChange={e => setCourseMeta({...courseMeta, status: e.target.value})} style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }}>
                                    <option value="Draft" style={{ background: '#1e1e2d' }}>مسودة (مخفي للطلاب)</option>
                                    <option value="Published" style={{ background: '#1e1e2d' }}>منشور (متاح للشراء والدخول)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'curriculum' && (
                    <div style={{ width: '100%', boxSizing: 'border-box' }}>
                        <button onClick={() => addLecture()} style={{ width: '100%', background: 'transparent', border: '2px dashed rgba(255,255,255,0.1)', color: 'white', padding: '12px', borderRadius: '10px', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}><FaPlus color="var(--p-purple)" /> إضافة محاضرة جديدة</button>
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            {curriculum.map((lecture: Lecture) => (
                                <LectureCard key={lecture.id} lecture={lecture} onUpdateLecture={updateLecture} onOpenContentPicker={setActiveLectureId} onOpenSettings={(item) => setSettingsItem({ lectureId: lecture.id, item })} onOpenLectureSettings={setSettingsLecture} onOpenReports={()=>{}} onOpenLectureReports={()=>{}} onOpenGrading={()=>{}} />
                            ))}
                        </DndContext>
                    </div>
                )}

                {activeTab === 'pricing' && <PricingTab curriculum={curriculum} />}
                {activeTab === 'students' && <StudentsTab courseId={resolvedParams.id} curriculum={curriculum} />}
                {activeTab === 'notifications' && <NotificationsTab curriculum={curriculum} />}
            </div>

            <ContentPickerModal isOpen={!!activeLectureId} onClose={() => setActiveLectureId(null)} onSelect={(item) => { if (activeLectureId) addItem(activeLectureId, { ...item, id: `new-${Date.now()}` } as LectureItemType); }} />
            <ItemSettingsDrawer isOpen={!!settingsItem} onClose={() => setSettingsItem(null)} item={settingsItem?.item || null} curriculum={curriculum} onSave={(itemId, updates) => { if (settingsItem) updateItem(settingsItem.lectureId, itemId, updates); }} />
            <LectureSettingsModal isOpen={!!settingsLecture} onClose={() => setSettingsLecture(null)} lecture={settingsLecture} onSave={(id, updates) => updateLecture(id, updates)} />
        </div>
    );
}