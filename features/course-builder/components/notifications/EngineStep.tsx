"use client";
import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';
import { CampaignState } from '../NotificationsTab';
// 💡 استدعاء הـ API الحقيقي (بالمسار المختصر)
import { broadcastApi } from '@/lib/api/endpoints/broadcast';

export interface Log { id: string; name: string; phone: string; status: 'success' | 'fail'; reason?: string; }

interface Props {
    data: CampaignState;
    logs: Log[];
    setLogs: React.Dispatch<React.SetStateAction<Log[]>>;
    onFinish: () => void;
    onPrev: () => void;
}

export default function EngineStep({ data, logs, setLogs, onFinish, onPrev }: Props) {
    const [isSending, setIsSending] = useState(false);
    const [campaignId, setCampaignId] = useState<string | null>(null);
    const [progress, setProgress] = useState(logs.length); 

    // 🚀 استخدام useRef عشان نمسك العداد جوه الـ Interval بأمان
    const progressRef = useRef(progress);
    useEffect(() => { progressRef.current = progress; }, [progress]);

    // 🚀 دالة البدء اللي بتكلم الـ API الحقيقي
    const startEngine = async () => {
        setIsSending(true);
        if (!campaignId) {
            const payload = {
                message: data.message,
                target: { condition: data.condition },
                type: data.channel === 'whatsapp' ? 'whatsapp' : 'in_app'
            };
            // 💡 أضفنا : any هنا عشان التايب سكريبت ميعترضش
            const res: any = await broadcastApi.sendCampaign(payload as any);
            setCampaignId(res.campaignId);
        }
    };

    const stopEngine = () => setIsSending(false);

    // 🚀 نظام الـ Polling لسؤال السيرفر عن حالة الإرسال
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isSending && campaignId) {
            interval = setInterval(async () => {
                if (progressRef.current >= data.targetCount) {
                    setIsSending(false);
                    clearInterval(interval);
                    setTimeout(() => onFinish(), 1000);
                    return;
                }

                // 💡 أضفنا : any هنا برضه
                const res: any = await broadcastApi.getCampaignStatus(campaignId, progressRef.current, data.targetCount);
                
                setProgress(res.progress);
                setLogs(prev => {
                    const newFormattedLogs = res.logs.map((l: any) => ({
                        id: l.id,
                        name: 'طالب الكورس',
                        phone: l.phone,
                        status: l.status,
                        reason: l.reason
                    }));
                    return [...newFormattedLogs, ...prev];
                });

                if (res.progress >= data.targetCount) {
                    setIsSending(false);
                    clearInterval(interval);
                    setTimeout(() => onFinish(), 1000);
                }
            }, 2000); // Polling every 2 seconds
        }

        return () => clearInterval(interval);
    }, [isSending, campaignId, data.targetCount, onFinish, setLogs]);

    const percentage = data.targetCount > 0 ? Math.round((progress / data.targetCount) * 100) : 0;

    return (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ ...s.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h3 style={{ margin: '0 0 5px 0', color: 'var(--txt)' }}>العدد المستهدف: <span style={{ color: '#3498db' }}>{data.targetCount}</span></h3>
                    <p style={{ margin: 0, color: 'var(--txt-mut)' }}>{data.channel === 'whatsapp' ? `السرعة: رسالة كل ${data.delaySeconds} ثانية.` : 'جاهز للإرسال السريع عبر الـ API.'}</p>
                </div>
                
                {!isSending && progress === 0 && (
                    <button onClick={startEngine} style={{ ...s.btnPrimary, background: '#2ecc71' }}><FaPlay /> بدء الإرسال</button>
                )}
                {isSending && progress < data.targetCount && (
                    <button onClick={stopEngine} style={{ ...s.btnPrimary, background: '#e74c3c' }}><FaPause /> إيقاف مؤقت</button>
                )}
                {!isSending && progress > 0 && progress < data.targetCount && (
                    <button onClick={startEngine} style={{ ...s.btnPrimary, background: '#f1c40f', color: '#1a1a2e' }}><FaPlay /> استكمال الإرسال</button>
                )}
            </div>

            <div style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--txt)', marginBottom: '8px', fontWeight: 'bold' }}>
                    <span>تقدم الإرسال:</span>
                    <span>{percentage}% ({progress} من {data.targetCount})</span>
                </div>
                <div style={{ width: '100%', height: '18px', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ width: `${percentage}%`, height: '100%', background: 'linear-gradient(90deg, var(--p-purple), #2ecc71)', transition: '0.2s ease-out' }}></div>
                </div>
            </div>

            <div style={{ background: '#0f172a', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', height: '350px' }}>
                <div style={{ padding: '15px 20px', background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'white', fontWeight: 'bold' }}>
                    سجل العمليات المباشر (Backend Logs)
                </div>
                <div style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {logs.length === 0 ? (
                        <div style={{ color: 'var(--txt-mut)', textAlign: 'center', marginTop: '80px' }}>في انتظار بدء الإرسال لبدء جلب السجلات من السيرفر...</div>
                    ) : (
                        logs.slice(0, 50).map((log: any, idx: number) => (
                            <div key={log.id || idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', borderLeft: `3px solid ${log.status === 'success' ? '#2ecc71' : '#e74c3c'}` }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white' }}>
                                    {log.status === 'success' ? <FaCheckCircle color="#2ecc71" /> : <FaExclamationTriangle color="#e74c3c" />}
                                    <span style={{ fontWeight: 'bold' }}>{log.phone}</span>
                                </div>
                                <div style={{ fontSize: '0.85rem', color: log.status === 'success' ? '#2ecc71' : '#e74c3c' }}>{log.status === 'success' ? 'نجاح' : log.reason}</div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '20px' }}>
                <button onClick={() => { stopEngine(); onPrev(); }} style={s.btnOutline}>➡️ إيقاف والرجوع للتعديل</button>
            </div>
        </div>
    );
}

const s = {
    card: { background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' },
    btnPrimary: { border: 'none', padding: '12px 25px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '10px', color: 'white', transition: '0.2s' },
    btnOutline: { background: 'transparent', color: 'var(--txt)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' }
};