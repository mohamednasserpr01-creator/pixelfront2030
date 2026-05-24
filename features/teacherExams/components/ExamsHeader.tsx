import React from 'react';
import { FaClipboardList, FaPlus } from 'react-icons/fa';
import { Button } from '../../../components/ui/Button';

interface Props { onCreateClick: () => void; }

export default function ExamsHeader({ onCreateClick }: Props) {
    return (
        /* 🚀 تنسيق Flex Wrap عشان الزرار ينزل تحت بانسيابية في الموبايل */
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px', width: '100%', boxSizing: 'border-box' }}>
            <div style={{ flex: '1 1 300px', maxWidth: '100%' }}>
                <h1 style={{ fontSize: 'clamp(1.2rem, 4vw, 1.8rem)', color: 'var(--txt)', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 5px 0' }}>
                    <FaClipboardList style={{ color: 'var(--p-purple)' }} /> إدارة بنك الامتحانات
                </h1>
                <p style={{ color: 'var(--txt-mut)', margin: 0, fontSize: 'clamp(0.8rem, 3vw, 0.9rem)', lineHeight: '1.5' }}>قم بتنظيم امتحاناتك حسب الصف الدراسي والأبواب لتكون جاهزة للربط بالمسار التعليمي.</p>
            </div>
            <div style={{ flex: '1 1 auto', display: 'flex', justifyContent: 'flex-end', minWidth: '200px' }}>
                <Button variant="primary" icon={<FaPlus />} onClick={onCreateClick} style={{ width: '100%', justifyContent: 'center' }}>إضافة امتحان جديد</Button>
            </div>
        </div>
    );
}