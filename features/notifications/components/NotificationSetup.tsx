"use client";
import React from 'react';
import { FaBell, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { useNotifications } from '../hooks/useNotifications';
import { Button } from '../../../components/ui/Button'; // تم تعديل المسار هنا ✅

export const NotificationSetup = () => {
    const { permissionStatus, requestPermission } = useNotifications();

    return (
        <div style={{ background: 'var(--card)', padding: '30px', borderRadius: '20px', border: '1px solid rgba(108,92,231,0.2)', maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
            
            <h3 style={{ color: 'var(--txt)', fontSize: '1.3rem', marginBottom: '10px' }}>تفعيل إشعارات المنصة 🔔</h3>
            <p style={{ color: 'var(--txt-mut)', marginBottom: '30px', fontSize: '0.9rem' }}>
                فعّل الإشعارات عشان يوصلك كل جديد (حصص، امتحانات، نتيجتك) أول بأول.
            </p>

            {/* 💣 الـ Preview الأسطوري (كأنها على الموبايل) */}
            <div style={{ background: '#f5f6fa', borderRadius: '15px', padding: '15px', marginBottom: '30px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', border: '1px solid #e1e8ef', textAlign: 'right', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-10px', right: '20px', background: 'var(--p-purple)', color: 'white', fontSize: '0.7rem', padding: '3px 10px', borderRadius: '10px' }}>
                    Preview
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <div style={{ width: '25px', height: '25px', background: 'var(--p-purple)', borderRadius: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '12px' }}>
                        PA
                    </div>
                    <span style={{ color: '#2f3640', fontWeight: 'bold', fontSize: '0.85rem' }}>بيكسل أكاديمي</span>
                    <span style={{ color: '#7f8fa6', fontSize: '0.75rem', marginRight: 'auto' }}>الآن</span>
                </div>
                <div style={{ color: '#2f3640', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '4px' }}>🔥 محاضرة جديدة</div>
                <div style={{ color: '#7f8fa6', fontSize: '0.85rem' }}>تم رفع الدرس الأول في الكيمياء، ادخل شوفه دلوقتي.</div>
            </div>

            {/* زرار التفعيل والحالة */}
            {permissionStatus === 'idle' && (
                <Button fullWidth onClick={requestPermission} style={{ background: 'var(--p-purple)' }}>
                    تفعيل الإشعارات الآن
                </Button>
            )}

            {permissionStatus === 'loading' && (
                <div style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <FaSpinner className="spin" /> جاري تفعيل الإشعارات...
                </div>
            )}

            {permissionStatus === 'granted' && (
                <div style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: 'rgba(46,204,113,0.1)', padding: '10px', borderRadius: '10px' }}>
                    <FaCheckCircle /> تم تفعيل الإشعارات بنجاح ✅
                </div>
            )}
        </div>
    );
};