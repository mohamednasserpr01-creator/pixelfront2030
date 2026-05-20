// FILE: features/teacherLessons/components/LessonsTable.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaFolderOpen, FaTrash } from 'react-icons/fa';
import { Button } from '../../../components/ui/Button';

const API_BASE_URL = 'http://localhost:5000/api'; // 🚀 ضفناه عشان نجيب المراحل

interface Props {
    lessons: any[];
    isLoading: boolean;
    onDelete?: (id: string) => void;
}

export default function LessonsTable({ lessons, isLoading, onDelete }: Props) {
    const router = useRouter();
    const [stagesMap, setStagesMap] = useState<Record<string, string>>({});

    // 🚀 جلب قاموس المراحل عشان نترجم الـ ID لاسم المرحلة بالعربي
    useEffect(() => {
        const fetchStages = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const res = await fetch(`${API_BASE_URL}/educational-stages`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    const stagesArray = data.data || data.items || data || [];
                    
                    // تحويل الداتا لقاموس (ID -> Name) لسهولة البحث
                    const map: Record<string, string> = {};
                    stagesArray.forEach((s: any) => {
                        map[s.id] = s.name;
                    });
                    setStagesMap(map);
                }
            } catch (error) {
                console.error("Error fetching stages for table:", error);
            }
        };
        fetchStages();
    }, []);

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
                    {lessons.length > 0 ? lessons.map(lec => {
                        // 🚀 السحر هنا: بنترجم الـ ID اللي جاي من الباك إند للاسم العربي من القاموس
                        const stageName = stagesMap[lec.educationalStageId] || stagesMap[lec.stage] || lec.educationalStage?.name || lec.stageName || 'مرحلة غير محددة';

                        return (
                            <tr key={lec.id} style={{ borderBottom: '1px dashed rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ fontWeight: 'bold', color: 'var(--txt)', fontSize: '1.1rem', marginBottom: '5px' }}>{lec.title}</div>
                                    <div style={{ color: 'var(--txt-mut)', fontSize: '0.85rem' }}>تم الإنشاء: {lec.date || lec.createdAt?.substring(0, 10)}</div>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'flex-start' }}>
                                        <span style={{ background: 'rgba(108,92,231,0.1)', color: 'var(--p-purple)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                            {stageName}
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--txt-mut)', fontSize: '0.9rem' }}>
                                            <FaFolderOpen style={{ color: '#f39c12' }} /> {lec.unit || lec.description || 'بدون باب'}
                                        </span>
                                    </div>
                                </td>
                                <td style={{ padding: '15px', color: 'var(--txt-mut)', fontSize: '0.95rem' }}>
                                    <div style={{ display: 'flex', gap: '15px' }}>
                                        <span style={{ color: (lec.videosCount || lec.videoUrl) ? '#3498db' : 'inherit' }}>
                                            {lec.videosCount > 0 || lec.videoUrl ? 'يوجد فيديو' : '0 فيديو'}
                                        </span>
                                        <span style={{ color: lec.filesCount > 0 ? '#e74c3c' : 'inherit' }}>{lec.filesCount || 0} ملف</span>
                                    </div>
                                </td>
                                <td style={{ padding: '15px', textAlign: 'center' }}>
                                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                        <Button variant="outline" size="sm" onClick={() => router.push(`/teacher/lessons/${lec.id}`)}>
                                            تعديل المحتوى
                                        </Button>
                                        
                                        {onDelete && (
                                            <button 
                                                onClick={() => onDelete(lec.id)}
                                                style={{
                                                    background: 'rgba(231, 76, 60, 0.1)',
                                                    border: '1px solid rgba(231, 76, 60, 0.3)',
                                                    color: '#e74c3c',
                                                    padding: '8px 12px',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '5px',
                                                    fontSize: '0.9rem',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onMouseOver={(e) => { e.currentTarget.style.background = '#e74c3c'; e.currentTarget.style.color = 'white'; }}
                                                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(231, 76, 60, 0.1)'; e.currentTarget.style.color = '#e74c3c'; }}
                                            >
                                                <FaTrash /> مسح
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    }) : (
                        <tr>
                            <td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: 'var(--txt-mut)' }}>لا توجد حصص مطابقة لهذا التصنيف.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}