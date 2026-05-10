"use client";
import React from 'react';
import { Button } from '../../../../components/ui/Button';

interface Props {
    students: any[];
    selectedIds: number[];
    onToggleAll: () => void;
    onToggleOne: (id: number) => void;
    onOpenProfile: (student: any) => void;
}

export const StudentsTable = React.memo(({ students, selectedIds, onToggleAll, onToggleOne, onOpenProfile }: Props) => {
    return (
        <div style={{ background: 'var(--card)', borderRadius: '20px', border: '1px solid var(--border-color)', overflowX: 'auto' }}>
            <table style={{ width: '100%', textAlign: 'right', borderCollapse: 'collapse', minWidth: '800px' }}>
                <thead>
                    <tr style={{ background: 'var(--bg)', color: 'var(--txt-mut)' }}>
                        <th style={{ padding: '15px', borderBottom: '1px solid var(--border-color)', width: '50px' }}>
                            <input type="checkbox" checked={selectedIds.length === students.length && students.length > 0} onChange={onToggleAll} style={{ width: '18px', height: '18px', accentColor: 'var(--p-purple)', cursor: 'pointer' }} />
                        </th>
                        <th style={{ padding: '15px', borderBottom: '1px solid var(--border-color)' }}>الكود</th>
                        <th style={{ padding: '15px', borderBottom: '1px solid var(--border-color)' }}>الاسم والتليفون</th>
                        <th style={{ padding: '15px', borderBottom: '1px solid var(--border-color)' }}>الباسورد</th>
                        <th style={{ padding: '15px', borderBottom: '1px solid var(--border-color)' }}>الحالة</th>
                        <th style={{ padding: '15px', borderBottom: '1px solid var(--border-color)' }}>المرحلة</th>
                        <th style={{ padding: '15px', borderBottom: '1px solid var(--border-color)', textAlign: 'center' }}>إدارة</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <tr key={student.id} style={{ borderBottom: '1px dashed var(--border-color)', background: selectedIds.includes(student.id) ? 'rgba(108,92,231,0.05)' : student.status === 'banned' ? 'rgba(231,76,60,0.05)' : 'transparent' }}>
                            <td style={{ padding: '15px' }}>
                                <input type="checkbox" checked={selectedIds.includes(student.id)} onChange={() => onToggleOne(student.id)} style={{ width: '18px', height: '18px', accentColor: 'var(--p-purple)', cursor: 'pointer' }} />
                            </td>
                            <td style={{ padding: '15px', fontWeight: 'bold', color: 'var(--p-purple)' }}>{student.serial}</td>
                            <td style={{ padding: '15px' }}>
                                <div style={{ fontWeight: 'bold', color: 'var(--txt)', textDecoration: student.status === 'banned' ? 'line-through' : 'none' }}>{student.name}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--txt-mut)' }}>📱 {student.phone}</div>
                            </td>
                            <td style={{ padding: '15px', fontFamily: 'monospace', color: 'var(--warning)', fontWeight: 'bold', letterSpacing: '1px' }}>{student.password}</td>
                            <td style={{ padding: '15px' }}>
                                {student.status === 'banned' 
                                    ? <span style={{ background: 'rgba(231,76,60,0.1)', color: 'var(--danger)', padding: '5px 10px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}>🚫 محظور</span>
                                    : <span style={{ background: 'rgba(46,204,113,0.1)', color: 'var(--success)', padding: '5px 10px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}>✅ نشط</span>
                                }
                            </td>
                            <td style={{ padding: '15px', color: 'var(--txt-mut)' }}>{student.grade}</td>
                            <td style={{ padding: '15px', textAlign: 'center' }}>
                                <Button variant="outline" size="sm" onClick={() => onOpenProfile(student)}>فتح الملف</Button>
                            </td>
                        </tr>
                    ))}
                    {students.length === 0 && (
                        <tr><td colSpan={7} style={{ padding: '30px', textAlign: 'center', color: 'var(--txt-mut)' }}>لا يوجد طلاب يطابقون بحثك.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
});