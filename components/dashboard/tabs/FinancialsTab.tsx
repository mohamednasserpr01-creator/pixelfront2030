"use client";
import React from 'react';
import { FaWallet } from 'react-icons/fa';
import { dashboardData } from '../../../data/mock/dashboardData'; // 💡 الداتا هنا فقط

export default function FinancialsTab() {
    return (
        <div className="tab-pane active" style={{ animation: 'fadeIn 0.4s ease' }}>
            <h2 className="section-title"><FaWallet /> المحفظة والأكواد</h2>
            <div className="recharge-box">
                <input type="text" placeholder="أدخل كود الشحن المكون من 16 رقم" maxLength={19} />
                <button className="btn-recharge">شحن الرصيد</button>
            </div>
            <h3 style={{ marginBottom: '15px', fontWeight: 900, color: 'var(--txt)' }}>سجل الأكواد المشحونة</h3>
            <div className="table-responsive scrollable-table">
                <table>
                    <thead><tr><th>رقم الكود</th><th>المدرس المصدر</th><th>القيمة</th><th>التاريخ</th></tr></thead>
                    <tbody>
                        {dashboardData.financials.map(fin => (
                            <tr key={fin.id}>
                                <td style={{ fontFamily: 'monospace', letterSpacing: '1px' }}>{fin.code}</td>
                                <td>{fin.source}</td><td style={{ color: 'var(--success)' }}>{fin.amount}</td><td>{fin.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}