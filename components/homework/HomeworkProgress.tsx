// FILE: components/homework/HomeworkProgress.tsx
import React from 'react';
import { FaPlayCircle, FaSave, FaPaperPlane } from 'react-icons/fa';

interface Props {
    answeredCount: number;
    totalCount: number;
    progressPercent: number;
    lang: string;
    onBack: () => void;
    onSave: () => void;
    onSubmit: () => void;
}

export default function HomeworkProgress({ answeredCount, totalCount, progressPercent, lang, onBack, onSave, onSubmit }: Props) {
    return (
        <div className="hw-sticky-bar" style={{ position: 'sticky', top: '80px', background: 'var(--card)', zIndex: 100, padding: '15px 0', borderBottom: '2px solid var(--h-bg)', borderTop: '2px solid var(--h-bg)', marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div className="progress-info">
                <div className="progress-text" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontWeight: 'bold' }}>
                    <span>{lang === 'ar' ? 'الأسئلة المجابة:' : 'Answered:'} <b>{answeredCount}</b> {lang === 'ar' ? 'من' : 'of'} <b>{totalCount}</b></span>
                    <span style={{ color: 'var(--p-purple)' }}>{progressPercent}%</span>
                </div>
                <div className="progress-track" style={{ width: '100%', height: '10px', background: 'var(--h-bg)', borderRadius: '50px', overflow: 'hidden' }}>
                    <div className="progress-fill" style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, var(--p-purple), #ff007f)', transition: 'width 0.3s ease' }}></div>
                </div>
            </div>
            <div className="hw-actions" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <button className="btn-nav-exam" style={{ padding: '8px 15px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--h-bg)', color: 'var(--txt)', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }} onClick={onBack}>
                    <FaPlayCircle /> {lang === 'ar' ? 'المحاضرة' : 'Lecture'}
                </button>
                <button className="btn-save-hw" style={{ padding: '8px 15px', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(241, 196, 15, 0.1)', color: '#f1c40f', border: '1px solid #f1c40f', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }} onClick={onSave}>
                    <FaSave /> {lang === 'ar' ? 'حفظ مؤقت' : 'Save'}
                </button>
                <button className="btn-submit-exam glow-btn" style={{ padding: '8px 20px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--p-purple)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }} onClick={onSubmit}>
                    <FaPaperPlane /> {lang === 'ar' ? 'تسليم' : 'Submit'}
                </button>
            </div>
        </div>
    );
}