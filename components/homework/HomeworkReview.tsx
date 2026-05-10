// FILE: components/homework/HomeworkReview.tsx
import React from 'react';
import { FaClipboardCheck, FaPlayCircle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { Homework } from '../../types';

interface Props {
    hw: Homework;
    answers: Record<string, any>;
    earnedScore: number;
    lang: string;
}

export default function HomeworkReview({ hw, answers, earnedScore, lang }: Props) {
    const router = useRouter();

    return (
        <div id="step-review">
            <div className="review-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '2px solid var(--h-bg)', paddingBottom: '20px' }}>
                <div>
                    <h2 style={{ color: 'var(--p-purple)', display: 'flex', alignItems: 'center', gap: '10px' }}><FaClipboardCheck /> {lang === 'ar' ? 'نموذج إجابات الواجب' : 'Model Answers'}</h2>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, marginTop: '10px', background: 'rgba(241, 196, 15, 0.1)', color: 'var(--txt)', padding: '5px 15px', borderRadius: '8px', display: 'inline-block', border: '1px solid rgba(241, 196, 15, 0.3)' }}>
                        {lang === 'ar' ? 'الدرجة النهائية:' : 'Final Score:'} <span style={{ color: '#f1c40f' }}>{earnedScore} / {hw.totalScore}</span>
                    </div>
                </div>
                <button className="btn-continue" style={{ background: 'var(--h-bg)', color: 'var(--txt)', border: 'none', padding: '10px 25px', borderRadius: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => router.back()}>
                    <FaPlayCircle /> {lang === 'ar' ? 'العودة للمحاضرة' : 'Back to Lecture'}
                </button>
            </div>

            {hw.questions.map((q, i) => {
                const isCorrect = q.type !== 'essay' && answers[q.id] === q.correctAns; 
                // المقالي بنعتبره محتاج تصحيح من المدرس (إجابة غير مكتملة افتراضياً)
                const isEssay = q.type === 'essay';
                
                return (
                    <div key={q.id} className="review-box" style={{ background: 'var(--bg)', border: '1px solid var(--h-bg)', borderRadius: '15px', padding: '25px', marginBottom: '20px' }}>
                        <h3 style={{ marginBottom: '15px', color: 'var(--txt)' }}>
                            <span style={{ color: 'var(--p-purple)' }}>{lang === 'ar' ? 'س' : 'Q'}{i + 1}:</span> {lang === 'ar' ? q.textAr : q.textEn}
                        </h3>
                        
                        <div style={{ background: isCorrect ? 'rgba(46, 204, 113, 0.05)' : (isEssay ? 'rgba(241, 196, 15, 0.05)' : 'rgba(231, 76, 60, 0.05)'), border: `1px solid ${isCorrect ? 'var(--success)' : (isEssay ? 'var(--warning)' : 'var(--danger)')}`, padding: '20px', borderRadius: '10px', marginTop: '15px', lineHeight: 1.6 }}>
                            <span style={{ display: 'inline-block', background: isCorrect ? 'var(--success)' : (isEssay ? 'var(--warning)' : 'var(--danger)'), color: isEssay ? 'var(--bg)' : 'white', padding: '3px 10px', borderRadius: '5px', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '15px' }}>
                                {isCorrect ? (lang === 'ar' ? `إجابتك صحيحة (${q.score}/${q.score})` : `Correct (${q.score}/${q.score})`) : 
                                (isEssay ? (lang === 'ar' ? `بانتظار تصحيح المعلم (0/${q.score})` : `Pending Grade (0/${q.score})`) : 
                                (lang === 'ar' ? `إجابة خاطئة (0/${q.score})` : `Wrong (0/${q.score})`))}
                            </span> 
                            <br />
                            <div style={{ color: 'var(--txt)' }}>
                                <strong style={{ color: 'var(--p-purple)' }}>{lang === 'ar' ? 'إجابتك:' : 'Your Answer:'}</strong> <br/>
                                {q.type === 'mcq' ? (answers[q.id] !== undefined ? (lang === 'ar' ? q.optionsAr?.[answers[q.id]] : q.optionsEn?.[answers[q.id]]) : '---') : 
                                (q.type === 'tf' ? (answers[q.id] !== undefined ? (answers[q.id] === 'true' ? (lang === 'ar' ? 'صواب' : 'True') : (lang === 'ar' ? 'خطأ' : 'False')) : '---') : 
                                (answers[q.id] || '---'))}
                            </div>
                            <br />
                            <div style={{ color: 'var(--txt)' }}>
                                <strong style={{ color: 'var(--success)' }}>{lang === 'ar' ? 'الإجابة النموذجية:' : 'Model Answer:'}</strong> <br/>
                                {lang === 'ar' ? q.reviewAr : q.reviewEn}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}