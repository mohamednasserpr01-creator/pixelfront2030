// FILE: app/admin/support/page.tsx
"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { FaHeartbeat, FaUserTie, FaUserNurse, FaCalendarAlt, FaPhoneVolume, FaPlus } from 'react-icons/fa';

import { useToast } from '../../../context/ToastContext';
import { Button } from '../../../components/ui/Button';
import { Appointment, SupportDay, SpecialistType, AppointmentStatus } from '../../../types';

// استدعاء المكونات
import AppointmentsFilters from './components/AppointmentsFilters';
import AppointmentsTable from './components/AppointmentsTable';
import ScheduleCards from './components/ScheduleCards';
import ScheduleFormModal from './components/ScheduleFormModal';

// ==========================================
// 💡 MOCK DATA: بيانات مُحسنة بالـ IDs
// ==========================================
const mockSchedule: Record<SpecialistType, SupportDay[]> = {
    male: [
        { 
            id: 'day_1', day: "السبت", date: "2026-03-21", 
            slots: [
                { id: 'slot_1', time: "10:00 ص", isBooked: false },
                { id: 'slot_2', time: "11:30 ص", isBooked: true, appointmentId: 'APP-01' }, 
                { id: 'slot_3', time: "01:00 م", isBooked: true, appointmentId: 'APP-02' }, 
            ] 
        }
    ],
    female: []
};

const mockAppointments: Appointment[] = [
    { id: 'APP-01', studentName: 'أحمد محمود', phone: '01012345678', type: 'male', day: 'السبت', date: '2026-03-21', time: '11:30 ص', slotId: 'slot_2', status: 'pending' },
    { id: 'APP-02', studentName: 'عمر خالد', phone: '01123456789', type: 'male', day: 'السبت', date: '2026-03-21', time: '01:00 م', slotId: 'slot_3', status: 'completed' }
];

export default function SupportAdminPage() {
    const { showToast } = useToast();
    const [mounted, setMounted] = useState(false);
    
    const [activeTab, setActiveTab] = useState<'appointments' | 'schedule'>('appointments');
    const [scheduleType, setScheduleType] = useState<SpecialistType>('male');

    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [schedule, setSchedule] = useState<Record<SpecialistType, SupportDay[]>>({ male: [], female: [] });
    
    const [filters, setFilters] = useState({ search: '', status: 'all' });
    const [isAddDayModalOpen, setIsAddDayModalOpen] = useState(false);

    useEffect(() => {
        setAppointments(mockAppointments);
        setSchedule(mockSchedule);
        setMounted(true);
    }, []);

    // 💡 فلترة الجلسات (بأداء عالي و Case-Insensitive)
    const filteredAppointments = useMemo(() => {
        return appointments.filter(a => {
            const matchSearch = filters.search === '' || a.studentName.toLowerCase().includes(filters.search) || a.phone.includes(filters.search);
            const matchStatus = filters.status === 'all' || a.status === filters.status;
            return matchSearch && matchStatus;
        });
    }, [appointments, filters]);

    // 💡 تحديث الجلسة مع فك الـ Slot لو اتلغت
    const handleUpdateAppointmentStatus = (appId: string, newStatus: AppointmentStatus) => {
        const appointment = appointments.find(a => a.id === appId);
        if (!appointment) return;

        // تحديث الحجز
        setAppointments(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));

        // 💡 اللوجيك السحري: لو الجلسة اتلغت، نفتح الميعاد تاني في الجدول عشان طالب غيره يحجز
        if (newStatus === 'cancelled') {
            setSchedule(prev => {
                const newData = { ...prev };
                const typeData = newData[appointment.type];
                
                for (let day of typeData) {
                    const slotIndex = day.slots.findIndex(s => s.id === appointment.slotId);
                    if (slotIndex !== -1) {
                        day.slots[slotIndex].isBooked = false;
                        day.slots[slotIndex].appointmentId = undefined;
                        break;
                    }
                }
                return newData;
            });
            showToast('تم إلغاء الجلسة وإتاحة الموعد مرة أخرى في الجدول 🔄', 'error');
        } else if (newStatus === 'completed') {
            showToast('تم إنهاء الجلسة بنجاح ✅', 'success');
        }
    };

    const handleAddDay = (newDay: SupportDay) => {
        setSchedule(prev => ({
            ...prev,
            [scheduleType]: [...prev[scheduleType], newDay]
        }));
        setIsAddDayModalOpen(false);
        showToast('تم إضافة اليوم والمواعيد بنجاح!', 'success');
    };

    const handleDeleteDay = (dayId: string) => {
        if(confirm('هل أنت متأكد من حذف هذا اليوم بجميع مواعيده؟')) {
            setSchedule(prev => ({
                ...prev,
                [scheduleType]: prev[scheduleType].filter(d => d.id !== dayId)
            }));
            showToast('تم حذف اليوم بنجاح', 'success');
        }
    };

    if (!mounted) return null;

    return (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <style>{`
                .nav-tab { padding: 10px 25px; border-radius: 30px; font-weight: bold; cursor: pointer; transition: 0.3s; display: flex; align-items: center; gap: 8px; }
                .nav-tab.active { background: linear-gradient(45deg, #0984e3, #74b9ff); color: white; box-shadow: 0 5px 15px rgba(9, 132, 227, 0.3); }
                .nav-tab.inactive { background: var(--card); color: var(--txt-mut); border: 1px solid rgba(255,255,255,0.1); }
            `}</style>

            {/* ======== Header & Tabs ======== */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', color: 'var(--txt)', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaHeartbeat style={{ color: '#0984e3' }} /> إدارة الدعم النفسي والأكاديمي
                    </h1>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <div className={`nav-tab ${activeTab === 'appointments' ? 'active' : 'inactive'}`} onClick={() => setActiveTab('appointments')}>
                        <FaPhoneVolume /> حجوزات الجلسات
                    </div>
                    <div className={`nav-tab ${activeTab === 'schedule' ? 'active' : 'inactive'}`} onClick={() => setActiveTab('schedule')}>
                        <FaCalendarAlt /> إعدادات الجدول
                    </div>
                </div>
            </div>

            {/* ======== Content ======== */}
            {activeTab === 'appointments' ? (
                <div style={{ animation: 'fadeIn 0.3s ease' }}>
                    <AppointmentsFilters onFilterChange={setFilters} />
                    <AppointmentsTable appointments={filteredAppointments} onUpdateStatus={handleUpdateAppointmentStatus} />
                </div>
            ) : (
                <div style={{ animation: 'fadeIn 0.3s ease' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', padding: '5px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <button onClick={() => setScheduleType('male')} style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: scheduleType === 'male' ? '#3498db' : 'transparent', color: scheduleType === 'male' ? 'white' : 'var(--txt-mut)', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' }}><FaUserTie/> جدول المتخصص (ذكر)</button>
                            <button onClick={() => setScheduleType('female')} style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: scheduleType === 'female' ? '#e84393' : 'transparent', color: scheduleType === 'female' ? 'white' : 'var(--txt-mut)', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' }}><FaUserNurse/> جدول المتخصصة (أنثى)</button>
                        </div>
                        <Button variant="primary" icon={<FaPlus />} onClick={() => setIsAddDayModalOpen(true)} style={{ background: '#0984e3' }}>إضافة يوم ومواعيد</Button>
                    </div>

                    <ScheduleCards days={schedule[scheduleType]} onDeleteDay={handleDeleteDay} />
                    <ScheduleFormModal isOpen={isAddDayModalOpen} onClose={() => setIsAddDayModalOpen(false)} onSave={handleAddDay} />
                </div>
            )}
        </div>
    );
}