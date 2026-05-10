"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { 
    FaHome, FaChalkboardTeacher, FaPlayCircle, FaShoppingCart, 
    FaGamepad, FaUserShield, FaTimes, FaGlobe, FaMoon, FaSun, 
    FaBars, FaUserCircle, FaSignOutAlt, FaThLarge, FaBookOpen, FaFolderOpen,
    FaHandsHelping, FaTrophy 
} from 'react-icons/fa';

import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

// 💡 استدعاء جرس الإشعارات 
import { NotificationBell } from '../../features/notifications/components/NotificationBell';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const { isLoggedIn, logout, user } = useAuth();
    const { theme, lang, toggleMode, toggleLang } = useSettings();

    return (
        <>
            <style jsx>{`
                @media (max-width: 992px) {
                    .hide-on-mobile { display: none !important; }
                }
            `}</style>

            <div 
                className="mobile-overlay" 
                onClick={() => setIsMenuOpen(false)}
                style={{
                    display: isMenuOpen ? 'block' : 'none',
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.7)',
                    zIndex: 999,
                    backdropFilter: 'blur(3px)'
                }}
            ></div>

            <header style={{ zIndex: 1000 }}>
                <div className="logo">
                    <Link href="/">
                        <img src="https://via.placeholder.com/180x50/6c5ce7/ffffff?text=Pixel+Academy" alt="Pixel Academy" style={{ width: '180px', height: '50px', objectFit: 'contain' }} />
                    </Link>
                </div>
                
                <nav className={isMenuOpen ? 'active' : ''}>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li className="mobile-only" style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                            <h2 style={{ color: 'var(--p-purple)', fontWeight: 900, margin: 0 }}>PIXEL</h2>
                            <button className="icon-btn" style={{ marginRight: 'auto' }} onClick={() => setIsMenuOpen(false)}><FaTimes /></button>
                        </li>
                        
                        <li><Link href="/" onClick={() => setIsMenuOpen(false)}><FaHome /> {lang === 'ar' ? 'الرئيسية' : 'Home'}</Link></li>
                        <li><Link href="/teachers" onClick={() => setIsMenuOpen(false)}><FaChalkboardTeacher /> {lang === 'ar' ? 'المدرسين' : 'Teachers'}</Link></li>
                        <li><Link href="/courses" onClick={() => setIsMenuOpen(false)}><FaPlayCircle /> {lang === 'ar' ? 'الكورسات' : 'Courses'}</Link></li>
                        <li><Link href="/knowledge-bank" onClick={() => setIsMenuOpen(false)}><FaBookOpen /> {lang === 'ar' ? 'بنك الأسئلة' : 'Questions'}</Link></li>
                        <li><Link href="/library" onClick={() => setIsMenuOpen(false)}><FaFolderOpen /> {lang === 'ar' ? 'المكتبة' : 'Library'}</Link></li>
                        
                        <li><Link href="/leaderboard" onClick={() => setIsMenuOpen(false)}><FaTrophy style={{ color: '#f1c40f' }} /> {lang === 'ar' ? 'ترتيب الطلاب' : 'Leaderboard'}</Link></li>
                        <li><Link href="/support" onClick={() => setIsMenuOpen(false)}><FaHandsHelping style={{ color: '#0984e3' }} /> {lang === 'ar' ? 'الدعم النفسي' : 'Support'}</Link></li>
                        
                        <li><Link href="/store" onClick={() => setIsMenuOpen(false)}><FaShoppingCart /> {lang === 'ar' ? 'المتجر' : 'Store'}</Link></li>
                        <li><Link href="/parent" onClick={() => setIsMenuOpen(false)} style={{ color: '#f39c12' }}><FaUserShield /> {lang === 'ar' ? 'متابعة ولي الأمر' : 'Parent Portal'}</Link></li>
                        
                        {/* أزرار الموبايل (حسب حالة الدخول) */}
                        <li className="mobile-only" style={{ marginTop: '20px' }}>
                            {isLoggedIn ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <Link href="/dashboard" className="btn-primary" style={{ display: 'flex', justifyContent: 'center', width: '100%' }} onClick={() => setIsMenuOpen(false)}>
                                        <FaThLarge style={{ margin: '0 5px' }} /> {lang === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
                                    </Link>
                                    <button onClick={() => { logout(); setIsMenuOpen(false); }} className="btn-outline" style={{ color: '#e74c3c', borderColor: '#e74c3c' }}>
                                        <FaSignOutAlt style={{ margin: '0 5px' }} /> {lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}
                                    </button>
                                </div>
                            ) : (
                                <Link href="/auth" className="btn-primary" style={{ display: 'flex', justifyContent: 'center', width: '100%' }} onClick={() => setIsMenuOpen(false)}>
                                    {lang === 'ar' ? 'دخول المنصة' : 'Login'}
                                </Link>
                            )}
                        </li>
                    </ul>
                </nav>
                
                <div className="toolbar" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    
                    {/* 💣 الجرس ظهر هنا لو الطالب مسجل دخول */}
                    {isLoggedIn && <NotificationBell />}

                    <button className="icon-btn" onClick={toggleMode} title={lang === 'ar' ? 'تبديل الوضع' : 'Toggle Theme'}>
                        {theme === 'dark' ? <FaMoon /> : <FaSun />}
                    </button>
                    
                    <button className="btn-outline hide-on-mobile" onClick={toggleLang}>AR/EN</button>
                    
                    {/* أزرار الكمبيوتر (حسب حالة الدخول) */}
                    {isLoggedIn ? (
                        <div className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Link href="/dashboard" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FaThLarge /> {lang === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
                            </Link>
                            <button className="icon-btn" onClick={logout} title={lang === 'ar' ? 'خروج' : 'Logout'} style={{ color: '#e74c3c' }}>
                                <FaSignOutAlt />
                            </button>
                        </div>
                    ) : (
                        <Link href="/auth" className="btn-primary hide-on-mobile">
                            {lang === 'ar' ? 'دخول المنصة' : 'Login'}
                        </Link>
                    )}
                    
                    <button className="icon-btn mobile-only" onClick={() => setIsMenuOpen(true)}>
                        <FaBars />
                    </button>
                </div>
            </header>
        </>
    );
}