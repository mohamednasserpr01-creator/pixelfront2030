"use client";
import React from 'react';
import { FaEdit, FaClock, FaMobileAlt, FaBell, FaMagic, FaWhatsapp } from 'react-icons/fa';
import { CampaignState } from '../NotificationsTab';

interface Props {
    data: CampaignState;
    setData: React.Dispatch<React.SetStateAction<CampaignState>>;
    onNext: () => void;
    onPrev: () => void;
}

export default function MessageStep({ data, setData, onNext, onPrev }: Props) {
    const isStepValid = data.message.trim().length > 5 && (data.sendType === 'now' || data.scheduleDate !== '');

    // 🚀 القوالب بقت تفهم إنت بتكلم ولي أمر ولا طالب!
    const applyDynamicTemplate = () => {
        const isStudent = data.audience === 'students';
        const isParent = data.audience === 'parents';
        
        // تجهيز المقدمة المناسبة
        const prefix = isStudent ? 'عزيزي الطالب' : isParent ? 'عزيزي ولي أمر الطالب' : 'عزيزي الطالب / ولي أمر الطالب';
        const targetName = '*[اسم_الطالب]*';

        let template = '';
        switch(data.condition) {
            case 'missed_exam':
                template = `${prefix} ${targetName}،\nنحيطكم علماً بأنه لم يتم تسليم ([اسم_الامتحان]).\nبرجاء المتابعة والالتزام حرصاً على المستوى الدراسي.\n\n_إدارة المنصة_`;
                break;
            case 'score_below_50':
                template = `${prefix} ${targetName}،\nنتيجة التقييم في ([اسم_الامتحان]) هي *[الدرجة]* من [الدرجة_النهائية].\nنرجو مراجعة الأخطاء وبذل مجهود أكبر في المرات القادمة.\n\n_إدارة المنصة_`;
                break;
            case 'score_above_50':
                template = `تهانينا ${isParent ? 'لنجلكم المتفوق' : 'للمتفوق'} ${targetName}! 🎉\nتم اجتياز ([اسم_الامتحان]) بتفوق بنتيجة *[الدرجة]* من [الدرجة_النهائية].\nفخورون بهذا المستوى ونتمنى دوام النجاح.\n\n_إدارة المنصة_`;
                break;
            case 'missed_lesson':
                template = `${prefix} ${targetName}،\nلاحظنا غيابكم عن مشاهدة فيديو الشرح ([اسم_المحاضرة]).\nيرجى سرعة المشاهدة حتى لا تتراكم الدروس.\n\n_إدارة المنصة_`;
                break;
            case 'absent_3_days':
                template = `${prefix} ${targetName}،\nافتقدناك في المنصة! لم يتم تسجيل الدخول منذ 3 أيام.\nتذكر أن الاستمرارية هي مفتاح التفوق. ننتظر العودة لاستكمال رحلة التعلم.\n\n_إدارة المنصة_`;
                break;
            default:
                template = `أهلاً بك ${targetName}،\nنود إعلامك بأنه تم تحديث محتوى الكورس.\n\n_إدارة المنصة_`;
        }
        setData({ ...data, message: template });
    };

    return (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={s.grid2}>
                <div style={s.card}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h3 style={s.cardTitle}><FaEdit color="#f1c40f" /> نص الرسالة</h3>
                        <button onClick={applyDynamicTemplate} style={{ ...s.btn, background: 'rgba(241, 196, 15, 0.1)', color: '#f1c40f', padding: '8px 12px', fontSize: '0.85rem' }}>
                            <FaMagic /> توليد قالب تلقائي
                        </button>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '15px', flexWrap: 'wrap' }}>
                        {['[اسم_الطالب]', '[اسم_المحاضرة]', '[اسم_الامتحان]', '[الدرجة]', '[الدرجة_النهائية]'].map(v => (
                            <button key={v} onClick={() => setData({ ...data, message: data.message + ` ${v} ` })} style={{ ...s.btn, background: 'rgba(52, 152, 219, 0.1)', color: '#3498db', padding: '6px 10px', fontSize: '0.8rem' }}>{v}</button>
                        ))}
                    </div>

                    <textarea value={data.message} onChange={(e) => setData({ ...data, message: e.target.value })} placeholder="اكتب رسالتك هنا..." rows={7} style={{ ...s.input, height: 'auto', resize: 'vertical', lineHeight: '1.6', fontSize: '1rem' }} />
                    
                    <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
                        <h4 style={{ margin: '0 0 15px 0', color: 'var(--txt)', display: 'flex', alignItems: 'center', gap: '8px' }}><FaClock color="#3498db"/> موعد الإرسال</h4>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => setData({ ...data, sendType: 'now' })} style={{ ...s.btn, flex: 1, background: data.sendType === 'now' ? 'var(--p-purple)' : 'transparent', color: data.sendType === 'now' ? 'white' : 'var(--txt-mut)', border: `1px solid ${data.sendType === 'now' ? 'var(--p-purple)' : 'rgba(255,255,255,0.1)'}` }}>إرسال الآن ⚡</button>
                            <button onClick={() => setData({ ...data, sendType: 'schedule' })} style={{ ...s.btn, flex: 1, background: data.sendType === 'schedule' ? 'var(--p-purple)' : 'transparent', color: data.sendType === 'schedule' ? 'white' : 'var(--txt-mut)', border: `1px solid ${data.sendType === 'schedule' ? 'var(--p-purple)' : 'rgba(255,255,255,0.1)'}` }}>إرسال مجدول 🕒</button>
                        </div>
                        {data.sendType === 'schedule' && (
                            <div style={{ marginTop: '15px', animation: 'fadeIn 0.3s ease' }}>
                                <input type="datetime-local" value={data.scheduleDate} onChange={(e) => setData({ ...data, scheduleDate: e.target.value })} style={s.input} />
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ ...s.card, background: data.channel === 'whatsapp' ? '#efeae2' : '#0f172a', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '15px 20px', background: data.channel === 'whatsapp' ? '#075e54' : '#1e293b', color: 'white', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold' }}>
                        {data.channel === 'whatsapp' ? <FaWhatsapp size={20} /> : <FaBell size={20} />}
                        {data.channel === 'whatsapp' ? 'معاينة الواتساب' : 'معاينة إشعار المنصة'}
                    </div>
                    <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', overflowY: 'auto', background: data.channel === 'whatsapp' ? 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")' : 'transparent' }}>
                        {data.message ? (
                            data.channel === 'whatsapp' ? (
                                <div style={{ background: '#dcf8c6', padding: '10px 15px', borderRadius: '10px 0 10px 10px', color: '#303030', alignSelf: 'flex-start', maxWidth: '85%', fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-wrap', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                                    {data.message}
                                    <div style={{ textAlign: 'right', fontSize: '0.65rem', color: '#999', marginTop: '5px' }}>10:45 AM</div>
                                </div>
                            ) : (
                                <div style={{ background: '#1e293b', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', color: 'white', display: 'flex', gap: '15px', alignSelf: 'center', width: '100%', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(52, 152, 219, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><FaBell color="#3498db" /></div>
                                    <div>
                                        <div style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '1rem' }}>إشعار جديد</div>
                                        <div style={{ color: 'var(--txt-mut)', fontSize: '0.9rem', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>{data.message}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '8px' }}>الآن</div>
                                    </div>
                                </div>
                            )
                        ) : (
                            <div style={{ textAlign: 'center', color: data.channel === 'whatsapp' ? '#888' : 'var(--txt-mut)', marginTop: '50px', background: data.channel === 'whatsapp' ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '20px', fontSize: '0.85rem', alignSelf: 'center' }}>اكتب الرسالة لتظهر المعاينة هنا</div>
                        )}
                    </div>
                </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <button onClick={onPrev} style={s.btnOutline}>➡️ رجوع للاستهداف</button>
                <button onClick={onNext} disabled={!isStepValid} style={{ ...s.btnPrimary, opacity: !isStepValid ? 0.5 : 1 }}>التالي: غرفة المراقبة والمحرك ⬅️</button>
            </div>
        </div>
    );
}

const s: { [key: string]: React.CSSProperties } = {
    grid2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' },
    card: { background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' },
    cardTitle: { margin: '0 0 15px 0', color: 'var(--txt)', display: 'flex', alignItems: 'center', gap: '8px' },
    input: { width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none', marginBottom: '15px' },
    btn: { padding: '12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 'bold', transition: '0.2s', border: 'none' },
    btnPrimary: { background: 'var(--p-purple)', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem' },
    btnOutline: { background: 'transparent', color: 'var(--txt)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 30px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }
};