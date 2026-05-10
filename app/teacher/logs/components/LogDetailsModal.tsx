"use client";
import React from 'react';
import { FaTimes, FaServer, FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';

interface Props {
    selectedDetails: any;
    onClose: () => void;
}

const getActionIcon = (type: string) => {
    switch(type) {
        case 'add': return <FaPlus color="#2ecc71" />;
        case 'edit': return <FaEdit color="#3498db" />;
        case 'delete': return <FaTrash color="#e74c3c" />;
        case 'view': return <FaEye color="#9b59b6" />;
        default: return <FaServer />;
    }
};

export const LogDetailsModal: React.FC<Props> = React.memo(({ selectedDetails, onClose }) => {
    if (!selectedDetails) return null;

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', zIndex: 99999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
            <div style={{ background: '#1a1a2e', width: '100%', maxWidth: '800px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)', padding: '25px', animation: 'fadeIn 0.2s ease', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px', marginBottom: '20px' }}>
                    <div>
                        <h3 style={{ margin: '0 0 5px 0', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {getActionIcon(selectedDetails.actionType)} تفاصيل العملية
                        </h3>
                        <div style={{ color: 'var(--txt-mut)', fontSize: '0.9rem' }}>بواسطة: {selectedDetails.user} | الوقت: <span style={{ direction: 'ltr', display: 'inline-block' }}>{selectedDetails.timestamp}</span></div>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--txt-mut)', cursor: 'pointer', fontSize: '1.2rem' }}><FaTimes /></button>
                </div>

                {selectedDetails.actionType === 'edit' && selectedDetails.details.oldState && (
                    <div style={{ display: 'flex', gap: '20px', flexDirection: 'row' }}>
                        <div style={{ flex: 1, background: 'rgba(231, 76, 60, 0.05)', border: '1px solid rgba(231, 76, 60, 0.2)', borderRadius: '10px', padding: '15px' }}>
                            <div style={{ color: '#e74c3c', fontWeight: 'bold', marginBottom: '10px', borderBottom: '1px solid rgba(231, 76, 60, 0.2)', paddingBottom: '5px' }}>البيانات القديمة (قبل التعديل)</div>
                            <pre style={{ margin: 0, color: 'var(--txt-mut)', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '0.9rem', direction: 'ltr', textAlign: 'left' }}>
                                {JSON.stringify(selectedDetails.details.oldState, null, 2)}
                            </pre>
                        </div>
                        <div style={{ flex: 1, background: 'rgba(46, 204, 113, 0.05)', border: '1px solid rgba(46, 204, 113, 0.2)', borderRadius: '10px', padding: '15px' }}>
                            <div style={{ color: '#2ecc71', fontWeight: 'bold', marginBottom: '10px', borderBottom: '1px solid rgba(46, 204, 113, 0.2)', paddingBottom: '5px' }}>البيانات الجديدة (بعد التعديل)</div>
                            <pre style={{ margin: 0, color: 'white', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '0.9rem', direction: 'ltr', textAlign: 'left' }}>
                                {JSON.stringify(selectedDetails.details.newState, null, 2)}
                            </pre>
                        </div>
                    </div>
                )}

                {selectedDetails.actionType !== 'edit' && (
                    <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '15px' }}>
                        <div style={{ color: 'white', fontWeight: 'bold', marginBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '5px' }}>حزمة البيانات المرفقة (Payload)</div>
                        <pre style={{ margin: 0, color: 'var(--p-purple)', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '0.95rem', direction: 'ltr', textAlign: 'left' }}>
                            {JSON.stringify(selectedDetails.details, null, 2)}
                        </pre>
                    </div>
                )}

                <div style={{ marginTop: '25px', textAlign: 'left' }}>
                    <button onClick={onClose} style={{ background: 'var(--card)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>إغلاق النافذة</button>
                </div>
            </div>
        </div>
    );
});