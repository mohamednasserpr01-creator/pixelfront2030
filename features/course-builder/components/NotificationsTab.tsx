"use client";
import React, { useState } from 'react';
import Link from 'next/link'; // 🚀 استدعاء اللينك للذهاب للأرشيف
import { FaPaperPlane, FaCheckCircle, FaHistory } from 'react-icons/fa';
import { Lecture } from '../types/curriculum.types';

import TargetingStep from './notifications/TargetingStep';
import MessageStep from './notifications/MessageStep';
import EngineStep from './notifications/EngineStep';
import ReportStep from './notifications/ReportStep';

interface Props { curriculum: Lecture[]; }

export interface CampaignState {
    channel: 'whatsapp' | 'in_app';
    whatsappNumber: string;
    delaySeconds: number; 
    audience: 'students' | 'parents' | 'both';
    condition: 'missed_exam' | 'score_below_50' | 'score_above_50' | 'missed_lesson' | 'absent_3_days' | 'custom';
    selectedLectureId: string;
    selectedItemId: string;
    targetCount: number;
    message: string;
    sendType: 'now' | 'schedule';
    scheduleDate: string;
}

export const NotificationsTab: React.FC<Props> = ({ curriculum }) => {
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
    
    const [campaignData, setCampaignData] = useState<CampaignState>({
        channel: 'whatsapp',
        whatsappNumber: '',
        delaySeconds: 5, 
        audience: 'parents',
        condition: 'missed_exam',
        selectedLectureId: '',
        selectedItemId: '',
        targetCount: 0,
        message: '',
        sendType: 'now',
        scheduleDate: ''
    });

    const [logs, setLogs] = useState<any[]>([]);

    return (
        <div style={{ animation: 'fadeIn 0.3s ease', padding: '20px', background: 'var(--bg)', borderRadius: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                <h2 style={{ margin: 0, color: 'var(--txt)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaPaperPlane color="var(--p-purple)" /> محرك الإشعارات الذكي
                </h2>
                
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {/* 🚀 الزرار اللي بياخدك لسجل الحملات */}
                    <Link href="/teacher/campaigns" style={{ textDecoration: 'none' }}>
                        <button style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--txt)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 15px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                            <FaHistory /> سجل الحملات السابقة
                        </button>
                    </Link>
                    
                    <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.1)', margin: '0 10px' }}></div>

                    {[ { id: 1, name: 'الاستهداف' }, { id: 2, name: 'الرسالة' }, { id: 3, name: 'المحرك' }, { id: 4, name: 'التقرير' } ].map(s => (
                        <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: step === s.id ? 'var(--p-purple)' : step > s.id ? '#2ecc71' : 'var(--txt-mut)', fontWeight: 'bold' }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: step === s.id ? 'var(--p-purple)' : step > s.id ? '#2ecc71' : 'var(--card)', border: `2px solid ${step === s.id ? 'var(--p-purple)' : step > s.id ? '#2ecc71' : 'var(--txt-mut)'}`, color: step === s.id || step > s.id ? 'white' : 'var(--txt-mut)', fontSize: '0.85rem' }}>
                                {step > s.id ? <FaCheckCircle /> : s.id}
                            </div>
                            <span style={{ fontSize: '0.9rem' }}>{s.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {step === 1 && <TargetingStep data={campaignData} setData={setCampaignData} curriculum={curriculum} onNext={() => setStep(2)} />}
            {step === 2 && <MessageStep data={campaignData} setData={setCampaignData} onNext={() => setStep(3)} onPrev={() => setStep(1)} />}
            {step === 3 && <EngineStep data={campaignData} logs={logs} setLogs={setLogs} onFinish={() => setStep(4)} onPrev={() => setStep(2)} />}
            {step === 4 && <ReportStep data={campaignData} setData={setCampaignData} logs={logs} setLogs={setLogs} onRetry={() => setStep(3)} onNewCampaign={() => { setCampaignData({ ...campaignData, message: '', targetCount: 0 }); setLogs([]); setStep(1); }} />}
        </div>
    );
};