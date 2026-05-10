"use client";
import React, { useState } from 'react';
import { FaTrash, FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle, FaWallet, FaBookOpen } from 'react-icons/fa';

interface Props {
    codes: any[];
    onDelete: (id: string) => void;
}

export const CodesTable: React.FC<Props> = React.memo(({ codes, onDelete }) => {
    const [revealedCodes, setRevealedCodes] = useState<Record<string, boolean>>({});

    const toggleReveal = (id: string) => {
        setRevealedCodes(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div style={{ background: 'var(--card)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: '1000px', borderCollapse: 'collapse', textAlign: 'right', color: 'white' }}>
                <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <th style={{ padding: '15px' }}>السيريال</th>
                        <th style={{ padding: '15px' }}>كود الشحن السري</th>
                        <th style={{ padding: '15px' }}>النوع / القيمة</th>
                        <th style={{ padding: '15px' }}>تاريخ ووقت الإنشاء</th>
                        <th style={{ padding: '15px' }}>حالة الشحن</th>
                        <th style={{ padding: '15px', textAlign: 'center' }}>حذف</th>
                    </tr>
                </thead>
                <tbody>
                    {codes.map(code => (
                        <tr key={code.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }} className="table-row-hover">
                            <td style={{ padding: '15px', fontWeight: 'bold', color: 'var(--txt-mut)', fontFamily: 'monospace' }}>{code.serial}</td>
                            
                            <td style={{ padding: '15px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ fontFamily: 'monospace', fontSize: '1.1rem', letterSpacing: '2px', color: revealedCodes[code.id] ? '#f1c40f' : 'var(--txt-mut)' }}>
                                        {revealedCodes[code.id] ? code.code : 'XXXX-XXXX-XXXX-XXXX'}
                                    </span>
                                    <button onClick={() => toggleReveal(code.id)} style={{ background: 'none', border: 'none', color: 'var(--p-purple)', cursor: 'pointer' }}>
                                        {revealedCodes[code.id] ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                    </button>
                                </div>
                            </td>

                            <td style={{ padding: '15px' }}>
                                {code.type === 'wallet' ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#2ecc71' }}><FaWallet/> محفظة ({code.value} ج.م)</div>
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#3498db' }}><FaBookOpen/> كورس ({code.value})</div>
                                )}
                            </td>

                            <td style={{ padding: '15px', color: 'var(--txt-mut)', fontSize: '0.85rem', direction: 'ltr', textAlign: 'right' }}>{code.createdAt}</td>
                            
                            <td style={{ padding: '15px' }}>
                                {code.status === 'used' ? (
                                    <div>
                                        <span style={{ background: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}><FaCheckCircle/> مشحون</span>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--txt-mut)', marginTop: '5px' }}>بواسطة: {code.usedBy}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--txt-mut)', direction: 'ltr', textAlign: 'right' }}>{code.usedAt}</div>
                                    </div>
                                ) : (
                                    <span style={{ background: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}><FaTimesCircle/> لم يُشحن</span>
                                )}
                            </td>

                            <td style={{ padding: '15px', textAlign: 'center' }}>
                                <button onClick={() => onDelete(code.id)} style={{ background: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }} title="حذف الكود">
                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                    ))}
                    {codes.length === 0 && (
                        <tr><td colSpan={6} style={{ padding: '30px', textAlign: 'center', color: 'var(--txt-mut)' }}>لا توجد أكواد مطابقة للبحث.</td></tr>
                    )}
                </tbody>
            </table>
            <style jsx>{`.table-row-hover:hover { background: rgba(255,255,255,0.02); }`}</style>
        </div>
    );
});