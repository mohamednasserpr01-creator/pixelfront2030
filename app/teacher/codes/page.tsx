"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { FaQrcode, FaPlus, FaSearch, FaTrashAlt } from 'react-icons/fa';
import { CodesTable } from './components/CodesTable';
import { CodeGeneratorModal } from './components/CodeGeneratorModal';
import { BulkDeleteModal } from './components/BulkDeleteModal';

// 🚀 التعديل الأهم: توليد 16 رقم فقط (بدون حروف أو شرط)
const generateRandomCode = () => {
    let code = '';
    for (let i = 0; i < 16; i++) {
        code += Math.floor(Math.random() * 10).toString();
    }
    return code;
};

export default function CodesPage() {
    const [isMounted, setIsMounted] = useState(false);
    const [codes, setCodes] = useState<any[]>([]);
    
    const [isGenModalOpen, setIsGenModalOpen] = useState(false);
    const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); 
    const [typeFilter, setTypeFilter] = useState('all'); 

    useEffect(() => {
        setIsMounted(true);
        setCodes([
            { id: '1', serial: '84001', code: generateRandomCode(), type: 'wallet', value: '100', status: 'used', createdAt: '2023-10-25 10:00 AM', usedAt: '2023-10-26 12:30 PM', usedBy: 'أحمد محمود', teacherName: 'أ. محمد ناصر' },
            { id: '2', serial: '84002', code: generateRandomCode(), type: 'course', value: 'كورس الباب الأول', status: 'unused', createdAt: '2023-10-25 10:00 AM', usedAt: null, usedBy: null, teacherName: 'أ. محمد ناصر' },
        ]);
    }, []);

    const handleGenerateCodes = (type: 'wallet' | 'course', value: string, count: number) => {
        const timestamp = new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true });
        const newCodes = [];
        
        // 🚀 السيريال أرقام فقط بيكمل على آخر كود (مثال يبدأ من 84000)
        const baseSerial = 84000 + codes.length + 1;

        for (let i = 0; i < count; i++) {
            newCodes.push({
                id: Date.now().toString() + i,
                serial: (baseSerial + i).toString(), // أرقام فقط
                code: generateRandomCode(), // 16 رقم فقط
                type,
                value,
                status: 'unused',
                createdAt: timestamp,
                usedAt: null,
                usedBy: null,
                teacherName: 'أ. محمد ناصر'
            });
        }
        setCodes([...newCodes, ...codes]);
        return newCodes; 
    };

    const handleDeleteSingle = (id: string) => {
        if(confirm('هل أنت متأكد من مسح هذا الكود؟')) {
            setCodes(codes.filter(c => c.id !== id));
        }
    };

    const handleBulkDelete = (timestamp: string) => {
        setCodes(codes.filter(c => !(c.createdAt === timestamp && c.status === 'unused')));
        alert('تم مسح الدفعة بنجاح!');
    };

    const availableTimestamps = useMemo(() => {
        const stamps = new Set(codes.map(c => c.createdAt));
        return Array.from(stamps).sort().reverse();
    }, [codes]);

    const filteredCodes = useMemo(() => {
        return codes.filter(c => {
            const matchSearch = c.serial.includes(searchQuery) || c.code.includes(searchQuery.toUpperCase()) || (c.usedBy && c.usedBy.includes(searchQuery));
            const matchStatus = statusFilter === 'all' || c.status === statusFilter;
            const matchType = typeFilter === 'all' || c.type === typeFilter;
            return matchSearch && matchStatus && matchType;
        });
    }, [codes, searchQuery, statusFilter, typeFilter]);

    if (!isMounted) return null;

    return (
        <div style={{ animation: 'fadeIn 0.4s ease', maxWidth: '1400px', margin: '0 auto', paddingBottom: '50px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', marginTop: '20px', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', margin: '0 0 5px 0', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaQrcode color="#9b59b6" /> مصنع أكواد الشحن
                    </h1>
                    <p style={{ color: 'var(--txt-mut)', margin: 0 }}>توليد، تتبع، وإدارة الأكواد السرية الخاصة بحسابك.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => setIsBulkDeleteModalOpen(true)} style={{ background: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c', border: '1px solid rgba(231, 76, 60, 0.3)', padding: '12px 20px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', transition: '0.2s' }}>
                        <FaTrashAlt /> حذف دفعة مسروقة
                    </button>
                    <button onClick={() => setIsGenModalOpen(true)} style={{ background: '#9b59b6', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', transition: '0.2s', boxShadow: '0 5px 15px rgba(155, 89, 182, 0.3)' }}>
                        <FaPlus /> توليد أكواد جديدة
                    </button>
                </div>
            </div>

            <div style={{ background: 'var(--card)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '20px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: '1 1 250px' }}>
                    <FaSearch style={{ position: 'absolute', right: '15px', top: '14px', color: 'var(--txt-mut)' }} />
                    <input type="text" placeholder="ابحث بالسيريال، الكود، أو اسم الطالب..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ width: '100%', padding: '12px 40px 12px 15px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }} />
                </div>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ flex: '1 1 150px', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }}>
                    <option value="all" style={{ background: '#1e1e2d' }}>جميع الحالات</option>
                    <option value="unused" style={{ background: '#1e1e2d' }}>أكواد غير مشحونة</option>
                    <option value="used" style={{ background: '#1e1e2d' }}>أكواد مشحونة</option>
                </select>
                <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{ flex: '1 1 150px', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }}>
                    <option value="all" style={{ background: '#1e1e2d' }}>جميع الأنواع</option>
                    <option value="wallet" style={{ background: '#1e1e2d' }}>أكواد رصيد محفظة</option>
                    <option value="course" style={{ background: '#1e1e2d' }}>أكواد كورسات</option>
                </select>
            </div>

            <CodesTable codes={filteredCodes} onDelete={handleDeleteSingle} />

            <CodeGeneratorModal isOpen={isGenModalOpen} onClose={() => setIsGenModalOpen(false)} onGenerate={handleGenerateCodes} />
            <BulkDeleteModal isOpen={isBulkDeleteModalOpen} onClose={() => setIsBulkDeleteModalOpen(false)} availableTimestamps={availableTimestamps} onBulkDelete={handleBulkDelete} />

        </div>
    );
}