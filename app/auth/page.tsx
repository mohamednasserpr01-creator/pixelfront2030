// FILE: app/auth/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { AnimatePresence } from 'framer-motion';

import styles from './AuthPage.module.css'; // 💡 استدعاء الـ CSS النظيف

import LoginForm from '../../components/auth/LoginForm';
import RegisterForm from '../../components/auth/RegisterForm';
import WelcomeModal from '../../components/auth/WelcomeModal';
import TermsModal from '../../components/auth/TermsModal';

import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

export default function AuthPage() {
    const [isLoginView, setIsLoginView] = useState(true);
    const [showTerms, setShowTerms] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);

    const router = useRouter();
    const { isLoggedIn } = useAuth();
    const { lang } = useSettings();

    useEffect(() => {
        if (isLoggedIn) {
            router.push('/dashboard');
        }
    }, [isLoggedIn, router]);

    if (isLoggedIn) return null;

    return (
        <main className={styles.mainContainer}>
            <div className={styles.splitLayout}>
                
                {/* ======== 1. قسم الصورة (على اليمين) ======== */}
                <div className={styles.heroSection}>
                    <div className={styles.heroOverlay}>
                        <h1 className={styles.heroTitle}>
                            {lang === 'ar' ? 'مرحباً بك في بيكسل 🚀' : 'Welcome to Pixel 🚀'}
                        </h1>
                        <p className={styles.heroText}>
                            {lang === 'ar' 
                                ? 'أكاديمية بيكسل.. بوابتك للتعليم التفاعلي الذكي وتجربة دراسية لا تُنسى.' 
                                : 'Pixel Academy.. Your gateway to smart interactive education and an unforgettable study experience.'}
                        </p>
                    </div>
                </div>

                {/* ======== 2. قسم الفورم (على الشمال) ======== */}
                <div className={styles.formSection}>
                    <div className={styles.authBox}>
                        <AnimatePresence mode="wait">
                            {isLoginView ? (
                                <LoginForm onSwitchView={() => setIsLoginView(false)} />
                            ) : (
                                <RegisterForm 
                                    onSwitchView={() => setIsLoginView(true)} 
                                    onSuccess={() => setShowWelcome(true)}
                                    onShowTerms={() => setShowTerms(true)}
                                    termsAccepted={termsAccepted}
                                    lang={lang} 
                                />
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* ======== 3. النوافذ المنبثقة ======== */}
                {showTerms && (
                    <TermsModal 
                        onAccept={() => { setShowTerms(false); setTermsAccepted(true); }} 
                        onClose={() => setShowTerms(false)} 
                        lang={lang} 
                    />
                )}
                {showWelcome && <WelcomeModal />}
                
            </div>
        </main>
    );
}