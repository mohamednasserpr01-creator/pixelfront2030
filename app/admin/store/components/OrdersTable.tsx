// FILE: app/admin/store/components/OrdersTable.tsx
"use client";
import React from 'react';
import { FaEye, FaClock, FaBoxOpen, FaTruck, FaCheckDouble, FaTimesCircle } from 'react-icons/fa';
import { Order, ShippingStatus } from '../../../../types';
import { Button } from '../../../../components/ui/Button';

interface OrdersTableProps {
    orders: Order[];
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onViewOrder: (order: Order) => void;
}

export default function OrdersTable({ orders, currentPage, totalPages, onPageChange, onViewOrder }: OrdersTableProps) {
    
    const getStatusStyle = (status: ShippingStatus) => {
        switch(status) {
            case 'pending': return { text: 'قيد المراجعة', color: 'var(--warning)', bg: 'rgba(241, 196, 15, 0.1)', icon: <FaClock/> };
            case 'processing': return { text: 'جاري التجهيز', color: '#3498db', bg: 'rgba(52, 152, 219, 0.1)', icon: <FaBoxOpen/> };
            case 'shipped': return { text: 'في الشحن', color: 'var(--p-purple)', bg: 'rgba(108, 92, 231, 0.1)', icon: <FaTruck/> };
            case 'delivered': return { text: 'تم التوصيل', color: 'var(--success)', bg: 'rgba(46, 204, 113, 0.1)', icon: <FaCheckDouble/> };
            case 'returned': return { text: 'مرتجع', color: 'var(--danger)', bg: 'rgba(231, 76, 60, 0.1)', icon: <FaTimesCircle/> };
            default: return { text: 'غير معروف', color: 'gray', bg: 'rgba(128,128,128,0.1)', icon: <FaClock/> };
        }
    };

    return (
        <div style={{ background: 'var(--card)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', textAlign: 'center', borderCollapse: 'collapse', minWidth: '1000px' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--txt-mut)', fontSize: '0.9rem' }}>
                            <th style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>رقم الطلب</th>
                            <th style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>بيانات الطالب</th>
                            <th style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>تاريخ الطلب</th>
                            <th style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>الإجمالي</th>
                            <th style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>الحالة</th>
                            <th style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>إجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? orders.map((o) => {
                            const status = getStatusStyle(o.shippingStatus);
                            return (
                                <tr key={o.id} style={{ borderBottom: '1px dashed rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '15px', fontWeight: '900', color: 'var(--p-purple)' }}>{o.id}</td>
                                    <td style={{ padding: '15px', textAlign: 'right' }}>
                                        <div style={{ fontWeight: 'bold', color: 'var(--txt)' }}>{o.studentName}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--txt-mut)', marginTop: '3px' }}>{o.phone}</div>
                                    </td>
                                    <td style={{ padding: '15px', color: 'var(--txt-mut)' }}>{o.date}</td>
                                    <td style={{ padding: '15px', color: 'var(--success)', fontWeight: 'bold', fontSize: '1.1rem' }}>{o.totalPrice} ج.م</td>
                                    <td style={{ padding: '15px' }}>
                                        <span style={{ background: status.bg, color: status.color, padding: '5px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                            {status.icon} {status.text}
                                        </span>
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        <Button variant="outline" size="sm" onClick={() => onViewOrder(o)} icon={<FaEye />}>التفاصيل</Button>
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr><td colSpan={6} style={{ padding: '40px', color: 'var(--txt-mut)' }}>لا توجد طلبات مطابقة.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* 💡 Server-Ready Pagination */}
            {totalPages > 1 && (
                <div style={{ padding: '15px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', background: 'rgba(0,0,0,0.2)' }}>
                    <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>السابق</Button>
                    <span style={{ fontWeight: 'bold', color: 'var(--p-purple)' }}>صفحة {currentPage} من {totalPages}</span>
                    <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>التالي</Button>
                </div>
            )}
        </div>
    );
}