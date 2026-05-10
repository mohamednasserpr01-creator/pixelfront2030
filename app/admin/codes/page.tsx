// FILE: app/admin/codes/page.tsx
"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
    FaBarcode, FaSearch, FaFilter, FaFileExcel, 
    FaCheckCircle, FaTimesCircle, FaUserCircle, 
    FaCalendarAlt, FaHashtag, FaKey
} from 'react-icons/fa';
import * as XLSX from 'xlsx';

import { useSettings } from '../../../context/SettingsContext';
import { useToast } from '../../../context/ToastContext';
import { Button } from '../../../components/ui/Button';

// ==========================================
// 💡 MOCK DATA: توليد 100 كود كعينة
// ==========================================
const generateMockCodes = () => {
    return Array.from({ length: 125 }, (_, i) => {
        const isUsed = Math.random() > 0.4; 
        const d = new Date();
        d.setDate(d.getDate() - Math.floor(Math.random() * 30));
        const addedDate = d.toISOString().split('T')[0];
        
        return {
            id: i + 1,
            serial: `840${200 + i}`,
            code: Array.from({length: 4}, () => Math.floor(1000 + Math.random() * 9000)).join(' '),
            price: i % 3 === 0 ? 150 : 50,
            teacher: i % 2 === 0 ? 'سنيورا بهيرة' : 'أ. محمد ناصر',
            addedDate: addedDate,
            addedBy: 'Admin_Ahmed',
            adderPhone: '01033259951',
            isUsed: isUsed,
            studentName: isUsed ? `طالب تجريبي ${i + 1}` : '-',
            studentPhone: isUsed ? `011${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}` : '-',
            usedDate: isUsed ? new Date().toISOString().split('T')[0] : '-'
        };
    });
};

export default function MasterCodesPage() {
    const router = useRouter();
    const { lang } = useSettings();
    const { showToast } = useToast();
    const isAr = lang === 'ar';

    const [mounted, setMounted] = useState(false);
    const [codes, setCodes] = useState<any[]>([]);

    // 💡 فلاتر البحث
    const [searchSerial, setSearchSerial] = useState('');
    const [searchCode, setSearchCode] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'used' | 'unused'>('all');

    // 💡 Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    useEffect(() => {
        setCodes(generateMockCodes());
        setMounted(true);
    }, []);

    // 💡 محرك الفلترة الذكي
    const filteredCodes = useMemo(() => {
        return codes.filter(c => {
            const matchSerial = searchSerial === '' || c.serial.includes(searchSerial);
            const matchCode = searchCode === '' || c.code.replace(/\s/g, '').includes(searchCode.replace(/\s/g, ''));
            const matchDateFrom = dateFrom === '' || c.addedDate >= dateFrom;
            const matchDateTo = dateTo === '' || c.addedDate <= dateTo;
            const matchStatus = statusFilter === 'all' || (statusFilter === 'used' && c.isUsed) || (statusFilter === 'unused' && !c.isUsed);
            
            return matchSerial && matchCode && matchDateFrom && matchDateTo && matchStatus;
        });
    }, [codes, searchSerial, searchCode, dateFrom, dateTo, statusFilter]);

    // حسابات الصفحات
    const totalPages = Math.ceil(filteredCodes.length / itemsPerPage);
    const currentData = filteredCodes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // تصفير الصفحة لما الفلتر يتغير
    useEffect(() => { setCurrentPage(1); }, [searchSerial, searchCode, dateFrom, dateTo, statusFilter]);

    // 💡 تصدير للإكسيل
    const handleExportExcel = () => {
        if (filteredCodes.length === 0) {
            showToast('لا توجد بيانات لتصديرها', 'error');
            return;
        }
        showToast('جاري استخراج ملف الإكسيل...', 'info');
        const excelData = filteredCodes.map((c, i) => ({
            'م': i + 1,
            'الرقم التسلسلي': c.serial,
            'كود الشحن': c.code,
            'السعر': c.price,
            'المدرس': c.teacher,
            'تاريخ الإضافة': c.addedDate,
            'أُضيف بواسطة': c.addedBy,
            'تليفون المضيف': c.adderPhone,
            'مستخدم؟': c.isUsed ? 'نعم' : 'لا',
            'اسم الطالب': c.studentName,
            'تليفون الطالب': c.studentPhone,
            'تاريخ الاستخدام': c.usedDate
        }));

        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Codes_Ledger");
        XLSX.writeFile(wb, `Pixel_Codes_${new Date().toISOString().split('T')[0]}.xlsx`);
        showToast('تم تحميل الملف بنجاح! 📊', 'success');
    };

    if (!mounted) return null;

    return (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <style>{`
                .student-link { color: var(--p-purple); font-weight: bold; cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 5px; }
                .student-link:hover { color: #ff007f; text-decoration: underline; }
                .filter-input { background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); padding: 12px 15px; border-radius: 10px; color: white; width: 100%; outline: none; transition: 0.3s; font-family: inherit; }
                .filter-input:focus { border-color: var(--p-purple); background: rgba(108,92,231,0.05); }
                .stat-box { background: var(--card); border: 1px solid rgba(255,255,255,0.05); padding: 20px; border-radius: 15px; flex: 1; min-width: 200px; display: flex; align-items: center; gap: 15px; }
            `}</style>

            {/* ======== Header & Stats ======== */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', color: 'var(--txt)', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaBarcode style={{ color: 'var(--p-purple)' }} /> السجل الشامل للأكواد
                    </h1>
                    <p style={{ color: 'var(--txt-mut)' }}>تتبع حالة جميع الأكواد المصدرة على المنصة وبحث دقيق.</p>
                </div>
                <Button variant="outline" style={{ background: '#217346', color: 'white', border: 'none' }} icon={<FaFileExcel/>} onClick={handleExportExcel}>
                    تصدير البيانات (Excel)
                </Button>
            </div>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '30px' }}>
                <div className="stat-box">
                    <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(108,92,231,0.1)', color: 'var(--p-purple)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem' }}><FaHashtag /></div>
                    <div><div style={{ color: 'var(--txt-mut)', fontSize: '0.9rem', fontWeight: 'bold' }}>إجمالي الأكواد</div><div style={{ fontSize: '1.5rem', fontWeight: 900 }}>{filteredCodes.length.toLocaleString()}</div></div>
                </div>
                <div className="stat-box">
                    <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(231,76,60,0.1)', color: 'var(--danger)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem' }}><FaCheckCircle /></div>
                    <div><div style={{ color: 'var(--txt-mut)', fontSize: '0.9rem', fontWeight: 'bold' }}>أكواد مستخدمة</div><div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--danger)' }}>{filteredCodes.filter(c => c.isUsed).length.toLocaleString()}</div></div>
                </div>
                <div className="stat-box">
                    <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(46,204,113,0.1)', color: 'var(--success)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem' }}><FaKey /></div>
                    <div><div style={{ color: 'var(--txt-mut)', fontSize: '0.9rem', fontWeight: 'bold' }}>أكواد متاحة (جديدة)</div><div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--success)' }}>{filteredCodes.filter(c => !c.isUsed).length.toLocaleString()}</div></div>
                </div>
            </div>

            {/* ======== Advanced Filters ======== */}
            <div style={{ background: 'var(--card)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                    <input type="text" placeholder="السيريال (مثال: 84027)" value={searchSerial} onChange={e => setSearchSerial(e.target.value)} className="filter-input" style={{ paddingRight: '40px' }} />
                    <FaHashtag style={{ position: 'absolute', right: '15px', top: '15px', color: 'var(--txt-mut)' }} />
                </div>
                
                <div style={{ position: 'relative' }}>
                    <input type="text" placeholder="كود الشحن المكون من 16 رقم" value={searchCode} onChange={e => setSearchCode(e.target.value)} className="filter-input" style={{ paddingRight: '40px' }} />
                    <FaSearch style={{ position: 'absolute', right: '15px', top: '15px', color: 'var(--p-purple)' }} />
                </div>

                {/* 💡 قائمة الحالة المتظبطة */}
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="filter-input" style={{ cursor: 'pointer', color: 'white', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(108,92,231,0.5)' }}>
                    <option value="all" style={{ background: '#1e1e2d', color: 'white' }}>حالة الكود: الكل</option>
                    <option value="unused" style={{ background: '#1e1e2d', color: 'white' }}>متاح للبيع (جديد)</option>
                    <option value="used" style={{ background: '#1e1e2d', color: 'white' }}>تم الاستخدام</option>
                </select>

                {/* 💡 حقل التاريخ المتظبط (ltr عشان الأرقام تطلع صح) */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '10px 15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <input type="date" title="من تاريخ" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ border: 'none', background: 'transparent', color: 'white', outline: 'none', fontFamily: 'inherit', cursor: 'pointer', colorScheme: 'dark', direction: 'ltr' }} />
                    <span style={{ color: 'var(--txt-mut)', fontSize: '0.9rem', fontWeight: 'bold' }}>إلى</span>
                    <input type="date" title="إلى تاريخ" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ border: 'none', background: 'transparent', color: 'white', outline: 'none', fontFamily: 'inherit', cursor: 'pointer', colorScheme: 'dark', direction: 'ltr' }} />
                </div>
            </div>

            {/* ======== The Master Table ======== */}
            <div style={{ background: 'var(--card)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', textAlign: 'center', borderCollapse: 'collapse', minWidth: '1200px' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--txt-mut)', fontSize: '0.9rem' }}>
                                <th style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>#</th>
                                <th style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>السيريال</th>
                                <th style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>كود الشحن</th>
                                <th style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>السعر</th>
                                <th style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>الإصدار (المدرس)</th>
                                <th style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>تاريخ الإضافة</th>
                                <th style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>الحالة</th>
                                <th style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>بيانات المستخدم (الطالب)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.length > 0 ? currentData.map((c, i) => (
                                <tr key={c.id} style={{ borderBottom: '1px dashed rgba(255,255,255,0.05)', transition: '0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '15px', color: 'var(--txt-mut)' }}>{(currentPage - 1) * itemsPerPage + i + 1}</td>
                                    <td style={{ padding: '15px', fontWeight: '900', color: 'var(--txt)' }}>{c.serial}</td>
                                    <td style={{ padding: '15px', fontFamily: 'monospace', letterSpacing: '2px', color: 'var(--warning)', fontSize: '1.1rem', fontWeight: 'bold' }}>{c.code}</td>
                                    <td style={{ padding: '15px', color: 'var(--success)', fontWeight: 'bold' }}>{c.price} ج.م</td>
                                    <td style={{ padding: '15px', color: 'var(--txt-mut)', fontSize: '0.9rem' }}>{c.teacher}</td>
                                    <td style={{ padding: '15px', color: 'var(--txt-mut)', fontSize: '0.85rem' }}>
                                        <div>{c.addedDate}</div>
                                        <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>بواسطة: {c.addedBy}</div>
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        {c.isUsed ? 
                                            <span style={{ background: 'rgba(231,76,60,0.1)', color: 'var(--danger)', padding: '5px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '5px' }}><FaTimesCircle /> مستخدم</span> 
                                            : 
                                            <span style={{ background: 'rgba(46,204,113,0.1)', color: 'var(--success)', padding: '5px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '5px' }}><FaCheckCircle /> متاح</span>
                                        }
                                    </td>
                                    <td style={{ padding: '15px', textAlign: 'right' }}>
                                        {c.isUsed ? (
                                            <div>
                                                {/* 💡 الرابط اللي بيودي لملف الطالب */}
                                                <span className="student-link" onClick={() => { showToast(`جاري فتح ملف ${c.studentName}`, 'info'); router.push('/admin/students'); }}>
                                                    <FaUserCircle /> {c.studentName}
                                                </span>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--txt-mut)', marginTop: '5px' }}>📱 {c.studentPhone}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--warning)', marginTop: '3px' }}>⏰ اُستخدم في: {c.usedDate}</div>
                                            </div>
                                        ) : (
                                            <span style={{ color: 'var(--txt-mut)', fontSize: '0.9rem' }}>-</span>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={8} style={{ padding: '40px', color: 'var(--txt-mut)' }}>لا توجد أكواد مطابقة لعملية البحث.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* ======== Pagination ======== */}
                {totalPages > 1 && (
                    <div style={{ padding: '15px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', background: 'rgba(0,0,0,0.2)' }}>
                        <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>السابق</Button>
                        <span style={{ fontWeight: 'bold', color: 'var(--p-purple)' }}>صفحة {currentPage} من {totalPages}</span>
                        <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>التالي</Button>
                    </div>
                )}
            </div>
        </div>
    );
}