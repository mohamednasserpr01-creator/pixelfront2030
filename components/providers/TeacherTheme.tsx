"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { FaSun, FaMoon } from "react-icons/fa";
import '../../styles/teacher-theme.css'; // 🚀 تم تعديل المسار هنا (رجعنا خطوتين لورا)

// 1. Context
const TeacherThemeContext = createContext({ isDark: true, toggleTheme: () => {} });
export const useTeacherTheme = () => useContext(TeacherThemeContext);

// 2. Provider (بيغلف صفحة المدرس)
export const TeacherThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [isDark, setIsDark] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // حفظ تفضيل المدرس في المتصفح
        const savedTheme = localStorage.getItem('teacherTheme');
        if (savedTheme === 'light') setIsDark(false);
    }, []);

    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        localStorage.setItem('teacherTheme', newTheme ? 'dark' : 'light');
    };

    // قبل ما الـ Client يشتغل عشان الـ Hydration error
    if (!mounted) return <div className="teacher-container teacher-dark">{children}</div>;

    return (
        <TeacherThemeContext.Provider value={{ isDark, toggleTheme }}>
            <div className={`teacher-container ${isDark ? 'teacher-dark' : ''}`}>
                {children}
            </div>
        </TeacherThemeContext.Provider>
    );
};

// 3. Switcher Button (الزرار اللي هتحطه في الهيدر)
export const TeacherThemeSwitcher = () => {
    const { isDark, toggleTheme } = useTeacherTheme();
    return (
        <button
            onClick={toggleTheme}
            style={{
                background: 'var(--card)', border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--p-purple)', width: '40px', height: '40px', borderRadius: '50%',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: '0.3s'
            }}
            title="تغيير مظهر لوحة التحكم"
        >
            {isDark ? <FaSun size={18} /> : <FaMoon size={18} />}
        </button>
    );
};