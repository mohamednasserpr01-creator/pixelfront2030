// FILE: features/notifications/hooks/useNotifications.tsx
"use client";
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AppNotification, PermissionStatus } from '../types/notification.types';

interface NotificationContextProps {
    notifications: AppNotification[];
    unreadCount: number;
    permissionStatus: PermissionStatus;
    requestPermission: () => Promise<void>;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    deleteNotification: (id: string) => void;
    clearAll: () => void;
    addNotification: (notification: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

// الـ Mocks بتاعتنا زي ما هي
const mockNotifications: AppNotification[] = [
    { id: '1', title: '🔥 محاضرة جديدة', body: 'تم رفع الدرس الأول في الكيمياء، ادخل شوفه دلوقتي.', createdAt: 'منذ 5 دقائق', isRead: false, type: 'info' },
    { id: '2', title: '🎉 عاش يا بطل!', body: 'أنت من أوائل امتحان الفيزياء الأسبوعي.', createdAt: 'منذ ساعتين', isRead: false, type: 'success' }
];

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
    // 💡 التعديل الأول: نبدأ بـ Array فاضي عشان منعملش Overwrite للبيانات الحقيقية
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>('idle');

    const fetchNotifications = useCallback(() => {
        const saved = localStorage.getItem('pixel_notifications');
        if (saved) {
            setNotifications(JSON.parse(saved));
        } else {
            // لو أول مرة يدخل المنصة خالص، اديله الـ Mocks
            setNotifications(mockNotifications);
            localStorage.setItem('pixel_notifications', JSON.stringify(mockNotifications));
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        fetchNotifications();
        const savedPermission = localStorage.getItem('pixel_notif_permission') as PermissionStatus;
        if (savedPermission) {
            setPermissionStatus(savedPermission);
        } else if (typeof window !== 'undefined' && 'Notification' in window) {
            if (Notification.permission === 'granted') setPermissionStatus('granted');
            else if (Notification.permission === 'denied') setPermissionStatus('denied');
        }
    }, [fetchNotifications]);

    // 💡 التعديل التاني: نحفظ بس لما تكون الداتا حملت فعلاً
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('pixel_notifications', JSON.stringify(notifications));
        }
    }, [notifications, isLoaded]);

    useEffect(() => {
        const handleCustomEvent = () => fetchNotifications();
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'pixel_notifications') fetchNotifications();
        };

        window.addEventListener('pixel_new_notification', handleCustomEvent);
        window.addEventListener('storage', handleStorageChange);
        
        return () => {
            window.removeEventListener('pixel_new_notification', handleCustomEvent);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [fetchNotifications]);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const requestPermission = async () => {
        setPermissionStatus('loading');
        if (!('Notification' in window)) {
            alert('متصفحك لا يدعم الإشعارات');
            setPermissionStatus('denied');
            return;
        }
        try {
            const permission = await Notification.requestPermission();
            const status = permission === 'granted' ? 'granted' : 'denied';
            setPermissionStatus(status);
            localStorage.setItem('pixel_notif_permission', status);
        } catch (error) {
            setPermissionStatus('idle');
        }
    };

    const markAsRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    const markAllAsRead = () => setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    const deleteNotification = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id));
    const clearAll = () => { setNotifications([]); localStorage.removeItem('pixel_notifications'); };

    const addNotification = useCallback((notif: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>) => {
        const newNotif: AppNotification = { ...notif, id: Date.now().toString(), createdAt: 'الآن', isRead: false };
        setNotifications(prev => [newNotif, ...prev]);

        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            new Notification(notif.title, { body: notif.body, icon: '/logo.png' });
        }
    }, []);

    return (
        <NotificationContext.Provider value={{ 
            notifications, unreadCount, permissionStatus, requestPermission, 
            markAsRead, markAllAsRead, deleteNotification, clearAll, addNotification 
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error("useNotifications must be used within a NotificationProvider");
    return context;
};