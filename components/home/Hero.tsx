"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link'; // ← ضفنا استدعاء اللينك هنا

// دي الإضافة بتاعة التايب سكريبت عشان نعرّف نوع كلمة lang
interface HeroProps {
    lang: string;
}

export default function Hero({ lang }: HeroProps) {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentSlide(prev => (prev === 0 ? 1 : 0));
        }, 5000);
        return () => clearInterval(slideInterval);
    }, []);

    return (
        <section className="hero">
            <div className={`slide ${currentSlide === 0 ? 'active' : ''}`}>
                <Image src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1920" alt="Pixel Academy Slide 1" fill style={{ objectFit: 'cover' }} priority />
            </div>
            <div className={`slide ${currentSlide === 1 ? 'active' : ''}`}>
                <Image src="https://images.unsplash.com/photo-1510070112810-d4e9a46d9e91?q=80&w=1920" alt="Pixel Academy Slide 2" fill style={{ objectFit: 'cover' }} />
            </div>
            <div className="hero-text">
                <h1 className="reveal active">PIXEL ACADEMY</h1>
                <p className="reveal delay-1 active">{lang === 'ar' ? 'أكاديمية بيكسل.. خطوتك الأولى نحو التفوق' : 'Pixel Academy.. Your first step to excellence'}</p>
                
                {/* التعديل هنا: استخدام Link بدل a tag للتحويل السريع */}
                <Link href="/auth" className="btn-primary reveal delay-2 active" style={{ padding: '15px 40px', fontSize: '1.2rem', borderRadius: '50px', display: 'inline-block' }}>
                    {lang === 'ar' ? 'ابدأ رحلتك الآن' : 'Start Your Journey'}
                </Link>
            </div>
        </section>
    );
}