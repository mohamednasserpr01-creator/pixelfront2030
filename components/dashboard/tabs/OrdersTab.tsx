"use client";
import React from 'react';
import { FaBoxOpen } from 'react-icons/fa';
import { dashboardData } from '../../../data/mock/dashboardData';

export default function OrdersTab() {
    return (
        <div className="tab-pane active" style={{ animation: 'fadeIn 0.4s ease' }}>
            <h2 className="section-title"><FaBoxOpen /> تتبع طلبات المتجر</h2>
            <div className="table-responsive scrollable-table">
                <table>
                    <thead><tr><th>رقم التتبع (PIN)</th><th>المنتجات المطلوبة</th><th>تاريخ الطلب</th><th>الحالة</th></tr></thead>
                    <tbody>
                        {dashboardData.orders.map((order, i) => (
                            <tr key={i}>
                                <td style={{ fontWeight: 900, color: 'var(--p-purple)' }}>{order.pin}</td>
                                <td>{order.items}</td><td>{order.date}</td>
                                <td><span className={`badge ${order.statusClass}`}>{order.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}