"use client";
import React, { useEffect, useMemo } from 'react';
import { FaWhatsapp, FaBell, FaCog, FaUsers, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import { Lecture, LectureItem } from '../../types/curriculum.types';
import { CampaignState } from '../NotificationsTab';

interface Props {
    data: CampaignState;
    setData: React.Dispatch<React.SetStateAction<CampaignState>>;
    curriculum: Lecture[];
    onNext: () => void;
}

export default function TargetingStep({ data, setData, curriculum, onNext }: Props) {
    
    const isValidPhone = /^01[0125][0-9]{8}$/.test(data.whatsappNumber);

    const availableItems = useMemo(() => {
        const lec = curriculum.find(l => l.id === data.selectedLectureId);
        if (!lec) return [];
        if (['missed_exam', 'score_below_50', 'score_above_50'].includes(data.condition)) {
            return lec.items.filter((i: LectureItem) => ['exam', 'homework', 'makeup_exam'].includes(i.type));
        }
        if (data.condition === 'missed_lesson') {
            return lec.items.filter((i: LectureItem) => ['lesson', 'homework_lesson'].includes(i.type));
        }
        return lec.items;
    }, [curriculum, data.selectedLectureId, data.condition]);

    useEffect(() => {
        const isGeneralFilter = ['custom', 'absent_3_days'].includes(data.condition);
        const isSpecificFilterComplete = !isGeneralFilter && data.selectedItemId !== '';

        if ((isGeneralFilter || isSpecificFilterComplete) && data.targetCount === 0) {
            const mockCount = Math.floor(Math.random() * 150) + 20;
            setData(prev => ({ ...prev, targetCount: mockCount }));
        } else if (!isGeneralFilter && data.selectedItemId === '') {
            setData(prev => ({ ...prev, targetCount: 0 }));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.condition, data.selectedItemId, data.audience]);

    const isStep1Valid = data.channel === 'whatsapp' 
        ? isValidPhone && data.targetCount > 0 && data.delaySeconds > 0
        : data.targetCount > 0;

    return (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={s.grid2}>
                
                <div style={s.card}>
                    <h3 style={s.cardTitle}><FaCog color="#f1c40f" /> إعدادات الإرسال</h3>
                    
                    <label style={s.label}>قناة الإرسال:</label>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                        <button onClick={() => setData({ ...data, channel: 'whatsapp' })} style={{ ...s.btn, flex: 1, border: `1px solid ${data.channel === 'whatsapp' ? '#2ecc71' : 'rgba(255,255,255,0.1)'}`, background: data.channel === 'whatsapp' ? 'rgba(46, 204, 113, 0.1)' : 'transparent', color: data.channel === 'whatsapp' ? '#2ecc71' : 'var(--txt)' }}>
                            <FaWhatsapp size={20} /> واتساب
                        </button>
                        <button onClick={() => setData({ ...data, channel: 'in_app' })} style={{ ...s.btn, flex: 1, border: `1px solid ${data.channel === 'in_app' ? '#3498db' : 'rgba(255,255,255,0.1)'}`, background: data.channel === 'in_app' ? 'rgba(52, 152, 219, 0.1)' : 'transparent', color: data.channel === 'in_app' ? '#3498db' : 'var(--txt)' }}>
                            <FaBell size={20} /> إشعار داخلي
                        </button>
                    </div>

                    {data.channel === 'whatsapp' && (
                        <div style={{ animation: 'fadeIn 0.3s ease' }}>
                            <label style={s.label}>رقم الواتساب المُرسل منه:</label>
                            <div style={{ position: 'relative', marginBottom: '15px' }}>
                                <input type="text" value={data.whatsappNumber} onChange={(e) => setData({ ...data, whatsappNumber: e.target.value })} placeholder="مثال: 01012345678" style={{ ...s.input, borderColor: data.whatsappNumber ? (isValidPhone ? '#2ecc71' : '#e74c3c') : 'rgba(255,255,255,0.1)', marginBottom: 0 }} maxLength={11} />
                                {data.whatsappNumber && (
                                    <div style={{ position: 'absolute', left: '15px', top: '12px' }}>
                                        {isValidPhone ? <FaCheckCircle color="#2ecc71" size={18} /> : <FaTimesCircle color="#e74c3c" size={18} />}
                                    </div>
                                )}
                            </div>
                            
                            <label style={s.label}><FaClock/> الفاصل الزمني بين كل رسالة (بالثواني):</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input type="number" value={data.delaySeconds} onChange={(e) => setData({ ...data, delaySeconds: Number(e.target.value) })} style={{ ...s.input, width: '80px', marginBottom: 0, textAlign: 'center' }} min={1} max={60} />
                                <span style={{ color: '#f1c40f', fontSize: '0.85rem', fontWeight: 'bold' }}>💡 نوصي بـ 5 إلى 10 ثوانٍ لتجنب حظر الرقم.</span>
                            </div>
                        </div>
                    )}
                </div>

                <div style={s.card}>
                    <h3 style={s.cardTitle}><FaUsers color="#3498db" /> الفلترة الذكية (مُحسنة)</h3>
                    
                    <label style={s.label}>إرسال إلى:</label>
                    <select value={data.audience} onChange={(e) => setData({ ...data, audience: e.target.value as any })} style={s.input}>
                        <option value="parents" style={s.option}>أولياء الأمور فقط</option>
                        <option value="students" style={s.option}>الطلاب فقط</option>
                        <option value="both" style={s.option}>الطلاب وأولياء الأمور معاً</option>
                    </select>

                    <label style={s.label}>الشرط / الحدث المطلوب:</label>
                    <select value={data.condition} onChange={(e) => setData({ ...data, condition: e.target.value as any, selectedItemId: '', selectedLectureId: '', targetCount: 0 })} style={s.input}>
                        <option value="missed_exam" style={s.option}>الطلاب المتأخرين عن تسليم (امتحان/واجب)</option>
                        <option value="score_below_50" style={s.option}>الطلاب الراسبين في التقييم (أقل من 50%)</option>
                        <option value="score_above_50" style={s.option}>الطلاب المتفوقين في التقييم (أعلى من 50%)</option>
                        <option value="missed_lesson" style={s.option}>الطلاب الغائبين عن مشاهدة فيديو الشرح</option>
                        <option value="absent_3_days" style={s.option}>الطلاب الغائبين عن المنصة (لم يسجل دخول منذ 3 أيام)</option>
                        <option value="custom" style={s.option}>إشعار عام (لجميع المشتركين في الكورس)</option>
                    </select>

                    {!['custom', 'absent_3_days'].includes(data.condition) && (
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <select value={data.selectedLectureId} onChange={(e) => setData({ ...data, selectedLectureId: e.target.value, selectedItemId: '' })} style={{ ...s.input, flex: 1 }}>
                                <option value="" style={s.option}>-- اختر المحاضرة --</option>
                                {curriculum.map(lec => <option key={lec.id} value={lec.id} style={s.option}>{lec.title}</option>)}
                            </select>

                            <select value={data.selectedItemId} onChange={(e) => setData({ ...data, selectedItemId: e.target.value })} disabled={!data.selectedLectureId} style={{ ...s.input, flex: 1, opacity: !data.selectedLectureId ? 0.5 : 1 }}>
                                <option value="" style={s.option}>-- اختر العنصر --</option>
                                {availableItems.map((item: LectureItem) => <option key={item.id} value={item.id} style={s.option}>{item.title}</option>)}
                            </select>
                        </div>
                    )}

                    <div style={{ marginTop: '10px', padding: '12px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', transition: '0.3s', background: data.targetCount > 0 ? 'rgba(46, 204, 113, 0.1)' : 'rgba(52, 152, 219, 0.1)', color: data.targetCount > 0 ? '#2ecc71' : '#3498db', border: `1px solid ${data.targetCount > 0 ? 'rgba(46, 204, 113, 0.3)' : 'rgba(52, 152, 219, 0.3)'}` }}>
                        {data.targetCount > 0 ? <><span>📊</span> العدد المستهدف المطابق للفلتر: {data.targetCount}</> : <><span>⏳</span> يرجى استكمال الفلتر لحساب العدد...</>}
                    </div>
                </div>

            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button onClick={onNext} disabled={!isStep1Valid} style={{ ...s.btnPrimary, opacity: !isStep1Valid ? 0.5 : 1 }}>التالي: صياغة الرسالة ⬅️</button>
            </div>
        </div>
    );
}

const s: { [key: string]: React.CSSProperties } = {
    grid2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' },
    card: { background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' },
    cardTitle: { margin: '0 0 15px 0', color: 'var(--txt)', display: 'flex', alignItems: 'center', gap: '8px' },
    label: { display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' },
    input: { width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none', marginBottom: '15px' },
    option: { background: '#1e293b', color: 'white' }, // 🚀 ده الستايل اللي هيحل المشكلة
    btn: { padding: '12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 'bold', transition: '0.2s', border: 'none' },
    btnPrimary: { background: 'var(--p-purple)', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem' }
};