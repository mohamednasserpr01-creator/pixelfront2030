"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowRight, FaBell, FaPenNib, FaCheckDouble, FaUserPlus, FaMoneyBillWave, FaFilter } from 'react-icons/fa';

export default function TeacherAlertsPage() {
    const router = useRouter();
    const [filter, setFilter] = useState<'all' | 'grading' | 'system' | 'sales'>('all');

    // 💡 داتا وهمية شاملة للمنصة كلها
    const [alerts, setAlerts] = useState([
        { id: 1, type: 'grading', courseId: 'course-1', title: 'تصحيح مقالي (كورس الفيزياء)', message: 'يوجد 45 إجابة جديدة تنتظر تصحيحك في امتحان الفصل الأول.', date: 'منذ 10 دقائق', isRead: false },
        { id: 2, type: 'sales', courseId: 'course-2', title: 'اشتراك جديد', message: 'قام الطالب أحمد محمد بشراء كورس المراجعة النهائية باستخدام فودافون كاش.', date: 'منذ ساعة', isRead: false },
        { id: 3, type: 'grading', courseId: 'course-1', title: 'تصحيح مقالي (كورس الكيمياء)', message: 'يوجد 12 إجابة جديدة بانتظار تصحيحك.', date: 'منذ ساعتين', isRead: true },
        { id: 4, type: 'system', courseId: null, title: 'تحديث في النظام', message: 'تم تفعيل نظام استخراج الشيتات المتخلفين بنجاح في المنصة.', date: 'أمس', isRead: true },
        { id: 5, type: 'user', courseId: null, title: 'طالب جديد', message: 'سجل طالب جديد حسابه على المنصة.', date: 'أمس', isRead: true },
    ]);

    const filteredAlerts = alerts.filter(a => filter === 'all' || a.type === filter);
    const unreadCount = alerts.filter(a => !a.isRead).length;

    const markAllAsRead = () => setAlerts(prev => prev.map(a => ({ ...a, isRead: true })));

    const handleAlertClick = (alert: any) => {
        setAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, isRead: true } : a));
        // 🚀 توجيه المدرس للكورس الخاص بالإشعار
        if (alert.courseId) {
            router.push(`/teacher/courses/${alert.courseId}`);
        }
    };

    const getIconForType = (type: string) => {
        switch(type) {
            case 'grading': return <FaPenNib color="#e67e22" size={20} />;
            case 'sales': return <FaMoneyBillWave color="#2ecc71" size={20} />;
            case 'user': return <FaUserPlus color="#3498db" size={20} />;
            default: return <FaBell color="#f1c40f" size={20} />;
        }
    };

    return (
        <div style={{ animation: 'fadeIn 0.4s ease', maxWidth: '1000px', margin: '0 auto', padding: '30px 15px 50px' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button onClick={() => router.back()} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--txt)', width: '45px', height: '45px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FaArrowRight />
                    </button>
                    <div>
                        <h1 style={{ margin: '0 0 5px 0', color: 'var(--txt)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FaBell color="#f1c40f" /> مركز الإشعارات الواردة
                        </h1>
                        <p style={{ margin: 0, color: 'var(--txt-mut)' }}>إدارة جميع تنبيهات الكورسات والمنصة من مكان واحد.</p>
                    </div>
                </div>
                {unreadCount > 0 && (
                    <button onClick={markAllAsRead} style={{ background: 'rgba(52, 152, 219, 0.1)', color: '#3498db', border: '1px solid rgba(52, 152, 219, 0.3)', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                        <FaCheckDouble /> تحديد الكل كمقروء ({unreadCount})
                    </button>
                )}
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ color: 'var(--txt-mut)', display: 'flex', alignItems: 'center', gap: '8px', marginRight: '10px' }}>
                    <FaFilter /> تصفية:
                </div>
                {[
                    { id: 'all', label: 'الكل' },
                    { id: 'grading', label: 'التصحيح المقالي' },
                    { id: 'sales', label: 'الاشتراكات' },
                    { id: 'system', label: 'تحديثات النظام' }
                ].map(f => (
                    <button 
                        key={f.id} 
                        onClick={() => setFilter(f.id as any)}
                        style={{ 
                            background: filter === f.id ? 'var(--p-purple)' : 'transparent', 
                            color: filter === f.id ? 'white' : 'var(--txt-mut)', 
                            border: filter === f.id ? 'none' : '1px solid rgba(255,255,255,0.1)', 
                            padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s'
                        }}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Alerts List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {filteredAlerts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '50px', background: 'rgba(0,0,0,0.2)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <FaBell size={50} style={{ color: 'var(--txt-mut)', opacity: 0.3, marginBottom: '15px' }} />
                        <h3 style={{ color: 'white', margin: '0 0 10px 0' }}>لا توجد إشعارات هنا</h3>
                        <p style={{ color: 'var(--txt-mut)', margin: 0 }}>صندوق الوارد نظيف ومحدث.</p>
                    </div>
                ) : (
                    filteredAlerts.map(alert => (
                        <div 
                            key={alert.id} 
                            onClick={() => handleAlertClick(alert)}
                            style={{ 
                                background: alert.isRead ? 'rgba(0,0,0,0.2)' : 'rgba(52, 152, 219, 0.08)',
                                border: `1px solid ${alert.isRead ? 'rgba(255,255,255,0.05)' : 'rgba(52, 152, 219, 0.3)'}`,
                                padding: '20px', borderRadius: '15px', display: 'flex', alignItems: 'flex-start', gap: '20px', cursor: alert.courseId ? 'pointer' : 'default', transition: '0.2s'
                            }}
                            onMouseOver={(e) => { if(alert.courseId) e.currentTarget.style.transform = 'translateY(-2px)' }}
                            onMouseOut={(e) => { if(alert.courseId) e.currentTarget.style.transform = 'translateY(0)' }}
                        >
                            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                {getIconForType(alert.type)}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <h3 style={{ margin: 0, color: 'white', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        {!alert.isRead && <span style={{ width: '10px', height: '10px', background: '#3498db', borderRadius: '50%', display: 'inline-block' }}></span>}
                                        {alert.title}
                                    </h3>
                                    <span style={{ color: 'var(--txt-mut)', fontSize: '0.9rem' }}>{alert.date}</span>
                                </div>
                                <p style={{ margin: '0 0 10px 0', color: 'var(--txt-mut)', fontSize: '1rem', lineHeight: '1.6' }}>{alert.message}</p>
                                {alert.courseId && (
                                    <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.1)', color: 'white', padding: '5px 12px', borderRadius: '6px', fontSize: '0.85rem' }}>
                                        انتقال إلى الكورس <FaArrowRight style={{ marginLeft: '5px', transform: 'rotate(180deg)' }} />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

        </div>
    );
}