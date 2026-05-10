"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

interface SettingsContextType {
    theme: string;
    lang: string;
    toggleMode: () => void;
    toggleLang: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState('dark');
    const [lang, setLang] = useState('ar');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const savedTheme = localStorage.getItem('pixel_theme') || 'dark';
        const savedLang = localStorage.getItem('pixel_lang') || 'ar';
        
        setTheme(savedTheme);
        setLang(savedLang);

        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
        } else {
            document.body.classList.remove('light-mode');
        }

        document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = savedLang;
    }, []);

    const toggleMode = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('pixel_theme', newTheme);
        document.body.classList.toggle('light-mode');
    };

    const toggleLang = () => {
        const newLang = lang === 'ar' ? 'en' : 'ar';
        setLang(newLang);
        localStorage.setItem('pixel_lang', newLang);
        document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = newLang;
    };

    // 💡 التعديل هنا: الـ Provider بقى بيغلف المحتوى فوراً وبدون أي شروط تأخير
    return (
        <SettingsContext.Provider value={{ theme, lang, toggleMode, toggleLang }}>
            {children}
        </SettingsContext.Provider>
    );
}

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) throw new Error("useSettings must be used within SettingsProvider");
    return context;
};