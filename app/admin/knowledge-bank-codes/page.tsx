"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
    FaDatabase, FaKey, FaEdit, FaChalkboardTeacher, 
    FaMoneyBillWave, FaListUl, FaGift, FaLock 
} from 'react-icons/fa';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { useToast } from '../../../context/ToastContext';

// 💡 MOCK DATA: بنوك الأسئلة اللي المدرسين كریتوها من حساباتهم
const INITIAL_BANKS = [
    { 
        id: 'b1', 
        title: 'بنك أسئلة الفيزياء الشامل 2026', 
        teacherName: 'أ. محمد ناصر', 
        units: ['الباب الأول: الكهربية', 'الباب الثاني: المغناطيسية', 'الباب الثالث: الحث', 'الفيزياء الحديثة'],
        price: 250, 
        freeUnits: ['الباب الأول: الكهربية'] // ده مجاني كـ تريال
    },
    { 
        id: 'b2', 
        title: 'بنك الكيمياء العضوية والتحليلية', 
        teacherName: 'أ. محمود مجدي', 
        units: ['العضوية جزء 1', 'العضوية جزء 2', 'التحليل الكيميائي', 'الاتزان الكيميائي'],
        price: 150, 
        freeUnits: [] 
    },
];

export default function KnowledgeBankPricingPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [mounted, setMounted] = useState(false);

    const [banks, setBanks] = useState(INITIAL_BANKS);
    
    // Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingBank, setEditingBank] = useState<any>(null);

    useEffect(() => setMounted(true), []);

    const openEditModal = (bank: any) => {
        setEditingBank({ ...bank });
        setIsEditModalOpen(true);
    };

    const toggleFreeUnit = (unit: string) => {
        setEditingBank((prev: any) => ({
            ...prev,
            freeUnits: prev.freeUnits.includes(unit)
                ? prev.freeUnits.filter((u: string) => u !== unit)
                : [...prev.freeUnits, unit]
        }));
    };

    const handleSavePricing = () => {
        if (editingBank.price === '' || editingBank.price < 0) {
            return showToast('يرجى تحديد سعر صحيح للبنك', 'error');
        }

        setBanks(banks.map(b => b.id === editingBank.id ? editingBank : b));
        setIsEditModalOpen(false);
        showToast('تم تحديث الإعدادات التجارية للبنك بنجاح! 💾', 'success');
    };

    if (!mounted) return null;

    return (
        <div style={{ animation: 'fadeIn 0.4s ease', maxWidth: '1200px', margin: '0 auto', padding: '20px', paddingBottom: '50px' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', margin: '0 0 5px 0', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaDatabase color="#3498db" /> إدارة وتسعير بنوك المعرفة
                    </h1>
                    <p style={{ color: 'var(--txt-mut)', margin: 0 }}>تحديد أسعار البنوك واختيار الوحدات المجانية (التجريبية).</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
<Button variant="primary" icon={<FaKey />} onClick={() => router.push('/admin/knowledge-bank-codes/codes')} style={{ background: '#3498db', border: 'none' }}>                        إدارة السيريالات
                    </Button>
                </div>
            </div>

            {/* Grid of Banks */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                {banks.map(bank => (
                    <div key={bank.id} style={{ background: 'var(--card)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        
                        {/* Card Header */}
                        <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
                            <h3 style={{ margin: '0 0 10px 0', color: 'white', fontSize: '1.2rem', lineHeight: '1.4' }}>{bank.title}</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--txt-mut)', fontSize: '0.9rem' }}>
                                <FaChalkboardTeacher color="#3498db"/> المدرس: {bank.teacherName}
                            </div>
                        </div>

                        {/* Card Body */}
                        <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(46, 204, 113, 0.1)', padding: '15px', borderRadius: '10px', border: '1px dashed rgba(46, 204, 113, 0.3)' }}>
                                <span style={{ color: '#2ecc71', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}><FaMoneyBillWave/> السعر للبنك الكامل:</span>
                                <strong style={{ color: 'white', fontSize: '1.3rem' }}>{bank.price} <span style={{fontSize:'0.8rem', color:'var(--txt-mut)'}}>ج.م</span></strong>
                            </div>

                            <div>
                                <h4 style={{ margin: '0 0 10px 0', color: 'var(--txt-mut)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}><FaListUl/> محتوى البنك:</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {bank.units.map((unit, idx) => {
                                        const isFree = bank.freeUnits.includes(unit);
                                        return (
                                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: isFree ? 'rgba(241, 196, 15, 0.05)' : 'rgba(255,255,255,0.02)', borderRadius: '8px', border: `1px solid ${isFree ? 'rgba(241, 196, 15, 0.2)' : 'transparent'}` }}>
                                                <span style={{ color: 'white', fontSize: '0.9rem' }}>{unit}</span>
                                                {isFree ? (
                                                    <span style={{ color: '#f1c40f', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}><FaGift/> مجاني</span>
                                                ) : (
                                                    <span style={{ color: 'var(--txt-mut)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '5px' }}><FaLock/> مقفول بالسيريال</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Card Footer */}
                        <div style={{ padding: '15px', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.1)' }}>
                            <Button variant="outline" fullWidth icon={<FaEdit />} onClick={() => openEditModal(bank)} style={{ color: 'var(--txt)' }}>
                                تعديل التسعير والهدايا
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal التعديل */}
            {editingBank && (
                <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="إعدادات التسعير والهدايا" maxWidth="500px">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px 0' }}>
                        
                        <div style={{ background: 'rgba(52, 152, 219, 0.1)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(52, 152, 219, 0.2)' }}>
                            <h4 style={{ margin: '0 0 5px 0', color: '#3498db' }}>{editingBank.title}</h4>
                            <div style={{ fontSize: '0.85rem', color: 'var(--txt-mut)' }}>{editingBank.teacherName}</div>
                        </div>

                        <div>
                            <label style={{ display: 'block', color: 'var(--txt-mut)', fontSize: '0.9rem', marginBottom: '8px' }}>سعر البنك بالكامل (ج.م)</label>
                            <input 
                                type="number" 
                                value={editingBank.price} 
                                onChange={e => setEditingBank({...editingBank, price: Number(e.target.value)})} 
                                style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none', fontSize: '1.1rem' }} 
                            />
                            <p style={{ fontSize: '0.75rem', color: 'var(--txt-mut)', margin: '5px 0 0 0' }}>هذا السعر الذي سيدفعه الطالب عند شراء سيريال لفتح البنك بالكامل.</p>
                        </div>

                        <div>
                            <label style={{ display: 'block', color: 'var(--txt-mut)', fontSize: '0.9rem', marginBottom: '8px' }}>الوحدات المجانية (هدية للتجربة)</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '10px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                {editingBank.units.map((unit: string) => (
                                    <label key={unit} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white', cursor: 'pointer', padding: '8px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                                        <input 
                                            type="checkbox" 
                                            checked={editingBank.freeUnits.includes(unit)} 
                                            onChange={() => toggleFreeUnit(unit)}
                                            style={{ cursor: 'pointer' }}
                                        />
                                        <span style={{ fontSize: '0.95rem' }}>{unit}</span>
                                    </label>
                                ))}
                            </div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--warning)', margin: '5px 0 0 0' }}>الوحدات المحددة هنا ستظهر مفتوحة مجاناً لجميع الطلاب بدون طلب سيريال تفعيل.</p>
                        </div>

                        <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                            <Button variant="primary" fullWidth onClick={handleSavePricing} style={{ background: '#3498db', border: 'none' }}>حفظ الإعدادات</Button>
                            <Button variant="outline" fullWidth onClick={() => setIsEditModalOpen(false)}>إلغاء</Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}