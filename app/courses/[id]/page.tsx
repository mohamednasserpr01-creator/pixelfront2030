// FILE: app/courses/[id]/page.tsx
"use client";
import React, { use, useState } from 'react';
import Link from 'next/link';
import { FaVideo, FaFilePdf, FaClipboardCheck, FaLock, FaPlayCircle, FaClock, FaTasks, FaEye, FaPencilAlt, FaCheckCircle, FaTrophy, FaChevronDown, FaChevronUp } from 'react-icons/fa';

import { useSettings } from '../../../context/SettingsContext';

export default function CourseDetails({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const courseId = resolvedParams.id;
    const { lang } = useSettings();
    const isAr = lang === 'ar';

    // 💡 حالة الداون ليست (مقفولة في البداية)
    const [openLecId, setOpenLecId] = useState<number | null>(null);

    const toggleLec = (id: number) => {
        setOpenLecId(prev => prev === id ? null : id);
    };

    // الداتا الوهمية
    const course = {
        title: isAr ? "المراجعة النهائية والتأسيس - 2026" : "Final Revision & Basics - 2026",
        price: 1500,
        isPurchased: true, // 💡 خليناها false عشان نشوف زرار شراء الكورس كامل
        stats: { vid: 450, pdf: 120, mEx: 200 },
        img: "https://images.unsplash.com/photo-1434031211128-095490e7e73b?w=800"
    };

    // داتا الحصص (فيها حصص مشتراة وحصص مقفولة عشان التيست)
    const lectures = [
        {
            id: 1, title: isAr ? "المحاضرة رقم 1" : "Lecture 1", price: 50, isPurchased: true, isCompleted: true, totalTime: "60 دقيقة", reqCount: 2,
            items: [
                { type: 'video', title: isAr ? "فيديو الشرح الأساسي" : "Main Video", time: "25:00", maxV: 3, currV: 1, req: true, icon: FaVideo },
                { type: 'pdf', title: isAr ? "ملف الشرح (PDF)" : "PDF Notes", req: false, icon: FaFilePdf },
                { type: 'exam', title: isAr ? "امتحان العبور الإجباري" : "Mandatory Exam", req: true, icon: FaClipboardCheck }
            ]
        },
        {
            id: 2, title: isAr ? "المحاضرة رقم 2" : "Lecture 2", price: 50, isPurchased: false, isCompleted: false, totalTime: "25:00 دقيقة", reqCount: 3,
            items: [
                { type: 'video', title: isAr ? "شرح متقدم" : "Advanced Video", time: "30:00", maxV: 3, currV: 0, req: true, icon: FaVideo },
                { type: 'homework', title: isAr ? "الواجب المنزلي" : "Homework", req: true, icon: FaPencilAlt }
            ]
        },
        {
            id: 3, title: isAr ? "المحاضرة رقم 3" : "Lecture 3", price: 50, isPurchased: false, isCompleted: false, totalTime: "50 دقيقة", reqCount: 1,
            items: [
                { type: 'video', title: isAr ? "حل أسئلة متقدمة" : "Solving Problems", time: "50:00", maxV: 3, currV: 0, req: true, icon: FaVideo }
            ]
        }
    ];

    const totalLectures = lectures.length;
    const completedLectures = lectures.filter(l => l.isCompleted).length;
    const progressPercentage = totalLectures === 0 ? 0 : Math.round((completedLectures / totalLectures) * 100);

    return (
        <main className="page-wrapper" style={{ paddingTop: '80px', paddingBottom: '80px', paddingLeft: '20px', paddingRight: '20px' }}>
            
            {/* ================= HERO SECTION ================= */}
            <section style={{ maxWidth: '1200px', width: '100%', margin: '0 auto 50px', padding: '40px 30px', background: 'var(--card)', borderRadius: '25px', border: '1px solid rgba(108,92,231,0.2)', display: 'flex', gap: '40px', alignItems: 'center', flexWrap: 'wrap' }}>
                <img src={course.img} alt="Course" style={{ width: '100%', maxWidth: '380px', height: '240px', borderRadius: '20px', objectFit: 'cover', border: '3px solid var(--p-purple)' }} />
                
                <div style={{ flex: '1' }}>
                    <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, color: 'var(--p-purple)', marginBottom: '15px' }}>
                        {course.title}
                    </h1>
                    
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '25px' }}>
                        <div style={{ background: 'rgba(108,92,231,0.1)', border: '1px solid rgba(108,92,231,0.2)', padding: '8px 14px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--txt)' }}>
                            <FaVideo style={{ color: 'var(--p-purple)' }} /> {course.stats.vid} {isAr ? 'فيديو' : 'Videos'}
                        </div>
                        <div style={{ background: 'rgba(108,92,231,0.1)', border: '1px solid rgba(108,92,231,0.2)', padding: '8px 14px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--txt)' }}>
                            <FaFilePdf style={{ color: 'var(--p-purple)' }} /> {course.stats.pdf} PDF
                        </div>
                        <div style={{ background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.2)', padding: '8px 14px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--txt)' }}>
                            <FaClipboardCheck style={{ color: 'var(--danger)' }} /> {course.stats.mEx} {isAr ? 'إجباري' : 'Mandatory'}
                        </div>
                    </div>

                    <div style={{ background: 'linear-gradient(135deg, var(--p-purple), #ff007f)', padding: '25px', borderRadius: '20px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', boxShadow: '0 10px 30px rgba(108,92,231,0.4)' }}>
                        <div>
                            <span style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>{isAr ? 'سعر الكورس كاملاً' : 'Full Course Price'}</span>
                            <h3 style={{ fontSize: '1.8rem', margin: 0, fontWeight: 900 }}>{course.price} {isAr ? 'ج.م' : 'EGP'}</h3>
                        </div>
                        <button style={{ background: 'white', color: 'var(--p-purple)', padding: '12px 35px', borderRadius: '12px', border: 'none', fontWeight: 900, cursor: 'pointer', fontSize: '1.1rem' }}>
                            {course.isPurchased ? (isAr ? '✅ مشترك' : '✅ Subscribed') : (isAr ? 'اشترك الآن' : 'Subscribe Now')}
                        </button>
                    </div>
                </div>
            </section>

            {/* ================= SYLLABUS SECTION ================= */}
            {/* 💡 أخدت العرض بالكامل 1200 بيكسل زي الهيرو بالظبط */}
            <section style={{ maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
                
                <h2 style={{ fontSize: '2rem', fontWeight: 900, borderInlineStart: '6px solid var(--p-purple)', paddingInlineStart: '15px', marginBottom: '25px', color: 'var(--txt)' }}>
                    {isAr ? 'رحلتك التعليمية 📍' : 'Your Learning Journey 📍'}
                </h2>

                {course.isPurchased && (
                    <div style={{ background: 'var(--h-bg)', borderRadius: '15px', padding: '20px', marginBottom: '30px', border: '1px solid rgba(108,92,231,0.2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <span style={{ fontWeight: 'bold', color: 'var(--txt)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FaTrophy style={{ color: 'var(--gold)' }} /> 
                                {isAr ? 'نسبة الإنجاز في الكورس' : 'Course Progress'}
                            </span>
                            <span style={{ fontWeight: 900, color: 'var(--p-purple)', fontSize: '1.1rem' }}>
                                {progressPercentage}% ({completedLectures} / {totalLectures})
                            </span>
                        </div>
                        <div style={{ height: '12px', background: 'var(--bg)', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ 
                                width: `${progressPercentage}%`, 
                                height: '100%', 
                                background: 'linear-gradient(90deg, var(--p-purple), #ff007f)', 
                                borderRadius: '10px', 
                                transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' 
                            }}></div>
                        </div>
                        <p style={{ color: 'var(--txt-mut)', fontSize: '0.85rem', marginTop: '10px', textAlign: isAr ? 'right' : 'left' }}>
                            {isAr ? `لقد أكملت ${completedLectures} من أصل ${totalLectures} حصص. استمر يا بطل! 🚀` : `You completed ${completedLectures} out of ${totalLectures} lectures. Keep going! 🚀`}
                        </p>
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {lectures.map((lec, index) => {
                        const isBought = course.isPurchased || lec.isPurchased;
                        const isLocked = index > 0 && !lectures[index - 1].isCompleted && !isBought;
                        const isOpen = openLecId === lec.id;

                        return (
                            <div key={lec.id}>
                                {/* رأس الحصة */}
                                <div 
                                    onClick={() => toggleLec(lec.id)}
                                    style={{ background: 'var(--card)', border: `1px solid ${isOpen ? 'var(--p-purple)' : 'rgba(108,92,231,0.2)'}`, padding: '20px 25px', borderRadius: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: '0.3s', flexWrap: 'wrap', gap: '15px' }}
                                >
                                    {/* الجزء الأيمن: اسم المحاضرة والتفاصيل */}
                                    <div>
                                        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '12px', color: 'var(--txt)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            {isLocked ? <FaLock style={{ color: '#7f8c8d' }} /> : (lec.isCompleted ? <FaPlayCircle style={{ color: 'var(--p-purple)' }} /> : <FaPlayCircle style={{ color: 'var(--p-purple)' }} />)}
                                            <span>{lec.title}</span>
                                        </h3>
                                        <div style={{ display: 'flex', gap: '10px', opacity: 0.8, fontSize: '0.85rem', fontWeight: 700, flexWrap: 'wrap' }}>
                                            <span style={{ background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}><FaClock style={{ color: 'var(--p-purple)' }} /> {lec.totalTime}</span>
                                            <span style={{ background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}><FaTasks style={{ color: 'var(--warning)' }} /> {lec.reqCount} {isAr ? 'مهام إجبارية' : 'Mandatory'}</span>
                                        </div>
                                    </div>
                                    
                                    {/* الجزء الأيسر: الأزرار ومؤشر القائمة (Chevron) */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                                        {isBought ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                {lec.isCompleted && <FaCheckCircle style={{ color: 'var(--success)', fontSize: '1.4rem' }} />}
                                                <Link href={`/courses/${courseId}/lecture/${lec.id}`}>
                                                    <button onClick={(e) => e.stopPropagation()} style={{ background: 'var(--success)', color: 'white', border: 'none', padding: '10px 30px', borderRadius: '10px', fontWeight: 900, cursor: 'pointer', fontSize: '1rem' }}>
                                                        {lec.isCompleted ? (isAr ? 'مراجعة' : 'Review') : (isAr ? 'ابدأ' : 'Start')}
                                                    </button>
                                                </Link>
                                            </div>
                                        ) : (
                                            // 💡 زرار الشراء الفردي متطابق مع التصميم (Gradient)
                                            <button onClick={(e) => e.stopPropagation()} style={{ background: 'linear-gradient(45deg, var(--p-purple), #ff007f)', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '10px', fontWeight: 900, cursor: 'pointer', fontSize: '1rem', boxShadow: '0 4px 15px rgba(108,92,231,0.3)' }}>
                                                {isAr ? `اشتراك ${lec.price} ج.م` : `Subscribe ${lec.price} EGP`}
                                            </button>
                                        )}
                                        
                                        {/* 💡 مؤشر القائمة המنسدلة (Chevron) */}
                                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--txt-mut)' }}>
                                            {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                                        </div>
                                    </div>
                                </div>

                                {/* محتوى الحصة */}
                                {isOpen && (
                                    <div style={{ background: 'var(--h-bg)', border: '1px solid rgba(108,92,231,0.1)', borderTop: 'none', padding: '35px 25px 20px', marginTop: '-15px', borderRadius: '0 0 18px 18px', animation: 'fadeIn 0.3s ease' }}>
                                        {lec.items.map((item, i) => {
                                            const isVideoLimit = item.type === 'video' && item.currV! >= item.maxV!;
                                            const ItemIcon = item.icon;

                                            return (
                                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderBottom: i !== lec.items.length - 1 ? '1px dashed rgba(255,255,255,0.1)' : 'none', flexWrap: 'wrap', gap: '15px' }}>
                                                    <div style={{ flex: '1' }}>
                                                        <h4 style={{ fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', color: 'var(--txt)' }}>
                                                            <ItemIcon style={{ color: 'var(--p-purple)', fontSize: '1.2rem' }} /> 
                                                            {item.title} 
                                                            {item.req && <span style={{ color: 'var(--danger)', fontSize: '0.75rem', background: 'rgba(231, 76, 60, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>{isAr ? '[إجباري]' : '[Mandatory]'}</span>}
                                                        </h4>
                                                        
                                                        {item.type === 'video' && (
                                                            <div style={{ display: 'flex', gap: '15px', fontSize: '0.85rem', fontWeight: 'bold', opacity: 0.8 }}>
                                                                <span style={{ color: 'var(--txt)' }}><FaClock style={{ color: 'var(--p-purple)' }} /> {item.time}</span>
                                                                <span style={{ color: isVideoLimit ? 'var(--danger)' : 'var(--warning)' }}><FaEye /> {isAr ? 'مشاهدات:' : 'Views:'} {item.currV}/{item.maxV}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    {isBought ? (
                                                        <Link href={`/courses/${courseId}/lecture/${lec.id}`}>
                                                            <button style={{ background: isVideoLimit ? '#7f8c8d' : 'var(--p-purple)', color: 'white', border: 'none', padding: '8px 22px', borderRadius: '8px', fontWeight: 'bold', cursor: isVideoLimit ? 'not-allowed' : 'pointer', opacity: isVideoLimit ? 0.6 : 1 }}>
                                                                {isVideoLimit ? (isAr ? 'انتهى' : 'Exhausted') : (isAr ? 'فتح' : 'Open')}
                                                            </button>
                                                        </Link>
                                                    ) : (
                                                        <FaLock style={{ color: 'var(--txt-mut)' }} />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>
        </main>
    );
}