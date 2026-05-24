"use client";
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { FaQrcode, FaPlus, FaSearch, FaTrashAlt } from 'react-icons/fa';
import { CodesTable } from './components/CodesTable';
import { CodeGeneratorModal } from './components/CodeGeneratorModal';
import { BulkDeleteModal } from './components/BulkDeleteModal';
import { codeService } from '../../../services/codeService';
import { useToast } from '../../../context/ToastContext';

// 🚀 توليد 16 رقم فقط (بدون حروف أو شرط)
const generateRandomCode = () => {
    let code = '';
    for (let i = 0; i < 16; i++) {
        code += Math.floor(Math.random() * 10).toString();
    }
    return code;
};

export default function CodesPage() {
    const { showToast } = useToast();
    const [isMounted, setIsMounted] = useState(false);
    const [codes, setCodes] = useState<any[]>([]);
    
    const [isGenModalOpen, setIsGenModalOpen] = useState(false);
    const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); 
    const [typeFilter, setTypeFilter] = useState('all'); 

    // 💡 جلب الأكواد من السيرفر
    const fetchCodes = useCallback(async () => {
        try {
            const data = await codeService.getAllCodes();
            setCodes(data || []);
        } catch (error) {
            console.error("Failed to load codes:", error);
            showToast('فشل في تحميل الأكواد', 'error');
        }
    }, [showToast]);

    useEffect(() => {
        setIsMounted(true);
        fetchCodes();
    }, [fetchCodes]);

    // 💡 توليد وحفظ الأكواد في قاعدة البيانات
    const handleGenerateCodes = async (type: 'wallet' | 'course', value: string, count: number) => {
        const timestamp = new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true });
        const newCodes = [];
        
        // 🚀 التعديل هنا: السيريال بيبدأ من 1 ويزيد بالترتيب
        const maxSerial = codes.length > 0 ? Math.max(...codes.map(c => parseInt(c.serial) || 0)) : 0;
        const baseSerial = maxSerial + 1;

        for (let i = 0; i < count; i++) {
            newCodes.push({
                serial: (baseSerial + i).toString(),
                code: generateRandomCode(),
                type: type,
                value: value.toString(),
                batchId: timestamp
            });
        }
        
        try {
            // 🚀 الإجبار على انتظار الحفظ في السيرفر قبل استكمال الطباعة
            await codeService.saveCodes(newCodes);
            await fetchCodes(); 
            return newCodes; 
        } catch (err) {
            showToast('حدث خطأ أثناء حفظ الأكواد في السيرفر', 'error');
            console.error(err);
            throw err; 
        }
    };

    const handleDeleteSingle = async (id: string) => {
        if(confirm('هل أنت متأكد من مسح هذا الكود نهائياً؟')) {
            try {
                await codeService.deleteCode(id);
                setCodes(codes.filter(c => c.id !== id));
                showToast('تم مسح الكود بنجاح', 'success');
            } catch (error) {
                showToast('فشل في مسح الكود', 'error');
            }
        }
    };

    const handleBulkDelete = async (batchId: string) => {
        try {
            await codeService.bulkDelete(batchId);
            setCodes(codes.filter(c => !(c.batchId === batchId && !c.isUsed)));
            showToast('تم مسح الدفعة بنجاح!', 'success');
        } catch (error) {
            showToast('فشل في مسح الدفعة، قد تكون مستخدمة بالكامل', 'error');
        }
    };

    const availableTimestamps = useMemo(() => {
        const stamps = new Set(codes.map(c => c.batchId || c.createdAt).filter(Boolean));
        return Array.from(stamps).sort().reverse();
    }, [codes]);

    const filteredCodes = useMemo(() => {
        return codes.filter(c => {
            const matchSearch = (c.serial && c.serial.includes(searchQuery)) || 
                                (c.code && c.code.includes(searchQuery.toUpperCase())) || 
                                (c.usedBy && c.usedBy.includes(searchQuery));
            const matchStatus = statusFilter === 'all' || (statusFilter === 'used' ? c.isUsed : !c.isUsed);
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