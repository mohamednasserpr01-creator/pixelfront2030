"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaPlus, FaSearch, FaBook, FaEdit, FaTrash, FaVideo, FaFilePdf, FaLink, FaGraduationCap, FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';

// 🚀 استدعاء السيرفيس والـ Modal
import CreateHomeworkLessonModal from '@/features/teacherHomeworkLessons/components/CreateHomeworkLessonModal';
import { homeworkLessonsService } from '@/features/teacherHomeworkLessons/services/homeworkLessonsService';

const API_BASE_URL = 'http://localhost:5290/api';

export default function HomeworkLessonsPage() {
    const router = useRouter();
    const { showToast } = useToast();
    
    const [search, setSearch] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    
    // 🚀 States الداتا والفلترة والصفحات
    const [lessons, setLessons] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stagesMap, setStagesMap] = useState<Record<string, string>>({});
    const [stagesList, setStagesList] = useState<any[]>([]); // 👈 ضفنا دي عشان نرسم زراير الفلتر
    
    const [activeStage, setActiveStage] = useState('all'); // 👈 State الفلتر
    const [currentPage, setCurrentPage] = useState(1);     // 👈 State الصفحة الحالية
    const [totalPages, setTotalPages] = useState(1);       // 👈 State إجمالي الصفحات

    // 1. جلب المراحل لترجمة الـ ID لرسم أزرار الفلتر
    useEffect(() => {
        const fetchStages = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const res = await fetch(`${API_BASE_URL}/educational-stages`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    const stagesArray = data.data || data.items || data || [];
                    
                    // تحويل لقاموس للجدول
                    const map: Record<string, string> = {};
                    stagesArray.forEach((s: any) => { map[s.id] = s.name; });
                    setStagesMap(map);
                    
                    // حفظ القائمة عشان نرسم زراير الفلتر فوق
                    setStagesList([{ id: 'all', name: 'جميع المراحل' }, ...stagesArray]);
                }
            } catch (error) {
                console.error("Error fetching stages:", error);
            }
        };
        fetchStages();
    }, []);

    // 2. جلب حصص الواجب بناءً على الصفحة والفلتر
    const fetchLessons = async () => {
        setIsLoading(true);
        try {
            // 🚀 بتبعت الصفحة الحالية والبحث والمرحلة للسيرفيس
            const result = await homeworkLessonsService.getHomeworks(currentPage, search, activeStage);
            setLessons(result.data || []);
            setTotalPages(result.totalPages || 1);
        } catch (error) {
            console.error("Failed to fetch homeworks", error);
        } finally {
            setIsLoading(false);
        }
    };

    // 3. تفعيل البحث اللحظي وتغيير الصفحة أو الفلتر
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchLessons();
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [search, activeStage, currentPage]); // 👈 ربطنا الـ useEffect بتغيير الفلتر والصفحات

    // 4. دالة المسح
    const handleDelete = async (id: string) => {
        if (!window.confirm('هل أنت متأكد من مسح حصة الواجب هذه بشكل نهائي؟')) return;
        try {
            await homeworkLessonsService.deleteHomework(id);
            showToast('تم مسح حصة الواجب بنجاح 🗑️', 'success');
            fetchLessons(); 
        } catch (error: any) {
            showToast(error.message || 'حدث خطأ أثناء المسح', 'error');
        }
    };

    return (
        <div style={{ animation: 'fadeIn 0.5s ease', paddingBottom: '50px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', color: 'var(--txt)', fontWeight: 900, margin: '0 0 5px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaBook style={{ color: '#1abc9c' }} /> إدارة حصص الواجبات
                    </h1>
                    <p style={{ color: 'var(--txt-mut)', margin: 0, fontSize: '0.9rem' }}>أضف فيديوهات ومذكرات حل الواجبات لتكون جاهزة للربط بالكورسات.</p>
                </div>
                <Button variant="primary" icon={<FaPlus />} onClick={() => setIsCreateModalOpen(true)} style={{ background: '#1abc9c', color: '#fff' }}>
                    إضافة حصة حل واجب
                </Button>
            </div>

            <div style={{ background: 'var(--card)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                
                {/* 🚀 شريط فلاتر المراحل (أزرار) */}
                {stagesList.length > 0 && (
                    <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '15px', marginBottom: '20px', borderBottom: '1px dashed rgba(255,255,255,0.1)' }}>
                        {stagesList.map(stage => (
                            <button 
                                key={stage.id}
                                onClick={() => { setActiveStage(stage.id.toString()); setCurrentPage(1); }} // لما نغير الفلتر نرجع لصفحة 1
                                style={{
                                    padding: '10px 20px', borderRadius: '30px', whiteSpace: 'nowrap', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: '0.3s',
                                    border: activeStage === stage.id.toString() ? 'none' : '1px solid rgba(255,255,255,0.1)',
                                    background: activeStage === stage.id.toString() ? '#1abc9c' : 'transparent',
                                    color: activeStage === stage.id.toString() ? 'white' : 'var(--txt-mut)',
                                    boxShadow: activeStage === stage.id.toString() ? '0 4px 15px rgba(26, 188, 156, 0.3)' : 'none'
                                }}
                            >
                                <FaGraduationCap /> {stage.name}
                            </button>
                        ))}
                    </div>
                )}

                {/* شريط البحث */}
                <div style={{ marginBottom: '20px', display: 'flex', gap: '15px' }}>
                    <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                        <FaSearch style={{ position: 'absolute', right: '15px', top: '15px', color: 'var(--txt-mut)' }} />
                        <input 
                            type="text" 
                            placeholder="ابحث عن حصة واجب..." 
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} // تصفير الصفحة عند البحث
                            style={{ width: '100%', padding: '12px 40px 12px 15px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', color: 'white', borderRadius: '8px', outline: 'none' }}
                        />
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
                        <thead>
                            <tr style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <th style={{ padding: '15px', color: 'var(--txt-mut)', fontWeight: 'bold' }}>اسم الحصة</th>
                                <th style={{ padding: '15px', color: 'var(--txt-mut)', fontWeight: 'bold' }}>الصف الدراسي</th>
                                <th style={{ padding: '15px', color: 'var(--txt-mut)', fontWeight: 'bold' }}>المحتوى المرفوع</th>
                                <th style={{ padding: '15px', color: 'var(--txt-mut)', fontWeight: 'bold' }}>تاريخ الإنشاء</th>
                                <th style={{ padding: '15px', color: 'var(--txt-mut)', fontWeight: 'bold' }}>إجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--txt-mut)' }}>جاري تحميل حصص الواجب... ⏳</td>
                                </tr>
                            ) : lessons.length > 0 ? (
                                lessons.map((lesson) => {
                                    const stageName = stagesMap[lesson.educationalStageId] || lesson.stage || 'مرحلة غير محددة';
                                    
                                    return (
                                        <tr key={lesson.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', transition: '0.2s' }}>
                                            <td style={{ padding: '15px', color: 'white', fontWeight: 'bold' }}>{lesson.title}</td>
                                            <td style={{ padding: '15px', color: 'var(--txt-mut)' }}>{stageName}</td>
                                            <td style={{ padding: '15px', color: 'var(--txt-mut)' }}>
                                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                                    {lesson.videosCount > 0 && <span style={{ background: 'rgba(231,76,60,0.1)', color: '#e74c3c', padding: '4px 8px', borderRadius: '5px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}><FaVideo /> {lesson.videosCount}</span>}
                                                    {lesson.pdfsCount > 0 && <span style={{ background: 'rgba(52,152,219,0.1)', color: '#3498db', padding: '4px 8px', borderRadius: '5px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}><FaFilePdf /> {lesson.pdfsCount}</span>}
                                                    {lesson.referencesCount > 0 && <span style={{ background: 'rgba(46,204,113,0.1)', color: '#2ecc71', padding: '4px 8px', borderRadius: '5px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}><FaLink /> {lesson.referencesCount}</span>}
                                                    {lesson.videosCount === 0 && lesson.pdfsCount === 0 && lesson.referencesCount === 0 && <span style={{color: 'var(--txt-mut)'}}>فارغ</span>}
                                                </div>
                                            </td>
                                            <td style={{ padding: '15px', color: 'var(--txt-mut)' }}>{lesson.createdAt?.substring(0, 10)}</td>
                                            <td style={{ padding: '15px' }}>
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <button onClick={() => router.push(`/teacher/homework-lessons/${lesson.id}`)} style={{ background: 'rgba(26,188,156,0.1)', color: '#1abc9c', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                        <FaEdit /> تعديل
                                                    </button>
                                                    <button onClick={() => handleDelete(lesson.id)} style={{ background: 'rgba(231,76,60,0.1)', color: 'var(--danger)', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                        <FaTrash /> مسح
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--txt-mut)' }}>لا توجد حصص واجب مسجلة ضمن هذا التصنيف.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 🚀 أزرار التقليب (Pagination) */}
                {totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginTop: '20px', padding: '15px', background: 'rgba(0,0,0,0.2)', borderRadius: '15px' }}>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            disabled={currentPage === 1} 
                            onClick={() => setCurrentPage(p => p - 1)}
                            style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                        >
                            <FaChevronRight /> السابق
                        </Button>
                        <span style={{ color: 'white', fontWeight: 'bold' }}>صفحة {currentPage} من {totalPages}</span>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            disabled={currentPage === totalPages} 
                            onClick={() => setCurrentPage(p => p + 1)}
                            style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                        >
                            التالي <FaChevronLeft />
                        </Button>
                    </div>
                )}
            </div>

            <CreateHomeworkLessonModal 
                isOpen={isCreateModalOpen} 
                onClose={() => {
                    setIsCreateModalOpen(false);
                    fetchLessons(); // تحديث الجدول لو أضاف حصة جديدة وقفل النافذة
                }} 
            />
        </div>
    );
}