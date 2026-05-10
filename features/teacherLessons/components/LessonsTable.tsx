// FILE: features/teacherLessons/components/LessonsTable.tsx
import React from 'react';
import { useRouter } from 'next/navigation';
import { FaFolderOpen } from 'react-icons/fa';
import { Button } from '../../../components/ui/Button';

interface Props {
    lessons: any[];
    isLoading: boolean;
}

export default function LessonsTable({ lessons, isLoading }: Props) {
    const router = useRouter();

    if (isLoading) {
        return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--txt-mut)' }}>جاري تحميل الحصص... ⏳</div>;
    }

    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', textAlign: 'right', borderCollapse: 'collapse', minWidth: '800px' }}>
                <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--txt-mut)' }}>
                        <th style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>معلومات الحصة</th>
                        <th style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>المرحلة والباب</th>
                        <th style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>المحتوى المرفوع</th>
                        <th style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>إدارة</th>
                    </tr>
                </thead>
                <tbody>
                    {lessons.length > 0 ? lessons.map(lec => (
                        <tr key={lec.id} style={{ borderBottom: '1px dashed rgba(255,255,255,0.05)' }}>
                            <td style={{ padding: '15px' }}>
                                <div style={{ fontWeight: 'bold', color: 'var(--txt)', fontSize: '1.1rem', marginBottom: '5px' }}>{lec.title}</div>
                                <div style={{ color: 'var(--txt-mut)', fontSize: '0.85rem' }}>تم الإنشاء: {lec.date}</div>
                            </td>
                            <td style={{ padding: '15px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'flex-start' }}>
                                    <span style={{ background: 'rgba(108,92,231,0.1)', color: 'var(--p-purple)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                        {lec.stage}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--txt-mut)', fontSize: '0.9rem' }}>
                                        <FaFolderOpen style={{ color: '#f39c12' }} /> {lec.unit}
                                    </span>
                                </div>
                            </td>
                            <td style={{ padding: '15px', color: 'var(--txt-mut)', fontSize: '0.95rem' }}>
                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <span style={{ color: lec.videosCount > 0 ? '#3498db' : 'inherit' }}>{lec.videosCount} فيديو</span>
                                    <span style={{ color: lec.filesCount > 0 ? '#e74c3c' : 'inherit' }}>{lec.filesCount} ملف</span>
                                </div>
                            </td>
                            <td style={{ padding: '15px', textAlign: 'center' }}>
                                <Button variant="outline" size="sm" onClick={() => router.push(`/teacher/lessons/${lec.id}`)}>
                                    تعديل المحتوى
                                </Button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: 'var(--txt-mut)' }}>لا توجد حصص مطابقة لهذا التصنيف.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}