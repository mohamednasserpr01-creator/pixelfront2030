"use client";
import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation'; // 🚀 استدعاء الـ Router
import { FaTimes, FaBell, FaPenNib, FaCheckDouble, FaCircle, FaListUl } from 'react-icons/fa';
import { Lecture, LectureItem } from '../types/curriculum.types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    curriculum: Lecture[];
    onOpenGrading: (item: LectureItem) => void; 
}

export const TeacherAlertsModal: React.FC<Props> = ({ isOpen, onClose, curriculum, onOpenGrading }) => {
    const router = useRouter();

    const mockAlerts = useMemo(() => {
        const alerts: any[] = [];
        curriculum.forEach(lec => {
            lec.items.forEach((item, index) => {
                if (['exam', 'homework', 'makeup_exam'].includes(item.type)) {
                    if (index % 2 === 0) {
                        alerts.push({
                            id: `alert-${item.id}`,
                            type: 'grading',
                            title: 'إجابات بانتظار التصحيح',
                            message: `يوجد 12 إجابة مقالية تحتاج لتصحيحك في (${item.title}) بمحاضرة (${lec.title}).`,
                            date: 'منذ ساعتين',
                            isRead: false,
                            itemRef: item 
                        });
                    }
                }
            });
        });
        return alerts;
    }, [curriculum]);

    const [alerts, setAlerts] = useState(mockAlerts);

    if (!isOpen) return null;

    const unreadCount = alerts.filter(a => !a.isRead).length;

    const handleAlertClick = (alert: any) => {
        setAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, isRead: true } : a));
        onClose();
        // 💡 هنا بيفتح التصحيح للامتحان ده فوراً زي ما طلبت
        if (alert.type === 'grading' && alert.itemRef) {
            onOpenGrading(alert.itemRef);
        }
    };

    const markAllAsRead = () => {
        setAlerts(prev => prev.map(a => ({ ...a, isRead: true })));
    };

    // 🚀 التوجيه لصفحة الإشعارات المركزية
    const handleViewAll = () => {
        onClose();
        router.push('/teacher/alerts');
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
            <div style={{ background: '#1a1a2e', borderRadius: '15px', width: '600px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', animation: 'fadeIn 0.3s ease' }}>
                
                <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)' }}>
                    <div>
                        <h2 style={{ margin: '0 0 5px 0', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FaBell color="#f1c40f" /> تنبيهات المدرس
                        </h2>
                        <div style={{ fontSize: '0.9rem', color: 'var(--txt-mut)' }}>
                            لديك <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>{unreadCount}</span> إشعار جديد
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        {unreadCount > 0 && (
                            <button onClick={markAllAsRead} style={{ background: 'transparent', border: 'none', color: '#3498db', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <FaCheckDouble /> تحديد الكل كمقروء
                            </button>
                        )}
                        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--txt-mut)', cursor: 'pointer', fontSize: '1.5rem' }}><FaTimes /></button>
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '15px', background: 'rgba(0,0,0,0.1)' }}>
                    {alerts.length === 0 ? (
                        <div style={{ textAlign: 'center', color: 'var(--txt-mut)', marginTop: '50px' }}>لا توجد إشعارات حالياً</div>
                    ) : (
                        alerts.map(alert => (
                            <div 
                                key={alert.id} 
                                onClick={() => handleAlertClick(alert)}
                                style={{ 
                                    padding: '15px', borderRadius: '10px', marginBottom: '10px', cursor: 'pointer', transition: '0.2s',
                                    background: alert.isRead ? 'transparent' : 'rgba(52, 152, 219, 0.1)',
                                    border: `1px solid ${alert.isRead ? 'rgba(255,255,255,0.05)' : 'rgba(52, 152, 219, 0.3)'}`,
                                    display: 'flex', gap: '15px', alignItems: 'flex-start'
                                }}
                            >
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: alert.type === 'grading' ? 'rgba(230, 126, 34, 0.2)' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    {alert.type === 'grading' ? <FaPenNib color="#e67e22" size={18} /> : <FaBell color="white" />}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                        <strong style={{ color: 'white', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {!alert.isRead && <FaCircle color="#3498db" size={8} />} {alert.title}
                                        </strong>
                                        <span style={{ color: 'var(--txt-mut)', fontSize: '0.8rem' }}>{alert.date}</span>
                                    </div>
                                    <p style={{ color: 'var(--txt-mut)', margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>{alert.message}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* 🚀 زرار عرض جميع الإشعارات (الفوتر) */}
                <div style={{ padding: '15px', borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', textAlign: 'center' }}>
                    <button 
                        onClick={handleViewAll}
                        style={{ width: '100%', background: 'var(--p-purple)', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
                    >
                        <FaListUl /> عرض جميع إشعارات المنصة
                    </button>
                </div>

            </div>
        </div>
    );
};