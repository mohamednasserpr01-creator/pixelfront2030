"use client";
import React, { useState, useRef } from 'react';
import { FaTimes, FaDatabase, FaImage, FaUpload } from 'react-icons/fa';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { title: string; subject: string; stage: string; image: string }) => void;
}

export const QuestionBankModal: React.FC<Props> = ({ isOpen, onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('فيزياء');
    const [stage, setStage] = useState('الصف الثالث الثانوي');
    const [image, setImage] = useState(''); 
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ background: '#1a1a2e', width: '100%', maxWidth: '450px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)', padding: '25px', animation: 'fadeIn 0.3s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0, color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}><FaDatabase color="var(--p-purple)"/> إنشاء بنك أسئلة جديد</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--txt-mut)', cursor: 'pointer', fontSize: '1.2rem' }}><FaTimes /></button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' }}>
                    <div>
                        <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '0.9rem' }}>اسم البنك</label>
                        <input type="text" placeholder="مثال: بنك أسئلة المراجعة النهائية" value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }} />
                    </div>
                    
                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '0.9rem' }}><FaImage /> صورة غلاف البنك</label>
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} />
                        
                        {!image ? (
                            <div onClick={() => fileInputRef.current?.click()} style={{ width: '100%', padding: '20px', border: '2px dashed rgba(255,255,255,0.2)', borderRadius: '10px', textAlign: 'center', cursor: 'pointer', color: 'var(--txt-mut)', transition: '0.2s' }} onMouseOver={e => e.currentTarget.style.borderColor = 'var(--p-purple)'} onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}>
                                <FaUpload size={24} style={{ marginBottom: '10px', color: 'var(--p-purple)' }} />
                                <div>اضغط هنا لرفع صورة من جهازك</div>
                            </div>
                        ) : (
                            <div style={{ position: 'relative' }}>
                                <img src={image} alt="Preview" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }} />
                                <button onClick={() => setImage('')} style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(231, 76, 60, 0.9)', color: 'white', border: 'none', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><FaTimes /></button>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '0.9rem' }}>المادة</label>
                            <select value={subject} onChange={e => setSubject(e.target.value)} style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }}>
                                <option value="فيزياء" style={{ background: '#1e1e2d' }}>فيزياء</option>
                                <option value="كيمياء" style={{ background: '#1e1e2d' }}>كيمياء</option>
                                <option value="أحياء" style={{ background: '#1e1e2d' }}>أحياء</option>
                                <option value="لغة عربية" style={{ background: '#1e1e2d' }}>لغة عربية</option>
                                <option value="رياضيات" style={{ background: '#1e1e2d' }}>رياضيات</option>
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '0.9rem' }}>المرحلة الدراسية</label>
                            <select value={stage} onChange={e => setStage(e.target.value)} style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }}>
                                <option value="الصف الأول الثانوي" style={{ background: '#1e1e2d' }}>الأول الثانوي</option>
                                <option value="الصف الثاني الثانوي" style={{ background: '#1e1e2d' }}>الثاني الثانوي</option>
                                <option value="الصف الثالث الثانوي" style={{ background: '#1e1e2d' }}>الثالث الثانوي</option>
                            </select>
                        </div>
                    </div>
                </div>

                <button onClick={() => {
                    if(title.trim() === '') return alert('يرجى إدخال اسم البنك');
                    onSave({ title, subject, stage, image: image || 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=500' });
                    setTitle(''); setImage(''); 
                }} style={{ width: '100%', background: 'var(--p-purple)', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
                    حفظ وإنشاء البنك
                </button>
            </div>
        </div>
    );
};