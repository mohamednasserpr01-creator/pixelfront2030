// FILE: features/teacherExams/components/CreateExamModal.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../context/ToastContext';
import { useCreateExam } from '../hooks/useCreateExam';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateExamModal({ isOpen, onClose }: Props) {
    const router = useRouter();
    const { showToast } = useToast();
    const createExamMutation = useCreateExam();

    const [newExamData, setNewExamData] = useState({ title: '', stage: 'sec3', unit: '' });

    const handleCreateExam = () => {
        if (!newExamData.title.trim() || !newExamData.unit.trim()) {
            showToast('يرجى إدخال اسم الامتحان والباب التابع له', 'error');
            return;
        }

        createExamMutation.mutate(newExamData, {
            onSuccess: (data) => {
                showToast('تم الإنشاء! جاري تحويلك لإضافة الأسئلة...', 'success');
                onClose();
                setNewExamData({ title: '', stage: 'sec3', unit: '' });
                setTimeout(() => router.push(`/teacher/exams/${data.id}`), 1000);
            }
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="إضافة امتحان جديد" maxWidth="500px">
            <div style={{ padding: '10px 0', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <Input 
                    label="اسم الامتحان" 
                    placeholder="مثال: امتحان شامل على الباب الأول" 
                    value={newExamData.title} 
                    onChange={e => setNewExamData({...newExamData, title: e.target.value})} 
                />
                
                <div>
                    <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>المرحلة الدراسية</label>
                    <select 
                        value={newExamData.stage} 
                        onChange={e => setNewExamData({...newExamData, stage: e.target.value})} 
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
                    placeholder="مثال: الباب الأول" 
                    value={newExamData.unit} 
                    onChange={e => setNewExamData({...newExamData, unit: e.target.value})} 
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateExam()}
                />
                
                <Button 
                    variant="primary" 
                    fullWidth 
                    onClick={handleCreateExam} 
                    style={{ marginTop: '10px', padding: '15px' }}
                    disabled={createExamMutation.isPending}
                >
                    {createExamMutation.isPending ? 'جاري الإنشاء...' : 'حفظ ومتابعة لإضافة الأسئلة'}
                </Button>
            </div>
        </Modal>
    );
}