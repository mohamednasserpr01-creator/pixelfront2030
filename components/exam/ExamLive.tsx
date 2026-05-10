// FILE: components/exam/ExamLive.tsx
"use client";
import React, { useEffect } from 'react';
import { FaCamera, FaArrowRight, FaArrowLeft, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import ExamTimer from './ExamTimer';
import { Exam, Question } from '../../types';

// 💡 استدعاء نظام الـ UI والإشعارات
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';

interface Props {
    exam: Exam;
    lang: string;
    currentQIndex: number;
    timeLeft: number;
    answers: Record<number, any>;
    onAnswerChange: (qId: number, val: any) => void;
    onNext: () => void;
    onPrev: () => void;
    onSubmit: () => void;
    onTimeUp: () => void;
    onNavigateTo: (index: number) => void;
}

export default function ExamLive({ exam, lang, currentQIndex, answers, onAnswerChange, onNext, onPrev, onSubmit, onTimeUp, onNavigateTo }: Props) {
    const currentQ = exam.questions[currentQIndex];
    const { showToast } = useToast();
    const isAr = lang === 'ar';

    // 🚨 سحر الـ Enterprise: نظام منع الغش (Anti-Cheat System)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                // إذا قام الطالب بفتح نافذة أخرى أو تصغير المتصفح
                showToast(
                    isAr 
                        ? '⚠️ تحذير: الخروج من صفحة الامتحان أو فتح نافذة أخرى يعتبر محاولة غش!' 
                        : '⚠️ Warning: Leaving the exam tab is considered a cheating attempt!',
                    'error'
                );
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [isAr, showToast]);

    return (
        <div>
            {/* Header & Timer */}
            <div className="exam-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '20px', borderBottom: '2px solid var(--h-bg)' }}>
                <div style={{ fontWeight: 'bold', color: 'var(--p-purple)', fontSize: '1.2rem' }}>
                    {isAr ? 'السؤال' : 'Question'} {currentQIndex + 1} {isAr ? 'من' : 'of'} {exam.questions.length}
                </div>
                <ExamTimer initialTimeLimit={exam.timeLimit} onTimeUp={onTimeUp} />
            </div>

            {/* 💡 Question Navigator (التنقل السريع) بنظافة */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '30px', overflowX: 'auto', paddingBottom: '10px' }}>
                {exam.questions.map((q, idx) => {
                    const isAnswered = answers[q.id] !== undefined && answers[q.id] !== null && answers[q.id].toString().trim() !== '';
                    const isActive = currentQIndex === idx;
                    return (
                        <button 
                            key={q.id}
                            onClick={() => onNavigateTo(idx)}
                            style={{ 
                                width: '40px', height: '40px', borderRadius: '8px', fontWeight: 'bold', 
                                border: isActive ? '2px solid var(--p-purple)' : '2px solid transparent', 
                                background: isAnswered ? 'var(--p-purple)' : 'var(--h-bg)', 
                                color: isAnswered ? '#fff' : 'var(--txt)', 
                                cursor: 'pointer', flexShrink: 0, transition: '0.2s' 
                            }}
                            title={isAr ? `الذهاب للسؤال ${idx + 1}` : `Go to question ${idx + 1}`}
                        >
                            {idx + 1}
                        </button>
                    );
                })}
            </div>

            {/* Question Card */}
            <div className="question-card" style={{ marginBottom: '40px' }}>
                <div className="q-meta" style={{ marginBottom: '15px' }}>
                    <span className="q-type" style={{ background: 'var(--p-purple)', color: '#fff', padding: '5px 15px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        {currentQ.type === 'mcq' ? (isAr ? 'اختيار من متعدد' : 'Multiple Choice') : (isAr ? 'مقالي' : 'Essay')}
                    </span>
                </div>
                <h3 className="q-text" style={{ fontSize: '1.5rem', lineHeight: '1.6', marginBottom: '25px', color: 'var(--txt)' }}>
                    {isAr ? currentQ.textAr : currentQ.textEn}
                </h3>
                
                {currentQ.type === 'mcq' && (
                    <div className="options-grid" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {(isAr ? currentQ.optionsAr : currentQ.optionsEn)?.map((opt: string, i: number) => (
                            <label 
                                key={i} 
                                className={`opt-label ${answers[currentQ.id] === i ? 'selected' : ''}`} 
                                style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: answers[currentQ.id] === i ? 'rgba(108,92,231,0.1)' : 'var(--h-bg)', border: `2px solid ${answers[currentQ.id] === i ? 'var(--p-purple)' : 'transparent'}`, borderRadius: '15px', cursor: 'pointer', transition: '0.3s', fontWeight: answers[currentQ.id] === i ? 'bold' : 'normal', color: 'var(--txt)' }}
                            >
                                <input 
                                    type="radio" 
                                    name={`q_${currentQ.id}`} 
                                    checked={answers[currentQ.id] === i}
                                    onChange={() => onAnswerChange(currentQ.id, i)}
                                    style={{ width: '20px', height: '20px', accentColor: 'var(--p-purple)' }}
                                /> 
                                {opt}
                            </label>
                        ))}
                    </div>
                )}

                {currentQ.type === 'essay' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <textarea 
                            className="essay-area" 
                            placeholder={isAr ? 'اكتب إجابتك هنا...' : 'Type your answer here...'}
                            value={answers[currentQ.id] || ''}
                            onChange={(e) => onAnswerChange(currentQ.id, e.target.value)}
                            style={{ width: '100%', minHeight: '150px', padding: '20px', borderRadius: '15px', background: 'var(--h-bg)', border: '2px solid transparent', color: 'var(--txt)', outline: 'none', resize: 'vertical', fontSize: '1rem', fontFamily: 'inherit' }}
                        ></textarea>
                        
                        <div style={{ position: 'relative', width: '100%' }}>
                            {/* 💡 استخدام الـ Button الخارق بدل HTML Button */}
                            <Button variant="outline" fullWidth icon={<FaCamera />}>
                                {isAr ? 'التقط صورة أو ارفع ملف للإجابة' : 'Upload Picture of Answer'}
                            </Button>
                            <input 
                                type="file" accept="image/*" 
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                                onChange={(e) => {
                                    if(e.target.files && e.target.files[0]) {
                                        const currentText = answers[currentQ.id] || '';
                                        const newText = currentText ? `${currentText}\n\n[📷 مرفق: ${e.target.files[0].name}]` : `[📷 مرفق: ${e.target.files[0].name}]`;
                                        onAnswerChange(currentQ.id, newText);
                                        showToast(isAr ? 'تم إرفاق الملف بنجاح' : 'File attached successfully', 'success');
                                    }
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* 💡 Footer Navigation باستخدام الـ UI System */}
            <div className="exam-footer" style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid var(--h-bg)', paddingTop: '20px' }}>
                <Button 
                    variant="outline" 
                    onClick={onPrev} 
                    disabled={currentQIndex === 0} 
                    icon={isAr ? <FaArrowRight /> : <FaArrowLeft />}
                >
                    {isAr ? 'السابق' : 'Previous'}
                </Button>
                
                {currentQIndex === exam.questions.length - 1 ? (
                    <Button 
                        variant="primary" 
                        onClick={onSubmit} 
                        icon={<FaCheck />} 
                        style={{ background: 'var(--success)' }}
                    >
                        {isAr ? 'تسليم الامتحان' : 'Submit Exam'}
                    </Button>
                ) : (
                    <Button 
                        variant="primary" 
                        onClick={onNext} 
                        icon={isAr ? <FaArrowLeft /> : <FaArrowRight />}
                    >
                        {isAr ? 'التالي' : 'Next'}
                    </Button>
                )}
            </div>
        </div>
    );
}