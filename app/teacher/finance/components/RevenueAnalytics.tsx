"use client";
import React, { useMemo } from 'react';
import { FaBookOpen, FaPlayCircle } from 'react-icons/fa';

interface Props {
    transactions: any[];
}

export const RevenueAnalytics: React.FC<Props> = React.memo(({ transactions }) => {
    
    // 🚀 تجميع المبيعات بناءً على اسم الكورس/المحاضرة
    const groupedData = useMemo(() => {
        const groups: Record<string, { type: string, count: number, revenue: number }> = {};
        transactions.forEach(trx => {
            if (!groups[trx.itemBought]) {
                groups[trx.itemBought] = { type: trx.itemType, count: 0, revenue: 0 };
            }
            groups[trx.itemBought].count += 1;
            groups[trx.itemBought].revenue += trx.amount;
        });
        return Object.entries(groups).sort((a, b) => b[1].revenue - a[1].revenue); // ترتيب من الأعلى للأقل
    }, [transactions]);

    return (
        <div style={{ animation: 'fadeIn 0.3s ease', background: 'var(--card)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'right', color: 'white' }}>
                <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <th style={{ padding: '15px' }}>اسم المحتوى (الكورس / المحاضرة)</th>
                        <th style={{ padding: '15px' }}>النوع</th>
                        <th style={{ padding: '15px', textAlign: 'center' }}>عدد المبيعات</th>
                        <th style={{ padding: '15px' }}>إجمالي الدخل</th>
                    </tr>
                </thead>
                <tbody>
                    {groupedData.map(([itemName, data]) => (
                        <tr key={itemName} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }} className="table-row-hover">
                            <td style={{ padding: '15px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                {data.type === 'كورس كامل' ? <FaBookOpen color="#3498db"/> : <FaPlayCircle color="#9b59b6"/>}
                                {itemName}
                            </td>
                            <td style={{ padding: '15px', color: 'var(--txt-mut)' }}>{data.type}</td>
                            <td style={{ padding: '15px', textAlign: 'center' }}>
                                <span style={{ background: 'rgba(255,255,255,0.1)', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold' }}>{data.count}</span>
                            </td>
                            <td style={{ padding: '15px', fontWeight: 'bold', color: '#2ecc71', fontSize: '1.1rem' }}>
                                {data.revenue.toLocaleString()} <span style={{ fontSize: '0.8rem', color: 'var(--txt-mut)' }}>ج.م</span>
                            </td>
                        </tr>
                    ))}
                    {groupedData.length === 0 && (
                        <tr><td colSpan={4} style={{ padding: '30px', textAlign: 'center', color: 'var(--txt-mut)' }}>لا توجد مبيعات في هذه الفترة.</td></tr>
                    )}
                </tbody>
            </table>
            <style jsx>{`.table-row-hover:hover { background: rgba(255,255,255,0.02); }`}</style>
        </div>
    );
});