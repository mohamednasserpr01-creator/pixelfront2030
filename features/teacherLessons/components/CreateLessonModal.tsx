// FILE: features/teacherLessons/components/CreateLessonModal.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../context/ToastContext';
import { useCreateLesson } from '../hooks/useCreateLesson';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateLessonModal({ isOpen, onClose }: Props) {
    const router = useRouter();
    const { showToast } = useToast();
    const createLessonMutation = useCreateLesson();

    const [newLessonData, setNewLessonData] = useState({ title: '', stage: 'sec3', unit: '' });

    const handleCreateLesson = () => {
        if (!newLessonData.title.trim() || !newLessonData.unit.trim()) {
            showToast('يرجى إدخال اسم الحصة والباب التابعة له', 'error');
            return;
        }

        createLessonMutation.mutate(newLessonData, {
            onSuccess: (data) => {
                showToast('تم الإنشاء! جاري تحويلك لإضافة المحتوى...', 'success');
                onClose();
                setNewLessonData({ title: '', stage: 'sec3', unit: '' });
                setTimeout(() => router.push(`/teacher/lessons/${data.id}`), 1000);
            }
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="إضافة حصة جديدة للمكتبة" maxWidth="500px">
            <div style={{ padding: '10px 0', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <Input 
                    label="اسم الحصة" 
                    placeholder="مثال: تأثير كومتون" 
                    value={newLessonData.title} 
                    onChange={e => setNewLessonData({...newLessonData, title: e.target.value})} 
                />
                
                <div>
                    <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>المرحلة الدراسية</label>
                    <select 
                        value={newLessonData.stage} 
                        onChange={e => setNewLessonData({...newLessonData, stage: e.target.value})} 
                        style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '10px', outline: 'none' }}
                    >
                        <option value="prep3" style={{background: '#1e1e2d'}}>الصف الثالث الإعدادي</option>
                        <option value="sec1" style={{background: '#1e1e2d'}}>الصف الأول الثانوي</option>
                        <option value="sec2" style={{background: '#1e1e2d'}}>الصف الثاني الثانوي</option>
                        <option value="sec3" style={{background: '#1e1e2d'}}>الصف الثالث الثانوي</option>
                    </select>
                </div>

                <Input 
                    label="الباب / الفصل (للتنظيم)" 
                    placeholder="مثال: الباب الخامس" 
                    value={newLessonData.unit} 
                    onChange={e => setNewLessonData({...newLessonData, unit: e.target.value})} 
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateLesson()}
                />
                
                <Button 
                    variant="primary" 
                    fullWidth 
                    onClick={handleCreateLesson} 
                    style={{ marginTop: '10px', padding: '15px' }}
                    disabled={createLessonMutation.isPending}
                >
                    {createLessonMutation.isPending ? 'جاري الإنشاء...' : 'حفظ ومتابعة لإضافة المحتوى'}
                </Button>
            </div>
        </Modal>
    );
}