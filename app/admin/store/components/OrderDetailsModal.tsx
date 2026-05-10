// FILE: app/admin/store/components/OrderDetailsModal.tsx
"use client";
import React from 'react';
import { FaMapMarkerAlt, FaBoxOpen, FaTruck, FaCheckCircle, FaMoneyBillWave } from 'react-icons/fa';
import { Order, ShippingStatus } from '../../../../types';
import { Modal } from '../../../../components/ui/Modal';
import { Button } from '../../../../components/ui/Button';

interface OrderDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order | null;
    onUpdateStatus: (orderId: string, newStatus: ShippingStatus) => void;
}

export default function OrderDetailsModal({ isOpen, onClose, order, onUpdateStatus }: OrderDetailsModalProps) {
    if (!order) return null;

    // 💡 Order Tracking Timeline Logic
    const steps = [
        { key: 'pending', label: 'تم الطلب' },
        { key: 'processing', label: 'جاري التجهيز' },
        { key: 'shipped', label: 'في الشحن' },
        { key: 'delivered', label: 'تم التوصيل' }
    ];
    
    const currentStepIndex = steps.findIndex(s => s.key === order.shippingStatus);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`تفاصيل الطلب: ${order.id}`} maxWidth="750px">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px 0' }}>
                
                {/* 1. مسار الطلب (Timeline) */}
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '25px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h3 style={{ color: 'var(--p-purple)', marginBottom: '20px', fontSize: '1.1rem' }}>مسار الطلب (Tracking)</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '15px', left: '10%', right: '10%', height: '3px', background: 'rgba(255,255,255,0.1)', zIndex: 0 }}></div>
                        <div style={{ position: 'absolute', top: '15px', right: '10%', width: `${currentStepIndex > 0 ? (currentStepIndex / (steps.length - 1)) * 80 : 0}%`, height: '3px', background: 'var(--success)', zIndex: 1, transition: '0.5s' }}></div>
                        
                        {steps.map((step, idx) => {
                            const isCompleted = currentStepIndex >= idx;
                            return (
                                <div key={step.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, gap: '10px' }}>
                                    <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: isCompleted ? 'var(--success)' : '#2d3436', border: `3px solid ${isCompleted ? 'var(--success)' : 'rgba(255,255,255,0.2)'}`, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', transition: '0.5s' }}>
                                        {isCompleted && <FaCheckCircle />}
                                    </div>
                                    <span style={{ fontSize: '0.85rem', color: isCompleted ? 'white' : 'var(--txt-mut)', fontWeight: isCompleted ? 'bold' : 'normal' }}>{step.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 2. بيانات الشحن والدفع */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <h3 style={{ color: 'var(--p-purple)', marginBottom: '15px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '10px' }}><FaMapMarkerAlt/> بيانات الشحن</h3>
                        <div style={{ marginBottom: '10px' }}><span style={{ color: 'var(--txt-mut)', fontSize: '0.9rem' }}>الطالب:</span> <span style={{ fontWeight: 'bold' }}>{order.studentName}</span></div>
                        <div style={{ marginBottom: '10px' }}><span style={{ color: 'var(--txt-mut)', fontSize: '0.9rem' }}>الهاتف:</span> <span style={{ fontWeight: 'bold', direction: 'ltr' }}>{order.phone}</span></div>
                        <div><span style={{ color: 'var(--txt-mut)', fontSize: '0.9rem' }}>العنوان:</span> <div style={{ fontWeight: 'bold', lineHeight: '1.5', marginTop: '5px' }}>{order.address}</div></div>
                    </div>
                    
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <h3 style={{ color: 'var(--p-purple)', marginBottom: '15px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '10px' }}><FaMoneyBillWave/> حالة الدفع</h3>
                        <div style={{ marginBottom: '10px' }}>
                            <span style={{ color: 'var(--txt-mut)', fontSize: '0.9rem' }}>الحالة:</span> 
                            <span style={{ marginLeft: '10px', padding: '3px 10px', borderRadius: '10px', background: order.paymentStatus === 'paid' ? 'rgba(46,204,113,0.1)' : 'rgba(241,196,15,0.1)', color: order.paymentStatus === 'paid' ? 'var(--success)' : 'var(--warning)', fontWeight: 'bold' }}>
                                {order.paymentStatus === 'paid' ? 'تم الدفع' : 'الدفع عند الاستلام'}
                            </span>
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--success)', marginTop: '20px' }}>{order.totalPrice} ج.م</div>
                    </div>
                </div>

                {/* 3. المنتجات */}
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h3 style={{ color: 'var(--p-purple)', marginBottom: '15px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '10px' }}><FaBoxOpen/> المنتجات المطلوبة</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {order.items.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
                                <div>
                                    <div style={{ fontWeight: 'bold' }}>{item.title}</div>
                                    <div style={{ color: 'var(--txt-mut)', fontSize: '0.85rem' }}>الكمية: {item.qty}</div>
                                </div>
                                <div style={{ fontWeight: 'bold', color: 'var(--success)' }}>{item.price * item.qty} ج.م</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. الإجراءات */}
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h3 style={{ color: 'var(--p-purple)', marginBottom: '15px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '10px' }}><FaTruck/> تحديث حالة الطلب</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        <Button variant="outline" onClick={() => onUpdateStatus(order.id, 'processing')} style={{ flex: 1, borderColor: order.shippingStatus === 'processing' ? '#3498db' : '' }}>تجهيز الأوردر</Button>
                        <Button variant="outline" onClick={() => onUpdateStatus(order.id, 'shipped')} style={{ flex: 1, borderColor: order.shippingStatus === 'shipped' ? 'var(--p-purple)' : '' }}>تسليم للشحن</Button>
                        <Button variant="outline" onClick={() => onUpdateStatus(order.id, 'delivered')} style={{ flex: 1, borderColor: order.shippingStatus === 'delivered' ? 'var(--success)' : '' }}>تم التوصيل ✅</Button>
                        <Button variant="outline" onClick={() => onUpdateStatus(order.id, 'returned')} style={{ flex: 1, borderColor: order.shippingStatus === 'returned' ? 'var(--danger)' : '' }}>مرتجع ❌</Button>
                    </div>
                </div>

            </div>
        </Modal>
    );
}