// FILE: context/ToastContext.tsx
"use client";
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';
import '../components/ui/ui.css';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string; // 💡 غيرناها لـ string عشان الـ UUID
    message: string;
    type: ToastType;
}

interface ToastContextType {
    // 💡 ضفنا الـ duration كمعامل اختياري
    showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    // 💡 دالة مركزية لحذف الإشعار
    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const showToast = useCallback((message: string, type: ToastType = 'info', duration: number = 3000) => {
        // 💡 استخدام randomUUID لمنع تكرار الـ ID، مع Fallback احتياطي
        const id = typeof crypto !== 'undefined' && crypto.randomUUID 
            ? crypto.randomUUID() 
            : Math.random().toString(36).substring(2, 9);

        setToasts(prev => {
            const newToasts = [...prev, { id, message, type }];
            // 💡 الحد الأقصى 5 إشعارات فقط عشان نمنع الـ Spam والـ Memory Leak
            return newToasts.slice(-5);
        });

        // 💡 الحذف التلقائي بناءً على الوقت الممرر
        setTimeout(() => {
            removeToast(id);
        }, duration);
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            
            {/* 💡 دعم الـ RTL للمنصة العربية */}
            <div className="toast-container" style={{ direction: 'rtl' }}>
                {toasts.map(toast => (
                    <div key={toast.id} className={`pixel-toast toast-${toast.type}`}>
                        {toast.type === 'success' && <FaCheckCircle size={20} />}
                        {toast.type === 'error' && <FaExclamationCircle size={20} />}
                        {toast.type === 'info' && <FaInfoCircle size={20} />}
                        
                        <span style={{ flex: 1, paddingLeft: '10px' }}>{toast.message}</span>
                        
                        {/* 💡 زرار الإغلاق اليدوي */}
                        <button 
                            onClick={() => removeToast(toast.id)} 
                            className="toast-close-btn"
                            aria-label="إغلاق الإشعار"
                        >
                            <FaTimes size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used within a ToastProvider");
    return context;
};