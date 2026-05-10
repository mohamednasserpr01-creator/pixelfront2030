// FILE: app/admin/support/components/AppointmentsTable.tsx
"use client";
import React from 'react';
import { FaUserTie, FaUserNurse, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { FaWhatsapp } from 'react-icons/fa6';
import { Appointment, AppointmentStatus } from '../../../../types';

interface AppointmentsTableProps {
    appointments: Appointment[];
    onUpdateStatus: (id: string, newStatus: AppointmentStatus) => void;
}

export default function AppointmentsTable({ appointments, onUpdateStatus }: AppointmentsTableProps) {
    return (
        <div style={{ background: 'var(--card)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', textAlign: 'center', borderCollapse: 'collapse', minWidth: '900px' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--txt-mut)', fontSize: '0.9rem' }}>
                            <th style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>الطالب</th>
                            <th style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>موعد الجلسة</th>
                            <th style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>نوع المتخصص</th>
                            <th style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>الحالة</th>
                            <th style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>إجراءات / تواصل</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.length > 0 ? appointments.map(app => (
                            <tr key={app.id} style={{ borderBottom: '1px dashed rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '15px', textAlign: 'right' }}>
                                    <div style={{ fontWeight: 'bold', color: 'var(--txt)' }}>{app.studentName}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--txt-mut)', marginTop: '3px', direction: 'ltr' }}>{app.phone}</div>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ color: '#0984e3', fontWeight: 'bold' }}>{app.day} - {app.date}</div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--txt)' }}>الساعة: {app.time}</div>
                                </td>
                                <td style={{ padding: '15px', color: 'var(--txt-mut)' }}>
                                    {app.type === 'male' ? <span style={{color: '#3498db'}}><FaUserTie/> متخصص (ذكر)</span> : <span style={{color: '#e84393'}}><FaUserNurse/> متخصصة (أنثى)</span>}
                                </td>
                                <td style={{ padding: '15px' }}>
                                    {app.status === 'pending' && <span style={{ background: 'rgba(241,196,15,0.1)', color: 'var(--warning)', padding: '5px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold' }}><FaClock/> قيد الانتظار</span>}
                                    {app.status === 'completed' && <span style={{ background: 'rgba(46,204,113,0.1)', color: 'var(--success)', padding: '5px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold' }}><FaCheckCircle/> تمت بنجاح</span>}
                                    {app.status === 'cancelled' && <span style={{ background: 'rgba(231,76,60,0.1)', color: 'var(--danger)', padding: '5px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold' }}><FaTimesCircle/> ملغية</span>}
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                        <a href={`https://wa.me/2${app.phone}`} target="_blank" rel="noreferrer" style={{ background: '#25D366', color: 'white', padding: '8px', borderRadius: '8px', fontSize: '1.2rem', display: 'flex', alignItems: 'center' }}>
                                            <FaWhatsapp />
                                        </a>
                                        {app.status === 'pending' && (
                                            <>
                                                <button onClick={() => onUpdateStatus(app.id, 'completed')} style={{ background: 'rgba(46,204,113,0.1)', color: 'var(--success)', border: '1px solid var(--success)', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>إنهاء</button>
                                                <button onClick={() => onUpdateStatus(app.id, 'cancelled')} style={{ background: 'rgba(231,76,60,0.1)', color: 'var(--danger)', border: '1px solid var(--danger)', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>إلغاء</button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan={5} style={{ padding: '40px', color: 'var(--txt-mut)' }}>لا توجد حجوزات مطابقة.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}