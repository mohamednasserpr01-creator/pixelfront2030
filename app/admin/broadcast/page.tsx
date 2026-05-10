"use client";
import React, { useState, useEffect } from 'react';
import { FaBullhorn, FaHistory, FaPaperPlane, FaSearch, FaWhatsapp, FaBell, FaCheckCircle, FaTimesCircle, FaChartPie, FaUsers, FaMagic } from 'react-icons/fa';
import { useToast } from '../../../context/ToastContext';

// Components
import TargetingStep from './components/TargetingStep';
import MessageStep from './components/MessageStep';
import EngineStep from './components/EngineStep';
import ReportStep from './components/ReportStep';

// 💡 استدعاء المخزن السحري!
import { useBroadcastStore } from '../../../features/broadcast/store/useBroadcastStore';

// داتا وهمية لسجل الحملات السابقة (لحد ما نربط بالباك إند)
const MOCK_HISTORY = [
    { id: 'CAMP-9021', date: '2026-04-25 10:00 ص', type: 'whatsapp', target: 'طلاب الصف الثالث الثانوي', success: 120, fail: 5, status: 'completed' },
    { id: 'CAMP-9020', date: '2026-04-20 05:30 م', type: 'in_app', target: 'إشعار عام', success: 450, fail: 0, status: 'completed' },
];

export default function BroadcastAdminPage() {
    const { showToast } = useToast();
    const [mounted, setMounted] = useState(false);
    const [activeMainTab, setActiveMainTab] = useState<'new' | 'history'>('new');
    const [historySearch, setHistorySearch] = useState('');

    // 🚀 سحب الخطوة الحالية ودوال التحكم من الـ Store بدل زحمة الـ useState
    const step = useBroadcastStore(state => state.step);
    const setStep = useBroadcastStore(state => state.setStep);
    const resetCampaign = useBroadcastStore(state => state.resetCampaign);

    useEffect(() => { setMounted(true); }, []);
    if (!mounted) return null;

    const filteredHistory = MOCK_HISTORY.filter(h => h.id.includes(historySearch) || h.target.includes(historySearch));

    return (
        <div style={{ animation: 'fadeIn 0.4s ease', maxWidth: '1200px', margin: '0 auto', padding: '20px', paddingBottom: '50px' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', margin: '0 0 5px 0', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaBullhorn color="#e67e22" /> مركز الإشعارات والحملات
                    </h1>
                    <p style={{ color: 'var(--txt-mut)', margin: 0 }}>إدارة الإرسال الجماعي لرسائل الواتساب وإشعارات المنصة.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px', background: 'rgba(0,0,0,0.2)', padding: '5px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <button onClick={() => { setActiveMainTab('new'); resetCampaign(); }} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s', background: activeMainTab === 'new' ? '#e67e22' : 'transparent', color: activeMainTab === 'new' ? 'white' : 'var(--txt-mut)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaPaperPlane /> حملة جديدة
                    </button>
                    <button onClick={() => setActiveMainTab('history')} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s', background: activeMainTab === 'history' ? 'var(--p-purple)' : 'transparent', color: activeMainTab === 'history' ? 'white' : 'var(--txt-mut)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaHistory /> سجل الحملات
                    </button>
                </div>
            </div>

            {/* History Tab */}
            {activeMainTab === 'history' && (
                <div style={{ animation: 'fadeIn 0.3s ease' }}>
                    <div style={{ background: 'var(--card)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '20px' }}>
                        <div style={{ position: 'relative', maxWidth: '400px' }}>
                            <FaSearch style={{ position: 'absolute', right: '15px', top: '14px', color: 'var(--txt-mut)' }} />
                            <input type="text" placeholder="ابحث برقم أو اسم الحملة..." value={historySearch} onChange={e => setHistorySearch(e.target.value)} style={{ width: '100%', padding: '12px 40px 12px 15px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }} />
                        </div>
                    </div>
                    <div style={{ background: 'var(--card)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', overflowX: 'auto' }}>
                        <table style={{ width: '100%', minWidth: '900px', borderCollapse: 'collapse', textAlign: 'right', color: 'white' }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'var(--txt-mut)' }}>
                                    <th style={{ padding: '15px' }}>الكود والتاريخ</th>
                                    <th style={{ padding: '15px' }}>الاستهداف والقناة</th>
                                    <th style={{ padding: '15px', textAlign: 'center' }}>النجاح</th>
                                    <th style={{ padding: '15px', textAlign: 'center' }}>الفشل</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredHistory.map(camp => (
                                    <tr key={camp.id} style={{ borderBottom: '1px dashed rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '15px' }}>
                                            <div style={{ fontWeight: 'bold', color: 'white' }}>{camp.id}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--txt-mut)', direction: 'ltr', textAlign: 'right' }}>{camp.date}</div>
                                        </td>
                                        <td style={{ padding: '15px' }}>
                                            <div style={{ fontWeight: 'bold', color: 'var(--txt)', marginBottom: '5px' }}>{camp.target}</div>
                                            <span style={{ fontSize: '0.8rem', background: camp.type === 'whatsapp' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(52, 152, 219, 0.1)', color: camp.type === 'whatsapp' ? '#2ecc71' : '#3498db', padding: '4px 8px', borderRadius: '5px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                                {camp.type === 'whatsapp' ? <FaWhatsapp /> : <FaBell />} {camp.type === 'whatsapp' ? 'واتساب' : 'إشعار داخلي'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '15px', textAlign: 'center', color: '#2ecc71', fontWeight: 'bold' }}>{camp.success.toLocaleString()}</td>
                                        <td style={{ padding: '15px', textAlign: 'center', color: '#e74c3c', fontWeight: 'bold' }}>{camp.fail.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* New Campaign Tab */}
            {activeMainTab === 'new' && (
                <div style={{ animation: 'fadeIn 0.3s ease' }}>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', background: 'var(--card)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap' }}>
                        {[ { s: 1, label: 'الاستهداف', icon: <FaUsers/> }, { s: 2, label: 'الرسالة', icon: <FaMagic/> }, { s: 3, label: 'الإرسال', icon: <FaPaperPlane/> }, { s: 4, label: 'التقرير', icon: <FaChartPie/> } ].map(item => (
                            <div key={item.s} style={{ flex: 1, textAlign: 'center' }}>
                                <div style={{ width: '45px', height: '45px', margin: '0 auto 10px', borderRadius: '50%', background: step === item.s ? '#e67e22' : (step > item.s ? '#2ecc71' : 'rgba(255,255,255,0.05)'), color: step >= item.s ? 'white' : 'var(--txt-mut)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold', border: `2px solid ${step === item.s ? '#e67e22' : (step > item.s ? '#2ecc71' : 'rgba(255,255,255,0.1)')}`, transition: '0.3s' }}>
                                    {step > item.s ? <FaCheckCircle /> : item.icon}
                                </div>
                                <div style={{ color: step >= item.s ? 'white' : 'var(--txt-mut)', fontWeight: 'bold', fontSize: '0.9rem' }}>{item.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* 🚀 السحر هنا: ولا Component بياخد Props، كلهم بيكلموا المخزن! */}
                    {step === 1 && <TargetingStep />}
                    {step === 2 && <MessageStep />}
                    {step === 3 && <EngineStep />}
                    {step === 4 && <ReportStep />}
                </div>
            )}
        </div>
    );
}