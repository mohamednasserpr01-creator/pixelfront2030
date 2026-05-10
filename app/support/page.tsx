"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useSettings } from '../../context/SettingsContext';

import { 
    FaHandsHelping, FaLock, FaUserPlus, FaUserTie, FaUserNurse, 
    FaCalendarAlt, FaCalendarTimes, FaCalendarCheck, FaPhoneVolume, 
    FaCheck, FaTimesCircle, FaCheckCircle, FaExclamationCircle, FaSpinner 
} from 'react-icons/fa';

// =========================================================================
// 💡 1. TYPE DEFINITIONS & BACKEND-READY STRUCTURE
// =========================================================================
export type SlotStatus = 'available' | 'booked' | 'locked';

export interface Slot {
    id: string;
    time: string;
    status: SlotStatus;
}

export interface DaySchedule {
    id: string;
    day: string;
    date: string;
    slots: Slot[];
}

export interface BookingPayload {
    dayId: string;
    slotId: string;
    dayName: string;
    date: string;
    time: string;
}

// =========================================================================
// 💡 2. MOCK DATA (With Unique IDs for safe React Rendering)
// =========================================================================
const MOCK_API_DATA: Record<'male' | 'female', DaySchedule[]> = {
    male: [
        { 
            id: "d1", day: "السبت", date: "21 مارس 2026", 
            slots: [
                { id: "s1", time: "10:00 ص", status: "available" },
                { id: "s2", time: "11:30 ص", status: "booked" }, 
                { id: "s3", time: "01:00 م", status: "available" },
            ] 
        },
        { 
            id: "d2", day: "الإثنين", date: "23 مارس 2026", 
            slots: [
                { id: "s4", time: "05:00 م", status: "available" },
                { id: "s5", time: "07:00 م", status: "booked" },
            ] 
        }
    ],
    female: [
        { 
            id: "d3", day: "الأحد", date: "22 مارس 2026", 
            slots: [
                { id: "s6", time: "12:00 م", status: "available" },
            ] 
        }
    ] 
};

// =========================================================================
// 💡 3. CUSTOM HOOK: useBooking (Separation of Logic)
// =========================================================================
function useBooking() {
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [specType, setSpecType] = useState<'male' | 'female'>('male');
    const [scheduleData, setScheduleData] = useState(MOCK_API_DATA);
    const [hasBookedThisWeek, setHasBookedThisWeek] = useState(false);
    
    // UI States
    const [showModal, setShowModal] = useState(false);
    const [pendingBooking, setPendingBooking] = useState<BookingPayload | null>(null);
    const [toastData, setToastData] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToastData({ msg, type });
        setTimeout(() => setToastData(null), 3000);
    };

    const initiateBooking = (payload: BookingPayload) => {
        if (hasBookedThisWeek) {
            showToast("عذراً! لقد حجزت جلسة بالفعل هذا الأسبوع.", 'error');
            return;
        }
        setPendingBooking(payload);
        setShowModal(true);
    };

    const confirmBooking = async () => {
        if (!pendingBooking) return;
        setIsSubmitting(true);

        // محاكاة لطلب API
        await new Promise(resolve => setTimeout(resolve, 1000));

        setScheduleData(prev => ({
            ...prev,
            [specType]: prev[specType].map(day => 
                day.id === pendingBooking.dayId 
                    ? { 
                        ...day, 
                        slots: day.slots.map(slot => 
                            slot.id === pendingBooking.slotId 
                                ? { ...slot, status: 'booked' as SlotStatus } 
                                : slot
                        ) 
                      }
                    : day
            )
        }));

        setHasBookedThisWeek(true);
        setIsSubmitting(false);
        setShowModal(false);
        setPendingBooking(null);
        showToast("تم تأكيد الحجز بنجاح وإرسال رسالة واتساب بالتفاصيل!", 'success');
    };

    const currentSchedule = useMemo(() => scheduleData[specType] || [], [scheduleData, specType]);

    return {
        isLoggedIn, setIsLoggedIn,
        specType, setSpecType,
        currentSchedule,
        showModal, setShowModal,
        pendingBooking, initiateBooking, confirmBooking, isSubmitting,
        toastData
    };
}

// =========================================================================
// 💡 4. SUB-COMPONENTS
// =========================================================================
const DayScheduleCard = ({ dayData, onSlotClick }: { dayData: DaySchedule, onSlotClick: (p: BookingPayload) => void }) => (
    <div className="day-card">
        <div className="day-header">
            <div className="day-info">
                <h3>{dayData.day}</h3>
                <p>{dayData.date}</p>
            </div>
            <div className="day-icon"><FaCalendarAlt /></div>
        </div>
        <div className="slots-grid">
            {dayData.slots.map((slot) => (
                <button 
                    key={slot.id}
                    disabled={slot.status !== 'available'}
                    className={`slot-btn ${slot.status}`}
                    onClick={() => onSlotClick({ 
                        dayId: dayData.id, slotId: slot.id, 
                        dayName: dayData.day, date: dayData.date, time: slot.time 
                    })}
                >
                    {slot.time}
                </button>
            ))}
        </div>
    </div>
);

const BookingModal = ({ 
    booking, onClose, onConfirm, isSubmitting 
}: { 
    booking: BookingPayload, onClose: () => void, onConfirm: () => void, isSubmitting: boolean 
}) => (
    <div className="modal-overlay">
        <div className="modal-content">
            <button className="close-btn" onClick={onClose} disabled={isSubmitting}>
                <FaTimesCircle />
            </button>
            
            <div className="modal-header">
                <FaCalendarCheck className="modal-icon" />
                <h2>تأكيد حجز الجلسة</h2>
            </div>

            <div className="modal-details">
                <div className="detail-row">
                    <span>اليوم:</span>
                    <strong>{booking.dayName}</strong>
                </div>
                <div className="detail-row">
                    <span>التاريخ:</span>
                    <strong>{booking.date}</strong>
                </div>
                <div className="detail-row">
                    <span>الساعة:</span>
                    <strong>{booking.time}</strong>
                </div>
            </div>

            <div className="whatsapp-notice">
                <FaPhoneVolume className="wa-icon" />
                <p>سيقوم المتخصص بالتواصل معك هاتفياً أو عبر الواتساب في الموعد المحدد. تأكد من استقرار الإنترنت.</p>
            </div>

            <button className="confirm-btn glow-btn" onClick={onConfirm} disabled={isSubmitting}>
                {isSubmitting ? <FaSpinner className="spinner" /> : <FaCheck />} 
                {isSubmitting ? 'جاري التأكيد...' : 'تأكيد الحجز'}
            </button>
        </div>
    </div>
);

// =========================================================================
// 💡 5. MAIN PAGE COMPONENT
// =========================================================================
export default function SupportRoomPage() {
    const { lang } = useSettings();
    const isAr = lang === 'ar';
    
    const {
        isLoggedIn, setIsLoggedIn,
        specType, setSpecType,
        currentSchedule,
        showModal, setShowModal,
        pendingBooking, initiateBooking, confirmBooking, isSubmitting,
        toastData
    } = useBooking();

    return (
        <main className="page-wrapper support-page">
            <style>{`
                .support-page { padding-bottom: 80px; }
                .support-hero { text-align: center; margin: 40px auto; max-width: 800px; padding: 0 20px; }
                .support-hero h1 { color: #0984e3; font-size: clamp(2rem, 4vw, 3rem); font-weight: 900; margin-bottom: 15px; display: flex; align-items: center; justify-content: center; gap: 15px; }
                .support-hero p { color: var(--txt); font-size: 1.1rem; line-height: 1.8; font-weight: bold; opacity: 0.9; }

                .tabs-container { display: flex; justify-content: center; gap: 20px; margin-bottom: 40px; }
                .tab-btn { padding: 12px 30px; border-radius: 12px; font-weight: 900; font-size: 1.1rem; cursor: pointer; transition: 0.3s; display: flex; align-items: center; gap: 10px; border: 1px solid rgba(255,255,255,0.1); background: transparent; color: var(--txt); }
                .tab-btn.active { background: #0984e3; color: #fff; border-color: #0984e3; box-shadow: 0 0 20px rgba(9,132,227,0.4); transform: translateY(-3px); }

                .schedule-grid { display: flex; flex-wrap: wrap; gap: 25px; justify-content: center; max-width: 1200px; margin: 0 auto; padding: 0 20px; }
                
                /* 💡 التعديل هنا: غيرنا width و max-width عشان يقعدوا جنب بعض */
                .day-card { background: var(--card); border-radius: 15px; padding: 25px; width: 350px; max-width: 100%; border: 1px solid rgba(255,255,255,0.05); box-shadow: 0 10px 30px rgba(0,0,0,0.1); transition: 0.3s; }
                .day-card:hover { border-color: rgba(9,132,227,0.3); transform: translateY(-5px); }
                
                .day-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed rgba(255,255,255,0.1); padding-bottom: 15px; margin-bottom: 20px; }
                .day-info h3 { font-weight: 900; font-size: 1.4rem; color: var(--txt); margin-bottom: 5px; }
                .day-info p { color: var(--txt-mut); font-size: 0.9rem; font-weight: bold; }
                .day-icon { background: rgba(9, 132, 227, 0.1); color: #0984e3; width: 45px; height: 45px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }

                .slots-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
                .slot-btn { padding: 12px 10px; border-radius: 10px; font-weight: bold; font-size: 1rem; font-family: monospace; text-align: center; cursor: pointer; transition: 0.3s; background: transparent; }
                .slot-btn.available { border: 1px solid rgba(255,255,255,0.1); color: var(--txt); }
                .slot-btn.available:hover { border-color: #0984e3; background: rgba(9, 132, 227, 0.1); color: #0984e3; }
                .slot-btn.booked { border: 1px solid rgba(231,76,60,0.2); color: #e74c3c; text-decoration: line-through; opacity: 0.6; cursor: not-allowed; }

                /* Modal Styles */
                .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(5px); z-index: 2000; display: flex; justify-content: center; align-items: center; padding: 20px; animation: fadeIn 0.3s ease; }
                .modal-content { background: var(--card); width: 100%; max-width: 450px; border-radius: 20px; border: 2px solid #0984e3; padding: 30px; position: relative; box-shadow: 0 20px 50px rgba(0,0,0,0.5); animation: slideUp 0.3s ease; }
                .close-btn { position: absolute; top: 15px; left: 15px; background: none; border: none; color: var(--txt-mut); font-size: 1.5rem; cursor: pointer; transition: 0.3s; }
                .close-btn:hover { color: #e74c3c; transform: rotate(90deg); }
                html[dir="ltr"] .close-btn { left: auto; right: 15px; }
                
                .modal-header { text-align: center; margin-bottom: 25px; }
                .modal-icon { font-size: 3.5rem; color: #0984e3; margin-bottom: 15px; }
                .modal-header h2 { color: var(--txt); font-weight: 900; font-size: 1.6rem; }

                .modal-details { background: var(--bg); padding: 20px; border-radius: 12px; margin-bottom: 20px; border: 1px solid rgba(255,255,255,0.05); }
                .detail-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-weight: bold; font-size: 1.1rem; border-bottom: 1px dashed rgba(255,255,255,0.1); padding-bottom: 12px; color: var(--txt); }
                .detail-row:last-child { margin-bottom: 0; border-bottom: none; padding-bottom: 0; }
                .detail-row strong { color: #0984e3; }

                .whatsapp-notice { background: rgba(9, 132, 227, 0.1); border: 1px dashed #0984e3; padding: 15px; border-radius: 12px; text-align: center; margin-bottom: 25px; }
                .wa-icon { font-size: 1.8rem; color: #0984e3; margin-bottom: 10px; }
                .whatsapp-notice p { font-size: 0.95rem; font-weight: bold; line-height: 1.6; color: var(--txt); }

                .confirm-btn { width: 100%; background: #2ecc71; color: white; border: none; padding: 16px; border-radius: 12px; font-size: 1.2rem; font-weight: 900; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 10px; transition: 0.3s; }
                .confirm-btn:disabled { opacity: 0.7; cursor: not-allowed; }
                .spinner { animation: spin 1s linear infinite; }

                .toast-notification { position: fixed; bottom: 30px; left: 30px; background: #2ecc71; color: white; padding: 15px 25px; border-radius: 12px; font-weight: bold; display: flex; align-items: center; gap: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); transform: translateY(100px); opacity: 0; transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); z-index: 9999; }
                html[dir="ltr"] .toast-notification { left: auto; right: 30px; }
                .toast-notification.show { transform: translateY(0); opacity: 1; }
                .toast-notification.error { background: #e74c3c; }

                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>

            <div className="support-hero">
                <h1>{isAr ? 'الدعم النفسي والأكاديمي' : 'Psychological Support'} <FaHandsHelping /></h1>
                <p>{isAr ? 'نحن هنا لمساعدتك على تجاوز ضغوط الدراسة وتوجيهك نفسياً وأكاديمياً لتحقيق أفضل نسخة من نفسك.' : 'We are here to help you overcome study pressures and guide you.'}</p>
            </div>

            {!isLoggedIn ? (
                <div style={{ background: 'var(--card)', padding: '50px', borderRadius: '20px', textAlign: 'center', maxWidth: '600px', margin: '0 auto', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <FaLock style={{ fontSize: '4rem', color: 'var(--txt-mut)', marginBottom: '20px' }} />
                    <h2 style={{ marginBottom: '15px', color: 'var(--txt)' }}>{isAr ? 'المواعيد غير متاحة للزوار' : 'Login Required'}</h2>
                    <p style={{ color: 'var(--txt-mut)', marginBottom: '30px', fontWeight: 'bold' }}>{isAr ? 'لحماية خصوصيتك ولتتمكن من حجز جلسة إرشادية، يرجى تسجيل الدخول.' : 'Please login to view and book sessions.'}</p>
                    <button onClick={() => setIsLoggedIn(true)} style={{ background: '#0984e3', color: 'white', padding: '12px 30px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                        <FaUserPlus /> {isAr ? 'سجل الآن لظهور المواعيد' : 'Login Now'}
                    </button>
                </div>
            ) : (
                <>
                    <div className="tabs-container">
                        <button className={`tab-btn ${specType === 'female' ? 'active' : ''}`} onClick={() => setSpecType('female')}>
                            <FaUserNurse /> {isAr ? 'حجز مع متخصصة' : 'Female Specialist'}
                        </button>
                        <button className={`tab-btn ${specType === 'male' ? 'active' : ''}`} onClick={() => setSpecType('male')}>
                            <FaUserTie /> {isAr ? 'حجز مع متخصص' : 'Male Specialist'}
                        </button>
                    </div>

                    <div className="schedule-grid">
                        {currentSchedule.length === 0 ? (
                            <div style={{ background: 'var(--card)', padding: '50px', borderRadius: '20px', textAlign: 'center', width: '100%', maxWidth: '600px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <FaCalendarTimes style={{ fontSize: '4rem', color: 'var(--txt-mut)', marginBottom: '20px' }} />
                                <h3 style={{ marginBottom: '15px', color: 'var(--txt)' }}>{isAr ? 'لا تتوفر مواعيد حالياً' : 'No appointments available'}</h3>
                                <p style={{ color: 'var(--txt-mut)', fontWeight: 'bold' }}>{isAr ? 'يرجى المحاولة لاحقاً أو اختيار متخصص آخر.' : 'Please try again later.'}</p>
                            </div>
                        ) : (
                            currentSchedule.map((dayData) => (
                                <DayScheduleCard 
                                    key={dayData.id} 
                                    dayData={dayData} 
                                    onSlotClick={initiateBooking} 
                                />
                            ))
                        )}
                    </div>
                </>
            )}

            {/* Modals & Toasts */}
            {showModal && pendingBooking && (
                <BookingModal 
                    booking={pendingBooking} 
                    onClose={() => setShowModal(false)} 
                    onConfirm={confirmBooking} 
                    isSubmitting={isSubmitting} 
                />
            )}

            <div className={`toast-notification ${toastData ? 'show' : ''} ${toastData?.type === 'error' ? 'error' : ''}`}>
                {toastData?.type === 'error' ? <FaExclamationCircle size={20} /> : <FaCheckCircle size={20} />} 
                <span>{toastData?.msg}</span>
            </div>

        </main>
    );
}