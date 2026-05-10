// FILE: components/exam/ExamResult.tsx
"use client";
import React from 'react';
import { FaEye, FaPlayCircle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

import { Button } from '../ui/Button'; // 💡 استدعاء زر الـ Enterprise

interface Props {
    lang: string;
    scorePercentage: number;
    onReview: () => void;
}

export default function ExamResult({ lang, scorePercentage, onReview }: Props) {
    const router = useRouter();
    const isSuccess = scorePercentage >= 50;
    const isAr = lang === 'ar';

    return (
        <div className="result-card" style={{ textAlign: 'center', padding: '40px 0' }}>
            <h2 style={{ color: 'var(--txt)', marginBottom: '30px' }}>
                {isAr ? 'نتيجة الامتحان' : 'Exam Result'}
            </h2>
            
            <div style={{ 
                width: '150px', height: '150px', borderRadius: '50%', 
                background: isSuccess ? 'linear-gradient(45deg, var(--success), #2ecc71)' : 'linear-gradient(45deg, var(--danger), #e74c3c)', 
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                fontSize: '3rem', fontWeight: 900, margin: '0 auto 30px', 
                boxShadow: isSuccess ? '0 10px 30px rgba(46, 204, 113, 0.4)' : '0 10px 30px rgba(231, 76, 60, 0.4)' 
            }}>
                {scorePercentage}%
            </div>
            
            <h3 style={{ color: isSuccess ? 'var(--success)' : 'var(--danger)', marginBottom: '40px', fontWeight: 900, fontSize: '1.5rem' }}>
                {isSuccess 
                    ? (isAr ? 'لقد اجتزت الامتحان بنجاح 🎉' : 'You passed the exam successfully 🎉')
                    : (isAr ? 'للأسف لم تجتز الامتحان، راجع إجاباتك 😔' : 'Unfortunately, you failed the exam 😔')}
            </h3>
            
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap', maxWidth: '500px', margin: '0 auto' }}>
                {/* 💡 أزرار احترافية متوافقة مع الـ Design System */}
                <Button variant="primary" onClick={onReview} icon={<FaEye />}>
                    {isAr ? 'عرض الإجابات' : 'Review Answers'}
                </Button>
                <Button variant="outline" onClick={() => router.back()} icon={<FaPlayCircle />}>
                    {isAr ? 'العودة للمحاضرة' : 'Back to Lecture'}
                </Button>
            </div>
        </div>
    );
}