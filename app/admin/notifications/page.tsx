// FILE: app/admin/notifications/page.tsx
"use client";
import React, { useState, useMemo } from 'react';
import { 
    FaShoppingCart, FaHeartbeat, FaExclamationTriangle, 
    FaCheckDouble, FaSearch, FaFilter, FaBell, FaSyncAlt, FaCircle, FaCalendarAlt 
} from 'react-icons/fa';
import { Button } from '../../../components/ui/Button';

// 💡 توليد داتا وهمية بتواريخ
const generateMockNotifications = () => {
    const types = ['store', 'support', 'security'];
    return Array.from({ length: 120 }, (_, i) => {
        const type = types[i % 3];
        let title, desc, icon;
        
        if (type === 'store') {
            title = `طلب متجر جديد #${1000 + i}`;
            desc = 'تم طلب مذكرة مراجعة نهائية، يرجى المراجعة وتأكيد الشحن.';
            icon = <FaShoppingCart color="var(--success)" />;
        } else if (type === 'support') {
            title = 'حجز دعم نفسي';
            desc = `الطالب رقم ${i + 50} يطلب موعد جلسة دعم نفسي عاجلة.`;
            icon = <FaHeartbeat color="var(--danger)" />;
        } else {
            title = 'تحذير أمني';
            desc = `تسجيل دخول من جهاز جديد للطالب كود PX-${2000 + i}.`;
            icon = <FaExclamationTriangle color="var(--warning)" />;
        }

        // توزيع التواريخ على آخر 7 أيام
        const d = new Date();
        d.setDate(d.getDate() - (i % 7));
        const dateStr = d.toISOString().split('T')[0];

        return {
            id: i + 1,
            isRead: i > 15,
            type,
            title,
            desc,
            rawDate: dateStr, // 💡 حقل التاريخ الفعلي للبحث
            displayDate: i === 0 ? 'منذ دقيقتين' : `${dateStr} - 10:00 ص`,
            icon
        };
    });
};

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState(generateMockNotifications());
    const [filter, setFilter] = useState<'all' | 'unread' | 'store' | 'support' | 'security'>('all');
    
    // 💡 حالات البحث (نص + تاريخ)
    const [searchQuery, setSearchQuery] = useState('');
    const [searchDate, setSearchDate] = useState('');
    
    const [visibleCount, setVisibleCount] = useState(20);

    const filteredNotifications = useMemo(() => {
        return notifications.filter(notif => {
            const matchesFilter = filter === 'all' || (filter === 'unread' && !notif.isRead) || notif.type === filter;
            const matchesText = notif.title.includes(searchQuery) || notif.desc.includes(searchQuery);
            const matchesDate = searchDate === '' || notif.rawDate === searchDate;

            return matchesFilter && matchesText && matchesDate;
        });
    }, [notifications, filter, searchQuery, searchDate]);

    const markAllAsRead = () => setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    const loadMore = () => setVisibleCount(prev => prev + 20);

    return (
        <div style={{ animation: 'fadeIn 0.5s ease', maxWidth: '1000px', margin: '0 auto' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', color: 'var(--txt)', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaBell style={{ color: 'var(--p-purple)' }} /> سجل التنبيهات الإدارية
                    </h1>
                    <p style={{ color: 'var(--txt-mut)' }}>متابعة جميع أحداث النظام، الطلبات، والتحذيرات الأمنية.</p>
                </div>
                <Button variant="outline" icon={<FaCheckDouble />} onClick={markAllAsRead}>تحديد الكل كمقروء</Button>
            </div>

            <div style={{ background: 'var(--card)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', padding: '20px', marginBottom: '25px', display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
                
                {/* البحث بالنص */}
                <div style={{ flex: '1 1 200px', position: 'relative' }}>
                    <FaSearch style={{ position: 'absolute', right: '15px', top: '15px', color: 'var(--p-purple)' }} />
                    <input 
                        type="text" 
                        placeholder="ابحث في التنبيهات..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 40px 12px 15px', borderRadius: '10px', color: 'var(--txt)', outline: 'none' }} 
                    />
                </div>

                {/* 💡 البحث بالتاريخ */}
                <div style={{ flex: '0 0 200px', position: 'relative' }}>
                    <FaCalendarAlt style={{ position: 'absolute', right: '15px', top: '15px', color: 'var(--p-purple)' }} />
                    <input 
                        type="date" 
                        value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)}
                        style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 15px 12px 40px', borderRadius: '10px', color: 'var(--txt)', outline: 'none', fontFamily: 'inherit' }} 
                    />
                    {searchDate && (
                        <button onClick={() => setSearchDate('')} style={{ position: 'absolute', left: '10px', top: '15px', background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>إلغاء</button>
                    )}
                </div>

                {/* الفلاتر */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', width: '100%' }}>
                    {[ { id: 'all', label: 'الكل' }, { id: 'unread', label: 'غير مقروء' }, { id: 'store', label: 'المتجر' }, { id: 'support', label: 'الدعم النفسي' }, { id: 'security', label: 'أمان' } ].map(f => (
                        <button 
                            key={f.id}
                            onClick={() => setFilter(f.id as any)}
                            style={{ background: filter === f.id ? 'var(--p-purple)' : 'rgba(255,255,255,0.05)', border: 'none', padding: '10px 15px', borderRadius: '8px', color: filter === f.id ? 'white' : 'var(--txt-mut)', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s', display: 'flex', alignItems: 'center', gap: '5px' }}
                        >
                            {f.id === 'unread' && <FaCircle style={{ fontSize: '0.5rem', color: filter === f.id ? 'white' : 'var(--danger)' }} />}
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {filteredNotifications.slice(0, visibleCount).map(notif => (
                    <div key={notif.id} style={{ background: 'var(--card)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', padding: '20px', display: 'flex', gap: '20px', alignItems: 'flex-start', transition: '0.3s', position: 'relative', overflow: 'hidden', opacity: notif.isRead ? 0.7 : 1 }}>
                        {!notif.isRead && <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '4px', background: 'var(--danger)' }}></div>}
                        <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem', flexShrink: 0 }}>{notif.icon}</div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '10px' }}>
                                <h3 style={{ fontSize: '1.1rem', color: 'white', fontWeight: notif.isRead ? 'normal' : 900 }}>{notif.title}</h3>
                                <span style={{ fontSize: '0.85rem', color: 'var(--txt-mut)' }}>{notif.displayDate}</span>
                            </div>
                            <p style={{ color: 'var(--txt-mut)', lineHeight: '1.6', fontSize: '0.95rem' }}>{notif.desc}</p>
                        </div>
                        {!notif.isRead && (
                            <button onClick={() => setNotifications(notifications.map(n => n.id === notif.id ? { ...n, isRead: true } : n))} style={{ background: 'none', border: 'none', color: 'var(--p-purple)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}>تحديد كمقروء</button>
                        )}
                    </div>
                ))}

                {filteredNotifications.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '50px', color: 'var(--txt-mut)', background: 'var(--card)', borderRadius: '15px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                        <FaFilter style={{ fontSize: '3rem', opacity: 0.2, marginBottom: '15px' }} />
                        <h3>لا توجد تنبيهات مطابقة للبحث أو التاريخ.</h3>
                    </div>
                )}
            </div>

            {visibleCount < filteredNotifications.length && (
                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                    <Button variant="outline" icon={<FaSyncAlt />} onClick={loadMore}>تحميل المزيد</Button>
                </div>
            )}
        </div>
    );
}