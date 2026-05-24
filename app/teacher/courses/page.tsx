"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaBook, FaPlus, FaSearch, FaGraduationCap, FaFolderOpen, FaUsers, FaMoneyBillWave, FaEdit } from 'react-icons/fa';
import { Button } from '@/components/ui/Button';
import { CreateCourseModal } from './components/CreateCourseModal';
import { useToast } from '@/context/ToastContext';
import { courseService } from '@/features/teacherCourses/services/courseService';

const CORE_API_URL = 'http://localhost:5290/api';

export default function TeacherCoursesPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [search, setSearch] = useState('');
    const [activeStage, setActiveStage] = useState('all');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const [courses, setCourses] = useState<any[]>([]);
    const [stages, setStages] = useState<any[]>([{ id: 'all', name: 'جميع المراحل' }]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchStages = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`${CORE_API_URL}/educational-stages`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (response.ok) {
                const data = await response.json();
                const extracted = data.data || data.items || data || [];
                const formattedStages = extracted.map((s: any) => ({ id: s.name, name: s.name }));
                setStages([{ id: 'all', name: 'جميع المراحل' }, ...formattedStages]);
            }
        } catch (error) { console.error("Error fetching stages", error); }
    };

    const fetchCourses = async () => {
        setIsLoading(true);
        try {
            const data = await courseService.getAll();
            setCourses(data);
        } catch (error) {
            showToast('خطأ في الاتصال بالخادم لجلب الكورسات', 'error');
        } finally { setIsLoading(false); }
    };

    useEffect(() => { fetchStages(); fetchCourses(); }, []);

    const filteredCourses = courses.filter(c => {
        const matchesSearch = c.title?.toLowerCase().includes(search.toLowerCase());
        const matchesStage = activeStage === 'all' || (c.category && c.category.includes(activeStage));
        return matchesSearch && matchesStage;
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '100vw', boxSizing: 'border-box', overflowX: 'hidden', padding: '10px', animation: 'fadeIn 0.5s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px', width: '100%' }}>
                <div style={{ flex: '1 1 100%' }}>
                    <h1 style={{ fontSize: '1.4rem', color: 'var(--txt)', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
                        <FaBook style={{ color: 'var(--p-purple)' }} /> إدارة الكورسات
                    </h1>
                </div>
                <div style={{ flex: '1 1 100%' }}>
                    <Button variant="primary" icon={<FaPlus />} onClick={() => setIsCreateModalOpen(true)} style={{ width: '100%', justifyContent: 'center' }}>
                        إضافة كورس جديد
                    </Button>
                </div>
            </div>

            <div style={{ background: 'var(--card)', padding: '15px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', width: '100%', boxSizing: 'border-box' }}>
                {stages.length > 0 && (
                    <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '15px', borderBottom: '1px dashed rgba(255,255,255,0.1)', WebkitOverflowScrolling: 'touch', width: '100%' }}>
                        {stages.map(stage => (
                            <button key={stage.id} onClick={() => setActiveStage(stage.id)}
                                style={{
                                    padding: '8px 15px', borderRadius: '30px', whiteSpace: 'nowrap', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', flexShrink: 0,
                                    border: activeStage === stage.id ? 'none' : '1px solid rgba(255,255,255,0.1)',
                                    background: activeStage === stage.id ? 'var(--p-purple)' : 'transparent',
                                    color: activeStage === stage.id ? 'white' : 'var(--txt-mut)'
                                }}>
                                <FaGraduationCap /> {stage.name}
                            </button>
                        ))}
                    </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', background: 'rgba(0,0,0,0.2)', padding: '10px 15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)', width: '100%', boxSizing: 'border-box' }}>
                    <FaSearch style={{ color: 'var(--txt-mut)', flexShrink: 0 }} />
                    <input type="text" placeholder="ابحث باسم الكورس..." value={search} onChange={e => setSearch(e.target.value)} style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }} />
                </div>

                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '30px', color: 'var(--p-purple)' }}>جاري تحميل الكورسات... ⏳</div>
                ) : (
                    <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: '5px' }}>
                        <table style={{ width: '100%', minWidth: '700px', textAlign: 'right', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--txt-mut)' }}>
                                    <th style={{ padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>الكورس</th>
                                    <th style={{ padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>المرحلة</th>
                                    <th style={{ padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>إحصائيات</th>
                                    <th style={{ padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>إدارة</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCourses.length > 0 ? filteredCourses.map(course => {
                                    const categoryParts = course.category ? course.category.split(' | ') : ['غير محدد', 'عام'];
                                    return (
                                        <tr key={course.id} style={{ borderBottom: '1px dashed rgba(255,255,255,0.05)' }}>
                                            <td style={{ padding: '12px', whiteSpace: 'nowrap' }}>
                                                <div style={{ fontWeight: 'bold', color: 'white' }}>{course.title}</div>
                                                <span style={{ background: course.status === 'Published' ? 'rgba(46,204,113,0.1)' : 'rgba(241,196,15,0.1)', color: course.status === 'Published' ? 'var(--success)' : 'var(--warning)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                                                    {course.status === 'Published' ? 'منشور' : 'مسودة'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px', whiteSpace: 'nowrap' }}>
                                                <span style={{ background: 'rgba(108,92,231,0.1)', color: 'var(--p-purple)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>{categoryParts[0]}</span>
                                            </td>
                                            <td style={{ padding: '12px', whiteSpace: 'nowrap', fontSize: '0.8rem' }}>
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <span><FaUsers color="#3498db" /> {course.enrollmentCount}</span>
                                                    <span><FaMoneyBillWave color="#2ecc71" /> {course.price} ج</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '12px', textAlign: 'center' }}>
                                                <button onClick={() => router.push(`/teacher/courses/${course.id}`)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold', margin: '0 auto' }}>
                                                    <FaEdit /> إدارة
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                }) : <tr><td colSpan={4} style={{ textAlign: 'center', padding: '30px', color: 'var(--txt-mut)' }}>لا توجد كورسات مطابقة.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <CreateCourseModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSuccess={fetchCourses} />
        </div>
    );
}