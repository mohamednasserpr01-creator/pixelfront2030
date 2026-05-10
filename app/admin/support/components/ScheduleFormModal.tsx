// FILE: app/admin/support/components/ScheduleFormModal.tsx
"use client";
import React, { useState } from 'react';
import { SupportDay, SupportSlot } from '../../../../types';
import { Modal } from '../../../../components/ui/Modal';
import { Button } from '../../../../components/ui/Button';

interface ScheduleFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newDay: SupportDay) => void;
}

export default function ScheduleFormModal({ isOpen, onClose, onSave }: ScheduleFormModalProps) {
    const [formData, setFormData] = useState({
        day: 'السبت',
        date: '',
        slots: '10:00 ص, 11:30 ص, 01:00 م'
    });

    const handleSubmit = () => {
        if (!formData.date || !formData.slots) return;

        // 💡 توليد Slots قوية بـ Unique IDs
        const generatedSlots: SupportSlot[] = formData.slots.split(',').map((s, idx) => ({
            id: `slot_${Date.now()}_${idx}`,
            time: s.trim(),
            isBooked: false
        })).filter(s => s.time !== '');

        const newDay: SupportDay = {
            id: `day_${Date.now()}`,
            day: formData.day,
            date: formData.date,
            slots: generatedSlots
        };

        onSave(newDay);
        setFormData({ day: 'السبت', date: '', slots: '10:00 ص, 11:30 ص, 01:00 م' }); // Reset
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="إضافة يوم عمل جديد" maxWidth="500px">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '10px 0' }}>
                <div>
                    <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '5px' }}>اليوم</label>
                    <select 
                        value={formData.day} 
                        onChange={e => setFormData({...formData, day: e.target.value})} 
                        style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 15px', borderRadius: '10px', color: 'white', width: '100%', outline: 'none' }}
                    >
                        {['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'].map(d => <option key={d} value={d} style={{background: '#1e1e2d'}}>{d}</option>)}
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '5px' }}>التاريخ (يفضل بصيغة YYYY-MM-DD)</label>
                    <input 
                        type="date" 
                        value={formData.date} 
                        onChange={e => setFormData({...formData, date: e.target.value})} 
                        style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 15px', borderRadius: '10px', color: 'white', width: '100%', outline: 'none', colorScheme: 'dark' }} 
                    />
                </div>
                <div>
                    <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '5px' }}>المواعيد المتاحة (افصل بينها بفاصلة)</label>
                    <textarea 
                        rows={3} 
                        value={formData.slots} 
                        onChange={e => setFormData({...formData, slots: e.target.value})} 
                        style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 15px', borderRadius: '10px', color: 'white', width: '100%', outline: 'none', resize: 'none', lineHeight: '1.6' }} 
                        placeholder="مثال: 10:00 ص, 11:30 ص, 01:00 م"
                    />
                    <div style={{ fontSize: '0.8rem', color: '#0984e3', marginTop: '5px' }}>* سيتم إضافة هذه المواعيد كـ "متاحة للحجز" أوتوماتيكياً.</div>
                </div>
                <Button variant="primary" fullWidth onClick={handleSubmit} style={{ marginTop: '10px', background: '#0984e3' }}>حفظ وإضافة للجدول</Button>
            </div>
        </Modal>
    );
}