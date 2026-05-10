"use client";
import React, { useState, useEffect, useRef } from 'react';
import { FaTimes, FaPlus, FaTrash, FaCheckCircle, FaImage } from 'react-icons/fa';

interface Option { id: string; text: string; }

export interface Question {
    id: string;
    type: 'mcq' | 'essay';
    text: string;
    imageUrl?: string; 
    options?: Option[];
    correctOptionId?: string;
    explanation: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (q: Question) => void;
    initialData?: Question | null;
}

export const QuestionModal: React.FC<Props> = ({ isOpen, onClose, onSave, initialData }) => {
    const [type, setType] = useState<'mcq' | 'essay'>('mcq');
    const [text, setText] = useState('');
    const [imageUrl, setImageUrl] = useState(''); 
    const [explanation, setExplanation] = useState('');
    const [options, setOptions] = useState<Option[]>([
        { id: '1', text: '' }, { id: '2', text: '' }
    ]);
    const [correctOptionId, setCorrectOptionId] = useState<string>('1');

    // 🚀 Reference عشان نتحكم في رفع الصورة
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialData) {
            setType(initialData.type);
            setText(initialData.text || '');
            setImageUrl(initialData.imageUrl || '');
            setExplanation(initialData.explanation || '');
            if (initialData.type === 'mcq' && initialData.options) {
                setOptions(initialData.options);
                setCorrectOptionId(initialData.correctOptionId || initialData.options[0].id);
            }
        } else {
            setType('mcq'); setText(''); setImageUrl(''); setExplanation('');
            setOptions([{ id: '1', text: '' }, { id: '2', text: '' }]);
            setCorrectOptionId('1');
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    // 🚀 دالة تحويل الصورة المرفوعة لرابط وتخزينها
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
        e.target.value = ''; // عشان لو مسحت الصورة ورجعت ترفعها تاني المتصفح يقبلها
    };

    const handleSave = () => {
        // 💡 يقبل يحفظ لو فيه نص، أو لو فيه صورة، أو الاتنين مع بعض
        if (!text.trim() && !imageUrl) return alert("يجب كتابة نص السؤال أو إرفاق صورة للسؤال على الأقل.");
        
        if (type === 'mcq') {
            if (options.some(o => !o.text.trim())) return alert("يجب ملء جميع الاختيارات");
            if (!correctOptionId) return alert("يجب تحديد الإجابة الصحيحة");
        }

        onSave({
            id: initialData?.id || Date.now().toString(),
            type,
            text,
            imageUrl, // 🚀 يتم حفظ الصورة هنا
            explanation,
            options: type === 'mcq' ? options : undefined,
            correctOptionId: type === 'mcq' ? correctOptionId : undefined
        });
        onClose();
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', zIndex: 99999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
            <div style={{ background: '#1a1a2e', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)', padding: '30px', animation: 'fadeIn 0.3s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0, color: 'white' }}>{initialData ? 'تعديل السؤال' : 'إضافة سؤال جديد'}</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--txt-mut)', cursor: 'pointer', fontSize: '1.2rem' }}><FaTimes /></button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button type="button" onClick={() => setType('mcq')} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: type === 'mcq' ? '2px solid var(--p-purple)' : '1px solid rgba(255,255,255,0.1)', background: type === 'mcq' ? 'rgba(108,92,231,0.1)' : 'rgba(0,0,0,0.2)', color: type === 'mcq' ? 'white' : 'var(--txt-mut)', fontWeight: 'bold', cursor: 'pointer' }}>اختيار من متعدد (MCQ)</button>
                        <button type="button" onClick={() => setType('essay')} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: type === 'essay' ? '2px solid #e67e22' : '1px solid rgba(255,255,255,0.1)', background: type === 'essay' ? 'rgba(230, 126, 34, 0.1)' : 'rgba(0,0,0,0.2)', color: type === 'essay' ? 'white' : 'var(--txt-mut)', fontWeight: 'bold', cursor: 'pointer' }}>سؤال مقالي (Essay)</button>
                    </div>

                    {/* 🚀 الحقل المدمج (نص + صورة) للسؤال */}
                    <div style={{ background: 'rgba(0,0,0,0.1)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--txt-mut)', marginBottom: '15px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                            <span>نص / صورة السؤال</span>
                            <div>
                                {/* 🚀 الـ Input المخفي لرفع الملف */}
                                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} />
                                
                                {/* 🚀 الزرار اللي بيفتح درايف الجهاز */}
                                <button type="button" onClick={() => fileInputRef.current?.click()} style={{ background: 'rgba(108,92,231,0.1)', border: '1px solid var(--p-purple)', color: 'var(--p-purple)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', fontWeight: 'bold', transition: '0.2s' }}>
                                    <FaImage /> إرفاق صورة للسؤال
                                </button>
                            </div>
                        </label>
                        
                        {/* 🚀 معاينة الصورة لو اترفع صورة */}
                        {imageUrl && (
                            <div style={{ position: 'relative', marginBottom: '15px', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                                <img src={imageUrl} alt="مرفق السؤال" style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '8px' }} />
                                <button type="button" onClick={() => setImageUrl('')} style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(231, 76, 60, 0.9)', color: 'white', border: 'none', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }} title="حذف الصورة"><FaTimes /></button>
                            </div>
                        )}
                        
                        <textarea value={text} onChange={e => setText(e.target.value)} rows={imageUrl ? 2 : 4} placeholder={imageUrl ? "يمكنك إضافة نص توضيحي مع الصورة (اختياري)..." : "اكتب نص السؤال هنا..."} style={{ width: '100%', padding: '15px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '10px', outline: 'none', resize: 'vertical' }} />
                    </div>

                    {type === 'mcq' && (
                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <label style={{ display: 'block', color: 'white', marginBottom: '15px', fontWeight: 'bold' }}>الاختيارات (حدد الإجابة الصحيحة)</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {options.map((opt, index) => (
                                    <div key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <button type="button" onClick={() => setCorrectOptionId(opt.id)} style={{ background: 'none', border: 'none', color: correctOptionId === opt.id ? '#2ecc71' : 'var(--txt-mut)', cursor: 'pointer', fontSize: '1.5rem' }} title="تعيين كإجابة صحيحة">
                                            <FaCheckCircle />
                                        </button>
                                        <input type="text" placeholder={`الاختيار ${index + 1}`} value={opt.text} onChange={e => setOptions(options.map(o => o.id === opt.id ? { ...o, text: e.target.value } : o))} style={{ flex: 1, padding: '10px 15px', background: correctOptionId === opt.id ? 'rgba(46, 204, 113, 0.1)' : 'rgba(0,0,0,0.3)', border: correctOptionId === opt.id ? '1px solid #2ecc71' : '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }} />
                                        {options.length > 2 && (
                                            <button type="button" onClick={() => {
                                                const newOpts = options.filter(o => o.id !== opt.id);
                                                setOptions(newOpts);
                                                if (correctOptionId === opt.id) setCorrectOptionId(newOpts[0].id);
                                            }} style={{ background: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c', border: 'none', width: '40px', height: '40px', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                <FaTrash />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button type="button" onClick={() => setOptions([...options, { id: Date.now().toString(), text: '' }])} style={{ background: 'transparent', color: 'var(--p-purple)', border: '1px dashed var(--p-purple)', padding: '10px', width: '100%', borderRadius: '8px', marginTop: '15px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                                <FaPlus /> إضافة اختيار جديد
                            </button>
                        </div>
                    )}

                    <div>
                        <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '0.9rem' }}>التفسير / التغذية الراجعة (يظهر للطالب بعد الحل)</label>
                        <textarea value={explanation} onChange={e => setExplanation(e.target.value)} rows={3} placeholder="اشرح لماذا هذه الإجابة هي الصحيحة..." style={{ width: '100%', padding: '15px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '10px', outline: 'none', resize: 'vertical' }} />
                    </div>

                    <button type="button" onClick={handleSave} style={{ width: '100%', background: 'var(--p-purple)', color: 'white', border: 'none', padding: '15px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem', marginTop: '10px' }}>حفظ السؤال</button>
                </div>
            </div>
        </div>
    );
};