"use client";
import React, { useState, useEffect, useRef } from 'react';
import { FaTimes, FaDatabase, FaUpload, FaChevronDown } from 'react-icons/fa';
import { fetchAPI } from '@/lib/api/client';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { title: string; subject: string; stage: string; image: string }) => void;
    initialData?: any; 
}

export const QuestionBankModal: React.FC<Props> = ({ isOpen, onClose, onSave, initialData }) => {
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [stage, setStage] = useState('');
    const [image, setImage] = useState(''); 
    
    const [stages, setStages] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchDropdownData = async () => {
        setIsLoading(true);
        try {
            const [stagesData, subjectsData] = await Promise.all([
                fetchAPI<any>('/educational-stages').catch(() => []),
                fetchAPI<any>('/subjects').catch(() => [])
            ]);

            const parsedStages = Array.isArray(stagesData) ? stagesData : (stagesData?.data || []);
            const parsedSubjects = Array.isArray(subjectsData) ? subjectsData : (subjectsData?.data || []);

            setStages(parsedStages);
            setSubjects(parsedSubjects);
        } catch (error) {
            console.error("Error fetching dropdown data", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchDropdownData();
            if (initialData) {
                // 🚀 حماية شاملة للحروف (عشان لو الباك إند بعت PascalCase أو camelCase)
                setTitle(initialData.title || initialData.Title || '');
                setSubject(initialData.subject || initialData.Subject || '');
                setStage(initialData.stage || initialData.Stage || '');
                setImage(initialData.imageUrl || initialData.ImageUrl || initialData.image || '');
            } else {
                setTitle(''); setSubject(''); setStage(''); setImage('');
            }
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
        e.target.value = '';
    };

    const handleSave = () => {
        if (!title || !subject || !stage) {
            alert('يرجى إدخال اسم البنك واختيار المادة والمرحلة الدراسية');
            return;
        }
        onSave({ title, subject, stage, image });
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
            <div style={{ background: '#1a1a2e', width: '100%', maxWidth: '500px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)', padding: '30px', animation: 'fadeIn 0.2s ease', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                    <h3 style={{ margin: 0, color: 'white', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.4rem' }}>
                        <FaDatabase color="var(--p-purple)"/> {initialData ? 'تعديل بيانات البنك' : 'إنشاء بنك أسئلة جديد'}
                    </h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--txt-mut)', cursor: 'pointer', fontSize: '1.2rem' }}><FaTimes /></button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '0.95rem', fontWeight: 'bold' }}>اسم بنك الأسئلة <span style={{color: 'var(--danger)'}}>*</span></label>
                        <input type="text" placeholder="مثال: بنك المراجعة النهائية" value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: '15px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '10px', outline: 'none', fontSize: '1rem' }} />
                    </div>

                    <div style={{ display: 'flex', gap: '15px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '0.95rem', fontWeight: 'bold' }}>المرحلة الدراسية <span style={{color: 'var(--danger)'}}>*</span></label>
                            <div style={{ position: 'relative' }}>
                                <select value={stage} onChange={e => setStage(e.target.value)} style={{ width: '100%', padding: '15px', paddingLeft: '40px', appearance: 'none', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: stage ? 'white' : 'var(--txt-mut)', borderRadius: '10px', outline: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                                    <option value="" disabled style={{background: '#1a1a2e', color: 'var(--txt-mut)'}}>-- اختر المرحلة --</option>
                                    {stages.map(s => {
                                        const name = s.name || s.Name || s.title || s.Title;
                                        return <option key={s.id || s.Id} value={name} style={{ background: '#1a1a2e', color: 'white', padding: '10px' }}>{name}</option>
                                    })}
                                </select>
                                <FaChevronDown style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--txt-mut)', pointerEvents: 'none' }} />
                            </div>
                        </div>

                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '0.95rem', fontWeight: 'bold' }}>المادة <span style={{color: 'var(--danger)'}}>*</span></label>
                            <div style={{ position: 'relative' }}>
                                <select value={subject} onChange={e => setSubject(e.target.value)} style={{ width: '100%', padding: '15px', paddingLeft: '40px', appearance: 'none', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: subject ? 'white' : 'var(--txt-mut)', borderRadius: '10px', outline: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                                    <option value="" disabled style={{background: '#1a1a2e', color: 'var(--txt-mut)'}}>-- اختر المادة --</option>
                                    {subjects.map(sub => {
                                        const name = sub.name || sub.Name || sub.title || sub.Title;
                                        return <option key={sub.id || sub.Id} value={name} style={{ background: '#1a1a2e', color: 'white', padding: '10px' }}>{name}</option>
                                    })}
                                </select>
                                <FaChevronDown style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--txt-mut)', pointerEvents: 'none' }} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '0.95rem', fontWeight: 'bold' }}>صورة الغلاف (اختياري)</label>
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} />
                        
                        {!image ? (
                            <div onClick={() => fileInputRef.current?.click()} style={{ width: '100%', padding: '25px', border: '2px dashed rgba(255,255,255,0.2)', borderRadius: '10px', textAlign: 'center', cursor: 'pointer', background: 'rgba(0,0,0,0.2)', color: 'var(--txt-mut)', transition: '0.2s' }} onMouseOver={e => e.currentTarget.style.borderColor = 'var(--p-purple)'} onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}>
                                <FaUpload size={24} style={{ marginBottom: '10px', color: 'var(--p-purple)' }} />
                                <div style={{ fontWeight: 'bold' }}>اضغط هنا لرفع صورة من جهازك</div>
                            </div>
                        ) : (
                            <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <img src={image} alt="Preview" style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                                <button onClick={() => setImage('')} style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(231, 76, 60, 0.9)', color: 'white', border: 'none', width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }} title="إزالة الصورة"><FaTimes /></button>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                        <button onClick={handleSave} disabled={isLoading} style={{ flex: 1, background: 'var(--p-purple)', color: 'white', border: 'none', padding: '15px', borderRadius: '10px', fontWeight: 'bold', cursor: isLoading ? 'not-allowed' : 'pointer', fontSize: '1.1rem', transition: '0.2s' }}>
                            {isLoading ? 'جاري التحميل...' : (initialData ? 'حفظ التعديلات' : 'إنشاء وحفظ')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}