"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaPlus, FaSearch, FaBook, FaEdit, FaTrash } from 'react-icons/fa';
import { Button } from '@/components/ui/Button';

// 💡 استدعاء الـ Modal اللي لسه عاملينه
import CreateHomeworkLessonModal from '@/features/teacherHomeworkLessons/components/CreateHomeworkLessonModal';

export default function HomeworkLessonsPage() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // 💡 State لفتح وقفل الـ Modal

    const mockHomeworkLessons = [
        { id: '1', title: 'حل واجب الباب الأول: الكهربية', stage: 'الصف الثالث الثانوي', date: '2026-04-20', videosCount: 2, pdfsCount: 1 },
        { id: '2', title: 'إجابات نموذجية: الباب الثاني', stage: 'الصف الثاني الثانوي', date: '2026-04-21', videosCount: 1, pdfsCount: 2 },
    ];

    return (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', color: 'var(--txt)', fontWeight: 900, margin: '0 0 5px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaBook style={{ color: '#1abc9c' }} /> إدارة حصص الواجبات
                    </h1>
                    <p style={{ color: 'var(--txt-mut)', margin: 0, fontSize: '0.9rem' }}>أضف فيديوهات ومذكرات حل الواجبات لتكون جاهزة للربط بالكورسات.</p>
                </div>
                {/* 💡 الزرار بقى بيفتح الـ Modal */}
                <Button variant="primary" icon={<FaPlus />} onClick={() => setIsCreateModalOpen(true)} style={{ background: '#1abc9c', color: '#fff' }}>
                    إضافة حصة حل واجب
                </Button>
            </div>

            <div style={{ background: 'var(--card)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ marginBottom: '20px', display: 'flex', gap: '15px' }}>
                    <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                        <FaSearch style={{ position: 'absolute', right: '15px', top: '15px', color: 'var(--txt-mut)' }} />
                        <input 
                            type="text" 
                            placeholder="ابحث عن حصة واجب..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
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
                                <th style={{ padding: '15px', color: 'var(--txt-mut)', fontWeight: 'bold' }}>المحتوى</th>
                                <th style={{ padding: '15px', color: 'var(--txt-mut)', fontWeight: 'bold' }}>تاريخ الإنشاء</th>
                                <th style={{ padding: '15px', color: 'var(--txt-mut)', fontWeight: 'bold' }}>إجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockHomeworkLessons.map((lesson) => (
                                <tr key={lesson.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', transition: '0.2s' }}>
                                    <td style={{ padding: '15px', color: 'white', fontWeight: 'bold' }}>{lesson.title}</td>
                                    <td style={{ padding: '15px', color: 'var(--txt-mut)' }}>{lesson.stage}</td>
                                    <td style={{ padding: '15px', color: 'var(--txt-mut)' }}>
                                        <span style={{ background: 'rgba(231,76,60,0.1)', color: '#e74c3c', padding: '4px 8px', borderRadius: '5px', fontSize: '0.8rem', marginLeft: '5px' }}>{lesson.videosCount} فيديو</span>
                                        <span style={{ background: 'rgba(26,188,156,0.1)', color: '#1abc9c', padding: '4px 8px', borderRadius: '5px', fontSize: '0.8rem' }}>{lesson.pdfsCount} ملف</span>
                                    </td>
                                    <td style={{ padding: '15px', color: 'var(--txt-mut)' }}>{lesson.date}</td>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button onClick={() => router.push(`/teacher/homework-lessons/${lesson.id}`)} style={{ background: 'rgba(52,152,219,0.1)', color: '#3498db', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}><FaEdit /> تعديل</button>
                                            <button style={{ background: 'rgba(231,76,60,0.1)', color: 'var(--danger)', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}><FaTrash /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 💡 الـ Component بتاعنا اللي بيظهر لما بندوس إضافة */}
            <CreateHomeworkLessonModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
            />
        </div>
    );
}