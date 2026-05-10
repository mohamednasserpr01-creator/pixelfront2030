"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
    FaDatabase, FaSearch, FaFileExcel, 
    FaCheckCircle, FaTimesCircle, FaPlus, 
    FaTrash, FaArrowRight, FaKey, FaUserAlt, FaBookOpen
} from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { useToast } from '../../../../context/ToastContext';
import { Button } from '../../../../components/ui/Button';
import { Modal } from '../../../../components/ui/Modal';

// 💡 MOCK DATA: البنوك المتاحة
const KNOWLEDGE_BANKS = [
    { id: 'b1', title: 'بنك أسئلة الفيزياء الشامل 2026' },
    { id: 'b2', title: 'بنك الكيمياء العضوية والتحليلية' },
];

// 💡 MOCK DATA لتوليد سيريالات وهمية للتيست
const generateMockSerials = () => {
    return Array.from({ length: 45 }, (_, i) => {
        const isUsed = Math.random() > 0.5;
        const assignedBank = KNOWLEDGE_BANKS[i % 2].title; // السيريال مخصص لبنك معين من وقت ما اتولد
        return {
            id: `serial-${i}`,
            serial: `KB-${Math.floor(100000 + Math.random() * 900000)}`,
            targetBank: assignedBank, // البنك اللي السيريال ده بيفتحه
            status: isUsed ? 'used' : 'unused',
            createdAt: '2026-04-10',
            usedBy: isUsed ? `طالب تجريبي ${i + 1}` : null,
            usedAt: isUsed ? '2026-04-12 02:30 PM' : null,
        };
    });
};

export default function KnowledgeBankSerialsPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [mounted, setMounted] = useState(false);
    
    const [serials, setSerials] = useState<any[]>([]);

    // الفلاتر
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    // Modal التوليد
    const [isGenModalOpen, setIsGenModalOpen] = useState(false);
    const [genForm, setGenForm] = useState({
        bankId: KNOWLEDGE_BANKS[0].id,
        count: '50'
    });
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        setSerials(generateMockSerials());
        setMounted(true);
    }, []);

    // 🚀 الفلترة الذكية (بحث بالسيريال، اسم الطالب، أو اسم البنك)
    const filteredSerials = useMemo(() => {
        return serials.filter(s => {
            const searchLower = searchQuery.toLowerCase();
            const matchSearch = 
                s.serial.toLowerCase().includes(searchLower) || 
                (s.usedBy && s.usedBy.toLowerCase().includes(searchLower)) ||
                (s.targetBank && s.targetBank.toLowerCase().includes(searchLower));
                
            const matchStatus = statusFilter === 'all' || s.status === statusFilter;
            return matchSearch && matchStatus;
        });
    }, [serials, searchQuery, statusFilter]);

    const totalPages = Math.ceil(filteredSerials.length / itemsPerPage);
    const currentData = filteredSerials.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => { setCurrentPage(1); }, [searchQuery, statusFilter]);

    const handleDelete = (id: string) => {
        if(confirm('هل أنت متأكد من مسح هذا السيريال نهائياً؟')) {
            setSerials(serials.filter(s => s.id !== id));
            showToast('تم الحذف بنجاح', 'success');
        }
    };

    const handleExportExcel = () => {
        if (filteredSerials.length === 0) return showToast('لا توجد بيانات لتصديرها', 'error');
        showToast('جاري استخراج الشيت...', 'info');
        
        const excelData = filteredSerials.map((s, i) => ({
            'م': i + 1, 
            'السيريال': s.serial, 
            'البنك المستهدف': s.targetBank,
            'الحالة': s.status === 'used' ? 'مُستخدم' : 'جديد',
            'تاريخ التوليد': s.createdAt, 
            'اسم الطالب': s.usedBy || '-', 
            'تاريخ التفعيل': s.usedAt || '-'
        }));
        
        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        ws['!views'] = [{ rightToLeft: true }];
        ws['!cols'] = [{ wch: 5 }, { wch: 15 }, { wch: 35 }, { wch: 15 }, { wch: 15 }, { wch: 25 }, { wch: 20 }];
        
        XLSX.utils.book_append_sheet(wb, ws, "سيريالات بنك المعرفة");
        XLSX.writeFile(wb, `KB_Serials_Report.xlsx`);
    };

    // 🚀 توليد السيريالات وربطها بالبنك (بدون أسعار)
    const handleGenerateSerials = () => {
        const numCount = parseInt(genForm.count);
        if (!numCount || numCount <= 0) return showToast("أدخل عدد صحيح!", 'error');

        setIsGenerating(true);
        const selectedBankTitle = KNOWLEDGE_BANKS.find(b => b.id === genForm.bankId)?.title;

        setTimeout(() => {
            const newRawSerials = Array.from({ length: numCount }, (_, i) => ({
                id: `newserial-${Date.now()}-${i}`,
                serial: `KB-${Math.floor(100000 + Math.random() * 900000)}`,
                targetBank: selectedBankTitle, // ربط السيريال بالبنك هنا
                status: 'unused',
                createdAt: new Date().toLocaleDateString(),
                usedBy: null,
                usedAt: null
            }));

            setSerials(prev => [...newRawSerials, ...prev]);
            
            setIsGenerating(false);
            setIsGenModalOpen(false);
            setGenForm(prev => ({...prev, count: '50'}));
            showToast(`تم توليد ${numCount} سيريال بنجاح! 🎉`, 'success');
        }, 800);
    };

    if (!mounted) return null;

    return (
        <div style={{ animation: 'fadeIn 0.4s ease', maxWidth: '1400px', margin: '0 auto', padding: '20px', paddingBottom: '50px' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button onClick={() => router.push('/admin/knowledge-bank-codes')} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--txt)', width: '45px', height: '45px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FaArrowRight />
                    </button>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', margin: '0 0 5px 0', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FaKey color="#3498db" /> سجل سيريالات بنك المعرفة
                        </h1>
                        <p style={{ color: 'var(--txt-mut)', margin: 0 }}>توليد مفاتيح الدخول وتتبع الطلاب والبنوك المُفعلة.</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Button variant="outline" style={{ background: 'rgba(33, 115, 70, 0.1)', color: '#2ecc71', border: '1px solid #27ae60' }} onClick={handleExportExcel} icon={<FaFileExcel/>}>تصدير للإكسيل</Button>
                    <Button variant="primary" icon={<FaPlus/>} onClick={() => setIsGenModalOpen(true)} style={{ background: '#3498db', border: 'none' }}>توليد سيريالات جديدة</Button>
                </div>
            </div>

            {/* Filters */}
            <div style={{ background: 'var(--card)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '20px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: '2 1 300px' }}>
                    <FaSearch style={{ position: 'absolute', right: '15px', top: '14px', color: 'var(--txt-mut)' }} />
                    <input type="text" placeholder="ابحث بالسيريال، اسم الطالب، أو اسم البنك..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ width: '100%', padding: '12px 40px 12px 15px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }} />
                </div>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ flex: '1 1 200px', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }}>
                    <option value="all">كل الحالات</option>
                    <option value="unused">جديد (لم يُستخدم)</option>
                    <option value="used">مُفعل</option>
                </select>
            </div>

            {/* Table */}
            <div style={{ background: 'var(--card)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', overflowX: 'auto' }}>
                <table style={{ width: '100%', minWidth: '1000px', borderCollapse: 'collapse', textAlign: 'right', color: 'white' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <th style={{ padding: '15px' }}>السيريال</th>
                            <th style={{ padding: '15px' }}>البنك المستهدف</th>
                            <th style={{ padding: '15px' }}>حالة الاستخدام</th>
                            <th style={{ padding: '15px' }}>تفاصيل التفعيل (الطالب والتاريخ)</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>إجراء</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map(s => (
                            <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ fontWeight: 'bold', color: 'white', fontFamily: 'monospace', fontSize: '1.1rem', letterSpacing: '1px' }}>{s.serial}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--txt-mut)', marginTop: '5px' }}>صدر: {s.createdAt}</div>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ color: '#3498db', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}><FaBookOpen size={14}/> {s.targetBank}</div>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    {s.status === 'used' ? (
                                        <span style={{ background: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}><FaCheckCircle/> مُستخدم</span>
                                    ) : (
                                        <span style={{ background: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}><FaTimesCircle/> متاح</span>
                                    )}
                                </td>
                                <td style={{ padding: '15px' }}>
                                    {s.status === 'used' ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                            <div style={{ color: 'white', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}><FaUserAlt size={12} color="var(--txt-mut)"/> {s.usedBy}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--txt-mut)' }}>{s.usedAt}</div>
                                        </div>
                                    ) : (
                                        <span style={{ color: 'var(--txt-mut)', fontSize: '0.85rem' }}>-</span>
                                    )}
                                </td>
                                <td style={{ padding: '15px', textAlign: 'center' }}>
                                    <button onClick={() => handleDelete(s.id)} style={{ background: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}><FaTrash /></button>
                                </td>
                            </tr>
                        ))}
                        {currentData.length === 0 && (
                            <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'var(--txt-mut)' }}>لا توجد سيريالات مطابقة لعملية البحث.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px' }}>
                    <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>السابق</Button>
                    <span style={{ color: 'white', fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}>صفحة {currentPage} من {totalPages}</span>
                    <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>التالي</Button>
                </div>
            )}

            {/* Modal التوليد المخصص للسيريالات */}
            <Modal isOpen={isGenModalOpen} onClose={() => setIsGenModalOpen(false)} title="توليد سيريالات بنك المعرفة" maxWidth="400px">
                <div style={{ padding: '10px 0', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ color: 'var(--txt-mut)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                        السيريالات المُولدة ستكون بمثابة مفتاح وصول للطالب، لفتح البنك المحدد أدناه.
                    </div>
                    
                    {/* 🚀 اختيار البنك المستهدف (بدون أسعار) */}
                    <div>
                        <label style={{ display: 'block', color: 'white', fontSize: '0.95rem', marginBottom: '8px', fontWeight: 'bold' }}>البنك المستهدف</label>
                        <select 
                            value={genForm.bankId} 
                            onChange={e => setGenForm({...genForm, bankId: e.target.value})} 
                            style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none', fontSize: '1rem' }}
                        >
                            {KNOWLEDGE_BANKS.map(b => (
                                <option key={b.id} value={b.id}>{b.title}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', color: 'white', fontSize: '0.95rem', marginBottom: '8px', fontWeight: 'bold' }}>العدد المطلوب</label>
                        <input 
                            type="number" 
                            value={genForm.count} 
                            onChange={e => setGenForm({...genForm, count: e.target.value})} 
                            style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none', fontSize: '1.1rem' }} 
                        />
                    </div>
                </div>

                <Button variant="primary" fullWidth onClick={handleGenerateSerials} disabled={isGenerating} style={{ marginTop: '20px', background: '#3498db', border: 'none' }}>
                    {isGenerating ? 'جاري التوليد...' : 'توليد السيريالات الآن'}
                </Button>
            </Modal>
        </div>
    );
}