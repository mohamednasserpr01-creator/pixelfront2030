"use client";
import React from 'react';
import { FaQrcode, FaWallet, FaChevronRight, FaChevronLeft } from 'react-icons/fa';

interface Props {
    transactions: any[];
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const TransactionsTable: React.FC<Props> = React.memo(({ transactions, currentPage, totalPages, onPageChange }) => {
    return (
        <div>
            <div style={{ background: 'var(--card)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', overflowX: 'auto' }}>
                <table style={{ width: '100%', minWidth: '1000px', borderCollapse: 'collapse', textAlign: 'right', color: 'white' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <th style={{ padding: '15px' }}>الطالب</th>
                            <th style={{ padding: '15px' }}>تم شراء</th>
                            <th style={{ padding: '15px' }}>طريقة الدفع / الكود</th>
                            <th style={{ padding: '15px' }}>المبلغ</th>
                            <th style={{ padding: '15px' }}>التاريخ والوقت</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(trx => (
                            <tr key={trx.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', transition: '0.2s' }} className="table-row-hover">
                                <td style={{ padding: '15px' }}>
                                    <div style={{ fontWeight: 'bold' }}>{trx.studentName}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--txt-mut)', fontFamily: 'monospace' }}>{trx.studentPhone}</div>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ color: 'white' }}>{trx.itemBought}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--txt-mut)' }}>{trx.itemType}</div>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    {trx.paymentMethod === 'custom_code' ? (
                                        <div>
                                            <span style={{ background: 'rgba(155, 89, 182, 0.1)', color: '#9b59b6', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}><FaQrcode/> كود مخصص</span>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--txt-mut)', marginTop: '5px', fontFamily: 'monospace' }}>سيريال: {trx.codeSerial}</div>
                                        </div>
                                    ) : (
                                        <span style={{ background: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}><FaWallet/> محفظة الطالب</span>
                                    )}
                                </td>
                                <td style={{ padding: '15px', fontWeight: 'bold', color: '#f1c40f', fontSize: '1.1rem' }}>
                                    {trx.amount} <span style={{ fontSize: '0.8rem', color: 'var(--txt-mut)', fontWeight: 'normal' }}>ج.م</span>
                                </td>
                                <td style={{ padding: '15px', color: 'var(--txt-mut)', fontSize: '0.85rem', direction: 'ltr', textAlign: 'right' }}>{trx.timestamp}</td>
                            </tr>
                        ))}
                        {transactions.length === 0 && (
                            <tr><td colSpan={5} style={{ padding: '30px', textAlign: 'center', color: 'var(--txt-mut)' }}>لا توجد مبيعات مطابقة للبحث أو التاريخ.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginTop: '20px' }}>
                    <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', width: '40px', height: '40px', borderRadius: '8px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}><FaChevronRight /></button>
                    <span style={{ color: 'var(--txt-mut)' }}>صفحة <strong style={{ color: 'white' }}>{currentPage}</strong> من {totalPages}</span>
                    <button disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)} style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', width: '40px', height: '40px', borderRadius: '8px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}><FaChevronLeft /></button>
                </div>
            )}
            <style jsx>{`.table-row-hover:hover { background: rgba(255,255,255,0.02); }`}</style>
        </div>
    );
});