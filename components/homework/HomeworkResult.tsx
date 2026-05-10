// FILE: components/homework/HomeworkResult.tsx
import React from 'react';
import { FaStar, FaEye, FaPlayCircle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface Props {
    scorePercentage: number;
    earnedScore: number;
    totalScore: number;
    lang: string;
    onReview: () => void;
}

export default function HomeworkResult({ scorePercentage, earnedScore, totalScore, lang, onReview }: Props) {
    const router = useRouter();
    const isSuccess = scorePercentage >= 50;

    return (
        <div className="hw-result" style={{ display: 'block', textAlign: 'center' }}>
            <div className="result-card" style={{ background: 'var(--bg)', border: `2px solid ${isSuccess ? '#2ecc71' : '#e74c3c'}`, borderRadius: '20px', padding: '40px' }}>
                <h2 style={{ marginBottom: '20px', color: 'var(--p-purple)', fontWeight: 900 }}>{lang === 'ar' ? 'نتيجة الواجب 📝' : 'Homework Result 📝'}</h2>
                
                <div className="score-circle" style={{ width: '150px', height: '150px', borderRadius: '50%', border: `8px solid ${isSuccess ? '#2ecc71' : '#e74c3c'}`, margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 900, color: isSuccess ? '#2ecc71' : '#e74c3c' }}>
                    {scorePercentage}%
                </div>
                
                <div className="grade-text" style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--txt)', marginBottom: '15px' }}>
                    <FaStar style={{ color: '#f1c40f' }}/> {lang === 'ar' ? 'الدرجة:' : 'Score:'} {earnedScore} / {totalScore}
                </div>
                
                <h3 style={{ color: isSuccess ? '#2ecc71' : '#e74c3c', marginBottom: '30px', fontWeight: 900, fontSize: '1.4rem' }}>
                    {isSuccess 
                        ? (lang === 'ar' ? 'أحسنت يا بطل! تم تسليم الواجب بنجاح.' : 'Great job! Homework submitted successfully.')
                        : (lang === 'ar' ? 'يجب مراجعة المحاضرة مرة أخرى لتحسين مستواك.' : 'You should review the lecture again.')}
                </h3>
                
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button className="btn-nav-exam glow-btn" style={{ background: 'var(--p-purple)', color: '#fff', border: 'none', padding: '13px 30px', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold' }} onClick={onReview}>
                        <FaEye /> {lang === 'ar' ? 'مراجعة الإجابات' : 'Review Answers'}
                    </button>
                    <button className="btn-continue glow-btn" style={{ background: isSuccess ? '#2ecc71' : 'var(--h-bg)', color: isSuccess ? 'white' : 'var(--txt)', border: 'none', padding: '13px 30px', borderRadius: '50px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => router.back()}>
                        <FaPlayCircle /> {lang === 'ar' ? 'استكمال المحاضرة' : 'Back to Lecture'}
                    </button>
                </div>
            </div>
        </div>
    );
}