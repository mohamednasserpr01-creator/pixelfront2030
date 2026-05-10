"use client";
import React from 'react';
import { FaBell, FaCheckCircle, FaCheckDouble, FaExclamationTriangle, FaInfoCircle, FaTimes, FaFilter } from 'react-icons/fa';
import { Button } from '../../ui/Button';
// 💡 استدعاء הـ Hook الذكي
import { useNotifications } from '../../../features/notifications/hooks/useNotifications';

export default function NotificationsTab({ lang }: { lang: string }) {
    const isAr = lang === 'ar';
    const { notifications, unreadCount, markAllAsRead, markAsRead, deleteNotification } = useNotifications();

    const getIconStyle = (type: string = 'info') => {
        if (type === 'success') return { color: 'var(--success)', bg: 'rgba(46,204,113,0.1)', icon: <FaCheckCircle /> };
        if (type === 'warning') return { color: 'var(--warning)', bg: 'rgba(241,196,15,0.1)', icon: <FaExclamationTriangle /> };
        if (type === 'error') return { color: 'var(--danger)', bg: 'rgba(231,76,60,0.1)', icon: <FaTimes /> };
        return { color: 'var(--p-purple)', bg: 'rgba(108,92,231,0.1)', icon: <FaInfoCircle /> };
    };

    return (
        <div className="tab-pane active fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
                <h2 className="section-title" style={{ margin: 0 }}>
                    <FaBell /> {isAr ? 'سجل الإشعارات' : 'Notifications'} 
                    {unreadCount > 0 && <span style={{ fontSize: '0.9rem', color: 'var(--danger)', marginInlineStart: '10px' }}>({unreadCount} جديد)</span>}
                </h2>
                <Button variant="outline" size="sm" icon={<FaCheckDouble />} onClick={markAllAsRead} disabled={unreadCount === 0}>
                    {isAr ? 'تحديد الكل كمقروء' : 'Mark all as read'}
                </Button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {notifications.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '50px', background: 'var(--card)', borderRadius: '15px', color: 'var(--txt-mut)', border: '1px dashed rgba(255,255,255,0.1)' }}>
                        <FaFilter style={{ fontSize: '3rem', opacity: 0.2, marginBottom: '15px' }} />
                        <h3 style={{ margin: 0 }}>لا توجد إشعارات حالياً 📭</h3>
                    </div>
                ) : (
                    notifications.map(notif => {
                        const style = getIconStyle(notif.type);
                        return (
                            <div 
                                key={notif.id} 
                                onClick={() => markAsRead(notif.id)}
                                style={{ 
                                    display: 'flex', gap: '15px', padding: '20px', background: 'var(--card)', 
                                    borderRadius: '15px', border: '1px solid', 
                                    borderColor: !notif.isRead ? 'rgba(108,92,231,0.3)' : 'rgba(255,255,255,0.05)', 
                                    position: 'relative', overflow: 'hidden', cursor: 'pointer', transition: '0.3s'
                                }}
                            >
                                {!notif.isRead && <div style={{ position: 'absolute', right: isAr ? 0 : 'auto', left: isAr ? 'auto' : 0, top: 0, bottom: 0, width: '4px', background: 'var(--p-purple)' }}></div>}
                                
                                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: style.bg, color: style.color, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                                    {style.icon}
                                </div>
                                
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--txt)' }}>{notif.title}</h3>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--txt-mut)', fontWeight: 'bold' }}>{notif.createdAt}</span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--txt-mut)', lineHeight: '1.6' }}>{notif.body}</p>
                                </div>

                                <button 
                                    onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }}
                                    style={{ background: 'transparent', border: 'none', color: 'var(--txt-mut)', cursor: 'pointer', transition: '0.2s', padding: '5px' }}
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}