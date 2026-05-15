"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
    FaBook, FaPlus, FaSearch, FaGraduationCap, 
    FaFolderOpen, FaUsers, FaMoneyBillWave, FaEdit 
} from 'react-icons/fa';
import { Button } from '@/components/ui/Button';
import { CreateCourseModal } from './components/CreateCourseModal';
import { useToast } from '@/context/ToastContext';

const API_BASE_URL = 'http://localhost:5000/api';

// دالة لترجمة المستويات לעربي في الجدول
const getLevelNameInArabic = (level: string) => {
    switch(level) {
        case 'Beginner': return 'الابتدائية / الإعدادية';
        case 'Intermediate': return 'الأول / الثاني الثانوي';
        case 'Advanced': return 'الثالث الثانوي';
        default: return 'عام';
    }
};

export default function TeacherCoursesPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [search, setSearch] = useState('');
    const [activeStage, setActiveStage] = useState('all');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // حالات الداتا
    const [courses, setCourses] = useState<any[]>([]);
    const [stages, setStages] = useState<any[]>([{ id: 'all', name: 'جميع المراحل' }]); // الديفولت
    const [isLoading, setIsLoading] = useState(true);

    // 🚀 جلب المراحل الحقيقية لزرار الفلاتر
    const fetchStages = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/educational-stages`);
            if (response.ok) {
                const data = await response.json();
                let extracted = [];
                if (Array.isArray(data)) extracted = data;
                else if (data?.data) extracted = data.data;
                else if (data?.items) extracted = data.items;
                else if (data?.result) extracted = data.result;

                const formattedStages = extracted.map((s: any) => ({
                    id: s.name || s.title, // هنستخدم الاسم كـ ID للفلترة
                    name: s.name || s.title
                }));
                
                setStages([{ id: 'all', name: 'جميع المراحل' }, ...formattedStages]);
            }
        } catch (error) {
            console.error("Error fetching stages", error);
        }
    };

    // 🚀 دالة جلب الكورسات (محدثة بصايد الأخطاء)
    const fetchCourses = async () => {
        setIsLoading(true);
        try {
            // 💡 بنجيب التوكن 
            const token = localStorage.getItem('accessToken') || localStorage.getItem('token'); 
            
            // لو مفيش توكن أصلاً
            if (!token) {
                showToast('أنت غير مسجل الدخول (لا يوجد Token)', 'error');
                setIsLoading(false);
                return;
            }

            const response = await fetch(`${API_BASE_URL}/courses/my-courses?pageNumber=1&pageSize=100`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                const result = await response.json();
                setCourses(result.data || []);
            } else {
                // 🚀 صايد الأخطاء الاحترافي
                if (response.status === 401) {
                    showToast('غير مصرح لك (401) - التوكن غير صالح أو منتهي، سجل دخول تاني', 'error');
                } else if (response.status === 403) {
                    showToast('مرفوض (403) - حسابك ليس له صلاحية "مدرس" أو "أدمن"', 'error');
                } else {
                    showToast(`خطأ من السيرفر كود: ${response.status}`, 'error');
                }
            }
        } catch (error) {
            showToast('خطأ في الاتصال بالخادم', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStages();
        fetchCourses();
    }, []);

    // 🚀 فلترة الكورسات بناءً على الكلمة اللي محطوطة في الـ Category
    const filteredCourses = courses.filter(c => {
        const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase());
        // بما إننا خزنّا اسم المرحلة في الـ Category، هنفلتر بناءً عليه
        const matchesStage = activeStage === 'all' || (c.category && c.category.includes(activeStage));
        return matchesSearch && matchesStage;
    });

    return (
        <div style={{ animation: 'fadeIn 0.5s ease', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            
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
                
                {/* 🚀 فلاتر المراحل الحقيقية */}
                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '15px', marginBottom: '20px', borderBottom: '1px dashed rgba(255,255,255,0.1)' }}>
                    {stages.map(stage => (
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
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: 'var(--p-purple)' }}>جاري تحميل الكورسات... ⏳</td>
                                </tr>
                            ) : filteredCourses.length > 0 ? filteredCourses.map(course => {
                                // 💡 بنفصل اسم الصف عن الشعبة عشان نعرضهم بشكل شيك
                                const categoryParts = course.category ? course.category.split(' | ') : ['غير محدد', 'عام'];
                                const displayStage = categoryParts[0] || 'غير محدد';
                                const displayStream = categoryParts[1] || 'عام';

                                return (
                                    <tr key={course.id} style={{ borderBottom: '1px dashed rgba(255,255,255,0.05)', transition: '0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                                        <td style={{ padding: '15px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                                                <div style={{ fontWeight: 'bold', color: 'var(--txt)', fontSize: '1.1rem' }}>{course.title}</div>
                                                {course.status === 'Published' ? (
                                                    <span style={{ background: 'rgba(46,204,113,0.1)', color: 'var(--success)', padding: '2px 8px', borderRadius: '5px', fontSize: '0.75rem', fontWeight: 'bold' }}>منشور</span>
                                                ) : (
                                                    <span style={{ background: 'rgba(241,196,15,0.1)', color: 'var(--warning)', padding: '2px 8px', borderRadius: '5px', fontSize: '0.75rem', fontWeight: 'bold' }}>مسودة</span>
                                                )}
                                            </div>
                                            <div style={{ color: 'var(--txt-mut)', fontSize: '0.85rem' }}>تم الإنشاء: {new Date(course.createdAt).toLocaleDateString('ar-EG')}</div>
                                        </td>
                                        <td style={{ padding: '15px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'flex-start' }}>
                                                <span style={{ background: 'rgba(108,92,231,0.1)', color: 'var(--p-purple)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                                    {displayStage}
                                                </span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--txt-mut)', fontSize: '0.9rem' }}>
                                                    <FaFolderOpen style={{ color: '#f39c12' }} /> قسم: {displayStream}
                                                </span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '15px', color: 'var(--txt-mut)', fontSize: '0.9rem' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FaUsers color="#3498db" /> {course.enrollmentCount || 0} طالب</span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FaMoneyBillWave color="#2ecc71" /> {course.price ? course.price.toLocaleString('ar-EG') : '0'} ج.م</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '15px', textAlign: 'center' }}>
                                            <Button variant="outline" size="sm" onClick={() => router.push(`/teacher/courses/${course.id}`)} icon={<FaEdit />}>
                                                إدارة الكورس والمحتوى
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: 'var(--txt-mut)' }}>لا توجد كورسات مطابقة. ابدأ بإنشاء كورس جديد!</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <CreateCourseModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
                onSuccess={fetchCourses} 
            />
        </div>
    );
}