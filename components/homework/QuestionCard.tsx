// FILE: components/homework/QuestionCard.tsx
import React from 'react';
import { FaMedal, FaCamera, FaCheckCircle } from 'react-icons/fa';
import { HwQuestion } from '../../types';

interface Props {
    q: HwQuestion;
    index: number;
    lang: string;
    answer: any;
    file: File | null;
    onAnswerChange: (qId: string, val: any) => void;
    onFileChange: (qId: string, file: File | null) => void;
}

export default function QuestionCard({ q, index, lang, answer, file, onAnswerChange, onFileChange }: Props) {
    const isAnswered = !!answer && answer.toString().trim() !== '';

    return (
        <div className={`q-card ${isAnswered ? 'answered' : ''}`} style={{ background: isAnswered ? 'rgba(108,92,231,0.05)' : 'var(--bg)', padding: '25px', borderRadius: '15px', marginBottom: '25px', border: `1px solid ${isAnswered ? 'var(--p-purple)' : 'var(--h-bg)'}` }}>
            <div className="q-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <div className="q-number" style={{ fontWeight: 'bold', color: 'var(--p-purple)' }}>{lang === 'ar' ? 'السؤال' : 'Q'} {index + 1}</div>
                <div className="q-score" style={{ fontWeight: 'bold', color: '#f1c40f', background: 'rgba(241, 196, 15, 0.1)', padding: '5px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <FaMedal /> {lang === 'ar' ? 'الدرجة:' : 'Score:'} {q.score}
                </div>
            </div>
            <h3 className="q-text" style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px', color: 'var(--txt)' }}>{lang === 'ar' ? q.textAr : q.textEn}</h3>
            
            {q.type === 'mcq' && (
                <div className="options-grid" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {(lang === 'ar' ? q.optionsAr : q.optionsEn)?.map((opt: string, i: number) => (
                        <label key={i} className="opt-label" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: answer === i ? 'rgba(108,92,231,0.1)' : 'var(--h-bg)', border: `2px solid ${answer === i ? 'var(--p-purple)' : 'transparent'}`, borderRadius: '15px', cursor: 'pointer', transition: '0.3s', fontWeight: answer === i ? 'bold' : 'normal', color: 'var(--txt)' }}>
                            <input 
                                type="radio" 
                                name={`q_${q.id}`} 
                                checked={answer === i}
                                onChange={() => onAnswerChange(q.id, i)}
                                style={{ width: '20px', height: '20px', accentColor: 'var(--p-purple)' }}
                            /> 
                            {opt}
                        </label>
                    ))}
                </div>
            )}

            {q.type === 'tf' && (
                <div className="options-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <label className="opt-label" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: answer === 'true' ? 'rgba(108,92,231,0.1)' : 'var(--h-bg)', border: `2px solid ${answer === 'true' ? 'var(--p-purple)' : 'transparent'}`, borderRadius: '15px', cursor: 'pointer', fontWeight: answer === 'true' ? 'bold' : 'normal', color: 'var(--txt)' }}>
                        <input type="radio" name={`q_${q.id}`} checked={answer === 'true'} onChange={() => onAnswerChange(q.id, 'true')} style={{ width: '20px', height: '20px', accentColor: 'var(--p-purple)' }} /> 
                        {lang === 'ar' ? 'صواب' : 'True'}
                    </label>
                    <label className="opt-label" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: answer === 'false' ? 'rgba(108,92,231,0.1)' : 'var(--h-bg)', border: `2px solid ${answer === 'false' ? 'var(--p-purple)' : 'transparent'}`, borderRadius: '15px', cursor: 'pointer', fontWeight: answer === 'false' ? 'bold' : 'normal', color: 'var(--txt)' }}>
                        <input type="radio" name={`q_${q.id}`} checked={answer === 'false'} onChange={() => onAnswerChange(q.id, 'false')} style={{ width: '20px', height: '20px', accentColor: 'var(--p-purple)' }} /> 
                        {lang === 'ar' ? 'خطأ' : 'False'}
                    </label>
                </div>
            )}

            {q.type === 'essay' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <textarea 
                        className="essay-area" 
                        placeholder={lang === 'ar' ? 'اكتب حلك أو ملاحظاتك هنا...' : 'Type your answer here...'}
                        value={answer || ''}
                        onChange={(e) => onAnswerChange(q.id, e.target.value)}
                        style={{ width: '100%', minHeight: '150px', padding: '20px', borderRadius: '15px', background: 'var(--h-bg)', border: '2px solid transparent', color: 'var(--txt)', outline: 'none', resize: 'vertical', fontSize: '1rem', fontFamily: 'inherit' }}
                    ></textarea>
                    <div style={{ position: 'relative', width: '100%' }}>
                        <button className="btn-upload glow-btn" style={{ width: '100%', padding: '15px', background: 'var(--bg)', color: 'var(--p-purple)', border: '2px dashed var(--p-purple)', borderRadius: '15px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}><FaCamera /> {lang === 'ar' ? 'إرفاق صورة للحل (اختياري)' : 'Attach Image (Optional)'}</button>
                        <input 
                            type="file" accept="image/*" 
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                            onChange={(e) => {
                                if(e.target.files && e.target.files[0]) onFileChange(q.id, e.target.files[0]);
                            }}
                        />
                    </div>
                    {file && (
                        <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#2ecc71', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <FaCheckCircle /> {lang === 'ar' ? 'تم إرفاق الصورة بنجاح.' : 'Image attached.'}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}