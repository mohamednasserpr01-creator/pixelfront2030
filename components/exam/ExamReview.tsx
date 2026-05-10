// FILE: components/exam/ExamReview.tsx
"use client";
import React from 'react';
import { FaClipboardCheck, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { Exam } from '../../types';

import { Button } from '../ui/Button'; // 💡 استدعاء زر الـ Enterprise

interface Props {
    exam: Exam;
    lang: string;
    answers: Record<number, any>;
    onBackToResult: () => void;
}

export default function ExamReview({ exam, lang, answers, onBackToResult }: Props) {
    const isAr = lang === 'ar';

    return (
        <div>
            <div className="review-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', paddingBottom: '20px', borderBottom: '2px solid var(--h-bg)' }}>
                <h2 style={{ color: 'var(--p-purple)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaClipboardCheck /> {isAr ? 'مراجعة الإجابات' : 'Review Answers'}
                </h2>
                
                {/* 💡 زر الرجوع احترافي ومتوافق مع اتجاه اللغة */}
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={onBackToResult} 
                    icon={isAr ? <FaArrowRight /> : <FaArrowLeft />}
                >
                    {isAr ? 'العودة للنتيجة' : 'Back'}
                </Button>
            </div>

            {exam.questions.map((q, i) => {
                const isCorrect = q.type === 'mcq' ? answers[q.id] === q.correctAns : null; 
                
                return (
                    <div key={q.id} className="review-box" style={{ background: 'var(--bg)', padding: '25px', borderRadius: '15px', marginBottom: '20px', border: `1px solid ${q.type === 'mcq' ? (isCorrect ? 'var(--success)' : 'var(--danger)') : 'var(--warning)'}` }}>
                        <h3 style={{ marginBottom: '15px', color: 'var(--txt)', lineHeight: '1.5' }}>
                            <span style={{ color: 'var(--p-purple)', marginRight: isAr ? '0' : '10px', marginLeft: isAr ? '10px' : '0' }}>{isAr ? 'س' : 'Q'}{i + 1}:</span> 
                            {isAr ? q.textAr : q.textEn}
                        </h3>
                        
                        <div style={{ background: 'var(--h-bg)', padding: '20px', borderRadius: '10px' }}>
                            {q.type === 'mcq' && (
                                <div style={{ marginBottom: '15px' }}>
                                    <span style={{ display: 'inline-block', padding: '5px 15px', borderRadius: '50px', background: isCorrect ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)', color: isCorrect ? 'var(--success)' : 'var(--danger)', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                        {isCorrect ? (isAr ? 'إجابتك صحيحة' : 'Correct') : (isAr ? 'إجابة خاطئة' : 'Wrong')}
                                    </span>
                                </div>
                            )}
                            
                            <div style={{ marginBottom: '15px', color: 'var(--txt)' }}>
                                <strong style={{ color: 'var(--p-purple)' }}>{isAr ? 'إجابتك:' : 'Your Answer:'}</strong> <br/>
                                <span style={{ display: 'inline-block', marginTop: '5px', whiteSpace: 'pre-wrap' }}>
                                    {q.type === 'mcq' ? (answers[q.id] !== undefined ? (isAr ? q.optionsAr?.[answers[q.id]] : q.optionsEn?.[answers[q.id]]) : '---') : (answers[q.id] || '---')}
                                </span>
                            </div>
                            
                            <div style={{ color: 'var(--txt)' }}>
                                <strong style={{ color: 'var(--success)' }}>{isAr ? 'الإجابة النموذجية:' : 'Model Answer:'}</strong> <br/>
                                <span style={{ display: 'inline-block', marginTop: '5px' }}>
                                    {isAr ? q.explanationAr : q.explanationEn}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}