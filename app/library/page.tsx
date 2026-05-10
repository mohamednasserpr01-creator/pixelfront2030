"use client";
import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';

import { 
    FaGraduationCap, FaBook, FaChalkboardTeacher, 
    FaFilePdf, FaUserEdit, FaHdd, FaDownload, FaFolderOpen 
} from 'react-icons/fa';

import { libraryDB } from '../../data/libraryData';

export default function LibraryPage() {
    const { lang } = useSettings();

    // States للفلترة
    const [stageFilter, setStageFilter] = useState('all');
    const [subjectFilter, setSubjectFilter] = useState('all');
    const [teacherFilter, setTeacherFilter] = useState('all');
    
    // Toast State
    const [toastMsg, setToastMsg] = useState<string | null>(null);

    // دالة محاكاة التحميل
    const handleDownload = (title: string) => {
        setToastMsg(lang === 'ar' ? `جاري تحضير ملف: ${title}...` : `Preparing file: ${title}...`);
        setTimeout(() => setToastMsg(null), 3000);
    };

    // فلترة الداتا بناءً على الاختيارات الحالية
    const filteredFiles = libraryDB.filter(file => {
        const matchStage = stageFilter === 'all' || file.stage === stageFilter;
        const matchSubject = subjectFilter === 'all' || file.subject === subjectFilter;
        const matchTeacher = teacherFilter === 'all' || file.teacher === teacherFilter;
        return matchStage && matchSubject && matchTeacher;
    });

    return (
        <main className="page-wrapper">

            {/* ======== HERO SECTION ======== */}
            <div className="library-hero" style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ color: 'var(--p-purple)', fontSize: '2.5rem', marginBottom: '15px' }}>
                    {lang === 'ar' ? 'مكتبة بيكسل 📚' : 'Pixel Library 📚'}
                </h1>
                <p style={{ color: 'var(--txt-mut)', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
                    {lang === 'ar' ? 'أكبر مستودع مجاني لمذكرات الشرح، المراجعات النهائية، والكتب الخارجية. حمل اللي تحتاجه بضغطة زر.' : 'The largest free repository for study notes, final reviews, and external books. Download what you need with one click.'}
                </p>
            </div>

            {/* ======== FILTERS ======== */}
            <section className="filters-section" style={{ marginBottom: '50px', display: 'flex', justifyContent: 'center' }}>
                <div className="filters-wrapper" style={{ background: 'var(--card)', padding: '25px', borderRadius: '20px', border: '1px solid rgba(108,92,231,0.1)', width: '100%', maxWidth: '1000px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                    
                    <div className="filters-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '25px' }}>
                        
                        <div className="filter-group" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <label style={{ fontWeight: 'bold', color: 'var(--txt)' }}><FaGraduationCap style={{ margin: '0 5px', color: 'var(--p-purple)' }}/> {lang === 'ar' ? 'المرحلة التعليمية' : 'Educational Stage'}</label>
                            <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)} style={{ padding: '12px 15px', borderRadius: '10px', border: '2px solid var(--h-bg)', background: 'var(--bg)', color: 'var(--txt)', outline: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                                <option value="all">{lang === 'ar' ? 'جميع المراحل' : 'All Stages'}</option>
                                <option value="sec3">{lang === 'ar' ? 'الصف الثالث الثانوي' : 'Grade 12'}</option>
                                <option value="sec2">{lang === 'ar' ? 'الصف الثاني الثانوي' : 'Grade 11'}</option>
                                <option value="sec1">{lang === 'ar' ? 'الصف الأول الثانوي' : 'Grade 10'}</option>
                            </select>
                        </div>

                        <div className="filter-group" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <label style={{ fontWeight: 'bold', color: 'var(--txt)' }}><FaBook style={{ margin: '0 5px', color: 'var(--p-purple)' }}/> {lang === 'ar' ? 'المادة' : 'Subject'}</label>
                            <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} style={{ padding: '12px 15px', borderRadius: '10px', border: '2px solid var(--h-bg)', background: 'var(--bg)', color: 'var(--txt)', outline: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                                <option value="all">{lang === 'ar' ? 'جميع المواد' : 'All Subjects'}</option>
                                <option value="physics">{lang === 'ar' ? 'فيزياء' : 'Physics'}</option>
                                <option value="chemistry">{lang === 'ar' ? 'كيمياء' : 'Chemistry'}</option>
                                <option value="arabic">{lang === 'ar' ? 'لغة عربية' : 'Arabic'}</option>
                                <option value="math">{lang === 'ar' ? 'رياضيات' : 'Math'}</option>
                            </select>
                        </div>

                        <div className="filter-group" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <label style={{ fontWeight: 'bold', color: 'var(--txt)' }}><FaChalkboardTeacher style={{ margin: '0 5px', color: 'var(--p-purple)' }}/> {lang === 'ar' ? 'المدرس المشارك' : 'Teacher'}</label>
                            <select value={teacherFilter} onChange={(e) => setTeacherFilter(e.target.value)} style={{ padding: '12px 15px', borderRadius: '10px', border: '2px solid var(--h-bg)', background: 'var(--bg)', color: 'var(--txt)', outline: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                                <option value="all">{lang === 'ar' ? 'جميع المدرسين' : 'All Teachers'}</option>
                                <option value="t1">{lang === 'ar' ? 'أ. محمد ناصر (فيزياء)' : 'Mr. Mohamed Nasser (Physics)'}</option>
                                <option value="t2">{lang === 'ar' ? 'أ. محمود سعيد (كيمياء)' : 'Mr. Mahmoud Saeed (Chemistry)'}</option>
                                <option value="t3">{lang === 'ar' ? 'أ. عبد الله السيد (عربي)' : 'Mr. Abdallah Elsayed (Arabic)'}</option>
                                <option value="external">{lang === 'ar' ? 'كتب خارجية عامة' : 'External Books'}</option>
                            </select>
                        </div>

                    </div>
                </div>
            </section>

            {/* ======== GRID ======== */}
            <section className="library-container">
                {filteredFiles.length === 0 ? (
                    <div className="no-results" style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '50px' }}>
                        <FaFolderOpen style={{ fontSize: '3rem', color: 'var(--p-purple)', marginBottom: '15px' }} /><br/>
                        {lang === 'ar' ? 'عفواً، لا توجد ملفات متطابقة مع بحثك الحالي.' : 'Sorry, no files match your current search.'}
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                        {filteredFiles.map(f => {
                            let iconColor = '#e74c3c'; 
                            if(f.subject === 'physics') iconColor = '#3498db';
                            if(f.subject === 'chemistry') iconColor = '#2ecc71';
                            if(f.subject === 'arabic') iconColor = '#e67e22';

                            return (
                                <div key={f.id} className="pdf-card" style={{ background: 'var(--card)', borderRadius: '15px', padding: '20px', border: '1px solid rgba(108,92,231,0.1)', textAlign: 'center', position: 'relative' }}>
                                    <div className="free-badge" style={{ position: 'absolute', top: '15px', right: '15px', background: 'var(--p-purple)', color: '#fff', padding: '5px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold' }}>{lang === 'ar' ? 'مجاني' : 'Free'}</div>
                                    <div className="pdf-icon-wrapper" style={{ margin: '20px 0' }}>
                                        <FaFilePdf style={{ fontSize: '4rem', color: iconColor }} />
                                    </div>
                                    <div><span className="pdf-stage" style={{ color: 'var(--txt-mut)', fontSize: '0.9rem' }}>{f.stageName}</span></div>
                                    <h3 className="pdf-title" style={{ margin: '10px 0', fontSize: '1.2rem', color: 'var(--txt)' }}>{f.title}</h3>
                                    <div className="pdf-teacher" style={{ color: 'var(--p-purple)', marginBottom: '20px' }}><FaUserEdit /> {f.teacherName}</div>
                                    
                                    <div className="pdf-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--h-bg)', paddingTop: '15px' }}>
                                        <span className="file-size" style={{ color: 'var(--txt-mut)', fontSize: '0.9rem' }}><FaHdd /> {f.size}</span>
                                        <button className="btn-download glow-btn" onClick={() => handleDownload(f.title)} style={{ padding: '8px 15px', display: 'flex', gap: '5px', alignItems: 'center', border: 'none', borderRadius: '8px', background: 'var(--p-purple)', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>
                                            {lang === 'ar' ? 'تحميل' : 'Download'} <FaDownload />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Toast Notification */}
            <div className={`toast ${toastMsg ? 'show' : ''}`} style={{ 
                position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', 
                background: 'var(--p-purple)', color: '#fff', padding: '15px 25px', 
                borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '10px', 
                boxShadow: '0 10px 30px rgba(108,92,231,0.3)', transition: '0.3s', 
                opacity: toastMsg ? 1 : 0, visibility: toastMsg ? 'visible' : 'hidden', zIndex: 9999 
            }}>
                <FaDownload /> <span>{toastMsg}</span>
            </div>

        </main>
    );
}