"use client";
import React from 'react';
import { FaHistory } from 'react-icons/fa';
import { dashboardData } from '../../../data/mock/dashboardData';

export default function ActivityTab() {
    return (
        <div className="tab-pane active" style={{ animation: 'fadeIn 0.4s ease' }}>
            <h2 className="section-title"><FaHistory /> السجل الشامل لحركة الطالب</h2>
            <div className="table-responsive scrollable-table">
                <table>
                    <thead><tr><th>الوقت والتاريخ</th><th>العملية</th><th>التفاصيل</th><th>الجهاز (IP)</th></tr></thead>
                    <tbody>
                        {dashboardData.activity.map(act => (
                            <tr key={act.id}>
                                <td style={{ direction: 'ltr', textAlign: 'right' }}>{act.time}</td>
                                <td><span className={`badge ${act.class}`}>{act.action}</span></td>
                                <td>{act.details}</td><td>{act.device}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}