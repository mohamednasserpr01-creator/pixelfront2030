// FILE: app/admin/store/components/OrdersStats.tsx
"use client";
import React, { useMemo } from 'react';
import { FaStore, FaClock, FaBoxOpen, FaCheckDouble } from 'react-icons/fa';
import { Order } from '../../../../types'; // 💡 استدعاء الـ Interface من ملف الـ Types اللي جهزناه

interface OrdersStatsProps {
    orders: Order[];
}

export default function OrdersStats({ orders }: OrdersStatsProps) {
    // 💡 استخدام useMemo عشان العمليات الحسابية دي متتكررش مع كل حرف بيتكتب في البحث (Performance Boost)
    const stats = useMemo(() => {
        return {
            total: orders.length,
            pending: orders.filter(o => o.shippingStatus === 'pending').length,
            processing: orders.filter(o => o.shippingStatus === 'processing').length,
            delivered: orders.filter(o => o.shippingStatus === 'delivered').length,
        };
    }, [orders]);

    return (
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '30px' }}>
            {/* إجمالي الطلبات */}
            <div style={styles.statBox}>
                <div style={{ ...styles.iconWrapper, background: 'rgba(108,92,231,0.1)', color: 'var(--p-purple)' }}>
                    <FaStore />
                </div>
                <div>
                    <div style={styles.label}>إجمالي الطلبات</div>
                    <div style={styles.value}>{stats.total}</div>
                </div>
            </div>

            {/* قيد المراجعة */}
            <div style={styles.statBox}>
                <div style={{ ...styles.iconWrapper, background: 'rgba(241,196,15,0.1)', color: 'var(--warning)' }}>
                    <FaClock />
                </div>
                <div>
                    <div style={styles.label}>قيد المراجعة</div>
                    <div style={{ ...styles.value, color: 'var(--warning)' }}>{stats.pending}</div>
                </div>
            </div>

            {/* جاري التجهيز */}
            <div style={styles.statBox}>
                <div style={{ ...styles.iconWrapper, background: 'rgba(52,152,219,0.1)', color: '#3498db' }}>
                    <FaBoxOpen />
                </div>
                <div>
                    <div style={styles.label}>جاري التجهيز</div>
                    <div style={{ ...styles.value, color: '#3498db' }}>{stats.processing}</div>
                </div>
            </div>

            {/* تم التوصيل */}
            <div style={styles.statBox}>
                <div style={{ ...styles.iconWrapper, background: 'rgba(46,204,113,0.1)', color: 'var(--success)' }}>
                    <FaCheckDouble />
                </div>
                <div>
                    <div style={styles.label}>تم التوصيل</div>
                    <div style={{ ...styles.value, color: 'var(--success)' }}>{stats.delivered}</div>
                </div>
            </div>
        </div>
    );
}

// 💡 فصلنا الستايل في أوبجيكت عشان الكود يبقى Clean ومقروء
const styles: { [key: string]: React.CSSProperties } = {
    statBox: {
        background: 'var(--card)',
        border: '1px solid rgba(255,255,255,0.05)',
        padding: '20px',
        borderRadius: '15px',
        flex: 1,
        minWidth: '180px',
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
    },
    iconWrapper: {
        width: '45px',
        height: '45px',
        borderRadius: '12px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '1.2rem'
    },
    label: {
        color: 'var(--txt-mut)',
        fontSize: '0.85rem',
        fontWeight: 'bold'
    },
    value: {
        fontSize: '1.4rem',
        fontWeight: 900
    }
};