import React from 'react';
import { useRouter } from 'next/navigation';
import { FaFolderOpen, FaListOl, FaTrash, FaEdit } from 'react-icons/fa';
import { Button } from '../../../components/ui/Button';

interface Props { exams: any[]; isLoading: boolean; stagesMap: Record<string, string>; onDelete: (id: string) => void; }

export default function ExamsTable({ exams, isLoading, stagesMap, onDelete }: Props) {
    const router = useRouter();
    if (isLoading) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--txt-mut)' }}>جاري التحميل... ⏳</div>;

    return (
        /* 🚀 فصل الجدول عن حجم الشاشة الكلي وعمل سكرول منفصل */
        <div style={{ display: 'block', width: '100%', maxWidth: '100%', overflowX: 'auto', boxSizing: 'border-box', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', minWidth: '750px', textAlign: 'right', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--txt-mut)' }}>
                        <th style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>معلومات الامتحان</th>
                        <th style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>المرحلة والباب</th>
                        <th style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>الأسئلة</th>
                        <th style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>إجراءات</th>
                    </tr>
                </thead>
                <tbody>
                    {exams.length > 0 ? exams.map(ex => {
                        const stageName = stagesMap[ex.stage] || ex.stage || 'مرحلة غير محددة';
                        return (
                            <tr key={ex.id} style={{ borderBottom: '1px dashed rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ fontWeight: 'bold', color: 'var(--txt)', fontSize: '1.1rem' }}>{ex.title}</div>
                                    <div style={{ color: 'var(--txt-mut)', fontSize: '0.85rem' }}>تم الإنشاء: {ex.date}</div>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <span style={{ background: 'rgba(108,92,231,0.1)', color: 'var(--p-purple)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold', display: 'inline-block', marginBottom: '5px' }}>{stageName}</span>
                                    <br/><span style={{ color: 'var(--txt-mut)', fontSize: '0.9rem' }}><FaFolderOpen style={{ color: '#f39c12' }} /> {ex.unit}</span>
                                </td>
                                <td style={{ padding: '15px', color: 'var(--txt-mut)' }}>
                                    <FaListOl style={{ color: 'var(--p-purple)' }}/> <span style={{ fontWeight: 'bold' }}>{ex.questionsCount} سؤال</span>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                        <button onClick={() => router.push(`/teacher/exams/${ex.id}`)} style={{ background: 'rgba(108,92,231,0.1)', color: 'var(--p-purple)', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}><FaEdit /> وضع الأسئلة</button>
                                        <button onClick={() => onDelete(ex.id)} style={{ background: 'rgba(231,76,60,0.1)', color: 'var(--danger)', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}><FaTrash /> مسح</button>
                                    </div>
                                </td>
                            </tr>
                        );
                    }) : <tr><td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: 'var(--txt-mut)' }}>لا توجد امتحانات مسجلة.</td></tr>}
                </tbody>
            </table>
        </div>
    );
}