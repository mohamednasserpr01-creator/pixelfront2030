// components/home/ForumSection.tsx
"use client";
import React from 'react';
import Link from 'next/link';
import { FaUsers } from 'react-icons/fa';
import { Button } from '../ui/Button';

export default function ForumSection({ lang }: { lang: string }) {
    const isAr = lang === 'ar';

    return (
        <section className="section-padding">
            <div className="forum-card reveal">
                <div className="forum-glow-bg1"></div>
                <div className="forum-glow-bg2"></div>
                
                <div className="forum-content" style={{ zIndex: 2, position: 'relative', textAlign: 'center' }}>
                    <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '15px', textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>
                        {isAr ? 'مجتمع بيكسل الحصري 🚀' : 'Exclusive Pixel Community 🚀'}
                    </h2>
                    <p style={{ fontSize: '1.1rem', marginBottom: '30px', maxWidth: '600px', margin: '0 auto 30px', lineHeight: 1.8, opacity: 0.9 }}>
                        {isAr ? 'مساحتك الخاصة للمناقشة مع أوائل الجمهورية ومدرسينك!' : 'Your space to discuss with top students and teachers!'}
                    </p>
                    
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Link href="/forum" style={{ textDecoration: 'none' }}>
                            <Button size="lg" icon={<FaUsers />}>
                                {isAr ? 'دخول إلى المنتدى الآن' : 'Enter Forum Now'}
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}