"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // ركز: استخدمنا مسار الـ App Router الصح
import { motion } from 'framer-motion';
import { FaCheckCircle, FaArrowLeft } from 'react-icons/fa';

export default function WelcomeModal() {
    const router = useRouter();

    // السحر بتاع الـ UX: تحويل تلقائي بعد 3 ثواني
    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/');
        }, 3000);
        
        // تنظيف التايمر عشان لو اليوزر داس على الزرار بنفسه قبل الـ 3 ثواني
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="modal-overlay">
            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                className="modal-box text-center border-success"
            >
                <FaCheckCircle style={{ fontSize: '4rem', color: 'var(--success)', marginBottom: '15px' }} />
                <h2 style={{ marginBottom: '10px', fontWeight: 900 }}>مرحباً بك فى منصة بيكسل أكاديمى! 🎆</h2>
                <p style={{ fontWeight: 'bold', marginBottom: '25px', opacity: 0.9 }}>
                    تم إنشاء حسابك بنجاح. سيتم تحويلك للمنصة تلقائياً الآن...
                </p>
                <button 
                    className="btn-submit btn-success mx-auto" 
                    onClick={() => router.push('/')} 
                    style={{ maxWidth: '300px' }}
                >
                    الدخول فوراً <FaArrowLeft />
                </button>
            </motion.div>
        </div>
    );
}