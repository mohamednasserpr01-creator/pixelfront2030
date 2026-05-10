"use client";
import React from 'react';
import { FaMoneyBillWave, FaCalendarDay, FaChartLine } from 'react-icons/fa';

interface Props {
    totalLifetimeRevenue: number;
    todayRevenue: number;
    periodRevenue: number;
}

export const FinanceCards: React.FC<Props> = ({ totalLifetimeRevenue, todayRevenue, periodRevenue }) => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            <div style={{ background: 'var(--card)', padding: '25px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-10px', left: '-10px', opacity: 0.05 }}><FaChartLine size={120} /></div>
                <h4 style={{ margin: '0 0 10px 0', color: 'var(--txt-mut)', fontSize: '1rem' }}>إجمالي المبيعات (طوال العمر)</h4>
                <div style={{ fontSize: '2.2rem', fontWeight: '900', color: 'white' }}>{totalLifetimeRevenue.toLocaleString()} <span style={{ fontSize: '1rem', color: 'var(--txt-mut)' }}>ج.م</span></div>
            </div>
            
            <div style={{ background: 'var(--card)', padding: '25px', borderRadius: '15px', border: '1px solid rgba(241, 196, 15, 0.2)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-10px', left: '-10px', opacity: 0.05, color: '#f1c40f' }}><FaCalendarDay size={120} /></div>
                <h4 style={{ margin: '0 0 10px 0', color: 'var(--txt-mut)', fontSize: '1rem' }}>مبيعات اليوم (الوردية الحالية)</h4>
                <div style={{ fontSize: '2.2rem', fontWeight: '900', color: '#f1c40f' }}>{todayRevenue.toLocaleString()} <span style={{ fontSize: '1rem', color: 'var(--txt-mut)' }}>ج.م</span></div>
            </div>

            <div style={{ background: 'linear-gradient(135deg, rgba(46, 204, 113, 0.1) 0%, rgba(46, 204, 113, 0.05) 100%)', padding: '25px', borderRadius: '15px', border: '1px solid rgba(46, 204, 113, 0.3)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-10px', left: '-10px', opacity: 0.05, color: '#2ecc71' }}><FaMoneyBillWave size={120} /></div>
                <h4 style={{ margin: '0 0 10px 0', color: 'var(--txt-mut)', fontSize: '1rem' }}>مبيعات الفترة المحددة (الفلتر)</h4>
                <div style={{ fontSize: '2.2rem', fontWeight: '900', color: '#2ecc71' }}>{periodRevenue.toLocaleString()} <span style={{ fontSize: '1rem', color: 'rgba(46, 204, 113, 0.7)' }}>ج.م</span></div>
            </div>
        </div>
    );
};