// FILE: features/teacherExams/components/ExamsHeader.tsx
import React from 'react';
import { FaClipboardList, FaPlus } from 'react-icons/fa';
import { Button } from '../../../components/ui/Button';

interface Props {
    onCreateClick: () => void;
}

export default function ExamsHeader({ onCreateClick }: Props) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
            <div>
                <h1 style={{ fontSize: '1.8rem', color: 'var(--txt)', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaClipboardList style={{ color: 'var(--p-purple)' }} /> إدارة بنك الامتحانات
                </h1>
                <p style={{ color: 'var(--txt-mut)' }}>قم بتنظيم امتحاناتك حسب الصف الدراسي والأبواب لتكون جاهزة للربط بالمسار التعليمي.</p>
            </div>
            <Button variant="primary" icon={<FaPlus />} onClick={onCreateClick}>
                إضافة امتحان جديد
            </Button>
        </div>
    );
}