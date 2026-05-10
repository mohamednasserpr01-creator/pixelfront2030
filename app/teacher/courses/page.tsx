"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
    FaBook, FaPlus, FaSearch, FaGraduationCap, 
    FaFolderOpen, FaUsers, FaMoneyBillWave, FaEdit 
} from 'react-icons/fa';
import { Button } from '@/components/ui/Button';
import { CreateCourseModal } from '@/features/course-builder/components/CreateCourseModal';

const STAGES = [
    { id: 'all', name: 'جميع المراحل' },
    { id: 'prep3', name: 'الصف الثالث الإعدادي' },
    { id: 'sec1', name: 'الصف الأول الثانوي' },
    { id: 'sec2', name: 'الصف الثاني الثانوي' },
    { id: 'sec3', name: 'الصف الثالث الثانوي' },
];

const mockCourses = [
    { id: '1', title: 'الفيزياء الحديثة', stageId: 'sec3', stageName: 'الصف الثالث الثانوي', stream: 'علمي', status: 'published', studentsCount: 1250, revenue: '187,500', date: '2026-04-05' },
    { id: '2', title: 'المراجعة النهائية - عضوية', stageId: 'sec3', stageName: 'الصف الثالث الثانوي', stream: 'علمي علوم', status: 'draft', studentsCount: 0, revenue: '0', date: '2026-04-10' },
    { id: '3', title: 'أساسيات الرياضيات', stageId: 'sec1', stageName: 'الصف الأول الثانوي', stream: 'عام', status: 'published', studentsCount: 430, revenue: '43,000', date: '2026-03-15' }
];

export default function TeacherCoursesPage() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [activeStage, setActiveStage] = useState('all');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const filteredCourses = mockCourses.filter(c => {
        const matchesSearch = c.title.includes(search);
        const matchesStage = activeStage === 'all' || c.stageId === activeStage;
        return matchesSearch && matchesStage;
    });

    return (
        <div style={{ animation: 'fadeIn 0.5s ease', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            
            {/* 🚀 Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', color: 'var(--txt)', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 5px 0' }}>
                        <FaBook style={{ color: 'var(--p-purple)' }} /> إدارة الكورسات الشاملة
                    </h1>
                    <p style={{ color: 'var(--txt-mut)', margin: 0 }}>قم بتنظيم كورساتك حسب المرحلة والشعبة لتسهيل الإدارة.</p>
                </div>
                <Button variant="primary" icon={<FaPlus />} onClick={() => setIsCreateModalOpen(true)}>
                    إضافة كورس جديد
                </Button>
            </div>

            <div style={{ background: 'var(--card)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                
                {/* 🚀 Filters */}
                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '15px', marginBottom: '20px', borderBottom: '1px dashed rgba(255,255,255,0.1)' }}>
                    {STAGES.map(stage => (
                        <button 
                            key={stage.id}
                            onClick={() => setActiveStage(stage.id)}
                            style={{
                                padding: '10px 20px', borderRadius: '30px', whiteSpace: 'nowrap', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: '0.3s',
                                border: activeStage === stage.id ? 'none' : '1px solid rgba(255,255,255,0.1)',
                                background: activeStage === stage.id ? 'var(--p-purple)' : 'transparent',
                                color: activeStage === stage.id ? 'white' : 'var(--txt-mut)',
                                boxShadow: activeStage === stage.id ? '0 4px 15px rgba(108,92,231,0.3)' : 'none'
                            }}
                        >
                            <FaGraduationCap /> {stage.name}
                        </button>
                    ))}
                </div>

                {/* 🚀 Search */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', background: 'rgba(0,0,0,0.2)', padding: '12px 15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <FaSearch style={{ color: 'var(--txt-mut)' }} />
                    <input 
                        type="text" 
                        placeholder="ابحث باسم الكورس..." 
                        value={search} 
                        onChange={e => setSearch(e.target.value)} 
                        style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }} 
                    />
                </div>

                {/* 🚀 Table */}
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', textAlign: 'right', borderCollapse: 'collapse', minWidth: '900px' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--txt-mut)' }}>
                                <th style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>معلومات الكورس</th>
                                <th style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>المرحلة والشعبة</th>
                                <th style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>إحصائيات</th>
                                <th style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>إدارة</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCourses.length > 0 ? filteredCourses.map(course => (
                                <tr key={course.id} style={{ borderBottom: '1px dashed rgba(255,255,255,0.05)', transition: '0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                                            <div style={{ fontWeight: 'bold', color: 'var(--txt)', fontSize: '1.1rem' }}>{course.title}</div>
                                            {course.status === 'published' ? (
                                                <span style={{ background: 'rgba(46,204,113,0.1)', color: 'var(--success)', padding: '2px 8px', borderRadius: '5px', fontSize: '0.75rem', fontWeight: 'bold' }}>منشور</span>
                                            ) : (
                                                <span style={{ background: 'rgba(241,196,15,0.1)', color: 'var(--warning)', padding: '2px 8px', borderRadius: '5px', fontSize: '0.75rem', fontWeight: 'bold' }}>مسودة</span>
                                            )}
                                        </div>
                                        <div style={{ color: 'var(--txt-mut)', fontSize: '0.85rem' }}>تم الإنشاء: {course.date}</div>
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'flex-start' }}>
                                            <span style={{ background: 'rgba(108,92,231,0.1)', color: 'var(--p-purple)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                                {course.stageName}
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--txt-mut)', fontSize: '0.9rem' }}>
                                                <FaFolderOpen style={{ color: '#f39c12' }} /> شعبة: {course.stream}
                                            </span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '15px', color: 'var(--txt-mut)', fontSize: '0.9rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FaUsers color="#3498db" /> {course.studentsCount} طالب</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FaMoneyBillWave color="#2ecc71" /> {course.revenue} ج.م</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '15px', textAlign: 'center' }}>
                                        <Button variant="outline" size="sm" onClick={() => router.push(`/teacher/courses/${course.id}`)} icon={<FaEdit />}>
                                            إدارة الكورس والمحتوى
                                        </Button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: 'var(--txt-mut)' }}>لا توجد كورسات مطابقة لهذا التصنيف.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <CreateCourseModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
        </div>
    );
}