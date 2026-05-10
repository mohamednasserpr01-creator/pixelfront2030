"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { FaMoneyBillWave, FaSearch, FaCalendarAlt, FaDownload, FaHistory, FaChartPie, FaFilter } from 'react-icons/fa';
import { FinanceCards } from './components/FinanceCards';
import { TransactionsTable } from './components/TransactionsTable';
import { RevenueAnalytics } from './components/RevenueAnalytics';

// الحصول على تاريخ اليوم الفعلي
const getTodayDate = () => new Date().toISOString().split('T')[0];

// 💡 Mock Data المتطورة عشان تشمل المراحل الدراسية
const STAGES = ['sec1', 'sec2', 'sec3'];
const MOCK_TRANSACTIONS = Array.from({ length: 150 }).map((_, i) => {
    const isCourse = i % 3 === 0;
    const isCustomCode = i % 2 === 0;
    const isToday = i < 15; 
    const dateDay = isToday ? getTodayDate().split('-')[2] : String(24 - (i % 15)).padStart(2, '0');
    const fullDate = isToday ? getTodayDate() : `2026-04-${dateDay}`;
    const stage = STAGES[i % 3];

    return {
        id: `trx-${i}`,
        studentName: `طالب تجريبي رقم ${i + 1}`,
        studentPhone: `01012345${i.toString().padStart(3, '0')}`,
        itemBought: isCourse ? 'كورس المراجعة النهائية' : `محاضرة الباب الـ ${i % 4 + 1}`,
        itemType: isCourse ? 'كورس كامل' : 'محاضرة منفصلة',
        paymentMethod: isCustomCode ? 'custom_code' : 'wallet',
        codeSerial: isCustomCode ? `840${i.toString().padStart(2, '0')}` : null,
        amount: isCourse ? 250 : 50,
        stage: stage, // إضافة المرحلة الدراسية
        dateOnly: fullDate,
        timestamp: `${fullDate} 10:${String((i * 13) % 60).padStart(2, '0')} AM`
    };
});

export default function FinancePage() {
    const [isMounted, setIsMounted] = useState(false);
    const [activeTab, setActiveTab] = useState<'transactions' | 'analytics'>('transactions');
    
    // 🚀 Advanced Filters States
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [paymentFilter, setPaymentFilter] = useState('all');
    const [stageFilter, setStageFilter] = useState('all');
    const [contentTypeFilter, setContentTypeFilter] = useState('all');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    useEffect(() => { setIsMounted(true); }, []);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // 🚀 الفلترة الذكية والمجمعة لكل الشروط
    const filteredTransactions = useMemo(() => {
        return MOCK_TRANSACTIONS.filter(trx => {
            // 1. البحث الشامل (طالب، تليفون، سيريال، اسم كورس/محاضرة)
            const matchSearch = 
                trx.studentName.includes(debouncedSearch) || 
                trx.studentPhone.includes(debouncedSearch) || 
                (trx.codeSerial && trx.codeSerial.includes(debouncedSearch)) ||
                trx.itemBought.includes(debouncedSearch);

            // 2. الفلاتر المنسدلة
            const matchMethod = paymentFilter === 'all' || trx.paymentMethod === paymentFilter;
            const matchStage = stageFilter === 'all' || trx.stage === stageFilter;
            const matchContentType = contentTypeFilter === 'all' || 
                                     (contentTypeFilter === 'course' && trx.itemType === 'كورس كامل') || 
                                     (contentTypeFilter === 'lecture' && trx.itemType === 'محاضرة منفصلة');
            
            // 3. فلتر التاريخ
            let matchDate = true;
            if (startDate) matchDate = matchDate && trx.dateOnly >= startDate;
            if (endDate) matchDate = matchDate && trx.dateOnly <= endDate;

            return matchSearch && matchMethod && matchStage && matchContentType && matchDate;
        });
    }, [debouncedSearch, startDate, endDate, paymentFilter, stageFilter, contentTypeFilter]);

    // الحسابات المالية
    const totalLifetimeRevenue = MOCK_TRANSACTIONS.reduce((sum, trx) => sum + trx.amount, 0);
    const todayRevenue = MOCK_TRANSACTIONS.filter(trx => trx.dateOnly === getTodayDate()).reduce((sum, trx) => sum + trx.amount, 0);
    const periodRevenue = filteredTransactions.reduce((sum, trx) => sum + trx.amount, 0);

    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    const paginatedTransactions = useMemo(() => filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [filteredTransactions, currentPage]);

    useEffect(() => { setCurrentPage(1); }, [debouncedSearch, startDate, endDate, paymentFilter, stageFilter, contentTypeFilter, activeTab]);

    if (!isMounted) return null;

    return (
        <div style={{ animation: 'fadeIn 0.4s ease', maxWidth: '1400px', margin: '0 auto', paddingBottom: '50px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', marginTop: '20px', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', margin: '0 0 5px 0', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaMoneyBillWave color="#2ecc71" /> الميزانية وتقفيل الحسابات
                    </h1>
                    <p style={{ color: 'var(--txt-mut)', margin: 0 }}>متابعة دقيقة لكل مبيعات السنتر والكورسات باليوم والمرحلة.</p>
                </div>
                <button style={{ background: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71', border: '1px solid rgba(46, 204, 113, 0.3)', padding: '12px 20px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', transition: '0.2s' }}>
                    <FaDownload /> تحميل شيت المبيعات (حسب الفلتر)
                </button>
            </div>

            <FinanceCards totalLifetimeRevenue={totalLifetimeRevenue} todayRevenue={todayRevenue} periodRevenue={periodRevenue} />

            <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '25px' }}>
                <button onClick={() => setActiveTab('transactions')} style={{ background: 'transparent', border: 'none', borderBottom: activeTab === 'transactions' ? '3px solid #2ecc71' : '3px solid transparent', padding: '0 0 15px 0', color: activeTab === 'transactions' ? 'white' : 'var(--txt-mut)', fontWeight: activeTab === 'transactions' ? 'bold' : 'normal', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px', transition: '0.2s' }}>
                    <FaHistory color={activeTab === 'transactions' ? '#2ecc71' : 'var(--txt-mut)'}/> سجل المبيعات اليومية
                </button>
                <button onClick={() => setActiveTab('analytics')} style={{ background: 'transparent', border: 'none', borderBottom: activeTab === 'analytics' ? '3px solid #2ecc71' : '3px solid transparent', padding: '0 0 15px 0', color: activeTab === 'analytics' ? 'white' : 'var(--txt-mut)', fontWeight: activeTab === 'analytics' ? 'bold' : 'normal', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px', transition: '0.2s' }}>
                    <FaChartPie color={activeTab === 'analytics' ? '#2ecc71' : 'var(--txt-mut)'}/> أرباح الكورسات والمحاضرات
                </button>
            </div>

            {/* 🚀 Advanced Filters Area */}
            <div style={{ background: 'var(--card)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--txt-mut)', fontSize: '0.95rem', fontWeight: 'bold' }}>
                    <FaFilter /> فلاتر البحث المتقدم
                </div>
                
                {/* الصف الأول: البحث والتاريخ */}
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: '2 1 300px' }}>
                        <FaSearch style={{ position: 'absolute', right: '15px', top: '14px', color: 'var(--txt-mut)' }} />
                        <input type="text" placeholder="ابحث باسم الطالب، الكورس، المحاضرة، أو السيريال..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ width: '100%', padding: '12px 40px 12px 15px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: '1 1 300px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0 15px', flex: 1 }}>
                            <FaCalendarAlt color="var(--txt-mut)" size={14} />
                            <span style={{ color: 'var(--txt-mut)', fontSize: '0.85rem', margin: '0 10px', whiteSpace: 'nowrap' }}>من:</span>
                            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ width: '100%', padding: '12px 0', background: 'transparent', border: 'none', color: 'white', outline: 'none', colorScheme: 'dark', fontFamily: 'inherit' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0 15px', flex: 1 }}>
                            <FaCalendarAlt color="var(--txt-mut)" size={14} />
                            <span style={{ color: 'var(--txt-mut)', fontSize: '0.85rem', margin: '0 10px', whiteSpace: 'nowrap' }}>إلى:</span>
                            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ width: '100%', padding: '12px 0', background: 'transparent', border: 'none', color: 'white', outline: 'none', colorScheme: 'dark', fontFamily: 'inherit' }} />
                        </div>
                    </div>
                </div>

                {/* الصف الثاني: التصنيفات */}
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    <select value={stageFilter} onChange={e => setStageFilter(e.target.value)} style={{ flex: '1 1 200px', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }}>
                        <option value="all" style={{ background: '#1e1e2d' }}>كل المراحل الدراسية</option>
                        <option value="sec1" style={{ background: '#1e1e2d' }}>الصف الأول الثانوي</option>
                        <option value="sec2" style={{ background: '#1e1e2d' }}>الصف الثاني الثانوي</option>
                        <option value="sec3" style={{ background: '#1e1e2d' }}>الصف الثالث الثانوي</option>
                    </select>

                    <select value={contentTypeFilter} onChange={e => setContentTypeFilter(e.target.value)} style={{ flex: '1 1 200px', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }}>
                        <option value="all" style={{ background: '#1e1e2d' }}>كل المحتوى (كورسات ومحاضرات)</option>
                        <option value="course" style={{ background: '#1e1e2d' }}>الكورسات الكاملة فقط</option>
                        <option value="lecture" style={{ background: '#1e1e2d' }}>المحاضرات المنفصلة فقط</option>
                    </select>

                    <select value={paymentFilter} onChange={e => setPaymentFilter(e.target.value)} style={{ flex: '1 1 200px', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }}>
                        <option value="all" style={{ background: '#1e1e2d' }}>كل طرق الدفع</option>
                        <option value="custom_code" style={{ background: '#1e1e2d' }}>أكواد السناتر فقط</option>
                        <option value="wallet" style={{ background: '#1e1e2d' }}>محافظ الطلاب فقط</option>
                    </select>
                </div>
            </div>

            {/* Tabs Content */}
            {activeTab === 'transactions' && (
                <TransactionsTable transactions={paginatedTransactions} currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            )}

            {activeTab === 'analytics' && (
                <RevenueAnalytics transactions={filteredTransactions} />
            )}

        </div>
    );
}