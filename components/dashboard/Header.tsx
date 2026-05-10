// FILE: components/dashboard/Header.tsx
"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
    FaBars, FaHome, FaEnvelope, 
    FaWallet, FaMoon, FaSun, FaSignOutAlt, 
    FaRobot 
} from 'react-icons/fa';

import { NotificationBell } from '../../features/notifications/components/NotificationBell';

interface HeaderProps {
    toggleSidebar: () => void;
    theme: string;
    toggleTheme: () => void;
    walletBalance: number;
    lang: string;
    setActiveTab: (tab: string) => void; 
}

export default function Header({ toggleSidebar, theme, toggleTheme, walletBalance, lang, setActiveTab }: HeaderProps) {
    const isAr = lang === 'ar';
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleDrop = (dropName: string) => {
        setActiveDropdown(activeDropdown === dropName ? null : dropName);
    };

    const handleViewAll = (tabName: string) => {
        setActiveTab(tabName);
        setActiveDropdown(null);
    };

    return (
        <header className="dash-header">
            <div className="logo">
                <button className="mobile-toggle" onClick={toggleSidebar}>
                    <FaBars />
                </button>
                <img src="https://via.placeholder.com/150x40/6c5ce7/ffffff?text=Pixel+Academy" alt="Logo" />
            </div>

            <div className="toolbar" ref={dropdownRef}>
                <Link href="/" className="icon-btn" title={isAr ? "الرئيسية" : "Home"}><FaHome /></Link>
                
                {/* --- قائمة الرسائل --- */}
                <div className="icon-wrapper">
                    <button className="icon-btn" onClick={() => toggleDrop('msgs')}>
                        <FaEnvelope />
                        <span className="badge-dot" style={{ background: 'var(--warning)' }}></span>
                    </button>
                    <div className={`dropdown-menu ${activeDropdown === 'msgs' ? 'active' : ''}`}>
                        <div className="drop-header">
                            <span>{isAr ? 'الرسائل (2)' : 'Messages (2)'}</span>
                            <span style={{ color: 'var(--p-purple)', fontSize: '0.8rem', cursor: 'pointer' }}>{isAr ? 'فتح المنتدى' : 'Open Forum'}</span>
                        </div>
                        <div className="drop-body">
                            <div className="drop-item unread" onClick={() => handleViewAll('messages')}>
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jack" className="drop-avatar" alt="User" />
                                <div className="drop-content">
                                    <h4>Physics_Lover</h4>
                                    <p>{isAr ? 'يا صاحبي حليت مسألة كيرشوف الصعبة ولا لسه؟' : 'Did you solve the Kirchhoff problem?'}</p>
                                    <span className="drop-time">{isAr ? 'منذ 10 دقائق' : '10 mins ago'}</span>
                                </div>
                            </div>
                            <div className="drop-item" onClick={() => handleViewAll('messages')}>
                                <div className="drop-icon"><FaRobot /></div>
                                <div className="drop-content">
                                    <h4>Pixel Bot</h4>
                                    <p>{isAr ? 'مرحباً بك في مجتمع بيكسل!' : 'Welcome to Pixel community!'}</p>
                                    <span className="drop-time">{isAr ? 'منذ يومين' : '2 days ago'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="drop-footer" onClick={() => handleViewAll('messages')}>
                            {isAr ? 'عرض كل الرسائل' : 'View all messages'}
                        </div>
                    </div>
                </div>

                {/* 🚀 السحر هنا: تم ربط زرار "عرض الكل" بالدالة عشان يفتح التاب */}
                <NotificationBell onViewAll={() => handleViewAll('notifications')} />
                
                <div className="wallet-badge">
                    <FaWallet /> <span>{walletBalance.toLocaleString('en-US')}</span> ج.م
                </div>

                <button className="icon-btn" onClick={toggleTheme}>
                    {theme === 'dark' ? <FaSun /> : <FaMoon />}
                </button>

                <button className="btn-logout" title={isAr ? "تسجيل خروج" : "Logout"}><FaSignOutAlt /></button>
            </div>
        </header>
    );
}