// FILE: app/admin/store/components/OrdersFilters.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { FaSearch, FaFileExcel } from 'react-icons/fa';
import { Button } from '../../../../components/ui/Button';
import { useDebounce } from '../../../../hooks/useDebounce';

interface OrdersFiltersProps {
    onFilterChange: (filters: { search: string; status: string; dateFrom: string; dateTo: string }) => void;
    onExport: () => void;
}

export default function OrdersFilters({ onFilterChange, onExport }: OrdersFiltersProps) {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('all');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    // 💡 هوك الـ Debounce: مش هيبعت الداتا للسيرفر أو يفلتر غير لما المستخدم يبطل كتابة بـ 300 مللي ثانية
    const debouncedSearch = useDebounce(search, 300);

    useEffect(() => {
        onFilterChange({ search: debouncedSearch, status, dateFrom, dateTo });
    }, [debouncedSearch, status, dateFrom, dateTo]);

    return (
        <div style={{ background: 'var(--card)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', alignItems: 'center' }}>
            
            <div style={{ position: 'relative' }}>
                <input type="text" placeholder="بحث برقم الطلب، الاسم، الهاتف..." value={search} onChange={e => setSearch(e.target.value)} style={styles.input} />
                <FaSearch style={{ position: 'absolute', right: '15px', top: '15px', color: 'var(--p-purple)' }} />
            </div>

            <select value={status} onChange={e => setStatus(e.target.value)} style={{ ...styles.input, cursor: 'pointer', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(108,92,231,0.5)' }}>
                <option value="all" style={{ background: '#1e1e2d' }}>حالة الطلب: الكل</option>
                <option value="pending" style={{ background: '#1e1e2d' }}>قيد المراجعة</option>
                <option value="processing" style={{ background: '#1e1e2d' }}>جاري التجهيز</option>
                <option value="shipped" style={{ background: '#1e1e2d' }}>في الشحن</option>
                <option value="delivered" style={{ background: '#1e1e2d' }}>تم التوصيل</option>
                <option value="cancelled" style={{ background: '#1e1e2d' }}>ملغي</option>
            </select>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '10px 15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <input type="date" title="من تاريخ" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={styles.dateInput} />
                <span style={{ color: 'var(--txt-mut)', fontSize: '0.9rem', fontWeight: 'bold' }}>إلى</span>
                <input type="date" title="إلى تاريخ" value={dateTo} onChange={e => setDateTo(e.target.value)} style={styles.dateInput} />
            </div>

            <Button variant="outline" style={{ background: '#217346', color: 'white', border: 'none', height: '100%' }} icon={<FaFileExcel/>} onClick={onExport}>
                إكسيل للشحن
            </Button>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    input: { background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 40px 12px 15px', borderRadius: '10px', color: 'white', width: '100%', outline: 'none', fontFamily: 'inherit' },
    dateInput: { border: 'none', background: 'transparent', color: 'white', outline: 'none', fontFamily: 'inherit', cursor: 'pointer', colorScheme: 'dark', direction: 'ltr' }
};