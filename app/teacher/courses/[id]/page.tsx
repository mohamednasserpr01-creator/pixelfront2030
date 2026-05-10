"use client";
import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowRight, FaSave, FaBookOpen, FaTags, FaChartPie, FaWhatsapp, FaCheck, FaPlus, FaCog, FaImage, FaClock, FaLock } from 'react-icons/fa';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import { useCurriculum } from '@/features/course-builder/hooks/useCurriculum';
import { LectureCard } from '@/features/course-builder/components/LectureCard';
import { ItemSettingsDrawer } from '@/features/course-builder/components/ItemSettingsDrawer';
import { ContentPickerModal } from '@/features/course-builder/components/ContentPickerModal';
import { PricingTab } from '@/features/course-builder/components/PricingTab'; 
import { StudentsTab } from '@/features/course-builder/components/StudentsTab'; 
import { ItemReportsModal } from '@/features/course-builder/components/ItemReportsModal'; 
import { LectureReportsModal } from '@/features/course-builder/components/LectureReportsModal'; 
import { ItemGradingModal } from '@/features/course-builder/components/ItemGradingModal'; 
import { NotificationsTab } from '@/features/course-builder/components/NotificationsTab';
// 🚀 استدعاء مودال إعدادات المحاضرة اللي ضفناه
import { LectureSettingsModal } from '@/features/course-builder/components/LectureSettingsModal';

import { Lecture, LectureItem as LectureItemType } from '@/features/course-builder/types/curriculum.types';
import { Input } from '@/components/ui/Input';

const initialData: Lecture[] = [
    { id: 'lec-1', title: 'المحاضرة الأولى: أساسيات', items: [{ id: 'item-1', type: 'lesson', title: 'شرح' as any, viewsLimit: 3 }] }
];

export default function CourseBuilderPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    
    const [activeTab, setActiveTab] = useState<'settings' | 'curriculum' | 'pricing' | 'students' | 'notifications'>('curriculum');
    
    const [courseMeta, setCourseMeta] = useState({
        title: 'كورس المراجعة النهائية (فيزياء)',
        description: 'شرح مفصل ومراجعة لجميع أبواب المنهج.',
        stage: 'sec3',
        stream: 'science',
        image: '',
        publishDate: '', 
        expireAfterDays: 0, 
        stopNewEnrollments: false, 
        lockForAll: false 
    });

    const { curriculum, addLecture, updateLecture, addItem, updateItem, reorderItems, moveItemBetweenLectures } = useCurriculum(initialData);

    const [activeLectureId, setActiveLectureId] = useState<string | null>(null);
    const [settingsItem, setSettingsItem] = useState<{ lectureId: string, item: LectureItemType } | null>(null);
    const [reportItem, setReportItem] = useState<LectureItemType | null>(null);
    const [reportLecture, setReportLecture] = useState<Lecture | null>(null);
    const [gradingItem, setGradingItem] = useState<LectureItemType | null>(null);
    
    // 🚀 State مخصوصة عشان تفتح وتقفل مودال المحاضرة
    const [settingsLecture, setSettingsLecture] = useState<Lecture | null>(null);

    useEffect(() => { setIsMounted(true); }, []);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        let sourceLectureId = ''; let sourceIndex = -1;
        curriculum.forEach((lec: Lecture) => {
            const index = lec.items.findIndex(i => i.id === activeId);
            if (index !== -1) { sourceLectureId = lec.id; sourceIndex = index; }
        });

        let targetLectureId = ''; let targetIndex = -1;
        curriculum.forEach((lec: Lecture) => {
            const index = lec.items.findIndex(i => i.id === overId);
            if (index !== -1) { targetLectureId = lec.id; targetIndex = index; }
        });

        if (sourceLectureId === targetLectureId) reorderItems(sourceLectureId, sourceIndex, targetIndex);
        else if (sourceLectureId && targetLectureId) moveItemBetweenLectures(sourceLectureId, targetLectureId, activeId, targetIndex);
    };

    if (!isMounted) return null;

    return (
        <div style={{ animation: 'fadeIn 0.4s ease', maxWidth: '1000px', margin: '0 auto', paddingBottom: '50px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px', marginTop: '30px' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <button onClick={() => router.push('/teacher/courses')} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--txt)', width: '45px', height: '45px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FaArrowRight />
                    </button>
                    <div>
                        <h1 style={{ fontSize: '1.6rem', margin: '0 0 5px 0', color: 'var(--txt)', fontWeight: 'bold' }}>{courseMeta.title}</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--txt-mut)', fontSize: '0.9rem' }}>
                            <span style={{ color: '#2ecc71', display: 'flex', alignItems: 'center', gap: '5px' }}><FaCheck size={12}/> منشور</span>
                            <span>•</span>
                            <span>ID: {resolvedParams.id}</span>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button style={{ background: 'var(--p-purple)', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaSave size={18} /> حفظ التعديلات
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '30px', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '30px', overflowX: 'auto' }}>
                {[ 
                    { id: 'settings', label: 'الإعدادات', icon: <FaCog /> },
                    { id: 'curriculum', label: 'المنهج', icon: <FaBookOpen /> }, 
                    { id: 'pricing', label: 'التسعير', icon: <FaTags /> }, 
                    { id: 'students', label: 'الطلاب', icon: <FaChartPie /> }, 
                    { id: 'notifications', label: 'الإشعارات', icon: <FaWhatsapp /> } 
                ].map((tab) => (
                    <button 
                        key={tab.id} 
                        onClick={() => setActiveTab(tab.id as any)} 
                        style={{ 
                            background: 'transparent', border: 'none', 
                            borderBottom: activeTab === tab.id ? '3px solid var(--p-purple)' : '3px solid transparent', 
                            padding: '0 0 15px 0', color: activeTab === tab.id ? 'var(--txt)' : 'var(--txt-mut)', 
                            cursor: 'pointer', fontWeight: activeTab === tab.id ? 'bold' : 'normal', 
                            fontSize: '1rem', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap'
                        }}
                    >
                        <span style={{ color: activeTab === tab.id ? 'var(--p-purple)' : 'inherit' }}>{tab.icon}</span>{tab.label}
                    </button>
                ))}
            </div>

            <div>
                {activeTab === 'settings' && (
                    <div style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ background: 'var(--card)', padding: '25px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <h3 style={{ margin: '0 0 20px 0', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <FaCog color="var(--p-purple)"/> البيانات الأساسية للكورس
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                <div style={{ gridColumn: '1 / -1' }}><Input label="اسم الكورس" value={courseMeta.title} onChange={e => setCourseMeta({...courseMeta, title: e.target.value})} /></div>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>وصف الكورس</label>
                                    <textarea value={courseMeta.description} onChange={e => setCourseMeta({...courseMeta, description: e.target.value})} style={{ width: '100%', padding: '15px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '10px', outline: 'none', resize: 'vertical', minHeight: '100px', fontFamily: 'inherit' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>المرحلة الدراسية</label>
                                    <select value={courseMeta.stage} onChange={e => setCourseMeta({...courseMeta, stage: e.target.value})} style={{ width: '100%', padding: '12px 15px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }}>
                                        <option value="prep3" style={{ background: '#1e1e2d' }}>الصف الثالث الإعدادي</option><option value="sec1" style={{ background: '#1e1e2d' }}>الصف الأول الثانوي</option><option value="sec2" style={{ background: '#1e1e2d' }}>الصف الثاني الثانوي</option><option value="sec3" style={{ background: '#1e1e2d' }}>الصف الثالث الثانوي</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>الشعبة</label>
                                    <select value={courseMeta.stream} onChange={e => setCourseMeta({...courseMeta, stream: e.target.value})} style={{ width: '100%', padding: '12px 15px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }}>
                                        <option value="all" style={{ background: '#1e1e2d' }}>عام (الكل)</option><option value="science" style={{ background: '#1e1e2d' }}>علمي علوم</option><option value="math" style={{ background: '#1e1e2d' }}>علمي رياضة</option><option value="literary" style={{ background: '#1e1e2d' }}>أدبي</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div style={{ background: 'var(--card)', padding: '25px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <h3 style={{ margin: '0 0 20px 0', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}><FaClock color="#f1c40f"/> إعدادات النشر والصلاحية</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>تاريخ ظهور الكورس للطلاب</label>
                                    <input type="datetime-local" value={courseMeta.publishDate} onChange={e => setCourseMeta({...courseMeta, publishDate: e.target.value})} style={{ width: '100%', padding: '12px 15px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>يُغلق تلقائياً بعد (أيام من الشراء)</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><input type="number" min={0} value={courseMeta.expireAfterDays} onChange={e => setCourseMeta({...courseMeta, expireAfterDays: Number(e.target.value)})} style={{ width: '100px', padding: '12px 15px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none', textAlign: 'center' }} /><span style={{ color: 'var(--txt-mut)' }}>يوم</span></div>
                                </div>
                            </div>
                            <div style={{ marginTop: '25px', display: 'flex', flexDirection: 'column', gap: '15px', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '20px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '10px', cursor: 'pointer' }}>
                                    <div><div style={{ color: 'white', fontWeight: 'bold', marginBottom: '5px' }}>إيقاف بيع الكورس (للمشتركين فقط)</div><div style={{ color: 'var(--txt-mut)', fontSize: '0.85rem' }}>لن يتمكن أي طالب جديد من الشراء.</div></div>
                                    <input type="checkbox" checked={courseMeta.stopNewEnrollments} onChange={e => setCourseMeta({...courseMeta, stopNewEnrollments: e.target.checked})} style={{ width: '20px', height: '20px', accentColor: '#f39c12' }} />
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: courseMeta.lockForAll ? 'rgba(231, 76, 60, 0.1)' : 'rgba(0,0,0,0.2)', border: courseMeta.lockForAll ? '1px solid #e74c3c' : '1px solid transparent', padding: '15px', borderRadius: '10px', cursor: 'pointer', transition: '0.3s' }}>
                                    <div><div style={{ color: courseMeta.lockForAll ? '#e74c3c' : 'white', fontWeight: 'bold', marginBottom: '5px' }}>إغلاق الكورس تماماً (على جميع الطلاب)</div><div style={{ color: 'var(--txt-mut)', fontSize: '0.85rem' }}>سيتم منع الجميع من الدخول إليه.</div></div>
                                    <input type="checkbox" checked={courseMeta.lockForAll} onChange={e => setCourseMeta({...courseMeta, lockForAll: e.target.checked})} style={{ width: '20px', height: '20px', accentColor: '#e74c3c' }} />
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'curriculum' && (
                    <div style={{ animation: 'fadeIn 0.3s ease' }}>
                        <button onClick={() => addLecture()} style={{ width: '100%', background: 'transparent', border: '2px dashed rgba(255,255,255,0.1)', color: 'var(--txt)', padding: '15px', borderRadius: '12px', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '30px', transition: '0.2s' }} onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--p-purple)'} onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}>
                            <FaPlus color="var(--p-purple)" /> إضافة محاضرة جديدة
                        </button>

                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            {curriculum.map((lecture: Lecture) => (
                                <LectureCard 
                                    key={lecture.id} 
                                    lecture={lecture} 
                                    onUpdateLecture={updateLecture} 
                                    onOpenContentPicker={(lecId: string) => setActiveLectureId(lecId)} 
                                    onOpenSettings={(item: LectureItemType) => setSettingsItem({ lectureId: lecture.id, item })} 
                                    onOpenReports={(item: LectureItemType) => setReportItem(item)} 
                                    onOpenLectureReports={(lec: Lecture) => setReportLecture(lec)} 
                                    onOpenGrading={(item: LectureItemType) => setGradingItem(item)} 
                                    onOpenLectureSettings={(lec: Lecture) => setSettingsLecture(lec)} // 🚀 الربط الصح للمودال
                                />
                            ))}
                        </DndContext>
                    </div>
                )}

                {activeTab === 'pricing' && <PricingTab curriculum={curriculum} />}
                {activeTab === 'students' && <StudentsTab courseId={resolvedParams.id} curriculum={curriculum} />}
                {activeTab === 'notifications' && <NotificationsTab curriculum={curriculum} />}
            </div>

            {/* Modals... */}
            <ContentPickerModal isOpen={!!activeLectureId} onClose={() => setActiveLectureId(null)} onSelect={(item: Partial<LectureItemType>) => { if (activeLectureId) addItem(activeLectureId, { ...item, id: `new-${Date.now()}` } as LectureItemType); }} />
            <ItemSettingsDrawer isOpen={!!settingsItem} onClose={() => setSettingsItem(null)} item={settingsItem?.item || null} curriculum={curriculum} onSave={(itemId: string, updates: Partial<LectureItemType>) => { if (settingsItem) updateItem(settingsItem.lectureId, itemId, updates); }} />
            <ItemReportsModal isOpen={!!reportItem} onClose={() => setReportItem(null)} item={reportItem} />
            <LectureReportsModal isOpen={!!reportLecture} onClose={() => setReportLecture(null)} lecture={reportLecture} />
            <ItemGradingModal isOpen={!!gradingItem} onClose={() => setGradingItem(null)} item={gradingItem} />
            
            {/* 🚀 المودال الجديد لإعدادات المحاضرة */}
            <LectureSettingsModal isOpen={!!settingsLecture} onClose={() => setSettingsLecture(null)} lecture={settingsLecture} onSave={(id, updates) => updateLecture(id, updates)} />

        </div>
    );
}