"use client";
import React, { useState } from 'react';
import { FaSyncAlt, FaUndo, FaBookOpen, FaPlayCircle, FaBarcode, FaSignInAlt, FaFileAlt, FaExclamationTriangle, FaClock } from 'react-icons/fa';

interface Props {
    student: any;
    onRefund: (studentId: number, itemId: string, type: 'course' | 'lecture', amount: number) => void;
    onResetExam: (studentId: number, examId: string) => void;
}

const renderTimelineIcon = (type: string) => {
    switch (type) {
        case 'login': return <FaSignInAlt color="var(--success)"/>;
        case 'course': return <FaPlayCircle color="var(--p-purple)"/>;
        case 'exam': return <FaFileAlt color="var(--warning)"/>;
        case 'error': return <FaExclamationTriangle color="var(--danger)"/>;
        case 'refund': return <FaUndo color="var(--success)"/>;
        case 'system': return <FaSyncAlt color="#3498db"/>;
        default: return <FaClock color="var(--txt-mut)"/>;
    }
};

export const ProfileTabs = React.memo(({ student, onRefund, onResetExam }: Props) => {
    const [activeTab, setActiveTab] = useState<'timeline' | 'subscriptions' | 'academic' | 'financial'>('academic');

    const purchasedCourses = student?.purchasedCourses || [];
    const purchasedLectures = student?.purchasedLectures || [];
    const chargingLogs = student?.chargingLogs || [];
    const timeline = student?.timeline || [];
    const academicRecord = student?.academicRecord || [];

    return (
        <div style={{ flex: '2 1 600px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '10px', background: 'var(--card)', padding: '10px', borderRadius: '15px', border: '1px solid rgba(128,128,128,0.2)', flexWrap: 'wrap' }}>
                <button onClick={() => setActiveTab('academic')} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s', background: activeTab === 'academic' ? 'var(--success)' : 'transparent', color: activeTab === 'academic' ? 'white' : 'var(--txt)' }}>الامتحانات</button>
                <button onClick={() => setActiveTab('subscriptions')} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s', background: activeTab === 'subscriptions' ? 'var(--p-purple)' : 'transparent', color: activeTab === 'subscriptions' ? 'white' : 'var(--txt)' }}>الاشتراكات</button>
                <button onClick={() => setActiveTab('financial')} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s', background: activeTab === 'financial' ? 'var(--warning)' : 'transparent', color: activeTab === 'financial' ? 'white' : 'var(--txt)' }}>سجل الشحن</button>
                <button onClick={() => setActiveTab('timeline')} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s', background: activeTab === 'timeline' ? 'rgba(52, 152, 219, 1)' : 'transparent', color: activeTab === 'timeline' ? 'white' : 'var(--txt)' }}>التحركات</button>
            </div>

            {activeTab === 'academic' && (
                 <div style={{ background: 'var(--card)', borderRadius: '20px', border: '1px solid rgba(128,128,128,0.2)', padding: '25px', animation: 'fadeIn 0.3s ease', overflowX: 'auto' }}>
                    <table style={{ width: '100%', textAlign: 'right', borderCollapse: 'collapse', minWidth: '600px' }}>
                        <thead>
                            <tr style={{ background: 'rgba(128,128,128,0.05)', color: 'var(--txt-mut)' }}>
                                <th style={{ padding: '15px', borderBottom: '1px solid rgba(128,128,128,0.1)' }}>الامتحان / الواجب</th>
                                <th style={{ padding: '15px', borderBottom: '1px solid rgba(128,128,128,0.1)', textAlign: 'center' }}>الدرجة</th>
                                <th style={{ padding: '15px', borderBottom: '1px solid rgba(128,128,128,0.1)', textAlign: 'center' }}>إجراء</th>
                            </tr>
                        </thead>
                        <tbody>
                            {academicRecord.length === 0 && <tr><td colSpan={3} style={{ padding: '20px', textAlign: 'center', color: 'var(--txt-mut)' }}>لا توجد امتحانات.</td></tr>}
                            {academicRecord.map((record: any, idx: number) => {
                                const color = record.status === 'not_started' ? 'var(--txt-mut)' : (record.score / record.total) >= 0.85 ? 'var(--success)' : (record.score / record.total) >= 0.5 ? 'var(--warning)' : 'var(--danger)';
                                return (
                                    <tr key={idx} style={{ borderBottom: '1px dashed rgba(128,128,128,0.1)' }}>
                                        <td style={{ padding: '15px', fontWeight: 'bold', color: 'var(--txt)' }}>
                                            {record.title}
                                            <div style={{ color: 'var(--txt-mut)', fontSize: '0.8rem', marginTop: '3px' }}>{record.type} | {record.date}</div>
                                        </td>
                                        <td style={{ padding: '15px', textAlign: 'center', fontWeight: 'bold', color }}>
                                            {record.status === 'not_started' ? 'لم يمتحن' : `${record.score} / ${record.total}`}
                                        </td>
                                        <td style={{ padding: '15px', textAlign: 'center' }}>
                                            <button onClick={() => onResetExam(student.id, record.id)} disabled={record.status === 'not_started'} style={{ background: record.status === 'not_started' ? 'rgba(128,128,128,0.1)' : 'rgba(241, 196, 15, 0.1)', color: record.status === 'not_started' ? 'var(--txt-mut)' : 'var(--warning)', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: record.status === 'not_started' ? 'not-allowed' : 'pointer', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                                <FaSyncAlt /> تصفير
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'subscriptions' && (
                <div style={{ background: 'var(--card)', borderRadius: '20px', border: '1px solid rgba(128,128,128,0.2)', padding: '25px', animation: 'fadeIn 0.3s ease' }}>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--txt)', fontWeight: 900, marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}><FaBookOpen color="var(--p-purple)"/> الكورسات المشتراة</h3>
                    <table style={{ width: '100%', textAlign: 'right', borderCollapse: 'collapse', marginBottom: '30px' }}>
                        <thead>
                            <tr style={{ background: 'rgba(128,128,128,0.05)', color: 'var(--txt-mut)' }}>
                                <th style={{ padding: '15px', borderBottom: '1px solid rgba(128,128,128,0.1)' }}>اسم الكورس</th>
                                <th style={{ padding: '15px', borderBottom: '1px solid rgba(128,128,128,0.1)' }}>المدرس</th>
                                <th style={{ padding: '15px', borderBottom: '1px solid rgba(128,128,128,0.1)', textAlign: 'center' }}>إجراء</th>
                            </tr>
                        </thead>
                        <tbody>
                            {purchasedCourses.length === 0 && <tr><td colSpan={3} style={{ padding: '20px', textAlign: 'center', color: 'var(--txt-mut)' }}>لا توجد كورسات.</td></tr>}
                            {purchasedCourses.map((c: any) => (
                                <tr key={c.id} style={{ borderBottom: '1px dashed rgba(128,128,128,0.1)' }}>
                                    <td style={{ padding: '15px', fontWeight: 'bold', color: 'var(--txt)' }}>{c.title}</td>
                                    <td style={{ padding: '15px', color: 'var(--p-purple)' }}>{c.teacher}</td>
                                    <td style={{ padding: '15px', textAlign: 'center' }}>
                                        <button onClick={() => onRefund(student.id, c.id, 'course', c.price)} style={{ background: 'rgba(231,76,60,0.1)', color: 'var(--danger)', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px', margin: '0 auto' }}>
                                            <FaUndo /> إلغاء واسترداد {c.price} ج.م
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'financial' && (
                <div style={{ background: 'var(--card)', borderRadius: '20px', border: '1px solid rgba(128,128,128,0.2)', padding: '25px', animation: 'fadeIn 0.3s ease', overflowX: 'auto' }}>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--txt)', fontWeight: 900, marginBottom: '20px' }}><FaBarcode color="var(--success)" /> سجل شحن الأكواد</h3>
                    <table style={{ width: '100%', textAlign: 'right', borderCollapse: 'collapse', minWidth: '400px' }}>
                        <thead>
                            <tr style={{ background: 'rgba(128,128,128,0.05)', color: 'var(--txt-mut)' }}>
                                <th style={{ padding: '15px', borderBottom: '1px solid rgba(128,128,128,0.1)' }}>الكود</th>
                                <th style={{ padding: '15px', borderBottom: '1px solid rgba(128,128,128,0.1)' }}>المدرس</th>
                                <th style={{ padding: '15px', borderBottom: '1px solid rgba(128,128,128,0.1)', textAlign: 'center' }}>القيمة</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chargingLogs.length === 0 && <tr><td colSpan={3} style={{ padding: '20px', textAlign: 'center', color: 'var(--txt-mut)' }}>لا يوجد سجل شحن.</td></tr>}
                            {chargingLogs.map((log: any) => (
                                <tr key={log.id} style={{ borderBottom: '1px dashed rgba(128,128,128,0.1)' }}>
                                    <td style={{ padding: '15px', fontFamily: 'monospace', color: 'var(--txt)' }}>{log.code}</td>
                                    <td style={{ padding: '15px', color: 'var(--p-purple)', fontWeight: 'bold' }}>{log.teacherName}</td>
                                    <td style={{ padding: '15px', textAlign: 'center', fontWeight: 'bold', color: 'var(--success)' }}>+{log.amount} ج.م</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'timeline' && (
                <div style={{ background: 'var(--card)', borderRadius: '20px', border: '1px solid rgba(128,128,128,0.2)', padding: '25px', animation: 'fadeIn 0.3s ease' }}>
                    {timeline.length === 0 ? (
                        <div style={{ textAlign: 'center', color: 'var(--txt-mut)', padding: '20px' }}>لا توجد تحركات مسجلة.</div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', paddingRight: '15px', borderRight: '2px solid rgba(128,128,128,0.2)' }}>
                            {timeline.map((act: any, i: number) => (
                                <div key={i} style={{ position: 'relative' }}>
                                    <div style={{ position: 'absolute', right: '-26px', top: '0', width: '20px', height: '20px', background: 'var(--card)', border: `2px solid ${act.type === 'error' ? 'var(--danger)' : act.type === 'refund' ? 'var(--success)' : act.type === 'system' ? '#3498db' : 'var(--p-purple)'}`, borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2 }}>
                                        {renderTimelineIcon(act.type)}
                                    </div>
                                    <div style={{ background: 'rgba(128,128,128,0.05)', border: '1px solid rgba(128,128,128,0.1)', padding: '15px', borderRadius: '10px', marginRight: '15px' }}>
                                        <div style={{ fontWeight: 'bold', color: 'var(--txt)', marginBottom: '5px' }}>{act.text}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--txt-mut)' }}>{act.time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
});