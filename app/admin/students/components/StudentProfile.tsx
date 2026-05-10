"use client";
import React, { useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { Button } from '../../../../components/ui/Button';
import { useToast } from '../../../../context/ToastContext';

// 🚀 الاستيرادات للكومبوننتس الجديدة اللي قطعناها
import { ProfileSidebar } from './ProfileSidebar';
import { ProfileTabs } from './ProfileTabs';
import { EditStudentModal } from './EditStudentModal';

interface Props {
    student: any;
    onBack: () => void;
    onUpdate: (updatedStudent: any) => void;
    onRefund: (studentId: number, itemId: string, type: 'course' | 'lecture', amount: number) => void;
    onResetExam: (studentId: number, examId: string) => void;
}

export const StudentProfile = React.memo(({ student, onBack, onUpdate, onRefund, onResetExam }: Props) => {
    const { showToast } = useToast();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const toggleStudentBan = () => {
        const newStatus = student.status === 'banned' ? 'active' : 'banned';
        onUpdate({ ...student, status: newStatus });
        showToast(newStatus === 'banned' ? 'تم حظر الطالب بنجاح! 🚫' : 'تم فك حظر الطالب بنجاح! ✅', newStatus === 'banned' ? 'error' : 'success');
    };

    const handleSaveEdit = (data: any) => {
        onUpdate({ ...student, ...data });
        setIsEditModalOpen(false);
        showToast('تم حفظ التعديلات بنجاح! 💾', 'success');
    };

    return (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <Button variant="outline" icon={<FaArrowRight />} onClick={onBack} style={{ marginBottom: '20px' }}>
                العودة للجدول
            </Button>

            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <ProfileSidebar 
                    student={student} 
                    onOpenEdit={() => setIsEditModalOpen(true)} 
                    onResetIP={() => showToast(`تم تصفير الأجهزة للطالب بنجاح! 🔄`, 'success')} 
                    onToggleBan={toggleStudentBan} 
                />
                
                <ProfileTabs 
                    student={student} 
                    onRefund={onRefund} 
                    onResetExam={onResetExam} 
                />
            </div>

            <EditStudentModal 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)} 
                student={student} 
                onSave={handleSaveEdit} 
            />
        </div>
    );
});