"use client";
import React, { useState, useRef, useEffect } from 'react';
import { FaBell, FaCheckDouble, FaRegBell } from 'react-icons/fa';
import { useNotifications } from '../hooks/useNotifications';
import { useSettings } from '../../../context/SettingsContext';

interface Props {
    onViewAll?: () => void;
}

export const NotificationBell = ({ onViewAll }: Props) => {
    const { notifications, unreadCount, markAllAsRead, markAsRead } = useNotifications();
    const { lang } = useSettings();
    const isAr = lang === 'ar';
    const [isOpen, setIsOpen] = useState(false);
    const dropRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={dropRef} style={{ position: 'relative', display: 'inline-block' }}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                style={{ 
                    background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--txt)', 
                    width: '45px', height: '45px', borderRadius: '50%', cursor: 'pointer', 
                    display: 'flex', justifyContent: 'center', alignItems: 'center', 
                    fontSize: '1.2rem', position: 'relative', transition: '0.3s'
                }}
            >
                {unreadCount > 0 ? <FaBell color="var(--warning)" /> : <FaRegBell />}
                {unreadCount > 0 && (
                    <span style={{
                        position: 'absolute', top: '0', right: '0', background: '#e74c3c', 
                        color: 'white', fontSize: '10px', fontWeight: 'bold', 
                        width: '20px', height: '20px', borderRadius: '50%', 
                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                        border: '2px solid var(--bg)'
                    }}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div style={{
                    position: 'absolute', top: '120%', left: '-10px', width: '320px', 
                    background: 'var(--h-bg)', border: '1px solid var(--p-purple)', 
                    borderRadius: '15px', boxShadow: '0 15px 40px rgba(0,0,0,0.6)', 
                    zIndex: 99999, overflow: 'hidden', direction: isAr ? 'rtl' : 'ltr',
                    backdropFilter: 'blur(20px)' 
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
                        <strong style={{ color: 'var(--txt)', fontSize: '1rem' }}>{isAr ? `الإشعارات (${unreadCount})` : `Notifications (${unreadCount})`}</strong>
                        <button onClick={markAllAsRead} style={{ background: 'none', border: 'none', color: 'var(--p-purple)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                            <FaCheckDouble /> {isAr ? 'تحديد كـ مقروء' : 'Mark all as read'}
                        </button>
                    </div>
                    
                    <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                        {notifications.length === 0 ? (
                            <div style={{ padding: '40px 30px', textAlign: 'center', color: 'var(--txt-mut)', fontSize: '0.9rem' }}>
                                {isAr ? 'لا توجد إشعارات حالياً 📭' : 'No notifications right now 📭'}
                            </div>
                        ) : (
                            notifications.map(notif => (
                                <div key={notif.id} onClick={() => markAsRead(notif.id)} style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.02)', background: notif.isRead ? 'transparent' : 'rgba(108,92,231,0.1)', cursor: 'pointer', display: 'flex', gap: '15px' }}>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ margin: '0 0 5px 0', fontSize: '0.95rem', color: notif.isRead ? 'var(--txt-mut)' : 'var(--txt)' }}>{notif.title}</h4>
                                        <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: 'var(--txt-mut)' }}>{notif.body}</p>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--p-purple)' }}>{notif.createdAt}</span>
                                    </div>
                                    {!notif.isRead && <div style={{ width: '10px', height: '10px', background: 'var(--p-purple)', borderRadius: '50%', marginTop: '5px' }}></div>}
                                </div>
                            ))
                        )}
                    </div>

                    {/* 🚀 الزرار السحري للذهاب لصفحة الإشعارات */}
                    {onViewAll && (
                        <div onClick={() => { setIsOpen(false); onViewAll(); }} style={{ padding: '12px', textAlign: 'center', background: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(255,255,255,0.05)', color: 'var(--p-purple)', fontWeight: 'bold', fontSize: '0.9rem', cursor: 'pointer' }}>
                            {isAr ? 'عرض كل الإشعارات' : 'View all notifications'}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};