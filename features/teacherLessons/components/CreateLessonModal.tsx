"use client";
import React, { useState, useEffect } from 'react';
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

interface Stage {
    id: string | number;
    name: string;
}

const API_BASE_URL = 'http://localhost:5000/api';

export default function CreateLessonModal({ isOpen, onClose }: Props) {
    const router = useRouter();
    const { showToast } = useToast();
    const createLessonMutation = useCreateLesson();

    const [newLessonData, setNewLessonData] = useState({ title: '', stage: '', unit: '' });
    
    const [stages, setStages] = useState<Stage[]>([]);
    const [isLoadingStages, setIsLoadingStages] = useState(true);

    useEffect(() => {
        const fetchStages = async () => {
            if (!isOpen) return;
            
            setIsLoadingStages(true);
            try {
                const token = localStorage.getItem('accessToken');
                const response = await fetch(`${API_BASE_URL}/educational-stages`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const result = await response.json();
                    const stagesArray = result.data || result; 
                    const fetchedStages = Array.isArray(stagesArray) ? stagesArray : [];
                    
                    setStages(fetchedStages);
                    
                    if (fetchedStages.length > 0) {
                        setNewLessonData(prev => ({ ...prev, stage: fetchedStages[0].id.toString() }));
                    }
                }
            } catch (error) {
                console.error("Failed to fetch educational stages", error);
            } finally {
                setIsLoadingStages(false);
            }
        };

        fetchStages();
    }, [isOpen]);

    const handleCreateLesson = () => {
        if (!newLessonData.title.trim() || !newLessonData.unit.trim()) {
            showToast('يرجى إدخال اسم الحصة والباب التابعة له', 'error');
            return;
        }

        createLessonMutation.mutate(newLessonData, {
            onSuccess: (data) => {
                showToast('تم الإنشاء! جاري تحويلك لإضافة المحتوى...', 'success');
                onClose();
                setNewLessonData({ title: '', stage: stages.length > 0 ? stages[0].id.toString() : '', unit: '' });
                
                const createdId = data?.data?.id || data?.id; 
                if (createdId) {
                    setTimeout(() => router.push(`/teacher/lessons/${createdId}`), 1000);
                }
            },
            // 🚀 التعديل هنا: صيد الخطأ وإظهاره للمدرس
            onError: (error: any) => {
                console.error("API Error:", error);
                showToast(`عذراً، فشل الحفظ: ${error.message}`, 'error');
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
                        disabled={isLoadingStages}
                    >
                        {isLoadingStages ? (
                            <option value="" style={{background: '#1e1e2d'}}>جاري تحميل المراحل...</option>
                        ) : stages.length === 0 ? (
                            <option value="" style={{background: '#1e1e2d'}}>لا توجد مراحل مسجلة في الإدارة</option>
                        ) : (
                            stages.map(stage => (
                                <option key={stage.id} value={stage.id} style={{background: '#1e1e2d'}}>
                                    {stage.name}
                                </option>
                            ))
                        )}
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