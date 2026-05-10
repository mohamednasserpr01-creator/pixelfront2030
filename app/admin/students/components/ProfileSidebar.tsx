"use client";
import React from 'react';
import { FaUserEdit, FaSyncAlt, FaBan, FaUnlock, FaWallet, FaNetworkWired, FaClock, FaDesktop } from 'react-icons/fa';
import { Button } from '../../../../components/ui/Button';

interface Props {
    student: any;
    onOpenEdit: () => void;
    onResetIP: () => void;
    onToggleBan: () => void;
}

export const ProfileSidebar = React.memo(({ student, onOpenEdit, onResetIP, onToggleBan }: Props) => {
    return (
        <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: '20px', position: 'sticky', top: '20px' }}>
            <div style={{ background: 'var(--card)', padding: '25px', borderRadius: '20px', border: student.status === 'banned' ? '2px solid var(--danger)' : '1px solid rgba(128,128,128,0.2)', textAlign: 'center', position: 'relative' }}>
                {student.status === 'banned' && (
                    <div style={{ position: 'absolute', top: '15px', right: '15px', background: 'var(--danger)', color: 'white', padding: '5px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <FaBan /> محظور
                    </div>
                )}
                <div style={{ width: '80px', height: '80px', background: student.status === 'banned' ? 'var(--danger)' : 'linear-gradient(45deg, var(--p-purple), #ff007f)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2.5rem', fontWeight: 900, color: 'white', margin: '0 auto 15px' }}>
                    {student.name.charAt(0)}
                </div>
                <h2 style={{ fontSize: '1.4rem', color: student.status === 'banned' ? 'var(--danger)' : 'var(--txt)', marginBottom: '5px', textDecoration: student.status === 'banned' ? 'line-through' : 'none' }}>
                    {student.name}
                </h2>
                <p style={{ color: 'var(--txt-mut)', marginBottom: '5px', fontWeight: 'bold' }}>{student.grade} - {student.major || 'عام'}</p>
                <p style={{ color: 'var(--warning)', fontFamily: 'monospace', fontWeight: 'bold', marginBottom: '15px', fontSize: '1.2rem' }}>{student.serial}</p>
                
                <div style={{ background: 'rgba(128,128,128,0.05)', padding: '15px', borderRadius: '15px', marginBottom: '20px', textAlign: 'right', fontSize: '0.9rem', border: '1px solid rgba(128,128,128,0.1)' }}>
                    <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--txt-mut)' }}>📱 الطالب:</span> <strong style={{ color: 'var(--txt)' }}>{student.phone}</strong></div>
                    <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--txt-mut)' }}>📞 ولي الأمر:</span> <strong style={{ color: 'var(--txt)' }}>{student.parentPhone}</strong></div>
                    <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--txt-mut)' }}>🔑 الباسوورد:</span> <strong style={{ color: 'var(--danger)', fontFamily: 'monospace' }}>{student.password}</strong></div>
                    <div style={{ marginBottom: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}><span style={{ color: 'var(--txt-mut)' }}>🏠 العنوان:</span> <span style={{ color: 'var(--txt)', lineHeight: '1.4' }}>{student.address || 'غير مسجل'}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed rgba(128,128,128,0.2)', paddingTop: '10px', marginTop: '5px' }}><span style={{ color: 'var(--txt-mut)' }}>📅 التسجيل:</span> <strong style={{ color: 'var(--txt)' }}>{student.joinedAt}</strong></div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                    <Button variant="outline" fullWidth icon={<FaUserEdit />} onClick={onOpenEdit}>تعديل</Button>
                    <Button variant="outline" style={{ color: 'var(--warning)', borderColor: 'var(--warning)' }} icon={<FaSyncAlt />} onClick={onResetIP} title="تصفير الأجهزة"></Button>
                </div>
                
                <Button 
                    variant={student.status === 'banned' ? 'primary' : 'outline'} fullWidth icon={student.status === 'banned' ? <FaUnlock /> : <FaBan />} onClick={onToggleBan}
                    style={{ background: student.status === 'banned' ? 'var(--success)' : 'transparent', color: student.status === 'banned' ? 'white' : 'var(--danger)', borderColor: student.status === 'banned' ? 'var(--success)' : 'var(--danger)' }}
                >
                    {student.status === 'banned' ? 'فك الحظر عن الطالب' : 'حظر الطالب نهائياً'}
                </Button>

                <div style={{ background: 'rgba(241, 196, 15, 0.1)', border: '1px solid var(--warning)', padding: '15px', borderRadius: '15px', marginTop: '20px' }}>
                    <div style={{ color: 'var(--txt-mut)', fontSize: '0.85rem' }}><FaWallet/> محفظة الطالب</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--txt)' }}>{student.balance || 0} ج.م</div>
                </div>
            </div>

            <div style={{ background: 'var(--card)', padding: '20px', borderRadius: '20px', border: '1px solid rgba(128,128,128,0.2)' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--txt)', fontWeight: 900, marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}><FaNetworkWired color="var(--danger)"/> سجل الأمان</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--txt-mut)' }}><FaClock/> آخر ظهور:</span> <strong style={{ color: 'var(--txt)' }}>{student.lastLogin || '-'}</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--txt-mut)' }}><FaDesktop/> آخر جهاز:</span> <strong style={{ color: 'var(--txt)' }}>{student.lastDevice || '-'}</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--txt-mut)' }}>🌐 آخر IP:</span> <strong style={{ color: 'var(--warning)' }}>{student.lastIP || '-'}</strong></div>
                </div>
            </div>
        </div>
    );
});