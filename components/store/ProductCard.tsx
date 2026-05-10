import React from 'react';
import Link from 'next/link';

// 1. عرفنا شكل بيانات المنتج عشان TypeScript يكون مبسوط وميطلعش إيرور
export interface Product {
    id: string | number;
    titleAr: string;
    titleEn: string;
    price: number;
    image: string;
    categoryAr: string;
    categoryEn: string;
}

interface ProductCardProps {
    product: Product;
    lang: string;
    onAddToCart?: (product: Product) => void; // دالة عشان لو حبينا نضيف للسلة من بره
}

export default function ProductCard({ product, lang, onAddToCart }: ProductCardProps) {
    return (
        // ده الهيكل الأساسي للكارت، تقدر تعدل ألوانه وستايله براحتك بعدين
        <div className="product-card" style={{ 
            background: 'var(--card)', 
            borderRadius: '15px', 
            padding: '15px', 
            border: '1px solid rgba(108,92,231,0.1)',
            transition: 'transform 0.3s ease'
        }}>
            
            {/* صورة المنتج (تقدر تحط تاج next/image بتاعك هنا) */}
            <div className="product-img-wrapper" style={{ height: '200px', backgroundColor: 'var(--h-bg)', borderRadius: '10px', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'var(--txt-mut)' }}>صورة {lang === 'ar' ? product.titleAr : product.titleEn}</span>
            </div>

            {/* تفاصيل المنتج */}
            <h3 style={{ color: 'var(--txt)', marginBottom: '10px', fontSize: '1.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {lang === 'ar' ? product.titleAr : product.titleEn}
            </h3>
            
            <p style={{ color: 'var(--txt-mut)', fontSize: '0.9rem', marginBottom: '15px' }}>
                {lang === 'ar' ? product.categoryAr : product.categoryEn}
            </p>

            {/* السعر وزرار الإضافة للسلة */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--p-purple)', fontWeight: 'bold', fontSize: '1.3rem' }}>
                    {product.price} ج.م
                </span>
                
                <button 
                    onClick={() => onAddToCart && onAddToCart(product)}
                    style={{ 
                        background: 'var(--p-purple)', 
                        color: '#fff', 
                        border: 'none', 
                        padding: '8px 15px', 
                        borderRadius: '8px', 
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    {lang === 'ar' ? 'إضافة' : 'Add'}
                </button>
            </div>
        </div>
    );
}