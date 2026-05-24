import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../context/ToastContext';
import { useCreateExam } from '../hooks/useCreateExam';

interface Props { isOpen: boolean; onClose: () => void; stages: any[]; }

export default function CreateExamModal({ isOpen, onClose, stages }: Props) {
    const router = useRouter();
    const { showToast } = useToast();
    const createExamMutation = useCreateExam();

    // شيلنا الباب من الـ State
    const [newExamData, setNewExamData] = useState({ title: '', stage: '' });

    const handleCreateExam = () => {
        if (!newExamData.title.trim() || !newExamData.stage) {
            showToast('يرجى إدخال اسم الامتحان واختيار المرحلة', 'error');
            return;
        }

        // بنبعت الباب فاضي للباك إند عشان ميزعلش
        createExamMutation.mutate({ ...newExamData, unit: "" }, {
            onSuccess: (data) => {
                showToast('تم الإنشاء! جاري تحويلك لإضافة الأسئلة...', 'success');
                onClose();
                setNewExamData({ title: '', stage: '' });
                setTimeout(() => router.push(`/teacher/exams/${data.id}`), 1000);
            },
            onError: (error: any) => {
                showToast(`خطأ من السيرفر: ${error.message}`, 'error');
            }
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="إضافة امتحان جديد" maxWidth="500px">
            <div style={{ padding: '10px 0', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <Input label="اسم الامتحان" placeholder="مثال: امتحان شامل" value={newExamData.title} onChange={e => setNewExamData({...newExamData, title: e.target.value})} />
                <div>
                    <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>المرحلة الدراسية</label>
                    <select value={newExamData.stage} onChange={e => setNewExamData({...newExamData, stage: e.target.value})} style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '10px', outline: 'none' }}>
                        <option value="" disabled style={{background: '#1e1e2d'}}>-- اختر المرحلة الدراسية --</option>
                        {stages.map(s => <option key={s.id} value={s.id} style={{background: '#1e1e2d'}}>{s.name}</option>)}
                    </select>
                </div>
                <Button variant="primary" fullWidth onClick={handleCreateExam} style={{ marginTop: '10px', padding: '15px' }} disabled={createExamMutation.isPending}>
                    {createExamMutation.isPending ? 'جاري الإنشاء...' : 'حفظ ومتابعة لإضافة الأسئلة'}
                </Button>
            </div>
        </Modal>
    );
}