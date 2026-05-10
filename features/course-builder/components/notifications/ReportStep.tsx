"use client";
import React, { useState } from 'react';
import { FaChartPie, FaRedo, FaPlus, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { CampaignState } from '../NotificationsTab';
import { Log } from './EngineStep';

interface Props {
    data: CampaignState;
    setData?: React.Dispatch<React.SetStateAction<CampaignState>>;
    logs: Log[];
    setLogs?: React.Dispatch<React.SetStateAction<Log[]>>;
    onRetry: () => void;
    onNewCampaign: () => void;
}

export default function ReportStep({ data, setData, logs, setLogs, onRetry, onNewCampaign }: Props) {
    const [reportTab, setReportTab] = useState<'success' | 'fail'>('fail');

    const successfulLogs = logs.filter(l => l.status === 'success');
    const failedLogs = logs.filter(l => l.status === 'fail');

    const handleRetryFailed = () => {
        if (failedLogs.length === 0) return;
        if (setData && setLogs) {
            setData(prev => ({ ...prev, targetCount: failedLogs.length }));
            setLogs([]); 
        }
        onRetry(); 
    };

    return (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <FaChartPie size={50} color="var(--p-purple)" style={{ marginBottom: '15px' }} />
                <h2 style={{ color: 'white', margin: '0 0 10px 0' }}>اكتملت حملة الإرسال</h2>
                <p style={{ color: 'var(--txt-mut)' }}>إليك ملخص تفصيلي لما تم في هذه الحملة عبر ({data.channel === 'whatsapp' ? 'واتساب' : 'إشعار داخلي'}).</p>
            </div>

            <div style={s.grid3}>
                <div style={{ ...s.statCard, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ color: 'var(--txt-mut)', marginBottom: '5px', fontWeight: 'bold' }}>إجمالي المستهدفين</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>{data.targetCount}</div>
                </div>
                <div style={{ ...s.statCard, background: 'rgba(46, 204, 113, 0.1)', border: '1px solid rgba(46, 204, 113, 0.3)' }}>
                    <div style={{ color: '#2ecc71', marginBottom: '5px', fontWeight: 'bold' }}>تم بنجاح</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2ecc71' }}>{successfulLogs.length}</div>
                </div>
                <div style={{ ...s.statCard, background: 'rgba(231, 76, 60, 0.1)', border: '1px solid rgba(231, 76, 60, 0.3)' }}>
                    <div style={{ color: '#e74c3c', marginBottom: '5px', fontWeight: 'bold' }}>فشل الإرسال</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#e74c3c' }}>{failedLogs.length}</div>
                </div>
            </div>

            <div style={s.card}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                    <button onClick={() => setReportTab('fail')} style={{ ...s.tabBtn, background: reportTab === 'fail' ? 'rgba(231, 76, 60, 0.2)' : 'transparent', color: reportTab === 'fail' ? '#e74c3c' : 'var(--txt-mut)' }}>
                        <FaTimesCircle /> الفاشل ({failedLogs.length})
                    </button>
                    <button onClick={() => setReportTab('success')} style={{ ...s.tabBtn, background: reportTab === 'success' ? 'rgba(46, 204, 113, 0.2)' : 'transparent', color: reportTab === 'success' ? '#2ecc71' : 'var(--txt-mut)' }}>
                        <FaCheckCircle /> الناجح ({successfulLogs.length})
                    </button>
                </div>

                <div style={{ maxHeight: '350px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '5px' }}>
                    {reportTab === 'fail' && failedLogs.length === 0 && (
                        <div style={{ textAlign: 'center', color: '#2ecc71', padding: '30px', fontWeight: 'bold' }}>🎉 ممتاز! لا توجد رسائل فاشلة في هذه الحملة.</div>
                    )}
                    {reportTab === 'success' && successfulLogs.length === 0 && (
                        <div style={{ textAlign: 'center', color: 'var(--txt-mut)', padding: '30px' }}>لم تنجح أي رسالة حتى الآن.</div>
                    )}
                    
                    {(reportTab === 'fail' ? failedLogs : successfulLogs).map(log => (
                        <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '8px', borderLeft: `4px solid ${reportTab === 'fail' ? '#e74c3c' : '#2ecc71'}`, flexWrap: 'wrap', gap: '10px' }}>
                            <div>
                                <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.95rem' }}>{log.name}</div>
                                <div style={{ color: 'var(--txt-mut)', fontSize: '0.85rem', marginTop: '3px' }}>{log.phone}</div>
                            </div>
                            {/* 🚀 إظهار سبب الفشل بشكل واضح جداً مع نص بديل احتياطي */}
                            {reportTab === 'fail' && (
                                <div style={{ background: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c', padding: '8px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold', border: '1px dashed rgba(231, 76, 60, 0.3)' }}>
                                    ⚠️ {log.reason || 'تعذر الإرسال بسبب خطأ غير معروف.'}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
                <button onClick={onNewCampaign} style={s.btnOutline}><FaPlus /> حملة جديدة</button>
                <button onClick={handleRetryFailed} disabled={failedLogs.length === 0} style={{ ...s.btnPrimary, background: '#f1c40f', color: '#1a1a2e', opacity: failedLogs.length === 0 ? 0.5 : 1 }}>
                    <FaRedo /> إعادة إرسال للفاشل ({failedLogs.length})
                </button>
            </div>
        </div>
    );
}

const s: { [key: string]: React.CSSProperties } = {
    grid3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px' },
    statCard: { background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', textAlign: 'center' },
    card: { background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' },
    tabBtn: { border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', transition: '0.2s' },
    btnPrimary: { border: 'none', padding: '12px 30px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '10px', transition: '0.2s' },
    btnOutline: { background: 'transparent', color: 'var(--txt)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 30px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', transition: '0.2s' }
};