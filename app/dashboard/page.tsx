"use client";
import React, { useState, useEffect, useMemo, Component, ErrorInfo, ReactNode } from 'react';
import dynamic from 'next/dynamic'; 

import Sidebar from '../../components/dashboard/Sidebar';
import Header from '../../components/dashboard/Header';

import { useSettings } from '../../context/SettingsContext'; 
import { useToast } from '../../context/ToastContext'; 

import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';

// 💡 استيراد ملف التنسيق الأصلي فقط!
import './dashboard.css'; 

// 💡 إضافة التابات الجديدة (المهام، الرسائل، الإشعارات)
export const TABS = {
    OVERVIEW: 'overview',
    COURSES: 'courses',
    TASKS: 'tasks',
    EXAMS: 'exams',
    FINANCIALS: 'financials',
    ORDERS: 'orders',
    ANALYTICS: 'analytics',
    SETTINGS: 'settings',
    MESSAGES: 'messages',       // 👈 تاب الرسائل
    NOTIFICATIONS: 'notifications' // 👈 تاب الإشعارات
} as const;

// 💡 حل مشكلة التايب الضعيف
export type TabValue = typeof TABS[keyof typeof TABS];

const Loader = () => (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <Skeleton variant="text" width="30%" height="30px" />
        <Skeleton variant="rectangular" width="100%" height="200px" />
        <Skeleton variant="rectangular" width="100%" height="150px" />
    </div>
);

const OverviewTab = dynamic(() => import('../../components/dashboard/tabs/OverviewTab'), { loading: Loader });
const CoursesTab = dynamic(() => import('../../components/dashboard/tabs/CoursesTab'), { loading: Loader });
const TasksTab = dynamic(() => import('../../components/dashboard/tabs/TasksTab'), { loading: Loader });
const ExamsTab = dynamic(() => import('../../components/dashboard/tabs/ExamsTab'), { loading: Loader });
const FinancialsTab = dynamic(() => import('../../components/dashboard/tabs/FinancialsTab'), { loading: Loader });
const OrdersTab = dynamic(() => import('../../components/dashboard/tabs/OrdersTab'), { loading: Loader });
const AnalyticsTab = dynamic(() => import('../../components/dashboard/tabs/AnalyticsTab'), { loading: Loader });
const SettingsTab = dynamic(() => import('../../components/dashboard/tabs/SettingsTab'), { loading: Loader });

// 💡 استدعاء الصفحات الجديدة اللي عملناها
const MessagesTab = dynamic(() => import('../../components/dashboard/tabs/MessagesTab'), { loading: Loader });
const NotificationsTab = dynamic(() => import('../../components/dashboard/tabs/NotificationsTab'), { loading: Loader });

const ChatBox = dynamic(() => import('../../components/chat/ChatBox'), { ssr: false });

const TAB_COMPONENTS: Record<TabValue, React.ComponentType<any>> = {
    [TABS.OVERVIEW]: OverviewTab,
    [TABS.COURSES]: CoursesTab,
    [TABS.TASKS]: TasksTab,
    [TABS.EXAMS]: ExamsTab,
    [TABS.FINANCIALS]: FinancialsTab,
    [TABS.ORDERS]: OrdersTab,
    [TABS.ANALYTICS]: AnalyticsTab,
    [TABS.SETTINGS]: SettingsTab,
    [TABS.MESSAGES]: MessagesTab,       // 👈 ربط الرسائل
    [TABS.NOTIFICATIONS]: NotificationsTab // 👈 ربط الإشعارات
};

// 💡 إضافة Error Boundary لحماية الداشبورد
class TabErrorBoundary extends Component<{ children: ReactNode, lang: string }, { hasError: boolean }> {
    constructor(props: { children: ReactNode, lang: string }) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(_: Error) { return { hasError: true }; }
    componentDidCatch(error: Error, errorInfo: ErrorInfo) { console.error("Tab Error:", error, errorInfo); }
    render() {
        if (this.state.hasError) {
            return (
                <div style={{ background: 'rgba(231, 76, 60, 0.1)', border: '1px dashed var(--danger)', padding: '40px', borderRadius: '15px', textAlign: 'center', marginTop: '20px' }}>
                    <h3 style={{ color: 'var(--danger)', marginBottom: '10px' }}>{this.props.lang === 'ar' ? 'عذراً، حدث خطأ في هذه الصفحة ⚠️' : 'Oops, something went wrong in this tab ⚠️'}</h3>
                    <p style={{ color: 'var(--txt)' }}>{this.props.lang === 'ar' ? 'نعمل على حل المشكلة، يرجى الانتقال لقسم آخر.' : 'We are fixing this issue. Please switch to another tab.'}</p>
                    <Button variant="outline" onClick={() => this.setState({ hasError: false })} style={{ marginTop: '15px' }}>
                        {this.props.lang === 'ar' ? 'إعادة المحاولة' : 'Try Again'}
                    </Button>
                </div>
            );
        }
        return this.props.children;
    }
}

export default function DashboardPage() {
    const { theme, toggleMode, lang } = useSettings(); 
    const { showToast } = useToast(); 
    
    const [activeTab, setActiveTab] = useState<TabValue>(TABS.OVERVIEW);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [walletBalance] = useState(1500);

    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [currentAvatar, setCurrentAvatar] = useState('https://api.dicebear.com/7.x/avataaars/svg?seed=Boy1&style=circle');
    const [tempAvatar, setTempAvatar] = useState('');

    const boysAvatars = useMemo(() => Array.from({ length: 10 }, (_, i) => `https://api.dicebear.com/7.x/avataaars/svg?seed=Boy${i + 1}&style=circle`), []);
    const girlsAvatars = useMemo(() => Array.from({ length: 10 }, (_, i) => `https://api.dicebear.com/7.x/avataaars/svg?seed=Girl${i + 1}&style=circle`), []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedAvatar = localStorage.getItem('pixel_saved_avatar');
            if (savedAvatar) setCurrentAvatar(savedAvatar);
        }
    }, []);

    const saveNewAvatar = () => {
        if (tempAvatar) {
            setCurrentAvatar(tempAvatar);
            localStorage.setItem('pixel_saved_avatar', tempAvatar);
            setIsAvatarModalOpen(false);
            showToast(lang === 'ar' ? 'تم تحديث صورتك الشخصية بنجاح! 🎭' : 'Avatar updated successfully! 🎭', 'success');
        } else {
            showToast(lang === 'ar' ? 'يرجى اختيار صورة أولاً' : 'Please select an avatar first', 'error');
        }
    };

    const ActiveComponent = TAB_COMPONENTS[activeTab] || OverviewTab; 

    return (
        <div className="dashboard-root">
            <Header 
                toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
                theme={theme} 
                toggleTheme={toggleMode} 
                walletBalance={walletBalance} 
                lang={lang} 
                setActiveTab={(tab) => setActiveTab(tab as TabValue)} // 👈 الدالة اتضافت هنا، الإيرور اختفى!
            />

            <div className="dash-container">
                <Sidebar 
                    activeTab={activeTab} 
                    setActiveTab={(tab) => setActiveTab(tab as TabValue)} 
                    isMobileOpen={isSidebarOpen} 
                    closeMobileSidebar={() => setIsSidebarOpen(false)}
                    currentAvatar={currentAvatar} 
                    openAvatarModal={() => setIsAvatarModalOpen(true)}
                    lang={lang} 
                />

                <main className="dash-content">
                    <TabErrorBoundary key={activeTab} lang={lang}>
                        <ActiveComponent lang={lang} />
                    </TabErrorBoundary>
                </main>
            </div>

            <ChatBox />

            <Modal 
                isOpen={isAvatarModalOpen} 
                onClose={() => setIsAvatarModalOpen(false)}
                title={lang === 'ar' ? 'اختر هويتك الافتراضية 🎭' : 'Choose Your Avatar 🎭'}
                maxWidth="650px"
            >
                <div dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                    <h4 style={{ color: 'var(--success)', marginBottom: '15px' }}>
                        {lang === 'ar' ? 'قسم الأولاد 👨‍🎓' : 'Boys Section 👨‍🎓'}
                    </h4>
                    <div className="avatar-grid">
                        {boysAvatars.map((url, i) => (
                            <img key={`boy-${i}`} src={url} className={`avatar-option ${tempAvatar === url ? 'selected' : ''}`} onClick={() => setTempAvatar(url)} alt="boy avatar" />
                        ))}
                    </div>
                    
                    <h4 style={{ color: '#e84393', marginTop: '25px', marginBottom: '15px' }}>
                        {lang === 'ar' ? 'قسم البنات 👩‍🎓' : 'Girls Section 👩‍🎓'}
                    </h4>
                    <div className="avatar-grid">
                        {girlsAvatars.map((url, i) => (
                            <img key={`girl-${i}`} src={url} className={`avatar-option ${tempAvatar === url ? 'selected' : ''}`} onClick={() => setTempAvatar(url)} alt="girl avatar" />
                        ))}
                    </div>
                    
                    <div style={{ marginTop: '30px' }}>
                        <Button fullWidth size="lg" onClick={saveNewAvatar}>
                            {lang === 'ar' ? 'حفظ الصورة الجديدة' : 'Save New Avatar'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}