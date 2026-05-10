"use client";
import React from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaServer } from 'react-icons/fa';

interface Props {
    logs: any[];
    onViewDetails: (log: any) => void;
}

const getActionIcon = (type: string) => {
    switch(type) {
        case 'add': return <FaPlus color="#2ecc71" />;
        case 'edit': return <FaEdit color="#3498db" />;
        case 'delete': return <FaTrash color="#e74c3c" />;
        case 'view': return <FaEye color="#9b59b6" />;
        default: return <FaServer />;
    }
};

const getActionBadge = (type: string) => {
    switch(type) {
        case 'add': return <span style={{ background: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem' }}>إضافة</span>;
        case 'edit': return <span style={{ background: 'rgba(52, 152, 219, 0.1)', color: '#3498db', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem' }}>تعديل</span>;
        case 'delete': return <span style={{ background: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem' }}>حذف</span>;
        case 'view': return <span style={{ background: 'rgba(155, 89, 182, 0.1)', color: '#9b59b6', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem' }}>تصفح</span>;
        default: return null;
    }
};

const getModuleName = (mod: string) => {
    const modules: any = { 'courses': 'الكورسات', 'lessons': 'الحصص', 'exams': 'الامتحانات', 'question_banks': 'بنوك الأسئلة', 'library': 'المكتبة' };
    return modules[mod] || mod;
};

// 🚀 السر هنا في React.memo عشان الجدول ميترسمش مع كل حرف في البحث
export const ActionsTable: React.FC<Props> = React.memo(({ logs, onViewDetails }) => {
    return (
        <div style={{ background: 'var(--card)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: '900px', borderCollapse: 'collapse', textAlign: 'right', color: 'white' }}>
                <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <th style={{ padding: '15px' }}>المستخدم</th>
                        <th style={{ padding: '15px' }}>القسم</th>
                        <th style={{ padding: '15px' }}>نوع الإجراء</th>
                        <th style={{ padding: '15px' }}>العنصر المتأثر (Target)</th>
                        <th style={{ padding: '15px' }}>الوقت والتاريخ</th>
                        <th style={{ padding: '15px', textAlign: 'center' }}>التفاصيل</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map(log => (
                        <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', transition: '0.2s' }}>
                            <td style={{ padding: '15px' }}>
                                <div style={{ fontWeight: 'bold' }}>{log.user}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--txt-mut)' }}>{log.role}</div>
                            </td>
                            <td style={{ padding: '15px', color: 'var(--txt-mut)' }}>{getModuleName(log.module)}</td>
                            <td style={{ padding: '15px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {getActionIcon(log.actionType)}
                                    {getActionBadge(log.actionType)}
                                </div>
                            </td>
                            <td style={{ padding: '15px', fontWeight: 'bold', color: 'var(--txt)' }}>{log.target}</td>
                            <td style={{ padding: '15px', color: 'var(--txt-mut)', fontSize: '0.85rem', direction: 'ltr', textAlign: 'right' }}>{log.timestamp}</td>
                            <td style={{ padding: '15px', textAlign: 'center' }}>
                                <button onClick={() => onViewDetails(log)} style={{ background: 'rgba(52, 152, 219, 0.1)', color: '#3498db', border: '1px solid rgba(52, 152, 219, 0.3)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }}>
                                    عرض الداتا
                                </button>
                            </td>
                        </tr>
                    ))}
                    {logs.length === 0 && (
                        <tr><td colSpan={6} style={{ padding: '30px', textAlign: 'center', color: 'var(--txt-mut)' }}>لا توجد سجلات مطابقة للبحث.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
});