import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaTimes, FaVideo } from 'react-icons/fa';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateHomeworkLessonModal({ isOpen, onClose }: Props) {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [stage, setStage] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title) return;
        
        const newId = Math.random().toString(36).substring(2, 9);
        router.push(`/teacher/homework-lessons/${newId}`);
        onClose();
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, animation: 'fadeIn 0.2s ease' }}>
            <div style={{ background: 'var(--card)', padding: '30px', borderRadius: '20px', width: '100%', maxWidth: '500px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                    <h2 style={{ margin: 0, color: 'var(--txt)', display: 'flex', alignItems: 'center', gap: '10px' }}><FaVideo style={{color: '#1abc9c'}}/> إضافة حصة حل واجب</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--txt-mut)', cursor: 'pointer' }}><FaTimes size={20} /></button>
                </div>
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '0.9rem' }}>اسم الحصة (مثال: إجابات نموذجية للباب الأول)</label>
                        <Input value={title} onChange={e => setTitle(e.target.value)} required />
                    </div>
                    <div>
                        <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '0.9rem' }}>الصف الدراسي</label>
                        {/* 💡 تم حل مشكلة الألوان هنا */}
                        <select value={stage} onChange={e => setStage(e.target.value)} required style={{ width: '100%', padding: '12px 15px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', color: 'white', borderRadius: '8px', outline: 'none' }}>
                            <option value="" disabled style={{ background: '#1e1e2d', color: 'white' }}>اختر الصف الدراسي...</option>
                            <option value="1" style={{ background: '#1e1e2d', color: 'white' }}>الصف الأول الثانوي</option>
                            <option value="2" style={{ background: '#1e1e2d', color: 'white' }}>الصف الثاني الثانوي</option>
                            <option value="3" style={{ background: '#1e1e2d', color: 'white' }}>الصف الثالث الثانوي</option>
                        </select>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <Button type="button" variant="outline" onClick={onClose} style={{ flex: 1 }}>إلغاء</Button>
                        <Button type="submit" variant="primary" style={{ flex: 2, background: '#1abc9c', color: '#fff' }}>حفظ ومتابعة تجهيز المحتوى</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}