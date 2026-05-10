"use client";
import React, { useState, useEffect } from 'react';
import { FaTimes, FaClock, FaLock, FaCog } from 'react-icons/fa';
import { Lecture } from '../types/curriculum.types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    lecture: Lecture | null;
    onSave: (lectureId: string, updates: Partial<Lecture>) => void;
}

export const LectureSettingsModal: React.FC<Props> = ({ isOpen, onClose, lecture, onSave }) => {
    const [publishDate, setPublishDate] = useState('');
    const [expireAfterDays, setExpireAfterDays] = useState(0);
    const [stopNewPurchases, setStopNewPurchases] = useState(false);
    const [lockForAll, setLockForAll] = useState(false);

    useEffect(() => {
        if (lecture) {
            setPublishDate(lecture.publishDate || '');
            setExpireAfterDays(lecture.expireAfterDays || 0);
            setStopNewPurchases(lecture.stopNewPurchases || false);
            setLockForAll(lecture.lockForAll || false);
        }
    }, [lecture]);

    if (!isOpen || !lecture) return null;

    const handleSave = () => {
        onSave(lecture.id, {
            publishDate,
            expireAfterDays,
            stopNewPurchases,
            lockForAll
        });
        onClose();
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', animation: 'fadeIn 0.2s ease' }}>
            <div style={{ width: '100%', maxWidth: '500px', background: '#1e1e2d', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                
                <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--card)', borderRadius: '15px 15px 0 0' }}>
                    <h3 style={{ margin: 0, color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaCog color="var(--p-purple)"/> إعدادات المحاضرة
                    </h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--txt-mut)', cursor: 'pointer' }}><FaTimes size={20} /></button>
                </div>

                <div style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* الجدولة والصلاحية */}
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <h4 style={{ margin: '0 0 15px 0', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}><FaClock color="#f1c40f"/> إعدادات الجدولة والصلاحية</h4>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '0.85rem' }}>تاريخ إتاحة المحاضرة بالكامل</label>
                            <input type="datetime-local" value={publishDate} onChange={e => setPublishDate(e.target.value)} style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '0.85rem' }}>تُغلق تلقائياً بعد (يوم من نزولها أو شرائها)</label>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <input type="number" min={0} value={expireAfterDays} onChange={e => setExpireAfterDays(Number(e.target.value))} style={{ width: '80px', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none', textAlign: 'center' }} />
                                <span style={{ fontSize: '0.8rem', color: '#f1c40f' }}>{expireAfterDays === 0 ? 'متاحة دائماً' : 'أيام'}</span>
                            </div>
                        </div>
                    </div>

                    {/* الغلق المنفصل */}
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <h4 style={{ margin: '0 0 15px 0', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}><FaLock color="#e74c3c"/> إعدادات الغلق المتقدمة</h4>
                        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px', cursor: 'pointer' }}>
                            <div>
                                <div style={{ color: 'white', fontSize: '0.9rem', marginBottom: '3px' }}>إيقاف بيع المحاضرة منفردة</div>
                                <div style={{ color: 'var(--txt-mut)', fontSize: '0.75rem' }}>متاحة فقط لمن اشتراها أو اشترى الكورس مسبقاً.</div>
                            </div>
                            <input type="checkbox" checked={stopNewPurchases} onChange={e => setStopNewPurchases(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: '#f39c12' }} />
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                            <div>
                                <div style={{ color: '#e74c3c', fontSize: '0.9rem', marginBottom: '3px', fontWeight: 'bold' }}>غلق المحاضرة تماماً</div>
                                <div style={{ color: 'var(--txt-mut)', fontSize: '0.75rem' }}>منع الدخول حتى للمشتركين فيها.</div>
                            </div>
                            <input type="checkbox" checked={lockForAll} onChange={e => setLockForAll(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: '#e74c3c' }} />
                        </label>
                    </div>

                    <button onClick={handleSave} style={{ width: '100%', background: 'var(--p-purple)', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '5px' }}>
                        حفظ إعدادات المحاضرة
                    </button>
                </div>
            </div>
        </div>
    );
};