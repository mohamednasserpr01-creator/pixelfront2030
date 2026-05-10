"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaTimes, FaBook } from 'react-icons/fa';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/context/ToastContext';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const CreateCourseModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const router = useRouter();
    const { showToast } = useToast();

    const [formData, setFormData] = useState({
        title: '',
        stage: 'sec3',
        stream: 'all'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            showToast('يرجى إدخال اسم الكورس', 'error');
            return;
        }

        // محاكاة إنشاء الكورس
        const newId = Math.random().toString(36).substring(2, 9);
        showToast('تم إنشاء الكورس مبدئياً، جاري تحويلك للبناء...', 'success');
        onClose();
        router.push(`/teacher/courses/${newId}`);
    };

    if (!isOpen) return null;

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, animation: 'fadeIn 0.2s ease' }}>
            <div style={{ background: 'var(--card)', padding: '30px', borderRadius: '20px', width: '100%', maxWidth: '500px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                    <h2 style={{ margin: 0, color: 'var(--txt)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaBook style={{color: 'var(--p-purple)'}}/> بناء كورس جديد
                    </h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--txt-mut)', cursor: 'pointer' }}><FaTimes size={20} /></button>
                </div>
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <Input 
                        label="اسم الكورس" 
                        placeholder="مثال: المراجعة النهائية (الفيزياء)" 
                        value={formData.title} 
                        onChange={e => setFormData({...formData, title: e.target.value})} 
                        required 
                    />
                    
                    <div>
                        <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>المرحلة الدراسية</label>
                        <select value={formData.stage} onChange={e => setFormData({...formData, stage: e.target.value})} style={{ width: '100%', padding: '12px 15px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', color: 'white', borderRadius: '8px', outline: 'none' }}>
                            <option value="prep3" style={{ background: '#1e1e2d' }}>الصف الثالث الإعدادي</option>
                            <option value="sec1" style={{ background: '#1e1e2d' }}>الصف الأول الثانوي</option>
                            <option value="sec2" style={{ background: '#1e1e2d' }}>الصف الثاني الثانوي</option>
                            <option value="sec3" style={{ background: '#1e1e2d' }}>الصف الثالث الثانوي</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>الشعبة (إن وُجدت)</label>
                        <select value={formData.stream} onChange={e => setFormData({...formData, stream: e.target.value})} style={{ width: '100%', padding: '12px 15px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', color: 'white', borderRadius: '8px', outline: 'none' }}>
                            <option value="all" style={{ background: '#1e1e2d' }}>عام (الكل)</option>
                            <option value="science" style={{ background: '#1e1e2d' }}>علمي علوم</option>
                            <option value="math" style={{ background: '#1e1e2d' }}>علمي رياضة</option>
                            <option value="literary" style={{ background: '#1e1e2d' }}>أدبي</option>
                        </select>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <Button type="button" variant="outline" onClick={onClose} style={{ flex: 1 }}>إلغاء</Button>
                        <Button type="submit" variant="primary" style={{ flex: 2 }}>بدء تجهيز المحتوى</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};