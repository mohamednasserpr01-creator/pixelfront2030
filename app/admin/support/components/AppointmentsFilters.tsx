// FILE: app/admin/support/components/AppointmentsFilters.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useDebounce } from '../../../../hooks/useDebounce';

interface AppointmentsFiltersProps {
    onFilterChange: (filters: { search: string; status: string }) => void;
}

export default function AppointmentsFilters({ onFilterChange }: AppointmentsFiltersProps) {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('all');

    // 💡 استخدام Debounce لمنع الريندر مع كل حرف
    const debouncedSearch = useDebounce(search, 300);

    useEffect(() => {
        onFilterChange({ search: debouncedSearch.toLowerCase(), status }); // 💡 Case Insensitive
    }, [debouncedSearch, status]);

    return (
        <div style={{ background: 'var(--card)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div style={{ position: 'relative' }}>
                <input 
                    type="text" 
                    placeholder="بحث بالاسم، رقم الهاتف..." 
                    value={search} 
                    onChange={e => setSearch(e.target.value)} 
                    style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 40px 12px 15px', borderRadius: '10px', color: 'white', width: '100%', outline: 'none' }} 
                />
                <FaSearch style={{ position: 'absolute', right: '15px', top: '15px', color: '#0984e3' }} />
            </div>
            <select 
                value={status} 
                onChange={e => setStatus(e.target.value)} 
                style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 15px', borderRadius: '10px', color: 'white', width: '100%', outline: 'none', cursor: 'pointer' }}
            >
                <option value="all" style={{ background: '#1e1e2d' }}>حالة الجلسة: الكل</option>
                <option value="pending" style={{ background: '#1e1e2d' }}>قيد الانتظار (قادمة)</option>
                <option value="completed" style={{ background: '#1e1e2d' }}>تمت بنجاح</option>
                <option value="cancelled" style={{ background: '#1e1e2d' }}>ملغية</option>
            </select>
        </div>
    );
}