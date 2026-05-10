"use client";
import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaSearch, FaFolderOpen, FaChalkboardTeacher, FaFilter, FaUserTie, FaTag } from 'react-icons/fa';

import { useSettings } from '../../context/SettingsContext';
import { useDebounce } from '../../hooks/useDebounce'; // 💡 استدعاء الديباونس
import { Button } from '../../components/ui/Button';
// import { coursesData } from '../../data/courses'; // لو الداتا بتيجي من بره

// ==========================================
// 💡 1. TYPE DEFINITIONS (Strict Typing بدل any)
// ==========================================
export interface Course {
    id: string | number;
    titleAr: string;
    titleEn: string;
    descAr: string;
    descEn: string;
    img: string;
    subject: string;
    teacherId: string; // 💡 تم إضافة المدرس
    price: number;     // 💡 تم إضافة السعر
}

// 💡 2. MOCK DATA (عدلتها عشان يكون فيها سعر ومدرس)
const coursesData: Course[] = [
    { id: 1, titleAr: 'فيزياء ميكانيكا', titleEn: 'Mechanics Physics', descAr: 'شرح كامل للميكانيكا', descEn: 'Full mechanics explanation', img: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400', subject: 'physics', teacherId: 't1', price: 250 },
    { id: 2, titleAr: 'جبر وتفاضل', titleEn: 'Algebra & Calculus', descAr: 'كورس الرياضيات البحتة', descEn: 'Pure math course', img: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=400', subject: 'math', teacherId: 't2', price: 200 },
    { id: 3, titleAr: 'كيمياء عضوية', titleEn: 'Organic Chemistry', descAr: 'أساسيات الكيمياء العضوية', descEn: 'Organic chemistry basics', img: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400', subject: 'chemistry', teacherId: 't3', price: 300 },
    { id: 4, titleAr: 'فيزياء كهربائية', titleEn: 'Electrical Physics', descAr: 'شرح الكهربية بالكامل', descEn: 'Electrical physics full course', img: 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=400', subject: 'physics', teacherId: 't1', price: 280 },
];

const subjects = [
    { id: 'all', nameAr: 'كل المواد', nameEn: 'All Subjects' },
    { id: 'physics', nameAr: 'الفيزياء', nameEn: 'Physics' },
    { id: 'math', nameAr: 'الرياضيات', nameEn: 'Mathematics' },
    { id: 'chemistry', nameAr: 'الكيمياء', nameEn: 'Chemistry' }
];

const teachers = [
    { id: 'all', nameAr: 'كل المدرسين', nameEn: 'All Teachers', subjectId: 'all' },
    { id: 't1', nameAr: 'د. مصطفى كمال', nameEn: 'Dr. Mostafa Kamal', subjectId: 'physics' },
    { id: 't2', nameAr: 'م. سارة جمال', nameEn: 'Eng. Sarah Gamal', subjectId: 'math' },
    { id: 't3', nameAr: 'أ. خالد حسن', nameEn: 'Mr. Khaled Hassan', subjectId: 'chemistry' }
];

export default function CoursesListPage() {
    const { lang } = useSettings();
    const isAr = lang === 'ar';

    // States
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('all');
    const [selectedTeacher, setSelectedTeacher] = useState('all');

    // 💡 3. استخدام Debounce للبحث (عشان ميعملش ريندر مع كل حرف)
    const debouncedSearch = useDebounce(searchQuery, 300);

    // تصفير المدرس لما الطالب يغير المادة
    useEffect(() => {
        setSelectedTeacher('all');
    }, [selectedSubject]);

    // المدرسين المتاحين بناءً على المادة المختارة
    const availableTeachers = useMemo(() => {
        return teachers.filter(t => t.id === 'all' || selectedSubject === 'all' || t.subjectId === selectedSubject);
    }, [selectedSubject]);

    // 💡 4. استخدام useMemo للفلترة (عشان Performance عالي جداً)
    const filteredCourses = useMemo(() => {
        return coursesData.filter((c: Course) => {
            const matchesSearch = (isAr ? c.titleAr : c.titleEn).toLowerCase().includes(debouncedSearch.toLowerCase());
            const matchesSubject = selectedSubject === 'all' || c.subject === selectedSubject;
            const matchesTeacher = selectedTeacher === 'all' || c.teacherId === selectedTeacher;
            
            return matchesSearch && matchesSubject && matchesTeacher;
        });
    }, [debouncedSearch, selectedSubject, selectedTeacher, isAr]);

    return (
        <main className="page-wrapper" style={{ paddingBottom: '80px' }}>
            
            {/* 💡 5. Clean CSS (لا للـ Inline Styles ولا للـ JS Hover) */}
            <style>{`
                .store-header h1 { color: var(--p-purple); font-size: clamp(2rem, 4vw, 3rem); font-weight: 900; margin-bottom: 25px; }
                
                .controls-wrapper { max-width: 900px; margin: 0 auto 40px; display: flex; gap: 15px; flex-wrap: wrap; align-items: center; justify-content: center; }
                
                .input-group { position: relative; flex: 2; min-width: 280px; }
                .input-control { width: 100%; height: 55px; padding: 0 50px 0 25px; border-radius: 50px; border: 2px solid rgba(108,92,231,0.2); background: var(--card); color: var(--txt); font-size: 1.05rem; outline: none; transition: 0.3s; font-weight: bold; box-shadow: 0 5px 20px rgba(0,0,0,0.05); appearance: none; }
                html[dir="ltr"] .input-control { padding: 0 25px 0 50px; }
                .input-control:focus { border-color: var(--p-purple); box-shadow: 0 5px 25px rgba(108,92,231,0.2); }
                .input-icon { position: absolute; right: 20px; top: 50%; transform: translateY(-50%); color: var(--p-purple); font-size: 1.2rem; pointer-events: none; }
                html[dir="ltr"] .input-icon { right: auto; left: 20px; }

                select.input-control { cursor: pointer; flex: 1; min-width: 200px; }

                /* الكروت 4 في الشاشة */
                .courses-grid { display: grid; grid-template-columns: repeat(1, 1fr); gap: 20px; max-width: 1300px; margin: 0 auto; padding: 0 20px; }
                @media (min-width: 600px) { .courses-grid { grid-template-columns: repeat(2, 1fr); } }
                @media (min-width: 900px) { .courses-grid { grid-template-columns: repeat(3, 1fr); } }
                @media (min-width: 1200px) { .courses-grid { grid-template-columns: repeat(4, 1fr); } }

                .course-card { background: rgba(30, 30, 45, 0.5); border-radius: 15px; border: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; overflow: hidden; transition: all 0.3s ease; box-shadow: 0 5px 15px rgba(0,0,0,0.1); position: relative; }
                /* 💡 Pure CSS Hover بديل الـ onMouseOver */
                .course-card:hover { transform: translateY(-8px); border-color: var(--p-purple); box-shadow: 0 15px 35px rgba(108,92,231,0.2); }

                /* 💡 Next/Image Wrapper */
                .c-img-wrapper { position: relative; width: 100%; height: 180px; background: var(--bg); overflow: hidden; }
                
                .price-badge { position: absolute; top: 15px; left: 15px; background: var(--p-purple); color: white; padding: 5px 15px; border-radius: 50px; font-weight: 900; font-size: 0.95rem; z-index: 10; display: flex; align-items: center; gap: 5px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); }
                html[dir="ltr"] .price-badge { left: auto; right: 15px; }

                .c-content { padding: 20px; display: flex; flex-direction: column; flex: 1; text-align: right; }
                html[dir="ltr"] .c-content { text-align: left; }
                .c-content h3 { font-size: 1.25rem; margin-bottom: 8px; color: var(--txt); font-weight: 900; }
                .c-content p { font-size: 0.9rem; color: var(--txt-mut); margin-bottom: 20px; font-weight: bold; line-height: 1.6; flex-grow: 1; }

                @media (max-width: 768px) {
                    .controls-wrapper { flex-direction: column; padding: 0 20px; }
                    .input-group, select.input-control { width: 100%; flex: unset; }
                }
            `}</style>

            <div className="store-header" style={{ textAlign: 'center', marginTop: '20px' }}>
                <h1>{isAr ? 'تصفح الكورسات المتاحة 📚' : 'Browse Available Courses 📚'}</h1>
                
                <div className="controls-wrapper">
                    {/* مربع البحث */}
                    <div className="input-group">
                        <input 
                            type="text" 
                            className="input-control"
                            placeholder={isAr ? "ابحث عن كورس..." : "Search for a course..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <FaSearch className="input-icon" />
                    </div>
                    
                    {/* فلتر المادة */}
                    <div className="input-group" style={{ flex: 1 }}>
                        <select 
                            className="input-control"
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                        >
                            {subjects.map(sub => (
                                <option key={sub.id} value={sub.id} style={{ background: 'var(--bg)', color: 'var(--txt)' }}>
                                    {isAr ? sub.nameAr : sub.nameEn}
                                </option>
                            ))}
                        </select>
                        <FaFilter className="input-icon" />
                    </div>

                    {/* فلتر المدرس (الجديد) */}
                    <div className="input-group" style={{ flex: 1 }}>
                        <select 
                            className="input-control"
                            value={selectedTeacher}
                            onChange={(e) => setSelectedTeacher(e.target.value)}
                            disabled={availableTeachers.length <= 1} // لو مفيش غير 'الكل' اقفله
                        >
                            {availableTeachers.map(t => (
                                <option key={t.id} value={t.id} style={{ background: 'var(--bg)', color: 'var(--txt)' }}>
                                    {isAr ? t.nameAr : t.nameEn}
                                </option>
                            ))}
                        </select>
                        <FaUserTie className="input-icon" />
                    </div>
                </div>
            </div>

            {filteredCourses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--card)', borderRadius: '20px', border: '2px dashed rgba(108,92,231,0.2)', maxWidth: '800px', margin: '0 auto' }}>
                    <FaFolderOpen style={{ fontSize: '4rem', color: 'var(--p-purple)', marginBottom: '20px', opacity: 0.8 }} />
                    <h2 style={{ color: 'var(--txt)' }}>{isAr ? 'لا توجد كورسات مطابقة لبحثك' : 'No courses match your criteria'}</h2>
                </div>
            ) : (
                <div className="courses-grid">
                    {filteredCourses.map(course => (
                        <div key={course.id} className="course-card">
                            
                            {/* 💡 6. استخدام next/image بدل img */}
                            <div className="c-img-wrapper">
                                <Image 
                                    src={course.img} 
                                    alt={course.titleEn} 
                                    fill 
                                    style={{ objectFit: 'cover' }} 
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                />
                                {/* 💡 شريط السعر الجديد */}
                                <div className="price-badge">
                                    <FaTag size={12} />
                                    {course.price} {isAr ? 'ج.م' : 'EGP'}
                                </div>
                            </div>
                            
                            <div className="c-content">
                                <h3>{isAr ? course.titleAr : course.titleEn}</h3>
                                <p>{isAr ? course.descAr : course.descEn}</p>
                                
                                <Link href={`/courses/${course.id}`} style={{ display: 'block', width: '100%', marginTop: 'auto' }}>
                                    <Button fullWidth icon={<FaChalkboardTeacher />}>
                                        {isAr ? 'التفاصيل والاشتراك' : 'Details & Subscribe'}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}