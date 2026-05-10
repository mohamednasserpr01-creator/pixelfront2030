// FILE: components/exam/ExamIntro.tsx
import React from 'react';
import { FaClock, FaListOl } from 'react-icons/fa';
import { Exam } from '../../types';

interface Props {
    exam: Exam;
    lang: string;
    onStart: () => void;
}

export default function ExamIntro({ exam, lang, onStart }: Props) {
    return (
        <div className="exam-intro" style={{ textAlign: 'center' }}>
            <h1 style={{ color: 'var(--p-purple)', marginBottom: '15px' }}>{lang === 'ar' ? exam.titleAr : exam.titleEn}</h1>
            <p style={{ fontWeight: 'bold', color: 'var(--txt-mut)', marginBottom: '30px' }}>{lang === 'ar' ? exam.lectureAr : exam.lectureEn}</p>
            
            <div className="exam-stats" style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '40px' }}>
                <div className="ex-stat-box" style={{ background: 'var(--h-bg)', padding: '20px', borderRadius: '15px', minWidth: '120px' }}>
                    <FaClock style={{ fontSize: '2rem', color: 'var(--warning)', marginBottom: '10px' }} />
                    <h4>{exam.timeLimit} {lang === 'ar' ? 'دقيقة' : 'Mins'}</h4>
                </div>
                <div className="ex-stat-box" style={{ background: 'var(--h-bg)', padding: '20px', borderRadius: '15px', minWidth: '120px' }}>
                    <FaListOl style={{ fontSize: '2rem', color: 'var(--success)', marginBottom: '10px' }} />
                    <h4>{exam.questions.length} {lang === 'ar' ? 'أسئلة' : 'Questions'}</h4>
                </div>
            </div>

            <button className="btn-start-exam glow-btn" onClick={onStart} style={{ background: 'var(--p-purple)', color: '#fff', border: 'none', padding: '15px 40px', borderRadius: '50px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' }}>
                {lang === 'ar' ? 'ابدأ الامتحان الآن' : 'Start Exam Now'}
            </button>
        </div>
    );
}