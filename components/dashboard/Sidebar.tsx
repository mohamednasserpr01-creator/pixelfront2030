"use client";
import React from 'react';
import { 
    FaHome, FaPlayCircle, FaFileAlt, FaMoneyCheckAlt, 
    FaBoxOpen, FaChartPie, FaCog, 
    FaTimes, FaTrophy, FaLock, FaPencilAlt, FaClipboardList
} from 'react-icons/fa';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    isMobileOpen: boolean;
    closeMobileSidebar: () => void;
    currentAvatar: string;
    openAvatarModal: () => void;
    lang: string; 
}

export default function Sidebar({ activeTab, setActiveTab, isMobileOpen, closeMobileSidebar, currentAvatar, openAvatarModal, lang }: SidebarProps) {
    const isAr = lang === 'ar';

    // 💡 تم إضافة "مهامي الدراسية" (Tasks) كصفحة كاملة في القائمة
    const navItems = [
        { id: 'overview', icon: <FaHome />, label: isAr ? 'نظرة عامة' : 'Overview' },
        { id: 'courses', icon: <FaPlayCircle />, label: isAr ? 'مسيرتي التعليمية' : 'My Courses' },
        { id: 'tasks', icon: <FaClipboardList />, label: isAr ? 'مهامي الدراسية' : 'My Tasks' }, // 👈 التاب الجديد
        { id: 'exams', icon: <FaFileAlt />, label: isAr ? 'الامتحانات والواجبات' : 'Exams & Homework' },
        { id: 'financials', icon: <FaMoneyCheckAlt />, label: isAr ? 'المحفظة والأكواد' : 'Wallet & Codes' },
        { id: 'orders', icon: <FaBoxOpen />, label: isAr ? 'طلبات المتجر' : 'Store Orders' },
        { id: 'analytics', icon: <FaChartPie />, label: isAr ? 'تحليل الأداء' : 'Analytics' },
        { id: 'settings', icon: <FaCog />, label: isAr ? 'إعدادات الحساب والأمان' : 'Account Settings' }
    ];

    return (
        <>
            <div className={`sidebar-overlay ${isMobileOpen ? 'active' : ''}`} onClick={closeMobileSidebar}></div>

            <aside className={`dash-sidebar ${isMobileOpen ? 'active' : ''}`} style={{ direction: isAr ? 'rtl' : 'ltr' }}>
                <button className="mobile-close-sidebar" onClick={closeMobileSidebar} style={{ left: isAr ? '10px' : 'auto', right: isAr ? 'auto' : '10px' }}><FaTimes /></button>
                
                <div className="student-id-card">
                    <div className="avatar-container">
                        <img src={currentAvatar} alt="Student" />
                        <button className="edit-avatar-btn" onClick={openAvatarModal} title={isAr ? "تغيير الأفاتار" : "Change Avatar"}><FaPencilAlt size={12} /></button>
                    </div>
                    <h3>{isAr ? 'أحمد محمود' : 'Ahmed Mahmoud'}</h3>
                    <p>@Ahmed_Pixel_99</p>
                    
                    <div className="rank-box">
                        <div className="rank-val"><FaTrophy /> {isAr ? 'المركز: 15 على المنصة' : 'Rank: 15 Platform-wide'}</div>
                        <div className="score-val">{isAr ? 'نقاط العبقرية: 8,450 نقطة' : 'Genius Points: 8,450'}</div>
                    </div>
                    
                    <div className="secret-code-box" title={isAr ? "مرر الماوس لرؤية الكود" : "Hover to reveal code"}>
                        <span><FaLock /> {isAr ? 'كود ولي الأمر السري:' : 'Parent Secret Code:'}</span>
                        <div className="secret-code">PX-7845-XY</div>
                    </div>
                </div>

                <nav className="dash-nav">
                    {navItems.map((item) => (
                        <button 
                            key={item.id} 
                            className={activeTab === item.id ? 'active' : ''} 
                            onClick={() => {
                                setActiveTab(item.id);
                                closeMobileSidebar(); 
                            }}
                            style={{ justifyContent: 'flex-start', gap: '15px' }}
                        >
                            {item.icon} {item.label}
                        </button>
                    ))}
                </nav>
            </aside>
        </>
    );
}