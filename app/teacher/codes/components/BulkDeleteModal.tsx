"use client";
import React, { useState } from 'react';
import { FaTimes, FaTrashAlt } from 'react-icons/fa';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    availableTimestamps: string[];
    onBulkDelete: (timestamp: string) => void;
}

export const BulkDeleteModal: React.FC<Props> = ({ isOpen, onClose, availableTimestamps, onBulkDelete }) => {
    const [selectedTimestamp, setSelectedTimestamp] = useState(availableTimestamps[0] || '');

    if (!isOpen) return null;

    const handleDelete = () => {
        if (!selectedTimestamp) return;
        if (confirm(`هل أنت متأكد من مسح جميع الأكواد (الغير مشحونة) التي تم توليدها في هذا الوقت: ${selectedTimestamp}؟ لا يمكن التراجع عن هذا الإجراء!`)) {
            onBulkDelete(selectedTimestamp);
            onClose();
        }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
            <div style={{ background: '#1a1a2e', width: '100%', maxWidth: '400px', borderRadius: '15px', border: '1px solid rgba(231, 76, 60, 0.3)', padding: '25px', animation: 'fadeIn 0.2s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0, color: '#e74c3c', display: 'flex', alignItems: 'center', gap: '10px' }}><FaTrashAlt /> حذف دفعة مسروقة</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--txt-mut)', cursor: 'pointer', fontSize: '1.2rem' }}><FaTimes /></button>
                </div>
                
                <p style={{ color: 'var(--txt-mut)', fontSize: '0.9rem', marginBottom: '20px', lineHeight: '1.5' }}>
                    اختر وقت التوليد بدقة. سيتم فحص ومسح جميع الأكواد التي صُنعت في هذه اللحظة (التي لم تُشحن بعد).
                </p>

                <select value={selectedTimestamp} onChange={e => setSelectedTimestamp(e.target.value)} style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none', marginBottom: '20px', direction: 'ltr' }}>
                    <option value="" disabled style={{ background: '#1e1e2d' }}>اختر دفعة (حسب الوقت)</option>
                    {availableTimestamps.map(ts => (
                        <option key={ts} value={ts} style={{ background: '#1e1e2d' }}>{ts}</option>
                    ))}
                </select>

                <button onClick={handleDelete} style={{ width: '100%', background: '#e74c3c', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
                    حذف الدفعة بالكامل
                </button>
            </div>
        </div>
    );
};