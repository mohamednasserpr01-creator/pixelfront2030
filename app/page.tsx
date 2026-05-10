// app/page.tsx
"use client";
import React, { useEffect } from 'react';

// استدعاء الأقسام
import Hero from '../components/home/Hero';
import CoursesSection from '../components/home/CoursesSection';
import ServicesSection from '../components/home/ServicesSection';
import ForumSection from '../components/home/ForumSection'; // 👈 استدعيناه هنا
import OffersSection from '../components/home/OffersSection';

import { useSettings } from '../context/SettingsContext';

export default function Home() {
    const { lang } = useSettings();

    useEffect(() => {
        const observerOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <main className="main-content-wrapper" style={{ paddingTop: '80px' }}>            
            <Hero lang={lang} />
            <CoursesSection lang={lang} />
            <ServicesSection lang={lang} />
            
            {/* 💡 الكود بقى سطر واحد ونضيف جداً! */}
            <ForumSection lang={lang} />
            
            <OffersSection lang={lang} />
        </main>
    );
}