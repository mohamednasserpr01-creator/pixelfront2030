import React, { memo } from 'react';
import { FaTrash, FaImage } from 'react-icons/fa';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Question, HomeworkLanguage } from '../types';
import { useToast } from '@/context/ToastContext';

interface Props { q: Question; index: number; language: HomeworkLanguage; dispatch: React.Dispatch<any>; }

const AR_LABELS = ['أ', 'ب', 'ج', 'د', 'هـ', 'و', 'ز', 'ح'];
const EN_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export const QuestionCard = memo(({ q, index, language, dispatch }: Props) => {
    const { showToast } = useToast();
    const updateQ = (field: keyof Question, value: any) => dispatch({ type: 'UPDATE_QUESTION', payload: { id: q.id, field, value } });
    const labels = language === 'en' ? EN_LABELS : AR_LABELS;

    const handleLocalImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
        const file = e.target.files?.[0];
        if (file) {
            callback(URL.createObjectURL(file));
            showToast('تم إرفاق الصورة بنجاح', 'success');
        }
        e.target.value = ''; 
    };

    return (
        /* 🚀 تنظيف خلفية السؤال لتتجاوب مع اللايت والدارك */
        <div style={{ background: 'var(--card)', border: '1px solid rgba(128,128,128,0.2)', borderRadius: '15px', padding: '25px', marginBottom: '25px', position: 'relative' }}>
            <button onClick={() => dispatch({ type: 'DELETE_QUESTION', payload: q.id })} style={{ position: 'absolute', top: '15px', left: '15px', background: 'rgba(231,76,60,0.1)', color: 'var(--danger)', border: 'none', padding: '10px', borderRadius: '10px', cursor: 'pointer', zIndex: 10 }}><FaTrash /></button>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px' }}>
                <span style={{ background: '#f39c12', color: 'white', padding: '5px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold' }}>سؤال {index + 1}</span>
                <h4 style={{ color: 'var(--txt)', margin: 0 }}>{q.type === 'mcq' ? 'اختياري' : q.type === 'tf' ? 'صح وخطأ' : 'مقالي'}</h4>
            </div>
            
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <div style={{ flex: 3, minWidth: '200px' }}><Input label="نص السؤال" value={q.text} onChange={e => updateQ('text', e.target.value)} /></div>
                <div style={{ flex: 1, minWidth: '100px' }}><Input label="الدرجة" type="number" value={q.score.toString()} onChange={e => updateQ('score', Number(e.target.value))} /></div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
                {!q.previewUrl ? (
                    <label style={{ background: 'rgba(128,128,128,0.05)', color: '#f39c12', border: '1px dashed rgba(128,128,128,0.2)', padding: '15px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%' }}>
                        <FaImage size={20} /> إرفاق صورة للسؤال
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleLocalImageUpload(e, (url) => updateQ('previewUrl', url))} />
                    </label>
                ) : (
                    <div style={{ position: 'relative', width: '100%', maxWidth: '500px', borderRadius: '10px', overflow: 'hidden' }}>
                        <img src={q.previewUrl} alt="Q" style={{ width: '100%' }} />
                        <button onClick={() => { URL.revokeObjectURL(q.previewUrl!); updateQ('previewUrl', null); }} style={{ position: 'absolute', top: '10px', right: '10px', background: 'var(--danger)', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}><FaTrash /></button>
                    </div>
                )}
            </div>

            {/* 💡 الاختيار من متعدد */}
            {q.type === 'mcq' && (
                <div style={{ background: 'rgba(128,128,128,0.05)', padding: '15px', borderRadius: '10px' }}>
                    <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '15px', fontWeight: 'bold' }}>الاختيارات (حدد الإجابة الصحيحة)</label>
                    {q.options?.map((opt, optIdx) => (
                        <div key={opt.id} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                            <input type="radio" name={`hw_correct_${q.id}`} checked={opt.isCorrect} onChange={() => { const newOptions = q.options!.map(o => ({ ...o, isCorrect: o.id === opt.id })); updateQ('options', newOptions); }} style={{ width: '20px', height: '20px', accentColor: '#f39c12', cursor: 'pointer' }} />
                            
                            <div style={{ flex: 1 }}>
                                {/* 🚀 تنظيف إنبوتات الإختيارات */}
                                <input type="text" value={opt.text} onChange={(e) => { const newOptions = [...q.options!]; newOptions[optIdx].text = e.target.value; updateQ('options', newOptions); }} placeholder={`نص الاختيار`} style={{ width: '100%', padding: '12px', background: 'rgba(128,128,128,0.05)', border: '1px solid rgba(128,128,128,0.2)', color: 'var(--txt)', borderRadius: '8px', outline: 'none', fontWeight: 'bold', fontSize: '1.1rem' }} />
                            </div>
                            
                            {!opt.previewUrl ? (
                                <label style={{ background: 'rgba(128,128,128,0.05)', color: '#f39c12', border: '1px dashed rgba(128,128,128,0.2)', padding: '12px', borderRadius: '8px', cursor: 'pointer', height: '42px', display: 'flex', alignItems: 'center' }}>
                                    <FaImage size={18} />
                                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleLocalImageUpload(e, (url) => { const newOptions = [...q.options!]; newOptions[optIdx].previewUrl = url; updateQ('options', newOptions); })} />
                                </label>
                            ) : (
                                <div style={{ position: 'relative', width: '80px', height: '42px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(128,128,128,0.2)' }}>
                                    <img src={opt.previewUrl} alt="opt" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <button onClick={() => { URL.revokeObjectURL(opt.previewUrl!); const newOptions = [...q.options!]; newOptions[optIdx].previewUrl = null; updateQ('options', newOptions); }} style={{ position: 'absolute', top: '0', right: '0', background: 'var(--danger)', color: 'white', border: 'none', width: '100%', height: '100%', cursor: 'pointer' }}><FaTrash size={12}/></button>
                                </div>
                            )}

                            {q.options!.length > 2 && <button onClick={() => updateQ('options', q.options!.filter(o => o.id !== opt.id))} style={{ background: 'rgba(231,76,60,0.1)', color: 'var(--danger)', border: 'none', height: '42px', width: '42px', borderRadius: '8px', cursor: 'pointer' }}><FaTrash /></button>}
                        </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => {
                        const nextIdx = q.options!.length;
                        const nextLabel = labels[nextIdx] || `الاختيار ${nextIdx + 1}`;
                        updateQ('options', [...q.options!, { id: Date.now().toString(), text: nextLabel, image: null, previewUrl: null, isCorrect: false }]);
                    }} style={{ marginTop: '10px' }}>+ إضافة اختيار</Button>
                </div>
            )}

            {/* 💡 صح وخطأ */}
            {q.type === 'tf' && (
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', background: 'rgba(128,128,128,0.05)', padding: '15px', borderRadius: '10px' }}>
                    <label style={{ color: 'var(--txt-mut)', fontWeight: 'bold' }}>الإجابة الصحيحة:</label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--txt)', cursor: 'pointer' }}>
                        <input type="radio" checked={q.isTrueFalseCorrect === true} onChange={() => updateQ('isTrueFalseCorrect', true)} style={{ accentColor: '#2ecc71', width: '18px', height: '18px' }} /> صح
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--txt)', cursor: 'pointer' }}>
                        <input type="radio" checked={q.isTrueFalseCorrect === false} onChange={() => updateQ('isTrueFalseCorrect', false)} style={{ accentColor: '#e74c3c', width: '18px', height: '18px' }} /> خطأ
                    </label>
                </div>
            )}

            {/* 💡 السؤال المقالي */}
            {q.type === 'essay' && (
                <div style={{ background: 'rgba(128,128,128,0.05)', padding: '15px', borderRadius: '10px' }}>
                    <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '10px', fontWeight: 'bold' }}>كيف يجيب الطالب على هذا السؤال؟</label>
                    <select 
                        value={q.essayFormat || 'both'} 
                        onChange={(e) => updateQ('essayFormat', e.target.value)}
                        style={{ width: '100%', padding: '12px', background: 'rgba(128,128,128,0.05)', border: '1px solid rgba(128,128,128,0.2)', color: 'var(--txt)', borderRadius: '8px', outline: 'none' }}
                    >
                        <option value="both" style={{background: 'var(--card)', color: 'var(--txt)'}}>كتابة نص + إرفاق صورة (موصى به)</option>
                        <option value="text" style={{background: 'var(--card)', color: 'var(--txt)'}}>كتابة نص فقط</option>
                        <option value="image" style={{background: 'var(--card)', color: 'var(--txt)'}}>إرفاق صورة للحل فقط (بدون كتابة)</option>
                    </select>
                </div>
            )}
        </div>
    );
});