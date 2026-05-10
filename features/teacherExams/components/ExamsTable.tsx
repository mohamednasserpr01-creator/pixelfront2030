// FILE: features/teacherExams/components/ExamsTable.tsx
import React from 'react';
import { useRouter } from 'next/navigation';
import { FaFolderOpen, FaListOl } from 'react-icons/fa';
import { Button } from '../../../components/ui/Button';

interface Props {
    exams: any[];
    isLoading: boolean;
}

export default function ExamsTable({ exams, isLoading }: Props) {
    const router = useRouter();

    if (isLoading) {
        return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--txt-mut)' }}>جاري تحميل الامتحانات... ⏳</div>;
    }

    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', textAlign: 'right', borderCollapse: 'collapse', minWidth: '800px' }}>
                <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--txt-mut)' }}>
                        <th style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>معلومات الامتحان</th>
                        <th style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>المرحلة والباب</th>
                        <th style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>تفاصيل الأسئلة</th>
                        <th style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>إدارة</th>
                    </tr>
                </thead>
                <tbody>
                    {exams.length > 0 ? exams.map(ex => (
                        <tr key={ex.id} style={{ borderBottom: '1px dashed rgba(255,255,255,0.05)' }}>
                            <td style={{ padding: '15px' }}>
                                <div style={{ fontWeight: 'bold', color: 'var(--txt)', fontSize: '1.1rem', marginBottom: '5px' }}>{ex.title}</div>
                                <div style={{ color: 'var(--txt-mut)', fontSize: '0.85rem' }}>تم الإنشاء: {ex.date}</div>
                            </td>
                            <td style={{ padding: '15px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'flex-start' }}>
                                    <span style={{ background: 'rgba(108,92,231,0.1)', color: 'var(--p-purple)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                        {ex.stage}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--txt-mut)', fontSize: '0.9rem' }}>
                                        <FaFolderOpen style={{ color: '#f39c12' }} /> {ex.unit}
                                    </span>
                                </div>
                            </td>
                            <td style={{ padding: '15px', color: 'var(--txt-mut)', fontSize: '0.95rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <FaListOl style={{ color: 'var(--p-purple)' }}/>
                                    <span style={{ fontWeight: 'bold' }}>{ex.questionsCount} سؤال</span>
                                </div>
                            </td>
                            <td style={{ padding: '15px', textAlign: 'center' }}>
                                <Button variant="outline" size="sm" onClick={() => router.push(`/teacher/exams/${ex.id}`)}>
                                    وضع الأسئلة والإعدادات
                                </Button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: 'var(--txt-mut)' }}>لا توجد امتحانات مطابقة لهذا التصنيف.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}