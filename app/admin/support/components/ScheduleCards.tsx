// FILE: app/admin/support/components/ScheduleCards.tsx
"use client";
import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { SupportDay } from '../../../../types';

interface ScheduleCardsProps {
    days: SupportDay[];
    onDeleteDay: (dayId: string) => void;
}

export default function ScheduleCards({ days, onDeleteDay }: ScheduleCardsProps) {
    if (days.length === 0) {
        return <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--txt-mut)' }}>لا توجد مواعيد مضافة لهذا القسم.</div>;
    }

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
            {days.map(dayObj => (
                <div key={dayObj.id} style={{ background: 'var(--card)', borderRadius: '15px', padding: '25px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                    <button 
                        onClick={() => onDeleteDay(dayObj.id)} 
                        style={{ position: 'absolute', top: '15px', left: '15px', background: 'rgba(231,76,60,0.1)', color: 'var(--danger)', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', transition: '0.2s' }}
                    >
                        <FaTrash />
                    </button>
                    
                    <div style={{ borderBottom: '1px dashed rgba(255,255,255,0.15)', paddingBottom: '15px', marginBottom: '20px' }}>
                        <div style={{ fontWeight: '900', fontSize: '1.4rem', color: '#fff', marginBottom: '5px' }}>{dayObj.day}</div>
                        {/* 💡 يفضل عرض التاريخ بالفورمات المقروء حتى لو كان ISO Date في الداتا */}
                        <div style={{ color: 'var(--txt-mut)', fontSize: '0.9rem', fontWeight: 'bold', direction: 'ltr', textAlign: 'right' }}>{dayObj.date}</div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        {dayObj.slots.map(slot => (
                            <div key={slot.id} style={{ 
                                padding: '10px', borderRadius: '8px', textAlign: 'center', fontSize: '0.9rem', fontWeight: 'bold', fontFamily: 'monospace',
                                border: slot.isBooked ? '1px solid rgba(231,76,60,0.3)' : '1px solid rgba(255,255,255,0.1)',
                                color: slot.isBooked ? '#e74c3c' : '#fff',
                                background: slot.isBooked ? 'rgba(231,76,60,0.05)' : 'transparent',
                            }}>
                                {slot.time} {slot.isBooked && '(محجوز)'}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}