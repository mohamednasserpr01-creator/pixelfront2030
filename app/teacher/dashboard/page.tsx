"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
    FaUsers, FaBookOpen, FaMoneyBillWave, FaChartLine, 
    FaPlayCircle, FaClipboardList, FaPlus, FaTasks, FaBullhorn, 
    FaArrowLeft, FaPenNib, FaUserGraduate, FaFileAlt
} from 'react-icons/fa';

// 🚀 استدعاء مودال إنشاء الكورس (عشان يسأل عن المرحلة والشعبة)
import { CreateCourseModal } from '@/features/course-builder/components/CreateCourseModal';

export default function TeacherDashboardPage() {
    const [mounted, setMounted] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // 💡 إحصائيات للمدرس
    const stats = {
        totalStudents: 1450,
        activeCourses: 8,
        totalRevenue: '125,000',
        pendingGrading: 24
    };

    // 🚀 مهام أكاديمية خاصة بالمدرس فقط (لا يوجد رسائل دعم هنا)
    const academicTasks = [
        { id: 1, title: 'تصحيح إجابات مقالية', desc: 'يوجد 24 إجابة مقالية بانتظار تقييمك في امتحان الباب الأول.', link: '/teacher/exams', color: '#e67e22', icon: <FaPenNib /> },
        { id: 2, title: 'كورسات قيد التجهيز (مسودة)', desc: 'لديك كورس "المراجعة النهائية" لم يتم نشره للطلاب حتى الآن.', link: '/teacher/courses', color: '#f1c40f', icon: <FaFileAlt /> },
        { id: 3, title: 'متابعة أداء الطلاب', desc: 'يوجد 15 طالب حصلوا على أقل من 50% في آخر تقييم.', link: '/teacher/students', color: '#e74c3c', icon: <FaUserGraduate /> }
    ];

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div style={{ animation: 'fadeIn 0.5s ease', maxWidth: '1200px', margin: '0 auto', padding: '20px', paddingBottom: '50px' }}>
            
            {/* 🚀 قسم الترحيب السريع */}
            <div style={{ background: 'linear-gradient(135deg, rgba(108,92,231,0.15), rgba(255,0,127,0.05))', border: '1px solid rgba(108,92,231,0.3)', borderRight: '5px solid var(--p-purple)', padding: '30px', borderRadius: '15px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', color: 'white', marginBottom: '8px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        مرحباً بك يا مستر 🎓
                    </h2>
                    <p style={{ color: 'var(--txt-mut)', fontSize: '1.1rem', margin: 0 }}>
                        هنا غرفة العمليات الخاصة بك.. راقب أداء المنصة، تفاعل طلابك، وإيراداتك في مكان واحد.
                    </p>
                </div>
                {/* 🚀 الزرار تم ربطه بـ Modal إنشاء الكورس بشكل سليم */}
                <button onClick={() => setIsCreateModalOpen(true)} style={{ background: 'var(--p-purple)', color: 'white', border: 'none', padding: '15px 30px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem', boxShadow: '0 5px 20px rgba(108,92,231,0.4)', transition: '0.3s' }} className="btn-hover">
                    <FaPlus /> إنشاء كورس جديد
                </button>
            </div>

            {/* 🚀 كروت الإحصائيات (KPIs) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '25px', marginBottom: '40px' }}>
                <div style={{ background: 'var(--card)', padding: '25px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                    <div style={{ width: '65px', height: '65px', borderRadius: '15px', background: 'rgba(52, 152, 219, 0.1)', color: '#3498db', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2rem' }}><FaUsers /></div>
                    <div><div style={{ color: 'var(--txt-mut)', fontSize: '0.95rem', fontWeight: 'bold', marginBottom: '5px' }}>إجمالي الطلاب</div><div style={{ fontSize: '2rem', fontWeight: 900, color: 'white' }}>{stats.totalStudents}</div></div>
                </div>

                <div style={{ background: 'var(--card)', padding: '25px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                    <div style={{ width: '65px', height: '65px', borderRadius: '15px', background: 'rgba(155, 89, 182, 0.1)', color: '#9b59b6', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2rem' }}><FaBookOpen /></div>
                    <div><div style={{ color: 'var(--txt-mut)', fontSize: '0.95rem', fontWeight: 'bold', marginBottom: '5px' }}>الكورسات النشطة</div><div style={{ fontSize: '2rem', fontWeight: 900, color: 'white' }}>{stats.activeCourses}</div></div>
                </div>

                <div style={{ background: 'var(--card)', padding: '25px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                    <div style={{ width: '65px', height: '65px', borderRadius: '15px', background: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2rem' }}><FaMoneyBillWave /></div>
                    <div><div style={{ color: 'var(--txt-mut)', fontSize: '0.95rem', fontWeight: 'bold', marginBottom: '5px' }}>الإيرادات التقريبية</div><div style={{ fontSize: '2rem', fontWeight: 900, color: '#2ecc71' }}>{stats.totalRevenue}</div></div>
                </div>

                <div style={{ background: 'var(--card)', padding: '25px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                    <div style={{ width: '65px', height: '65px', borderRadius: '15px', background: 'rgba(230, 126, 34, 0.1)', color: '#e67e22', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2rem' }}><FaClipboardList /></div>
                    <div><div style={{ color: 'var(--txt-mut)', fontSize: '0.95rem', fontWeight: 'bold', marginBottom: '5px' }}>بانتظار التصحيح</div><div style={{ fontSize: '2rem', fontWeight: 900, color: '#e67e22' }}>{stats.pendingGrading}</div></div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
                
                {/* 🚀 قسم الإجراءات السريعة */}
                <div>
                    <h3 style={{ marginBottom: '20px', color: 'white', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.4rem' }}>
                        <FaChartLine color="var(--p-purple)" /> إدارة المحتوى السريعة
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        
                        <Link href="/teacher/courses" style={{ textDecoration: 'none' }}>
                            <div style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transition: '0.3s', cursor: 'pointer', height: '100%' }} className="hover-card">
                                <FaBookOpen style={{ fontSize: '2.5rem', color: '#3498db', marginBottom: '10px' }} />
                                <h4 style={{ color: 'white', margin: '0 0 5px 0' }}>إدارة الكورسات</h4>
                                <p style={{ color: 'var(--txt-mut)', fontSize: '0.85rem', margin: 0 }}>متابعة المحتوى والطلاب</p>
                            </div>
                        </Link>

                        <Link href="/teacher/lessons" style={{ textDecoration: 'none' }}>
                            <div style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transition: '0.3s', cursor: 'pointer', height: '100%' }} className="hover-card">
                                <FaPlayCircle style={{ fontSize: '2.5rem', color: 'var(--p-purple)', marginBottom: '10px' }} />
                                <h4 style={{ color: 'white', margin: '0 0 5px 0' }}>بنك الحصص</h4>
                                <p style={{ color: 'var(--txt-mut)', fontSize: '0.85rem', margin: 0 }}>رفع فيديوهات ومذكرات</p>
                            </div>
                        </Link>

                        <Link href="/teacher/exams" style={{ textDecoration: 'none' }}>
                            <div style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transition: '0.3s', cursor: 'pointer', height: '100%' }} className="hover-card">
                                <FaClipboardList style={{ fontSize: '2.5rem', color: '#e74c3c', marginBottom: '10px' }} />
                                <h4 style={{ color: 'white', margin: '0 0 5px 0' }}>بنك الامتحانات</h4>
                                <p style={{ color: 'var(--txt-mut)', fontSize: '0.85rem', margin: 0 }}>تصحيح وتقييم مستمر</p>
                            </div>
                        </Link>

                        <Link href="/teacher/campaigns" style={{ textDecoration: 'none' }}>
                            <div style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transition: '0.3s', cursor: 'pointer', height: '100%' }} className="hover-card">
                                <FaBullhorn style={{ fontSize: '2.5rem', color: '#f1c40f', marginBottom: '10px' }} />
                                <h4 style={{ color: 'white', margin: '0 0 5px 0' }}>الإشعارات والواتساب</h4>
                                <p style={{ color: 'var(--txt-mut)', fontSize: '0.85rem', margin: 0 }}>حملات وتنبيهات للطلاب</p>
                            </div>
                        </Link>

                    </div>
                </div>

                {/* 🚀 قسم المهام الأكاديمية العاجلة للمدرس */}
                <div>
                    <h3 style={{ marginBottom: '20px', color: 'white', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.4rem' }}>
                        <FaTasks color="#2ecc71" /> مهام أكاديمية بانتظارك
                    </h3>
                    <div style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.05)', padding: '25px', borderRadius: '15px', display: 'flex', flexDirection: 'column', gap: '15px', height: 'calc(100% - 50px)' }}>
                        {academicTasks.map((task, index) => (
                            <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: index !== academicTasks.length - 1 ? '15px' : '0', borderBottom: index !== academicTasks.length - 1 ? '1px dashed rgba(255,255,255,0.1)' : 'none', flexWrap: 'wrap', gap: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', flex: 1 }}>
                                    <div style={{ width: '35px', height: '35px', borderRadius: '8px', background: `rgba(${task.color === '#e67e22' ? '230, 126, 34' : task.color === '#f1c40f' ? '241, 196, 15' : '231, 76, 60'}, 0.1)`, color: task.color, display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                                        {task.icon}
                                    </div>
                                    <div>
                                        <div style={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', marginBottom: '5px', lineHeight: '1.4' }}>{task.title}</div>
                                        <div style={{ color: 'var(--txt-mut)', fontSize: '0.85rem' }}>{task.desc}</div>
                                    </div>
                                </div>
                                <Link href={task.link} style={{ textDecoration: 'none' }}>
                                    <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', transition: '0.2s', whiteSpace: 'nowrap' }} className="btn-hover">
                                        الذهاب للمهمة <FaArrowLeft />
                                    </button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
                
            </div>

            <style jsx>{`
                .hover-card:hover { transform: translateY(-5px); border-color: var(--p-purple) !important; background: rgba(108,92,231,0.05) !important; }
                .btn-hover:hover { transform: scale(1.02); background: rgba(255,255,255,0.1) !important; }
            `}</style>

            {/* 🚀 إدراج المودال هنا */}
            <CreateCourseModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
        </div>
    );
}