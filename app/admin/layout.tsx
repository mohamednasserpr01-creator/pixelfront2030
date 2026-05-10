"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
    FaUserShield, FaChalkboardTeacher, FaUserGraduate, 
    FaLayerGroup, FaGift, FaBarcode, FaHeartbeat, 
    FaStore, FaBars, FaBell, FaSearch, FaShoppingCart, 
    FaHeadset, FaCircle, FaEnvelope, FaComments, FaWallet,
    FaDatabase, FaBullhorn // 🚀 إضافة أيقونة حملات الإشعارات
} from 'react-icons/fa';
import styles from './Admin.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // 💡 إدارة الإشعارات والرسائل
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isMsgOpen, setIsMsgOpen] = useState(false);
    
    const notifRef = useRef<HTMLDivElement>(null);
    const msgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) setIsNotifOpen(false);
            if (msgRef.current && !msgRef.current.contains(event.target as Node)) setIsMsgOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const adminMenu = [
        { name: 'لوحة التحكم', path: '/admin', icon: <FaUserShield /> },
        { name: 'أدمنز المنصة', path: '/admin/staff', icon: <FaUserShield /> },
        { name: 'المدرسين', path: '/admin/teachers', icon: <FaChalkboardTeacher /> },
        { name: 'الطلاب', path: '/admin/students', icon: <FaUserGraduate /> },
        { name: 'الصفوف والشعب', path: '/admin/grades', icon: <FaLayerGroup /> },
        { name: 'العروض', path: '/admin/offers', icon: <FaGift /> },
        { name: 'أكواد الشحن', path: '/admin/codes', icon: <FaBarcode /> },
        { name: 'أكواد بنك المعرفة', path: '/admin/knowledge-bank-codes', icon: <FaDatabase /> }, 
        { name: 'وحدة المتجر', path: '/admin/store', icon: <FaStore /> },
        { name: 'الدعم النفسي', path: '/admin/support', icon: <FaHeartbeat /> },
        { name: 'رسائل الدعم', path: '/admin/messages', icon: <FaComments /> },
        // 🚀 إضافة رابط حملات الإشعارات
        { name: 'حملات الإشعارات', path: '/admin/broadcast', icon: <FaBullhorn /> }, 
    ];

    // داتا الإشعارات
    const notifications = [
        { id: 1, isNew: true, title: 'طلب متجر جديد', desc: 'أوردر ملازم رقم #1024 يحتاج إلى تأكيد.', time: 'منذ 5 دقائق', icon: <FaShoppingCart color="var(--success)" /> },
        { id: 2, isNew: true, title: 'حجز دعم نفسي', desc: 'الطالبة سلمى تطلب موعد جلسة.', time: 'منذ 15 دقيقة', icon: <FaHeartbeat color="var(--danger)" /> },
    ];

    // داتا الرسائل المصغرة
    const messages = [
        { id: 1, isNew: true, sender: 'يوسف أحمد', text: 'لو سمحت الفيديو بيقطع عندي...', time: 'منذ دقيقتين' },
        { id: 2, isNew: true, sender: 'شهد محمود', text: 'ممكن اعرف كود الشحن بكام؟', time: 'منذ 10 دقائق' },
    ];

    return (
        <div className={styles.adminWrapper}>
            <aside className={`${styles.sidebar} ${isMobileMenuOpen ? styles.open : ''}`}>
                <div className={styles.logoArea}>
                    <h1>PIXEL <span style={{ color: 'white' }}>ADMIN</span></h1>
                </div>
                <nav className={styles.navLinks} style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 100px)' }}> {/* 🚀 إضافة سكرول للناف بار عشان اللينكات كترت */}
                    {adminMenu.map((item, index) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link key={index} href={item.path} className={`${styles.linkItem} ${isActive ? styles.active : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                                <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>{item.name}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            <div className={styles.mainContent}>
                <div className={styles.topbar}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <button className="mobile-only" style={{ background: 'none', border: 'none', color: 'var(--txt)', fontSize: '1.5rem', cursor: 'pointer' }} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}><FaBars /></button>
                        <div className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '50px', padding: '10px 20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <FaSearch style={{ color: 'var(--txt-mut)', marginRight: '10px' }} />
                            <input type="text" placeholder="بحث سريع..." style={{ background: 'none', border: 'none', color: 'var(--txt)', outline: 'none', width: '250px' }} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                        
                        {/* 💬 أيقونة الرسائل (بقت تفتح Dropdown زي الإشعارات) */}
                        <div style={{ position: 'relative' }} ref={msgRef}>
                            <div style={{ cursor: 'pointer', position: 'relative' }} onClick={() => { setIsMsgOpen(!isMsgOpen); setIsNotifOpen(false); }}>
                                <FaEnvelope style={{ fontSize: '1.4rem', color: 'var(--txt)' }} />
                                {messages.filter(m => m.isNew).length > 0 && (
                                    <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'var(--p-purple)', color: 'white', fontSize: '0.7rem', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                        {messages.filter(m => m.isNew).length}
                                    </span>
                                )}
                            </div>

                            {isMsgOpen && (
                                <div style={{ position: 'absolute', top: '45px', left: '-20px', width: '340px', backgroundColor: '#1e1e2d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px', boxShadow: '0 15px 50px rgba(0,0,0,0.9)', zIndex: 999999, overflow: 'hidden', animation: 'fadeIn 0.2s ease' }}>
                                    <div style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#151521' }}>
                                        <span style={{ color: 'white' }}>الرسائل الجديدة</span>
                                    </div>
                                    <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                                        {messages.map(msg => (
                                            <div key={msg.id} onClick={() => { setIsMsgOpen(false); router.push('/admin/messages'); }} style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '15px', cursor: 'pointer', background: msg.isNew ? 'rgba(108,92,231,0.1)' : 'transparent', transition: '0.2s' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--p-purple)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontWeight: 'bold' }}>{msg.sender.charAt(0)}</div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 'bold', fontSize: '0.95rem', color: 'white' }}>{msg.sender}</div>
                                                    <div style={{ fontSize: '0.85rem', color: '#a0a0b0', margin: '3px 0' }}>{msg.text}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--p-purple)' }}>{msg.time}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div onClick={() => { setIsMsgOpen(false); router.push('/admin/messages'); }} style={{ padding: '12px', textAlign: 'center', backgroundColor: '#151521', fontSize: '0.9rem', color: 'var(--p-purple)', cursor: 'pointer', fontWeight: 'bold', borderTop: '1px solid rgba(255,255,255,0.05)' }}>عرض كل الرسائل</div>
                                </div>
                            )}
                        </div>

                        {/* 🔔 جرس الإشعارات */}
                        <div style={{ position: 'relative' }} ref={notifRef}>
                            <div style={{ cursor: 'pointer', position: 'relative' }} onClick={() => { setIsNotifOpen(!isNotifOpen); setIsMsgOpen(false); }}>
                                <FaBell style={{ fontSize: '1.4rem', color: 'var(--txt)' }} />
                                {notifications.filter(n => n.isNew).length > 0 && (
                                    <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'var(--danger)', color: 'white', fontSize: '0.7rem', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                        {notifications.filter(n => n.isNew).length}
                                    </span>
                                )}
                            </div>

                            {isNotifOpen && (
                                <div style={{ position: 'absolute', top: '45px', left: '-20px', width: '340px', backgroundColor: '#1e1e2d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px', boxShadow: '0 15px 50px rgba(0,0,0,0.9)', zIndex: 999999, overflow: 'hidden', animation: 'fadeIn 0.2s ease' }}>
                                    <div style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#151521' }}>
                                        <span style={{ color: 'white' }}>التنبيهات الإدارية</span>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--p-purple)', cursor: 'pointer' }}>تحديد كـ مقروء</span>
                                    </div>
                                    <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                                        {notifications.map(notif => (
                                            <div key={notif.id} style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '15px', cursor: 'pointer', background: notif.isNew ? 'rgba(231,76,60,0.1)' : 'transparent', transition: '0.2s' }}>
                                                <div style={{ fontSize: '1.2rem', marginTop: '3px' }}>{notif.icon}</div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 'bold', fontSize: '0.95rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        {notif.title}
                                                        {notif.isNew && <FaCircle style={{ color: 'var(--danger)', fontSize: '0.5rem' }} />}
                                                    </div>
                                                    <div style={{ fontSize: '0.85rem', color: '#a0a0b0', margin: '5px 0' }}>{notif.desc}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{notif.time}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div onClick={() => { setIsNotifOpen(false); router.push('/admin/notifications'); }} style={{ padding: '12px', textAlign: 'center', backgroundColor: '#151521', fontSize: '0.9rem', color: 'var(--txt-mut)', cursor: 'pointer', fontWeight: 'bold', borderTop: '1px solid rgba(255,255,255,0.05)' }}>عرض كل التنبيهات</div>
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: '20px' }}>
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontWeight: 900, fontSize: '0.9rem', color: 'white' }}>محمد ناصر</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--success)' }}>Super Admin</div>
                            </div>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--p-purple), #ff007f)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.2rem', color: 'white' }}>م</div>
                        </div>
                    </div>
                </div>

                <main className={styles.pageContainer}>
                    {children}
                </main>
            </div>
        </div>
    );
}