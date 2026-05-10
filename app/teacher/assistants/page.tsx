"use client";
import React, { useState, useEffect } from 'react';
import { FaUserShield, FaPlus, FaEdit, FaTrash, FaCheck, FaPhoneAlt } from 'react-icons/fa';
import { AssistantModal, Assistant } from './components/AssistantModal';

const MOCK_ASSISTANTS: Assistant[] = [
    { id: '1', name: 'أحمد محمود', phone: '01012345678', permissions: ['exams', 'homework', 'question_banks'] },
    { id: '2', name: 'سارة طارق', phone: '01198765432', permissions: ['library', 'courses', 'lessons'] }
];

export default function AssistantsPage() {
    const [isMounted, setIsMounted] = useState(false);
    const [assistants, setAssistants] = useState<Assistant[]>(MOCK_ASSISTANTS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAssistant, setEditingAssistant] = useState<Assistant | null>(null);

    useEffect(() => { setIsMounted(true); }, []);
    if (!isMounted) return null;

    const handleSave = (data: Assistant) => {
        if (editingAssistant) {
            setAssistants(assistants.map(a => a.id === data.id ? data : a));
        } else {
            setAssistants([...assistants, data]);
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('هل أنت متأكد من مسح حساب هذا المساعد؟ لن يتمكن من الدخول للمنصة بعد الآن.')) {
            setAssistants(assistants.filter(a => a.id !== id));
        }
    };

    return (
        <div style={{ animation: 'fadeIn 0.4s ease', maxWidth: '1200px', margin: '0 auto', paddingBottom: '50px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', marginTop: '20px', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    {/* 🚀 تم تعديل اللون هنا لـ var(--txt) */}
                    <h1 style={{ fontSize: '1.8rem', margin: '0 0 5px 0', color: 'var(--txt)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaUserShield color="#e67e22" /> فريق المساعدين
                    </h1>
                    <p style={{ color: 'var(--txt-mut)', margin: 0 }}>إدارة حسابات وصلاحيات فريق العمل الخاص بك.</p>
                </div>
                <button onClick={() => { setEditingAssistant(null); setIsModalOpen(true); }} style={{ background: '#e67e22', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', transition: '0.2s', boxShadow: '0 5px 15px rgba(230, 126, 34, 0.3)' }} className="btn-hover">
                    <FaPlus /> إضافة مساعد جديد
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {assistants.map(assistant => (
                    /* 🚀 تم تعديل البوردر ليتوافق مع الـ Light/Dark */
                    <div key={assistant.id} style={{ background: 'var(--card)', borderRadius: '15px', padding: '25px', border: '1px solid rgba(128,128,128,0.2)', position: 'relative' }}>
                        
                        <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '10px' }}>
                            <button onClick={() => { setEditingAssistant(assistant); setIsModalOpen(true); }} style={{ background: 'rgba(52, 152, 219, 0.1)', color: '#3498db', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }} title="تعديل"><FaEdit /></button>
                            <button onClick={() => handleDelete(assistant.id)} style={{ background: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }} title="حذف"><FaTrash /></button>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(230, 126, 34, 0.1)', color: '#e67e22', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.8rem' }}>
                                <FaUserShield />
                            </div>
                            <div>
                                {/* 🚀 تم تعديل اللون هنا لـ var(--txt) */}
                                <h3 style={{ margin: '0 0 5px 0', color: 'var(--txt)', fontSize: '1.2rem' }}>{assistant.name}</h3>
                                <div style={{ color: 'var(--txt-mut)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}><FaPhoneAlt size={12}/> {assistant.phone}</div>
                            </div>
                        </div>

                        {/* 🚀 تم تعديل البوردر هنا أيضاً */}
                        <div style={{ borderTop: '1px solid rgba(128,128,128,0.2)', paddingTop: '15px' }}>
                            <strong style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '10px', fontSize: '0.9rem' }}>الصلاحيات الممنوحة ({assistant.permissions.length}):</strong>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {assistant.permissions.length === 0 ? (
                                    <span style={{ color: '#e74c3c', fontSize: '0.85rem' }}>لا يوجد صلاحيات</span>
                                ) : (
                                    assistant.permissions.map(perm => (
                                        <span key={perm} style={{ background: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71', border: '1px solid rgba(46, 204, 113, 0.2)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <FaCheck size={10}/> {perm}
                                        </span>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <AssistantModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} initialData={editingAssistant} />
        </div>
    );
}