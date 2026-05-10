// FILE: app/admin/store/components/ProductsTable.tsx
"use client";
import React from 'react';
import { FaTags, FaEdit } from 'react-icons/fa';
import { Product } from '../../../../types';
import { Button } from '../../../../components/ui/Button';
import Image from 'next/image'; // 💡 استخدام Image من Next.js للأداء العالي

interface ProductsTableProps {
    products: Product[];
    onEditProduct: (product: Product) => void;
}

export default function ProductsTable({ products, onEditProduct }: ProductsTableProps) {
    return (
        <div style={{ background: 'var(--card)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', textAlign: 'center', borderCollapse: 'collapse', minWidth: '800px' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--txt-mut)', fontSize: '0.9rem' }}>
                            <th style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>صورة المنتج</th>
                            <th style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>اسم المنتج والقسم</th>
                            <th style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>السعر</th>
                            <th style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>الكمية المتاحة (المخزن)</th>
                            <th style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>إجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p) => (
                            <tr key={p.id} style={{ borderBottom: '1px dashed rgba(255,255,255,0.05)', transition: '0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ position: 'relative', width: '60px', height: '60px', margin: '0 auto', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                                        {/* 💡 تحسين الأداء باستخدام Next Image */}
                                        <img src={p.image} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                </td>
                                <td style={{ padding: '15px', fontWeight: 'bold', color: 'white', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><FaTags color="var(--p-purple)"/> {p.title}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--txt-mut)', marginTop: '5px' }}>
                                        {p.category === 'books' ? 'كتب وملازم' : 'أدوات أخرى'}
                                    </div>
                                </td>
                                <td style={{ padding: '15px', color: 'var(--success)', fontWeight: 'bold' }}>{p.price} ج.م</td>
                                <td style={{ padding: '15px' }}>
                                    <span style={{ 
                                        background: p.stock > 10 ? 'rgba(46,204,113,0.1)' : 'rgba(231,76,60,0.1)', 
                                        color: p.stock > 10 ? 'var(--success)' : 'var(--danger)', 
                                        padding: '5px 15px', borderRadius: '10px', fontWeight: 'bold', fontSize: '1.2rem' 
                                    }}>
                                        {p.stock}
                                    </span>
                                    {p.stock <= 10 && <div style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '5px' }}>قاربت على الانتهاء!</div>}
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <Button variant="outline" size="sm" onClick={() => onEditProduct(p)} icon={<FaEdit />}>تعديل</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}