"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; 
import { 
    FaChalkboardTeacher, FaBookOpen, FaPlayCircle, 
    FaClipboardList, FaQrcode, FaChartLine, 
    FaBars, FaTimes, FaWallet, FaFolderOpen, FaUserShield,
    FaVideo, FaPenNib, FaBell, FaCircle, FaHistory
} from 'react-icons/fa';

// 🚀 1. استدعاء البروفايدر وزرار التحويل بتاع السيم المعزول
import { TeacherThemeProvider, TeacherThemeSwitcher } from '@/components/providers/TeacherTheme';

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const menuItems = [
        { title: 'الرئيسية (الداشبورد)', path: '/teacher/dashboard', icon: <FaChartLine /> },
        { title: 'الكورسات', path: '/teacher/courses', icon: <FaBookOpen /> },
        { title: 'الحصص ومحتواها', path: '/teacher/lessons', icon: <FaPlayCircle /> },
        { title: 'حصص حل الواجب', path: '/teacher/homework-lessons', icon: <FaVideo /> },
        { title: 'الواجبات', path: '/teacher/homework', icon: <FaPenNib /> },
        { title: 'الامتحانات', path: '/teacher/exams', icon: <FaClipboardList /> },
        { title: 'بنوك الأسئلة', path: '/teacher/question-banks', icon: <FaChalkboardTeacher /> },
        { title: 'أكواد الشحن', path: '/teacher/codes', icon: <FaQrcode /> },
        { title: 'المكتبة الخاصة', path: '/teacher/library', icon: <FaFolderOpen /> },
        { title: 'المساعدين', path: '/teacher/assistants', icon: <FaUserShield /> },
        { title: 'سجل النشاطات', path: '/teacher/logs', icon: <FaHistory /> },
        { title: 'الميزانية والأرباح', path: '/teacher/finance', icon: <FaWallet /> },
    ];

    // 🚀 2. تغليف الصفحة بالـ TeacherThemeProvider
    return (
        <TeacherThemeProvider>
            <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', color: 'var(--txt)' }}>
                
                <aside style={{ 
                    width: isSidebarOpen ? '280px' : '0px', 
                    background: 'var(--card)', 
                    borderLeft: '1px solid rgba(255,255,255,0.05)', 
                    transition: '0.3s ease',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'fixed',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    zIndex: 1000
                }}>
                    <div style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', minHeight: '75px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--p-purple)', fontWeight: 900, fontSize: '1.2rem', whiteSpace: 'nowrap' }}>
                            <FaChalkboardTeacher size={24} /> منصة المدرس
                        </div>
                        <button onClick={() => setIsSidebarOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--txt-mut)', cursor: 'pointer', display: 'block' }}>
                            <FaTimes size={20} />
                        </button>
                    </div>

                    <div style={{ padding: '20px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        {menuItems.map((item, idx) => {
                            const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);                        
                            return (
                                <Link key={idx} href={item.path} style={{ textDecoration: 'none' }}>
                                    <div style={{ 
                                        display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', 
                                        borderRadius: '12px', transition: '0.2s', whiteSpace: 'nowrap',
                                        background: isActive ? 'linear-gradient(45deg, var(--p-purple), #ff007f)' : 'transparent',
                                        color: isActive ? 'white' : 'var(--txt-mut)',
                                        fontWeight: isActive ? 'bold' : 'normal',
                                    }}>
                                        <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                                        <span>{item.title}</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </aside>

                <main style={{ 
                    flex: 1, 
                    transition: '0.3s ease', 
                    marginRight: isSidebarOpen ? '280px' : '0px',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh'
                }}>
                    <div style={{ 
                        background: 'var(--h-bg)', 
                        backdropFilter: 'blur(10px)',
                        padding: '15px 30px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        position: 'sticky',
                        top: 0,
                        zIndex: 100,
                        minHeight: '75px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            {!isSidebarOpen && (
                                <button onClick={() => setIsSidebarOpen(true)} style={{ background: 'var(--p-purple)', border: 'none', color: 'white', padding: '10px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FaBars />
                                </button>
                            )}
                            <h2 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--txt)' }}>لوحة تحكم المدرس</h2>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            
                            {/* 🚀 3. زرار تغيير المظهر (Theme Switcher) */}
                            <TeacherThemeSwitcher />

                            {/* حاوية أيقونة الجرس والقايمة المنسدلة */}
                            <div ref={dropdownRef} style={{ position: 'relative' }}>
                                <button 
                                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                    style={{ position: 'relative', background: 'rgba(241, 196, 15, 0.1)', color: '#f1c40f', border: '1px solid rgba(241, 196, 15, 0.3)', width: '45px', height: '45px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s', marginLeft: '10px' }}
                                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(241, 196, 15, 0.2)'}
                                    onMouseOut={(e) => e.currentTarget.style.background = 'rgba(241, 196, 15, 0.1)'}
                                >
                                    <FaBell size={20} />
                                    <span style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#e74c3c', color: 'white', fontSize: '0.75rem', fontWeight: 'bold', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--bg)' }}>
                                        2
                                    </span>
                                </button>

                                {isNotificationsOpen && (
                                    <div style={{ 
                                        position: 'absolute', top: '55px', left: '0', width: '350px', 
                                        background: 'var(--card)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)', 
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 1000, overflow: 'hidden',
                                        animation: 'fadeIn 0.2s ease', textAlign: 'right'
                                    }}>
                                        <div style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.1)' }}>
                                            <strong style={{ color: 'var(--txt)' }}>أحدث الإشعارات</strong>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--txt-mut)' }}>تنبيهين جدد</span>
                                        </div>
                                        
                                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                            <Link 
                                                href="/teacher/courses/course-1"
                                                onClick={() => setIsNotificationsOpen(false)}
                                                style={{ display: 'block', textDecoration: 'none', padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)', transition: '0.2s', background: 'rgba(52, 152, 219, 0.05)' }}
                                                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(52, 152, 219, 0.1)'}
                                                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(52, 152, 219, 0.05)'}
                                            >
                                                <div style={{ color: 'var(--txt)', fontSize: '0.95rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <FaCircle color="#3498db" size={8}/> تصحيح مقالي (كورس الفيزياء)
                                                </div>
                                                <div style={{ color: 'var(--txt-mut)', fontSize: '0.85rem', marginTop: '5px', lineHeight: '1.5' }}>
                                                    يوجد إجابات بانتظار تصحيحك في امتحان المحاضرة الأولى.
                                                </div>
                                            </Link>

                                            <Link 
                                                href="/teacher/alerts"
                                                onClick={() => setIsNotificationsOpen(false)}
                                                style={{ display: 'block', textDecoration: 'none', padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)', transition: '0.2s' }}
                                                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                            >
                                                <div style={{ color: 'var(--txt)', fontSize: '0.95rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <FaCircle color="#2ecc71" size={8}/> اشتراك طالب جديد
                                                </div>
                                                <div style={{ color: 'var(--txt-mut)', fontSize: '0.85rem', marginTop: '5px', lineHeight: '1.5' }}>
                                                    قام الطالب أحمد محمد بشراء كورس المراجعة.
                                                </div>
                                            </Link>
                                        </div>
                                        
                                        <Link 
                                            href="/teacher/alerts"
                                            onClick={() => setIsNotificationsOpen(false)}
                                            style={{ display: 'block', textAlign: 'center', width: '100%', background: 'transparent', color: 'var(--p-purple)', textDecoration: 'none', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '12px', fontWeight: 'bold', fontSize: '0.9rem' }}
                                            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            عرض جميع الإشعارات
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <div style={{ textAlign: 'left', direction: 'ltr', paddingRight: '15px', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                                <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--txt)' }}>أ. محمد ناصر</div>
                                <div style={{ color: 'var(--txt-mut)', fontSize: '0.8rem' }}>مدرس لغة عربية</div>
                            </div>
                            <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: '#34495e', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', color: 'white', border: '2px solid var(--p-purple)' }}>
                                MN
                            </div>
                        </div>
                    </div>

                    <div style={{ padding: '30px', flex: 1, overflowY: 'auto' }}>
                        {children}
                    </div>
                </main>
            </div>
        </TeacherThemeProvider>
    );
}