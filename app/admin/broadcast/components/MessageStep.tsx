"use client";
import React, { useState } from 'react';
import { FaEdit, FaClock, FaWhatsapp, FaBell, FaMagic, FaArrowRight, FaSpinner, FaCheck, FaLink } from 'react-icons/fa';
import { Button } from '../../../../components/ui/Button';

// 💡 استدعاء المخزن السحري!
import { useBroadcastStore } from '../../../../features/broadcast/store/useBroadcastStore';

export default function MessageStep() {
    // 💡 بنسحب كل حاجة محتاجينها من المخزن
    const { 
        msgType, messageBody, senderPhone, delaySeconds, targetAudience, condition, 
        updateField, setStep 
    } = useBroadcastStore();

    // 💡 الحالات دي خاصة بالواجهة فقط (UI States)
    const [isWaChecking, setIsWaChecking] = useState(false);
    const [isWaConnected, setIsWaConnected] = useState(false);
    const [sendTiming, setSendTiming] = useState<'now' | 'schedule'>('now');
    const [scheduleDate, setScheduleDate] = useState('');

    const isStepValid = messageBody.trim().length > 5 && (msgType === 'in_app' || isWaConnected);

    // 💡 محاكاة التحقق من اتصال الواتساب
    const checkWhatsappConnection = () => {
        if (!/^01[0125][0-9]{8}$/.test(senderPhone)) {
            alert('يرجى إدخال رقم مصري صحيح');
            return;
        }
        setIsWaChecking(true);
        setTimeout(() => {
            setIsWaChecking(false);
            setIsWaConnected(true);
        }, 1500);
    };

    // 🚀 المولد الذكي اللي بيغير الرسالة حسب الاستهداف الخاص بـ "الأدمن"!
    const applyDynamicTemplate = () => {
        const prefix = targetAudience === 'parents' ? 'عزيزي ولي الأمر،' : 'عزيزي الطالب،';
        let template = '';
        
        switch(condition) {
            case 'new_course':
                template = `${prefix}\nتم إطلاق كورس جديد وحصري على المنصة!\nسارع بالاشتراك الآن لتحقيق أقصى استفادة.\n\n_إدارة بيكسل أكاديمي_`;
                break;
            case 'new_offer':
                template = `${prefix}\nعرض جديد متاح الآن لفترة محدودة! 🎁\nوفر فلوسك واشترك في أقوى باقات المنصة.\n\n_إدارة بيكسل أكاديمي_`;
                break;
            case 'new_product':
                template = `${prefix}\nمنتج جديد متوفر الآن في متجر بيكسل 🛒\nاطلب الآن وسيصلك لباب البيت.\n\n_إدارة بيكسل أكاديمي_`;
                break;
            case 'new_bank':
                template = `${prefix}\nبنك أسئلة جديد متاح الآن للتدريب 🧠\nادخل واختبر مستواك.\n\n_إدارة بيكسل أكاديمي_`;
                break;
            case 'new_library':
                template = `${prefix}\nتم إضافة ملخص جديد في المكتبة 📚\nيمكنك تحميله الآن بصيغة PDF مجاناً.\n\n_إدارة بيكسل أكاديمي_`;
                break;
            default:
                template = `${prefix}\nإشعار هام من إدارة المنصة.\n\n_إدارة بيكسل أكاديمي_`;
        }
        updateField('messageBody', template);
    };

    return (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <h2 style={{ marginBottom: '25px', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaMagic color="#9b59b6" /> صياغة الرسالة والجدولة
            </h2>

            {/* قناة الإرسال */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px', padding: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div>
                    <label style={{ display: 'block', color: 'white', marginBottom: '15px', fontWeight: 'bold' }}>قناة الإرسال:</label>
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        <button onClick={() => updateField('msgType', 'whatsapp')} style={{ flex: 1, padding: '15px', borderRadius: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1.1rem', cursor: 'pointer', transition: '0.3s', border: `2px solid ${msgType === 'whatsapp' ? '#2ecc71' : 'rgba(255,255,255,0.1)'}`, background: msgType === 'whatsapp' ? 'rgba(46, 204, 113, 0.1)' : 'transparent', color: msgType === 'whatsapp' ? '#2ecc71' : 'var(--txt)' }}>
                            <FaWhatsapp size={24} /> رسالة واتساب
                        </button>
                        <button onClick={() => updateField('msgType', 'in_app')} style={{ flex: 1, padding: '15px', borderRadius: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1.1rem', cursor: 'pointer', transition: '0.3s', border: `2px solid ${msgType === 'in_app' ? '#3498db' : 'rgba(255,255,255,0.1)'}`, background: msgType === 'in_app' ? 'rgba(52, 152, 219, 0.1)' : 'transparent', color: msgType === 'in_app' ? '#3498db' : 'var(--txt)' }}>
                            <FaBell size={24} /> إشعار منبثق للمنصة
                        </button>
                    </div>
                </div>

                {msgType === 'whatsapp' && (
                    <div style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', gap: '15px', background: 'rgba(46, 204, 113, 0.05)', padding: '20px', borderRadius: '10px', border: '1px dashed rgba(46, 204, 113, 0.3)' }}>
                        <div>
                            <label style={{ display: 'block', color: 'white', marginBottom: '8px', fontSize: '0.95rem', fontWeight: 'bold' }}>رقم هاتف الإرسال الخاص بك</label>
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                <input type="tel" placeholder="مثال: 01012345678" value={senderPhone} onChange={(e) => updateField('senderPhone', e.target.value)} style={{ flex: 1, minWidth: '200px', padding: '12px', borderRadius: '8px', border: `1px solid ${isWaConnected ? '#2ecc71' : 'rgba(255,255,255,0.2)'}`, background: 'rgba(0,0,0,0.4)', color: 'white', outline: 'none', direction: 'ltr', textAlign: 'right' }} maxLength={11} />
                                <button onClick={checkWhatsappConnection} disabled={isWaChecking || isWaConnected || senderPhone.length < 11} style={{ background: isWaConnected ? 'rgba(46, 204, 113, 0.2)' : '#2ecc71', color: isWaConnected ? '#2ecc71' : 'white', border: isWaConnected ? '1px solid #2ecc71' : 'none', padding: '12px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: (isWaChecking || isWaConnected || senderPhone.length < 11) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: '0.3s', opacity: (senderPhone.length < 11 && !isWaConnected) ? 0.5 : 1 }}>
                                    {isWaChecking ? <FaSpinner className="spin" /> : (isWaConnected ? <FaCheck /> : <FaLink />)}
                                    {isWaChecking ? 'جاري التحقق...' : (isWaConnected ? 'تم الربط بالخادم' : 'تحقق من الاتصال')}
                                </button>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', borderTop: '1px solid rgba(46, 204, 113, 0.2)', paddingTop: '15px' }}>
                            <FaClock style={{ color: '#2ecc71', fontSize: '1.5rem' }} />
                            <div style={{ flex: 1 }}>
                                <div style={{ color: 'white', fontWeight: 'bold', marginBottom: '5px' }}>الفاصل الزمني بين كل رسالة والأخرى</div>
                                <div style={{ color: 'var(--txt-mut)', fontSize: '0.85rem' }}>مهم جداً لتجنب حظر الرقم من شركة الواتساب. (نوصي بـ 5 ثواني).</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input type="number" min="1" max="60" value={delaySeconds} onChange={(e) => updateField('delaySeconds', Number(e.target.value))} style={{ width: '80px', padding: '10px', borderRadius: '8px', border: '1px solid #2ecc71', background: 'rgba(0,0,0,0.5)', color: 'white', outline: 'none', textAlign: 'center', fontWeight: 'bold', fontSize: '1.1rem' }} />
                                <span style={{ color: 'var(--txt-mut)' }}>ثانية</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* المحرر والمعاينة */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <label style={{ color: 'var(--txt-mut)', fontWeight: 'bold' }}>محتوى الرسالة</label>
                        <button onClick={applyDynamicTemplate} style={{ background: 'rgba(155, 89, 182, 0.1)', color: '#9b59b6', border: '1px solid rgba(155, 89, 182, 0.3)', padding: '5px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <FaMagic /> توليد حسب الفلتر
                        </button>
                    </div>
                    <textarea 
                        value={messageBody} 
                        onChange={e => updateField('messageBody', e.target.value)} 
                        placeholder="اكتب رسالتك هنا..." 
                        style={{ width: '100%', height: '220px', padding: '20px', background: 'rgba(0,0,0,0.3)', border: `2px solid ${msgType === 'whatsapp' ? 'rgba(46, 204, 113, 0.3)' : 'rgba(52, 152, 219, 0.3)'}`, color: 'white', borderRadius: '12px', outline: 'none', resize: 'vertical', fontSize: '1.1rem', lineHeight: '1.8', fontFamily: 'inherit' }} 
                    />

                    {/* الجدولة */}
                    <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
                        <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '10px', fontWeight: 'bold' }}><FaClock/> موعد الإرسال</label>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                            <button onClick={() => setSendTiming('now')} style={{ flex: 1, padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', border: `1px solid ${sendTiming === 'now' ? 'var(--p-purple)' : 'rgba(255,255,255,0.1)'}`, background: sendTiming === 'now' ? 'var(--p-purple)' : 'transparent', color: sendTiming === 'now' ? 'white' : 'var(--txt-mut)', transition: '0.3s' }}>إرسال الآن ⚡</button>
                            <button onClick={() => setSendTiming('schedule')} style={{ flex: 1, padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', border: `1px solid ${sendTiming === 'schedule' ? 'var(--p-purple)' : 'rgba(255,255,255,0.1)'}`, background: sendTiming === 'schedule' ? 'var(--p-purple)' : 'transparent', color: sendTiming === 'schedule' ? 'white' : 'var(--txt-mut)', transition: '0.3s' }}>إرسال لاحقاً 🕒</button>
                        </div>
                        {sendTiming === 'schedule' && (
                            <div style={{ animation: 'fadeIn 0.3s ease' }}>
                                <input type="datetime-local" value={scheduleDate} onChange={e => { setScheduleDate(e.target.value); updateField('isScheduled', true); updateField('scheduleDate', e.target.value); }} style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }} />
                            </div>
                        )}
                    </div>
                </div>

                {/* المعاينة الحية */}
                <div style={{ flex: '0 0 350px', background: msgType === 'whatsapp' ? '#efeae2' : '#0f172a', borderRadius: '15px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '15px', background: msgType === 'whatsapp' ? '#075e54' : '#1e293b', color: 'white', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold' }}>
                        {msgType === 'whatsapp' ? <FaWhatsapp size={20} /> : <FaBell size={20} />}
                        {msgType === 'whatsapp' ? 'معاينة في الواتساب' : 'معاينة في التطبيق'}
                    </div>
                    <div style={{ padding: '20px', flex: 1, background: msgType === 'whatsapp' ? 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")' : 'transparent', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {messageBody ? (
                            msgType === 'whatsapp' ? (
                                <div style={{ background: '#dcf8c6', padding: '10px 15px', borderRadius: '10px 0 10px 10px', color: '#303030', alignSelf: 'flex-start', maxWidth: '85%', fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-wrap', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                                    {messageBody}
                                    <div style={{ textAlign: 'right', fontSize: '0.65rem', color: '#999', marginTop: '5px' }}>10:45 AM</div>
                                </div>
                            ) : (
                                <div style={{ background: '#1e293b', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', color: 'white', display: 'flex', gap: '15px', width: '100%', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(52, 152, 219, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><FaBell color="#3498db" /></div>
                                    <div>
                                        <div style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '1rem' }}>إشعار جديد</div>
                                        <div style={{ color: 'var(--txt-mut)', fontSize: '0.9rem', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>{messageBody}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '8px' }}>الآن</div>
                                    </div>
                                </div>
                            )
                        ) : (
                            <div style={{ textAlign: 'center', color: msgType === 'whatsapp' ? '#888' : 'var(--txt-mut)', marginTop: '50px', background: msgType === 'whatsapp' ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '20px', fontSize: '0.85rem' }}>اكتب الرسالة لتظهر المعاينة هنا</div>
                        )}
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
                <Button variant="outline" onClick={() => setStep(1)}>السابق: الاستهداف</Button>
                <Button variant="primary" onClick={() => setStep(3)} disabled={!isStepValid} style={{ background: '#e67e22', border: 'none', padding: '12px 30px', opacity: !isStepValid ? 0.5 : 1 }}>
                    التالي: الإرسال <FaArrowRight style={{ transform: 'rotate(180deg)', marginLeft: '10px' }} />
                </Button>
            </div>
            
            <style jsx>{`@keyframes spin { 100% { transform: rotate(360deg); } } .spin { animation: spin 1s linear infinite; }`}</style>
        </div>
    );
}