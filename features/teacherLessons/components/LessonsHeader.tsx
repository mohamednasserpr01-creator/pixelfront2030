// FILE: features/teacherLessons/components/LessonsHeader.tsx
import React from 'react';
import { FaPlayCircle, FaPlus } from 'react-icons/fa';
import { Button } from '../../../components/ui/Button';

interface Props {
    onCreateClick: () => void;
}

export default function LessonsHeader({ onCreateClick }: Props) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
            <div>
                <h1 style={{ fontSize: '1.8rem', color: 'var(--txt)', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaPlayCircle style={{ color: 'var(--p-purple)' }} /> إدارة بنك الحصص
                </h1>
                <p style={{ color: 'var(--txt-mut)' }}>قم بتنظيم حصصك حسب الصف الدراسي والأبواب.</p>
            </div>
            <Button variant="primary" icon={<FaPlus />} onClick={onCreateClick}>
                إضافة حصة جديدة
            </Button>
        </div>
    );
}