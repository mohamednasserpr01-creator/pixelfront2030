// FILE: components/lecture/LectureSummary/LectureSummary.tsx
"use client";
import React from 'react';
import Link from 'next/link';
import { FaTrophy, FaCheckCircle, FaChartLine, FaArrowRight, FaClock } from 'react-icons/fa';
import { useSettings } from '../../../context/SettingsContext';
import { Button } from '../../ui/Button';
import confetti from 'canvas-confetti'; // 💡 هنحتاج ننزل المكتبة دي عشان حركات الاحتفال

interface LectureSummaryProps {
    lectureNameAr: string;
    lectureNameEn: string;
    completionRate: number; // مثلاً 100%
    examScore: number;      // مثلاً 85%
    timeSpent: string;      // مثلاً "45 دقيقة"
}

export default function LectureSummary({ lectureNameAr, lectureNameEn, completionRate, examScore, timeSpent }: LectureSummaryProps) {
    const { lang } = useSettings();
    const isAr = lang === 'ar';

    // 💡 تشغيل حركة الاحتفال (الورق الملون) أول ما الشاشة تظهر
    React.useEffect(() => {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#6c5ce7', '#2ecc71', '#ffd700']
        });
    }, []);

    return (
        <div style={{ 
            background: 'var(--card)', 
            borderRadius: '20px', 
            border: '2px solid var(--success)', 
            padding: '40px 20px', 
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(46, 204, 113, 0.2)',
            animation: 'fadeInUp 0.5s ease-out'
        }}>
            <div style={{ 
                width: '100px', height: '100px', background: 'rgba(46, 204, 113, 0.1)', 
                borderRadius: '50%', margin: '0 auto 20px', display: 'flex', 
                justifyContent: 'center', alignItems: 'center', border: '3px solid var(--success)' 
            }}>
                <FaTrophy style={{ fontSize: '3rem', color: 'var(--gold)' }} />
            </div>

            <h1 style={{ color: 'var(--txt)', marginBottom: '10px', fontSize: '2.2rem', fontWeight: 900 }}>
                {isAr ? 'عاش يا بطل! تم إنجاز الحصة 🎓' : 'Great Job! Lecture Completed 🎓'}
            </h1>
            <p style={{ color: 'var(--p-purple)', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '30px' }}>
                {isAr ? lectureNameAr : lectureNameEn}
            </p>

            {/* شبكة الإحصائيات (التقرير) */}
            <div style={{ 
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                gap: '20px', marginBottom: '40px', maxWidth: '800px', margin: '0 auto 40px' 
            }}>
                <div style={{ background: 'var(--bg)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <FaCheckCircle style={{ fontSize: '2rem', color: 'var(--success)', marginBottom: '10px' }} />
                    <h3 style={{ fontSize: '1.5rem', color: 'var(--txt)', marginBottom: '5px' }}>{completionRate}%</h3>
                    <p style={{ color: 'var(--txt-mut)', fontSize: '0.9rem' }}>{isAr ? 'نسبة الإنجاز' : 'Completion'}</p>
                </div>

                <div style={{ background: 'var(--bg)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <FaChartLine style={{ fontSize: '2rem', color: examScore >= 50 ? 'var(--success)' : 'var(--danger)', marginBottom: '10px' }} />
                    <h3 style={{ fontSize: '1.5rem', color: 'var(--txt)', marginBottom: '5px' }}>{examScore}%</h3>
                    <p style={{ color: 'var(--txt-mut)', fontSize: '0.9rem' }}>{isAr ? 'نتيجة الامتحان' : 'Exam Score'}</p>
                </div>

                <div style={{ background: 'var(--bg)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <FaClock style={{ fontSize: '2rem', color: 'var(--warning)', marginBottom: '10px' }} />
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--txt)', marginBottom: '5px' }}>{timeSpent}</h3>
                    <p style={{ color: 'var(--txt-mut)', fontSize: '0.9rem' }}>{isAr ? 'الوقت المستغرق' : 'Time Spent'}</p>
                </div>
            </div>

            <p style={{ color: 'var(--txt-mut)', marginBottom: '25px' }}>
                {isAr ? 'تم حفظ هذا التقرير بنجاح في ملفك الشخصي. يمكنك مراجعته في أي وقت من لوحة التحكم.' : 'This report has been saved to your profile. You can review it anytime from your dashboard.'}
            </p>

            <Link href="/dashboard" style={{ textDecoration: 'none' }}>
                <Button size="lg" icon={<FaArrowRight style={{ transform: isAr ? 'rotate(180deg)' : 'none' }} />}>
                    {isAr ? 'العودة إلى لوحة التحكم' : 'Return to Dashboard'}
                </Button>
            </Link>
        </div>
    );
}