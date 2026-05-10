// FILE: app/admin/store/components/ProductModal.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { FaUpload } from 'react-icons/fa';
import { Product, ProductCategory } from '../../../../types';
import { Modal } from '../../../../components/ui/Modal';
import { Button } from '../../../../components/ui/Button';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (product: Partial<Product>) => void;
    initialData?: Product | null;
}

export default function ProductModal({ isOpen, onClose, onSave, initialData }: ProductModalProps) {
    const [formData, setFormData] = useState({
        title: '', price: '', stock: '', category: 'books' as ProductCategory, image: null as string | null
    });

    // 💡 تفريغ أو تعبئة الداتا لما المودال يفتح
    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title,
                price: initialData.price.toString(),
                stock: initialData.stock.toString(),
                category: initialData.category,
                image: initialData.image
            });
        } else {
            setFormData({ title: '', price: '', stock: '', category: 'books', image: null });
        }
    }, [initialData, isOpen]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => setFormData({...formData, image: event.target?.result as string});
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSubmit = () => {
        onSave({
            title: formData.title,
            price: Number(formData.price),
            stock: Number(formData.stock),
            category: formData.category,
            image: formData.image || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=500', // Default
            status: Number(formData.stock) > 0 ? 'متوفر' : 'غير متوفر'
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "تعديل المنتج" : "إضافة منتج للمتجر والمخزن"} maxWidth="600px">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '10px 0' }}>
                <div>
                    <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '5px' }}>اسم المنتج / الملزمة</label>
                    <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={styles.input} placeholder="مثال: كتاب المراجعة النهائية" />
                </div>
                
                <div>
                    <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '5px' }}>القسم</label>
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as ProductCategory})} style={{...styles.input, cursor: 'pointer'}}>
                        <option value="books" style={{ background: '#1e1e2d' }}>كتب وملازم</option>
                        <option value="tools" style={{ background: '#1e1e2d' }}>أدوات أخرى</option>
                    </select>
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '5px' }}>السعر (ج.م)</label>
                        <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={styles.input} placeholder="150" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '5px' }}>الكمية المتاحة (المخزن)</label>
                        <input type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} style={styles.input} placeholder="100" />
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '5px' }}>صورة المنتج</label>
                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: 'rgba(108,92,231,0.1)', color: 'var(--p-purple)', padding: '15px', borderRadius: '10px', border: '1px dashed var(--p-purple)', cursor: 'pointer' }}>
                        <FaUpload /> {formData.image ? 'تم إرفاق الصورة بنجاح ✅' : 'اضغط لرفع صورة المنتج'}
                        <input type="file" style={{ display: 'none' }} accept="image/*" onChange={handleImageUpload} />
                    </label>
                    {formData.image && (
                        <div style={{ marginTop: '10px', textAlign: 'center' }}>
                            <img src={formData.image} alt="Preview" style={{ width: '100px', borderRadius: '10px' }} />
                        </div>
                    )}
                </div>

                <Button variant="primary" fullWidth onClick={handleSubmit} style={{ marginTop: '10px' }}>
                    {initialData ? 'حفظ التعديلات' : 'حفظ ونشر في المتجر'}
                </Button>
            </div>
        </Modal>
    );
}

const styles = {
    input: { background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 15px', borderRadius: '10px', color: 'white', width: '100%', outline: 'none' }
};