"use client";
import React, { useState } from 'react';
import { FaTimes, FaUserPlus, FaBook, FaList } from 'react-icons/fa';
import { Lecture } from '../types/curriculum.types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    curriculum: Lecture[];
    onAdd: (phone: string, targetType: 'course' | 'lecture', targetId: string, isFree: boolean) => void;
}

export const AddStudentModal: React.FC<Props> = ({ isOpen, onClose, curriculum, onAdd }) => {
    const [phone, setPhone] = useState('');
    const [targetType, setTargetType] = useState<'course' | 'lecture'>('course');
    const [targetId, setTargetId] = useState<string>('full_course');
    const [isFree, setIsFree] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (phone.length < 10) return alert("يرجى إدخال رقم هاتف صحيح");
        if (targetType === 'lecture' && targetId === 'full_course') return alert("يرجى اختيار الحصة");
        
        onAdd(phone, targetType, targetId, isFree);
        setPhone(''); // تصفير الفورم
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
            <div style={{ background: '#1a1a2e', padding: '30px', borderRadius: '15px', width: '450px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                    <h3 style={{ margin: 0, color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}><FaUserPlus color="#3498db" /> إضافة طالب يدوياً</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--txt-mut)', cursor: 'pointer', fontSize: '1.2rem' }}><FaTimes /></button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* رقم الطالب */}
                    <div>
                        <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '0.9rem' }}>رقم هاتف الطالب</label>
                        <input type="tel" placeholder="01xxxxxxxxx" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }} required />
                    </div>

                    {/* نوع الإضافة (كورس ولا حصة) */}
                    <div>
                        <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '0.9rem' }}>ماذا تريد أن تفتح له؟</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="button" onClick={() => { setTargetType('course'); setTargetId('full_course'); }} style={{ flex: 1, padding: '10px', background: targetType === 'course' ? 'rgba(52, 152, 219, 0.2)' : 'rgba(255,255,255,0.05)', color: targetType === 'course' ? '#3498db' : 'white', border: `1px solid ${targetType === 'course' ? '#3498db' : 'transparent'}`, borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <FaBook /> الكورس بالكامل
                            </button>
                            <button type="button" onClick={() => setTargetType('lecture')} style={{ flex: 1, padding: '10px', background: targetType === 'lecture' ? 'rgba(155, 89, 182, 0.2)' : 'rgba(255,255,255,0.05)', color: targetType === 'lecture' ? 'var(--p-purple)' : 'white', border: `1px solid ${targetType === 'lecture' ? 'var(--p-purple)' : 'transparent'}`, borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <FaList /> حصة معينة
                            </button>
                        </div>
                    </div>

                    {/* اختيار الحصة لو مختار حصة معينة */}
                    {targetType === 'lecture' && (
                        <div>
                            <select value={targetId} onChange={(e) => setTargetId(e.target.value)} style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }}>
                                <option value="full_course" disabled>اختر الحصة...</option>
                                {curriculum.map(lec => (
                                    <option key={lec.id} value={lec.id} style={{ color: 'black' }}>{lec.title}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* الدفع */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <input type="checkbox" id="freeBox" checked={isFree} onChange={(e) => setIsFree(e.target.checked)} style={{ accentColor: '#2ecc71', width: '18px', height: '18px' }} />
                        <label htmlFor="freeBox" style={{ color: 'white', cursor: 'pointer' }}>إضافة كمنحة (مجاني بالكامل)</label>
                    </div>

                    <button type="submit" style={{ background: '#2ecc71', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
                        تأكيد الإضافة
                    </button>
                </form>
            </div>
        </div>
    );
};