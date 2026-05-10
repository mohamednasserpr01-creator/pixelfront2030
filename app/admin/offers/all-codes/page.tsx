"use client";
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
    FaBarcode, FaSearch, FaFileExcel, 
    FaCheckCircle, FaTimesCircle, FaGift, 
    FaPlus, FaTrash, FaEye, FaEyeSlash, FaPrint, FaImage, FaArrowRight, FaTimes, FaPalette
} from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { useToast } from '../../../../context/ToastContext';
import { Button } from '../../../../components/ui/Button';
import { Modal } from '../../../../components/ui/Modal';

// 🚀 توليد 16 رقم عشوائي للأكواد (نفس كود المدرس بالظبط)
const generateRandomCode = () => {
    let code = '';
    for (let i = 0; i < 16; i++) { code += Math.floor(Math.random() * 10).toString(); }
    return code;
};

// 💡 MOCK DATA العروض المتاحة
const MOCK_OFFERS = [
    { id: '1', title: 'باقة أبطال الثانوية (علمي)', price: 600 },
    { id: '2', title: 'مراجعة ليلة الامتحان (فيزياء)', price: 250 },
];

const generateMockOfferCodes = () => {
    return Array.from({ length: 85 }, (_, i) => {
        const isUsed = Math.random() > 0.6;
        const offer = MOCK_OFFERS[i % 2];
        return {
            id: `oc-${i}`,
            serial: `950${200 + i}`,
            code: generateRandomCode(),
            offerId: offer.id,
            offerName: offer.title,
            price: offer.price,
            status: isUsed ? 'used' : 'unused',
            createdAt: '2026-04-10 10:00 AM',
            usedBy: isUsed ? `طالب تجريبي ${i}` : null,
            usedAt: isUsed ? '2026-04-12 02:30 PM' : null,
        };
    });
};

export default function MasterOfferCodesPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [mounted, setMounted] = useState(false);
    
    const [codes, setCodes] = useState<any[]>([]);
    const [revealedCodes, setRevealedCodes] = useState<Record<string, boolean>>({});

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [offerFilter, setOfferFilter] = useState('all');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const [isGenModalOpen, setIsGenModalOpen] = useState(false);
    const [genForm, setGenForm] = useState({ offerId: MOCK_OFFERS[0].id, count: '50', color: '#000000', bgImage: null as string | null });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        setCodes(generateMockOfferCodes());
        setMounted(true);
    }, []);

    const filteredCodes = useMemo(() => {
        return codes.filter(c => {
            const matchSearch = c.serial.includes(searchQuery) || c.code.includes(searchQuery) || (c.usedBy && c.usedBy.includes(searchQuery));
            const matchStatus = statusFilter === 'all' || c.status === statusFilter;
            const matchOffer = offerFilter === 'all' || c.offerId === offerFilter;
            return matchSearch && matchStatus && matchOffer;
        });
    }, [codes, searchQuery, statusFilter, offerFilter]);

    const totalPages = Math.ceil(filteredCodes.length / itemsPerPage);
    const currentData = filteredCodes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => { setCurrentPage(1); }, [searchQuery, statusFilter, offerFilter]);

    const toggleReveal = (id: string) => setRevealedCodes(prev => ({ ...prev, [id]: !prev[id] }));

    const handleDelete = (id: string) => {
        if(confirm('هل أنت متأكد من مسح كود العرض هذا نهائياً؟')) {
            setCodes(codes.filter(c => c.id !== id));
            showToast('تم الحذف بنجاح', 'success');
        }
    };

    const handleExportExcel = () => {
        if (filteredCodes.length === 0) return showToast('لا توجد بيانات لتصديرها', 'error');
        showToast('جاري استخراج الشيت...', 'info');
        const excelData = filteredCodes.map((c, i) => ({
            'م': i + 1, 'السيريال': c.serial, 'الكود السري': c.code, 'اسم العرض': c.offerName, 'السعر': c.price,
            'تاريخ الإصدار': c.createdAt, 'الحالة': c.status === 'used' ? 'مستخدم' : 'جديد',
            'اسم الطالب': c.usedBy || '-', 'تاريخ الشحن': c.usedAt || '-'
        }));
        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        ws['!views'] = [{ rightToLeft: true }];
        XLSX.utils.book_append_sheet(wb, ws, "أكواد العروض");
        XLSX.writeFile(wb, `Offer_Codes_Report.xlsx`);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => setGenForm({...genForm, bgImage: event.target?.result as string});
            reader.readAsDataURL(e.target.files[0]);
        }
        e.target.value = '';
    };

    // 🚀 تم نقل محرك طباعة المدرس بالمللي لمنع التداخل والتهنيج
    const handleGenerateAndPrint = () => {
        const numCount = parseInt(genForm.count);
        if (!numCount || numCount <= 0) return showToast("أدخل عدد صحيح!", 'error');
        if (!genForm.bgImage) return showToast("يرجى رفع صورة تصميم الكارت!", 'error');

        setIsGenerating(true);
        const selectedOffer = MOCK_OFFERS.find(o => o.id === genForm.offerId);

        setTimeout(() => {
            const newRawCodes = Array.from({ length: numCount }, (_, i) => ({
                id: `new-${Date.now()}-${i}`,
                serial: (950000 + codes.length + i).toString(),
                code: generateRandomCode(), // 16 رقم لازقين في بعض عشان الـ CSS
                offerId: genForm.offerId,
                offerName: selectedOffer?.title,
                price: selectedOffer?.price || 0,
                status: 'unused',
                createdAt: new Date().toLocaleString('en-US'),
                usedBy: null, usedAt: null
            }));

            setCodes(prev => [...newRawCodes, ...prev]);

            // بناء הـ HTML بنفس طريقة المدرس
            let cardsHtml = '';
            newRawCodes.forEach(c => {
                cardsHtml += `
                    <div class="card">
                        <p class="price">${c.price}</p>
                        <p class="index">${c.serial}</p>
                        <p class="code" style="color: ${genForm.color}">${c.code}</p>
                    </div>
                `;
            });

            const printWindow = window.open('', '_blank');
            if (!printWindow) {
                alert("يرجى السماح بالنوافذ المنبثقة (Pop-ups).");
                setIsGenerating(false);
                return;
            }

            const htmlContent = `
            <!DOCTYPE html>
            <html dir="ltr">
            <head>
                <title>طباعة أكواد العروض</title>
                <link href="https://fonts.googleapis.com/css2?family=Russo+One&display=swap" rel="stylesheet">
                <style>
                    *, *::before, *::after { padding: 0; margin: 0; box-sizing: border-box; }
                    body { background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    @page { size: A4 portrait; margin-top: 4.5mm; margin-bottom: 4mm; margin-left: 10mm; margin-right: 10mm; }
                    @media print { div.card { page-break-inside: avoid; } ::-webkit-scrollbar { display: none; } }
                    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
                    .card { background-image: url('${genForm.bgImage}'); background-position: center; background-repeat: no-repeat; background-size: cover; aspect-ratio: 21 / 10; position: relative; font-family: 'Russo One', sans-serif; }
                    .price { position: absolute; top: 6%; left: 11%; font-size: 11px; font-weight: 900; color: black; }
                    .index { position: absolute; bottom: 25%; left: 50%; transform: translateX(-50%); font-size: 11px; font-weight: 900; color: black; letter-spacing: 1px; }
                    .code { position: absolute; bottom: 5%; left: 50%; transform: translateX(-50%); font-size: 13px; font-weight: 900; letter-spacing: 1px; }
                </style>
            </head>
            <body>
                <div class="grid">${cardsHtml}</div>
                <script> window.onload = () => { setTimeout(() => { window.print(); }, 500); }; </script>
            </body>
            </html>
            `;

            printWindow.document.open();
            printWindow.document.write(htmlContent);
            printWindow.document.close();
            
            setIsGenerating(false);
            setIsGenModalOpen(false);
            showToast('تم التوليد وتجهيز شيت الطباعة بنجاح! 🖨️', 'success');
        }, 1000);
    };

    if (!mounted) return null;

    return (
        <div style={{ animation: 'fadeIn 0.4s ease', maxWidth: '1400px', margin: '0 auto', padding: '20px', paddingBottom: '50px' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button onClick={() => router.push('/admin/offers')} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--txt)', width: '45px', height: '45px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FaArrowRight />
                    </button>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', margin: '0 0 5px 0', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FaGift color="#ff007f" /> السجل المركزي لأكواد العروض
                        </h1>
                        <p style={{ color: 'var(--txt-mut)', margin: 0 }}>توليد وبحث وتتبع أكواد الخصومات والباقات المجمعة.</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Button variant="outline" style={{ background: 'rgba(33, 115, 70, 0.1)', color: '#2ecc71', border: '1px solid #27ae60' }} onClick={handleExportExcel} icon={<FaFileExcel/>}>تصدير للإكسيل</Button>
                    <Button variant="primary" icon={<FaPlus/>} onClick={() => setIsGenModalOpen(true)} style={{ background: 'linear-gradient(45deg, var(--p-purple), #ff007f)', border: 'none' }}>توليد وطباعة أكواد</Button>
                </div>
            </div>

            {/* Filters */}
            <div style={{ background: 'var(--card)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '20px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: '2 1 300px' }}>
                    <FaSearch style={{ position: 'absolute', right: '15px', top: '14px', color: 'var(--txt-mut)' }} />
                    <input type="text" placeholder="ابحث بالسيريال، كود الشحن، أو اسم الطالب..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ width: '100%', padding: '12px 40px 12px 15px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }} />
                </div>
                <select value={offerFilter} onChange={e => setOfferFilter(e.target.value)} style={{ flex: '1 1 200px', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }}>
                    <option value="all" style={{ background: '#1e1e2d' }}>جميع العروض المتاحة</option>
                    {MOCK_OFFERS.map(o => <option key={o.id} value={o.id} style={{ background: '#1e1e2d' }}>{o.title}</option>)}
                </select>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ flex: '1 1 150px', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }}>
                    <option value="all" style={{ background: '#1e1e2d' }}>كل الحالات</option>
                    <option value="unused" style={{ background: '#1e1e2d' }}>جديد (لم يشحن)</option>
                    <option value="used" style={{ background: '#1e1e2d' }}>مشحون</option>
                </select>
            </div>

            {/* Table */}
            <div style={{ background: 'var(--card)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', overflowX: 'auto' }}>
                <table style={{ width: '100%', minWidth: '1000px', borderCollapse: 'collapse', textAlign: 'right', color: 'white' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <th style={{ padding: '15px' }}>السيريال</th>
                            <th style={{ padding: '15px' }}>كود الشحن السري</th>
                            <th style={{ padding: '15px' }}>العرض والقيمة</th>
                            <th style={{ padding: '15px' }}>الحالة وتفاصيل الاستخدام</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>إجراء</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map(c => (
                            <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', transition: '0.2s' }} className="table-row-hover">
                                <td style={{ padding: '15px', fontWeight: 'bold', color: 'var(--txt-mut)', fontFamily: 'monospace' }}>{c.serial}</td>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{ fontFamily: 'monospace', fontSize: '1.1rem', letterSpacing: '2px', color: revealedCodes[c.id] ? '#f1c40f' : 'var(--txt-mut)' }}>
                                            {revealedCodes[c.id] ? c.code : 'XXXX-XXXX-XXXX-XXXX'}
                                        </span>
                                        <button onClick={() => toggleReveal(c.id)} style={{ background: 'none', border: 'none', color: '#ff007f', cursor: 'pointer' }}>
                                            {revealedCodes[c.id] ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                        </button>
                                    </div>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'white', fontWeight: 'bold' }}><FaGift color="#ff007f"/> {c.offerName}</div>
                                    <div style={{ color: '#2ecc71', fontSize: '0.85rem', marginTop: '5px', fontWeight: 'bold' }}>{c.price} ج.م</div>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    {c.status === 'used' ? (
                                        <div>
                                            <span style={{ background: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}><FaCheckCircle/> مشحون</span>
                                            <div style={{ fontSize: '0.85rem', color: 'white', marginTop: '5px', fontWeight: 'bold' }}>الطالب: {c.usedBy}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--txt-mut)', direction: 'ltr', textAlign: 'right' }}>{c.usedAt}</div>
                                        </div>
                                    ) : (
                                        <span style={{ background: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}><FaTimesCircle/> لم يُشحن بعد</span>
                                    )}
                                </td>
                                <td style={{ padding: '15px', textAlign: 'center' }}>
                                    <button onClick={() => handleDelete(c.id)} style={{ background: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }} title="حذف الكود">
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {currentData.length === 0 && (
                            <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'var(--txt-mut)' }}>لا توجد أكواد مطابقة لعملية البحث أو الفلترة.</td></tr>
                        )}
                    </tbody>
                </table>
                <style jsx>{`.table-row-hover:hover { background: rgba(255,255,255,0.02); }`}</style>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px', background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '15px' }}>
                    <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>السابق</Button>
                    <span style={{ color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>صفحة {currentPage} من {totalPages}</span>
                    <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>التالي</Button>
                </div>
            )}

            {/* Modal التوليد */}
            <Modal isOpen={isGenModalOpen} onClose={() => setIsGenModalOpen(false)} title="توليد أكواد لعرض معين" maxWidth="800px">
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', padding: '10px 0' }}>
                    <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div>
                            <label style={{ display: 'block', color: 'var(--txt-mut)', fontSize: '0.9rem', marginBottom: '8px' }}>اختر العرض المستهدف</label>
                            <select value={genForm.offerId} onChange={e => setGenForm({...genForm, offerId: e.target.value})} style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }}>
                                {MOCK_OFFERS.map(o => <option key={o.id} value={o.id} style={{ background: '#1e1e2d' }}>{o.title}</option>)}
                            </select>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div>
                                <label style={{ display: 'block', color: 'var(--txt-mut)', fontSize: '0.9rem', marginBottom: '8px' }}>العدد</label>
                                <input type="number" value={genForm.count} onChange={e => setGenForm({...genForm, count: e.target.value})} style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', color: 'var(--txt-mut)', fontSize: '0.9rem', marginBottom: '8px' }}><FaPalette/> لون النص</label>
                                <input type="color" value={genForm.color} onChange={e => setGenForm({...genForm, color: e.target.value})} style={{ width: '100%', height: '42px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'transparent' }} />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', color: 'var(--txt-mut)', fontSize: '0.9rem', marginBottom: '8px' }}>تصميم الكارت (خلفية)</label>
                            <div onClick={() => fileInputRef.current?.click()} style={{ padding: genForm.bgImage ? '0' : '20px', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', position: 'relative', overflow: 'hidden', height: genForm.bgImage ? '120px' : 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <input type="file" ref={fileInputRef} accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
                                {genForm.bgImage ? (
                                    <>
                                        <img src={genForm.bgImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <button onClick={(e) => { e.stopPropagation(); setGenForm({...genForm, bgImage: null}); }} style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(0,0,0,0.7)', color: '#e74c3c', border: 'none', padding: '5px', borderRadius: '50%', cursor: 'pointer' }}><FaTrash /></button>
                                    </>
                                ) : (
                                    <div style={{ color: 'var(--txt-mut)' }}><FaImage size={24} style={{ marginBottom: '10px' }} /><br/>ارفع تصميم (أبعاد 21:10)</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div style={{ flex: '1 1 350px', background: 'rgba(0,0,0,0.2)', borderRadius: '15px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px dashed rgba(255,255,255,0.05)' }}>
                        <h4 style={{ margin: '0 0 15px 0', color: 'var(--txt-mut)' }}>معاينة الطباعة</h4>
                        <div style={{ width: '100%', aspectRatio: '21/10', background: genForm.bgImage ? `url(${genForm.bgImage}) center/contain no-repeat` : '#1e1e2d', borderRadius: '10px', position: 'relative', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <div style={{ position: 'absolute', top: '10%', left: '10%', background: 'white', padding: '2px 8px', borderRadius: '4px', fontWeight: '900', color: 'black', fontSize: '0.8rem' }}>{MOCK_OFFERS.find(o => o.id === genForm.offerId)?.price || 0}</div>
                            <div style={{ position: 'absolute', bottom: '25%', left: '50%', transform: 'translateX(-50%)', background: 'white', padding: '2px 10px', borderRadius: '8px', color: 'black', fontWeight: '900', fontSize: '0.75rem' }}>(950001)</div>
                            <div style={{ position: 'absolute', bottom: '5%', left: '50%', transform: 'translateX(-50%)', width: '90%', textAlign: 'center', color: genForm.color, fontFamily: 'monospace', fontSize: '1rem', fontWeight: 900, letterSpacing: '2px', textShadow: '0 0 2px white' }}>1234567890123456</div>
                        </div>
                    </div>
                </div>

                <Button variant="primary" fullWidth onClick={handleGenerateAndPrint} disabled={isGenerating} style={{ marginTop: '20px', background: 'linear-gradient(45deg, var(--p-purple), #ff007f)', border: 'none' }}>
                    {isGenerating ? 'جاري التوليد والتجهيز للطباعة...' : <><FaPrint style={{marginRight: '10px'}}/> تسجيل الأكواد وطباعة الـ PDF</>}
                </Button>
            </Modal>
        </div>
    );
}