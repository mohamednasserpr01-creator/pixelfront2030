"use client";
import React from 'react';
import { FaPaperPlane, FaPlay, FaPause, FaCheckCircle, FaExclamationTriangle, FaTimes, FaWhatsapp } from 'react-icons/fa';
import { Button } from '../../../../components/ui/Button'; // تأكد من مسار الزرار حسب مشروعك

// 💡 1. بنستدعي المخزن
import { useBroadcastStore } from '../../../../features/broadcast/store/useBroadcastStore';
// 💡 2. بنستدعي المايسترو (Custom Hook) اللي عملناه
import { useBroadcastEngine } from '../../../../features/broadcast/hooks/useBroadcastEngine';

export default function EngineStep() {
    // 💡 بنسحب الداتا اللي هنعرضها من المخزن
    const { targetCount, msgType, delaySeconds, logs = [], setStep } = useBroadcastStore();

    // 💡 بنسحب الأكشنز والـ Logic من الـ Hook النظيف بتاعنا
    // وبنمررله دالة بتنقله لخطوة التقرير لما يخلص
    const { isSending, progress, startEngine, stopEngine, resetEngine } = useBroadcastEngine(() => setStep(4));

    const percentage = targetCount > 0 ? Math.round((progress / targetCount) * 100) : 0;

    return (
        <div style={{ background: 'var(--card)', padding: '30px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', animation: 'fadeIn 0.3s ease' }}>
            <h2 style={{ marginBottom: '25px', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaPaperPlane color="#2ecc71" /> غرفة الإرسال والمراقبة
            </h2>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '25px', borderRadius: '15px', marginBottom: '30px', border: '1px solid rgba(255,255,255,0.02)', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <div style={{ color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '1.1rem' }}>حالة الإرسال الجماعي</div>
                    <div style={{ color: isSending ? '#f1c40f' : (progress >= targetCount ? '#2ecc71' : 'white'), fontWeight: '900', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {isSending ? <FaPlay /> : (progress >= targetCount ? <FaCheckCircle /> : <FaPause />)}
                        {isSending ? 'جاري ضخ الرسائل...' : (progress >= targetCount ? 'اكتمل الإرسال بنجاح' : 'متوقف ومستعد للإرسال')}
                    </div>
                    {msgType === 'whatsapp' && (
                        <div style={{ fontSize: '0.85rem', color: '#2ecc71', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <FaWhatsapp /> سرعة الإرسال المبرمجة: رسالة كل {delaySeconds} ثانية.
                        </div>
                    )}
                </div>
                <div style={{ textAlign: 'left' }}>
                    <div style={{ color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '1.1rem' }}>إجمالي المستهدف</div>
                    <div style={{ color: '#3498db', fontWeight: '900', fontSize: '2rem' }}>{targetCount.toLocaleString()}</div>
                </div>
            </div>

            {/* Progress Bar */}
            <div style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--txt-mut)', marginBottom: '10px', fontWeight: 'bold', fontSize: '1.1rem' }}>
                    <span>تقدم الإرسال:</span>
                    <span style={{ color: '#2ecc71' }}>{progress.toLocaleString()} / {targetCount.toLocaleString()} ( {percentage}% )</span>
                </div>
                <div style={{ width: '100%', height: '25px', background: 'rgba(0,0,0,0.4)', borderRadius: '15px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
                    <div style={{ width: `${percentage}%`, height: '100%', background: 'linear-gradient(90deg, var(--p-purple), #2ecc71)', transition: 'width 0.5s ease', position: 'relative', overflow: 'hidden' }}>
                        {isSending && <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)', animation: 'skeleton-loading 1.5s infinite linear' }}></div>}
                    </div>
                </div>
            </div>

            {/* Controls (بدون Logic، مجرد مناداة للـ Hook) */}
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '30px', flexWrap: 'wrap' }}>
                {!isSending && progress < targetCount && (
                    <button onClick={startEngine} style={{ background: '#2ecc71', color: 'white', border: 'none', padding: '15px 40px', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 5px 15px rgba(46, 204, 113, 0.4)' }}>
                        <FaPlay /> {progress === 0 ? 'بدء الإرسال فوراً' : 'استكمال الإرسال'}
                    </button>
                )}
                {isSending && (
                    <button onClick={stopEngine} style={{ background: '#f1c40f', color: '#000', border: 'none', padding: '15px 40px', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 5px 15px rgba(241, 196, 15, 0.4)' }}>
                        <FaPause /> إيقاف الإرسال مؤقتاً
                    </button>
                )}
                {progress < targetCount && (
                    <button onClick={resetEngine} style={{ background: 'transparent', color: '#e74c3c', border: '1px solid #e74c3c', padding: '15px 30px', borderRadius: '10px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaTimes /> إلغاء وتصفير
                    </button>
                )}
            </div>

            {/* Live Logs */}
            <div style={{ background: '#111', borderRadius: '15px', padding: '20px', border: '1px solid rgba(255,255,255,0.05)', height: '250px', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                    <h4 style={{ margin: 0, color: 'var(--txt-mut)', fontSize: '0.9rem' }}>سجل العمليات (Backend Logs)</h4>
                    <span style={{ fontSize: '0.8rem', color: '#3498db' }}>{isSending ? 'جاري الاستقبال...' : 'متوقف'}</span>
                </div>

                {logs.length === 0 ? (
                    <div style={{ color: 'var(--txt-mut)', textAlign: 'center', opacity: 0.5, marginTop: '60px' }}>في انتظار بدء الإرسال لبدء جلب السجلات من السيرفر...</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {logs.slice(0, 50).map((log: any, idx: number) => (
                            <div key={log.id || idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '12px 15px', borderRadius: '8px', borderLeft: `3px solid ${log.status === 'success' ? '#2ecc71' : '#e74c3c'}` }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white' }}>
                                    {log.status === 'success' ? <FaCheckCircle color="#2ecc71" /> : <FaExclamationTriangle color="#e74c3c" />}
                                    <span>إرسال إلى <strong>{log.name}</strong> <span style={{ color: 'var(--txt-mut)', fontSize: '0.85rem', fontFamily: 'monospace' }}>({log.phone})</span></span>
                                </div>
                                <div style={{ color: log.status === 'success' ? '#2ecc71' : '#e74c3c', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                    {log.status === 'success' ? 'نجاح' : `فشل: ${log.reason}`}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
                <Button variant="outline" onClick={() => { stopEngine(); setStep(2); }}>السابق: تعديل الرسالة</Button>
                {progress >= targetCount && targetCount > 0 && (
                    <Button variant="primary" onClick={() => setStep(4)} style={{ background: 'var(--p-purple)', border: 'none' }}>الذهاب للتقرير النهائي 📊</Button>
                )}
            </div>
            <style jsx>{`@keyframes skeleton-loading { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }`}</style>
        </div>
    );
}