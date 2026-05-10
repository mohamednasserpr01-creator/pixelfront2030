"use client";
import React from 'react';
import { FaFileAlt } from 'react-icons/fa';
import { dashboardData } from '../../../data/mock/dashboardData';

export default function ExamsTab() {
    return (
        <div className="tab-pane active" style={{ animation: 'fadeIn 0.4s ease' }}>
            <h2 className="section-title"><FaFileAlt /> سجل الدرجات</h2>
            <div className="table-responsive scrollable-table">
                <table>
                    <thead>
                        <tr>
                            <th>النوع</th>
                            <th>الاختبار / الواجب</th>
                            <th>المادة</th>
                            <th>الدرجة</th>
                            <th>التاريخ</th>
                            <th>الحالة</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dashboardData.exams.map(exam => (
                            <tr key={exam.id}>
                                <td><span className={`badge ${exam.typeClass}`}>{exam.type}</span></td>
                                <td>{exam.title}</td>
                                <td>{exam.subject}</td>
                                <td style={{ color: `var(--${exam.statusClass})`, fontWeight: 900 }}>{exam.score}</td>
                                <td>{exam.date}</td>
                                <td><span className={`badge ${exam.statusClass}`}>{exam.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}