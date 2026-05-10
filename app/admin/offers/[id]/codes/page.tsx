// FILE: app/admin/offers/[id]/codes/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaArrowRight, FaPlus, FaBarcode, FaFilePdf, FaUpload, FaFileExcel } from 'react-icons/fa';

// 💡 المسارات الأساسية اللي كانت شغالة معاك
import { Button } from '../../../../../components/ui/Button';
import { Modal } from '../../../../../components/ui/Modal';
import { useToast } from '../../../../../context/ToastContext';
import styles from '../../Offers.module.css';

// 💡 المسار المتصلح لمحرك الـ PDF (بناءً على شجرة الملفات بتاعتك: 3 خطوات لورا عشان نوصل لـ admin)
import { generateCodesPDF } from '../../../utils/generateCodesPDF';

import * as XLSX from 'xlsx'; // مكتبة تصدير الإكسيل

export default function OfferCodesPage() {
    const params = useParams();
    const router = useRouter();
    const { showToast } = useToast();
    const [mounted, setMounted] = useState(false);

    const [codes, setCodes] = useState<any[]>([]);
    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const [form, setForm] = useState({ 
        count: '', color: '#000000', customPrice: '', previewImage: null as string | null 
    });

    useEffect(() => {
        // داتا مبدئية للتجربة (تأكيد عمل الجدول)
        setCodes([{
            id: 1, serial: '84027', code: '2125 9374 8127 5892', price: 50, teacher: 'مس بهيرة', 
            addedDate: new Date().toLocaleDateString('en-US'), addedBy: 'Admin', isUsed: false
        }]);
        setMounted(true);
    }, []);

    // رفع صورة الخلفية للمعاينة وللـ PDF
    const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => setForm({...form, previewImage: event.target?.result as string});
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    // توليد الـ PDF والأكواد
    const handleGenerateCodes = async () => {
        const count = parseInt(form.count);
        if (!count || count <= 0) { showToast('أدخل عدد صحيح!', 'error'); return; }
        if (!form.previewImage) { showToast('يجب رفع صورة التصميم (الخلفية) أولاً!', 'error'); return; }

        setIsGenerating(true);
        showToast('جاري التوليد وبناء ملف الـ PDF...', 'info');

        try {
            const newCodes = await generateCodesPDF({
                count: count, 
                price: form.customPrice || '50', 
                color: form.color,
                background: form.previewImage, 
                title: `Offer_${params?.id || 'New'}`
            });

            // إضافة الأكواد الجديدة لأول الجدول
            setCodes(prev => [...newCodes.map((c: any, i: number) => ({ ...c, id: Date.now() + i })), ...prev]);
            showToast('تم التوليد وتحميل الـ PDF بنجاح! ✅', 'success');
            setIsGenerateModalOpen(false);
        } catch (error) {
            showToast('حدث خطأ أثناء التوليد. راجع الكونسول.', 'error');
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    };

    // دالة استخراج الإكسيل
    const handleExportExcel = () => {
        if (codes.length === 0) { 
            showToast('لا يوجد أكواد لتصديرها', 'error'); 
            return; 
        }
        
        const excelData = codes.map((c, index) => ({
            'م': index + 1,
            'السيريال': c.serial,
            'الكود السري': c.code,
            'السعر': `${c.price} ج.م`,
            'حالة الاستخدام': c.isUsed ? 'مستخدم' : 'جديد',
            'اسم الطالب': c.isUsed ? c.studentName : '-',
            'تاريخ الإضافة': c.addedDate
        }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Codes");
        
        XLSX.writeFile(workbook, `Offer_${params?.id || 'Data'}_Codes.xlsx`);
        showToast('تم تحميل ملف الإكسيل بنجاح! 📊', 'success');
    };

    if (!mounted) return null;

    return (
        <div className={styles.container}>
            {/* Header */}
            <div style={{ background: 'var(--card)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', color: 'white', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaBarcode color="var(--p-purple)"/> إدارة أكواد العرض
                    </h2>
                    <p style={{ color: 'var(--txt-mut)', marginTop: '5px' }}>إجمالي الأكواد: <strong style={{color: 'white'}}>{codes.length}</strong></p>
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <Button variant="outline" style={{ background: 'rgba(33, 115, 70, 0.1)', color: '#217346', border: '1px solid #217346' }} onClick={handleExportExcel} icon={<FaFileExcel/>}>تصدير إكسيل</Button>
                    <Button variant="primary" icon={<FaPlus/>} onClick={() => setIsGenerateModalOpen(true)} style={{ background: 'linear-gradient(45deg, var(--p-purple), #ff007f)', border: 'none' }}>توليد أكواد PDF</Button>
                    <Button variant="outline" icon={<FaArrowRight />} onClick={() => router.push(`/admin/offers/${params?.id}`)}>رجوع للعرض</Button>
                </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto', background: 'var(--card)', borderRadius: '15px', padding: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <table style={{ width: '100%', textAlign: 'center', borderCollapse: 'collapse', color: 'white', minWidth: '1000px' }}>
                    <thead>
                        <tr style={{ color: 'var(--p-purple)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <th style={{ padding: '15px' }}>السيريال</th>
                            <th style={{ padding: '15px' }}>الكود السري</th>
                            <th style={{ padding: '15px' }}>السعر</th>
                            <th style={{ padding: '15px' }}>تاريخ الإضافة</th>
                            <th style={{ padding: '15px' }}>الحالة</th>
                        </tr>
                    </thead>
                    <tbody>
                        {codes.map((c) => (
                            <tr key={c.id} style={{ borderBottom: '1px dashed rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '15px', fontWeight: 'bold' }}>{c.serial}</td>
                                <td style={{ padding: '15px', fontFamily: 'monospace', letterSpacing: '2px', color: 'var(--warning)', fontSize: '1.1rem' }}>{c.code}</td>
                                <td style={{ padding: '15px', color: 'var(--success)', fontWeight: 'bold' }}>{c.price} ج.م</td>
                                <td style={{ padding: '15px', color: 'var(--txt-mut)' }}>{c.addedDate}</td>
                                <td style={{ padding: '15px' }}>
                                    {c.isUsed ? <span style={{ background: 'rgba(231,76,60,0.1)', color: 'var(--danger)', padding: '5px 10px', borderRadius: '5px' }}>مستخدم</span> : <span style={{ background: 'rgba(46,204,113,0.1)', color: 'var(--success)', padding: '5px 10px', borderRadius: '5px' }}>جديد</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal للتوليد */}
            <Modal isOpen={isGenerateModalOpen} onClose={() => setIsGenerateModalOpen(false)} title="توليد الأكواد وإنشاء ملف PDF" maxWidth="850px">
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', padding: '10px 0' }}>
                    
                    {/* Settings Form */}
                    <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div>
                            <div className={styles.formLabel}>عدد الأكواد المطلوب توليدها</div>
                            <input type="number" className={styles.formInput} placeholder="مثال: 50" value={form.count} onChange={e => setForm({...form, count: e.target.value})} />
                        </div>
                        <div>
                            <div className={styles.formLabel}>سعر كود الشحن</div>
                            <input className={styles.formInput} placeholder="مثال: 50" value={form.customPrice} onChange={e => setForm({...form, customPrice: e.target.value})} />
                        </div>
                        <div>
                            <div className={styles.formLabel}>لون خط الكود</div>
                            <input type="color" value={form.color} onChange={e => setForm({...form, color: e.target.value})} style={{ width: '100%', height: '45px', border: 'none', borderRadius: '5px', cursor: 'pointer', padding: 0 }} />
                        </div>
                        <div>
                            <div className={styles.formLabel}>صورة الخلفية (تصميم الكارت)</div>
                            <label className={styles.fileUpload}>
                                <FaUpload /> ارفع التصميم
                                <input type="file" style={{ display: 'none' }} accept="image/*" onChange={handleBackgroundUpload} />
                            </label>
                        </div>
                    </div>

                    {/* Live Preview */}
                    <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div className={styles.formLabel}>معاينة حية لشكل الكارت على الـ PDF</div>
                        <div style={{ width: '100%', height: '350px', background: form.previewImage ? `url(${form.previewImage}) center/contain no-repeat` : '#2d3436', borderRadius: '15px', position: 'relative', border: '2px dashed var(--p-purple)' }}>
                            {!form.previewImage && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>ارفع التصميم للمعاينة هنا</div>}
                            
                            <div style={{ position: 'absolute', top: '20px', left: '20px', background: 'white', padding: '5px 10px', borderRadius: '5px', fontWeight: '900', color: '#000', fontSize: '1.2rem', boxShadow: '0 2px 5px rgba(0,0,0,0.3)' }}>
                                {form.customPrice || '50'}
                            </div>
                            
                            <div style={{ position: 'absolute', bottom: '60px', left: '50%', transform: 'translateX(-50%)', background: 'white', padding: '2px 15px', borderRadius: '15px', color: '#000', fontWeight: '900', boxShadow: '0 2px 5px rgba(0,0,0,0.3)' }}>
                                (84054)
                            </div>
                            
                            <div style={{ position: 'absolute', bottom: '15px', left: '50%', transform: 'translateX(-50%)', width: '90%', textAlign: 'center' }}>
                                <div style={{ color: form.color, fontFamily: 'monospace', fontSize: '1.6rem', fontWeight: 900, letterSpacing: '4px', textShadow: '0px 0px 3px rgba(255,255,255,0.8)' }}>
                                    7972 6385 6154 6811
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <Button variant="primary" fullWidth onClick={handleGenerateCodes} disabled={isGenerating} style={{ marginTop: '20px', background: 'linear-gradient(45deg, #00b894, #00cec9)', border: 'none', fontSize: '1.1rem' }}>
                    {isGenerating ? 'جاري التوليد...' : <><FaFilePdf style={{marginRight: '10px'}}/> حفظ وتنزيل ملف الـ PDF</>}
                </Button>
            </Modal>
        </div>
    );
}