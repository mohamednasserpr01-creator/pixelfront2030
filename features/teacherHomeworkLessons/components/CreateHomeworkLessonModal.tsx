import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaTimes, FaVideo } from 'react-icons/fa';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/context/ToastContext';
import { homeworkLessonsService } from '../services/homeworkLessonsService';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

interface Stage {
    id: string | number;
    name: string;
}

const API_BASE_URL = 'http://localhost:5290/api';

export default function CreateHomeworkLessonModal({ isOpen, onClose }: Props) {
    const router = useRouter();
    const { showToast } = useToast();
    const [title, setTitle] = useState('');
    const [stage, setStage] = useState('');
    const [stages, setStages] = useState<Stage[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchStages = async () => {
            if (!isOpen) return;
            try {
                const token = localStorage.getItem('accessToken');
                const response = await fetch(`${API_BASE_URL}/educational-stages`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (response.ok) {
                    const result = await response.json();
                    const stagesArray = result.data || result.items || result; 
                    setStages(Array.isArray(stagesArray) ? stagesArray : []);
                }
            } catch (error) {
                console.error("Failed to fetch stages", error);
            }
        };

        fetchStages();
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !stage) {
            showToast('يرجى إدخال اسم الحصة واختيار المرحلة', 'error');
            return;
        }
        
        setIsSaving(true);
        try {
            const result = await homeworkLessonsService.createHomework({ title, stage });
            showToast('تم الإنشاء بنجاح!', 'success');
            
            const newId = result?.id || result?.data?.id;
            if (newId) {
                router.push(`/teacher/homework-lessons/${newId}`);
            }
            onClose();
        } catch (error: any) {
            showToast(error.message || 'فشل في الإنشاء', 'error');
        } finally {
            setIsSaving(false);
        }
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
                        <select value={stage} onChange={e => setStage(e.target.value)} required style={{ width: '100%', padding: '12px 15px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', color: 'white', borderRadius: '8px', outline: 'none' }}>
                            <option value="" disabled style={{ background: '#1e1e2d', color: 'white' }}>اختر الصف الدراسي...</option>
                            {stages.map(s => (
                                <option key={s.id} value={s.id} style={{ background: '#1e1e2d', color: 'white' }}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <Button type="button" variant="outline" onClick={onClose} style={{ flex: 1 }}>إلغاء</Button>
                        <Button type="submit" variant="primary" disabled={isSaving} style={{ flex: 2, background: '#1abc9c', color: '#fff', opacity: isSaving ? 0.7 : 1 }}>
                            {isSaving ? 'جاري الحفظ...' : 'حفظ ومتابعة تجهيز المحتوى'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}