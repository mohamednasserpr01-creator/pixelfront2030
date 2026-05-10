"use client";
import React, { useState } from 'react';
import { FaHistory, FaSearch, FaWhatsapp, FaBell, FaCheckCircle, FaTimesCircle, FaEye, FaTimes, FaChartPie, FaArrowRight, FaRedo, FaSpinner } from 'react-icons/fa';
import Link from 'next/link';

// داتا وهمية قابلة للتعديل عشان الـ Simulation يشتغل
const initialCampaigns = [
    { id: 'CAMP-101', date: '2026-04-20', type: 'whatsapp', target: 'الطلاب المتأخرين عن تسليم الواجب', total: 150, success: 145, fail: 5, status: 'completed' },
    { id: 'CAMP-102', date: '2026-04-18', type: 'in_app', target: 'إشعار عام ببدء المراجعة', total: 1200, success: 1190, fail: 10, status: 'completed' },
    { id: 'CAMP-103', date: '2026-04-15', type: 'whatsapp', target: 'تهنئة المتفوقين في الفيزياء', total: 45, success: 45, fail: 0, status: 'completed' },
];

export default function CampaignsHistoryPage() {
    const [search, setSearch] = useState('');
    const [campaigns, setCampaigns] = useState(initialCampaigns);
    const [selectedCampaign, setSelectedCampaign] = useState<typeof initialCampaigns[0] | null>(null);
    
    // State للتحكم في حالة إعادة الإرسال جوه النافذة
    const [isRetrying, setIsRetrying] = useState(false);

    const filtered = campaigns.filter(c => c.target.includes(search) || c.id.includes(search));

    // 🚀 دالة ذكية لإعادة إرسال الفاشل مباشرة من الأرشيف
    const handleRetryFromArchive = () => {
        if (!selectedCampaign || selectedCampaign.fail === 0) return;
        setIsRetrying(true);

        // محاكاة عملية الإرسال لمدة ثانيتين
        setTimeout(() => {
            const updatedCampaign = {
                ...selectedCampaign,
                success: selectedCampaign.success + selectedCampaign.fail, // نقل الفاشل للناجح
                fail: 0 // تصفير الفاشل
            };

            // تحديث الواجهة والنافذة المفتوحة
            setCampaigns(prev => prev.map(c => c.id === updatedCampaign.id ? updatedCampaign : c));
            setSelectedCampaign(updatedCampaign);
            setIsRetrying(false);
            
        }, 2000);
    };

    return (
        <div style={{ animation: 'fadeIn 0.5s ease', maxWidth: '1200px', margin: '0 auto', padding: '30px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <Link href="/teacher/dashboard">
                        <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--txt)', width: '45px', height: '45px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FaArrowRight />
                        </button>
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', color: 'var(--txt)', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 5px 0' }}>
                            <FaHistory style={{ color: 'var(--p-purple)' }} /> سجل حملات الإشعارات
                        </h1>
                        <p style={{ color: 'var(--txt-mut)', margin: 0 }}>راجع إحصائيات ونتائج جميع الرسائل المرسلة للطلاب وأولياء الأمور.</p>
                    </div>
                </div>
            </div>

            <div style={{ background: 'var(--card)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ position: 'relative', marginBottom: '20px', maxWidth: '400px' }}>
                    <FaSearch style={{ position: 'absolute', right: '15px', top: '15px', color: 'var(--txt-mut)' }} />
                    <input type="text" placeholder="ابحث باسم الحملة..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: '100%', padding: '12px 40px 12px 15px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '10px', outline: 'none' }} />
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', textAlign: 'right', borderCollapse: 'collapse', minWidth: '900px' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--txt-mut)', fontSize: '0.9rem' }}>
                                <th style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>كود وتاريخ الحملة</th>
                                <th style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>الهدف والقناة</th>
                                <th style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>الإحصائيات</th>
                                <th style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>إجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(camp => (
                                <tr key={camp.id} style={{ borderBottom: '1px dashed rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ fontWeight: 'bold', color: 'var(--p-purple)' }}>{camp.id}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--txt-mut)' }}>{camp.date}</div>
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ fontWeight: 'bold', color: 'white', marginBottom: '5px' }}>{camp.target}</div>
                                        <span style={{ fontSize: '0.8rem', background: camp.type === 'whatsapp' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(52, 152, 219, 0.1)', color: camp.type === 'whatsapp' ? '#2ecc71' : '#3498db', padding: '4px 8px', borderRadius: '5px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                            {camp.type === 'whatsapp' ? <FaWhatsapp /> : <FaBell />} {camp.type === 'whatsapp' ? 'واتساب' : 'إشعار داخلي'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '15px', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                            <span title="تم بنجاح" style={{ color: '#2ecc71' }}><FaCheckCircle /> {camp.success}</span>
                                            <span title="فشل الإرسال" style={{ color: '#e74c3c' }}><FaTimesCircle /> {camp.fail}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '15px', textAlign: 'center' }}>
                                        <button onClick={() => setSelectedCampaign(camp)} style={{ background: 'transparent', border: '1px solid var(--p-purple)', color: 'var(--p-purple)', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '5px', transition: '0.2s' }}>
                                            <FaEye /> عرض التقرير
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && <tr><td colSpan={4} style={{ textAlign: 'center', padding: '30px', color: 'var(--txt-mut)' }}>لا توجد حملات مطابقة.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 🚀 النافذة المنبثقة (Modal) */}
            {selectedCampaign && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)', padding: '20px' }}>
                    <div style={{ background: 'var(--bg)', border: '1px solid rgba(255,255,255,0.1)', width: '100%', maxWidth: '600px', borderRadius: '15px', overflow: 'hidden', animation: 'fadeIn 0.3s ease', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                        
                        <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)' }}>
                            <h3 style={{ margin: 0, color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <FaChartPie color="var(--p-purple)" /> تقرير حملة ({selectedCampaign.id})
                            </h3>
                            <button onClick={() => !isRetrying && setSelectedCampaign(null)} disabled={isRetrying} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--txt-mut)', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FaTimes />
                            </button>
                        </div>

                        <div style={{ padding: '30px' }}>
                            <h4 style={{ color: 'var(--txt-mut)', margin: '0 0 5px 0' }}>الهدف المرسل إليه:</h4>
                            <div style={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '25px' }}>{selectedCampaign.target}</div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '25px' }}>
                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                                    <div style={{ color: 'var(--txt-mut)', fontSize: '0.9rem', marginBottom: '5px' }}>الإجمالي</div>
                                    <div style={{ color: 'white', fontSize: '1.8rem', fontWeight: 'bold' }}>{selectedCampaign.total}</div>
                                </div>
                                <div style={{ background: 'rgba(46, 204, 113, 0.1)', padding: '20px', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(46, 204, 113, 0.3)' }}>
                                    <div style={{ color: '#2ecc71', fontSize: '0.9rem', marginBottom: '5px' }}>الناجح</div>
                                    <div style={{ color: '#2ecc71', fontSize: '1.8rem', fontWeight: 'bold' }}>{selectedCampaign.success}</div>
                                </div>
                                <div style={{ background: 'rgba(231, 76, 60, 0.1)', padding: '20px', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(231, 76, 60, 0.3)' }}>
                                    <div style={{ color: '#e74c3c', fontSize: '0.9rem', marginBottom: '5px' }}>الفاشل</div>
                                    <div style={{ color: '#e74c3c', fontSize: '1.8rem', fontWeight: 'bold' }}>{selectedCampaign.fail}</div>
                                </div>
                            </div>

                            {/* 🚀 مساحة الأكشن الذكية */}
                            {selectedCampaign.fail > 0 ? (
                                <div style={{ background: 'rgba(241, 196, 15, 0.1)', border: '1px dashed rgba(241, 196, 15, 0.5)', padding: '15px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ color: '#f1c40f', fontSize: '0.9rem', fontWeight: 'bold' }}>⚠️ يوجد {selectedCampaign.fail} رسائل فاشلة.</div>
                                    <button onClick={handleRetryFromArchive} disabled={isRetrying} style={{ background: '#f1c40f', color: '#1a1a2e', border: 'none', padding: '8px 15px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {isRetrying ? <><FaSpinner style={{ animation: 'spin 1s linear infinite' }} /> جاري الإرسال...</> : <><FaRedo /> إعادة الإرسال</>}
                                    </button>
                                </div>
                            ) : (
                                <div style={{ background: 'rgba(46, 204, 113, 0.1)', border: '1px dashed rgba(46, 204, 113, 0.5)', padding: '15px', borderRadius: '10px', color: '#2ecc71', textAlign: 'center', fontWeight: 'bold' }}>
                                    🎉 اكتملت هذه الحملة بنجاح بنسبة 100%.
                                </div>
                            )}
                        </div>
                        
                        <div style={{ padding: '15px 20px', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'left' }}>
                            <button onClick={() => !isRetrying && setSelectedCampaign(null)} disabled={isRetrying} style={{ background: 'var(--p-purple)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: isRetrying ? 'not-allowed' : 'pointer', opacity: isRetrying ? 0.5 : 1 }}>
                                إغلاق التقرير
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* إضافة كلاس للـ Spin لو مش موجود في المشروع عندك */}
            <style jsx>{`
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}