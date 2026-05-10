"use client";
import React, { useState, useEffect } from 'react';
import { FaTimes, FaUserShield } from 'react-icons/fa';

export interface Assistant {
    id: string;
    name: string;
    phone: string;
    permissions: string[];
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Assistant) => void;
    initialData?: Assistant | null;
}

const PERMISSIONS_LIST = [
    { id: 'courses', label: 'إدارة الكورسات' },
    { id: 'lessons', label: 'الحصص ومحتواها' },
    { id: 'homework_lessons', label: 'حصص حل الواجب' },
    { id: 'homework', label: 'إدارة الواجبات' },
    { id: 'exams', label: 'إدارة الامتحانات' },
    { id: 'question_banks', label: 'بنوك الأسئلة' },
    { id: 'library', label: 'المكتبة الخاصة' },
];

export const AssistantModal: React.FC<Props> = ({ isOpen, onClose, onSave, initialData }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [permissions, setPermissions] = useState<string[]>([]);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setPhone(initialData.phone);
            setPassword(''); 
            setPermissions(initialData.permissions);
        } else {
            setName('');
            setPhone('');
            setPassword('');
            setPermissions([]);
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleTogglePermission = (id: string) => {
        setPermissions(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const handleSubmit = () => {
        if (!name || !phone) return alert('يرجى إدخال الاسم ورقم الهاتف');
        onSave({
            id: initialData?.id || Date.now().toString(),
            name,
            phone,
            permissions
        });
        onClose();
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
            {/* 🚀 تم تبديل الخلفية الثابتة بـ var(--card) لتتفاعل مع السيم */}
            <div style={{ background: 'var(--card)', width: '100%', maxWidth: '600px', borderRadius: '15px', border: '1px solid rgba(128,128,128,0.2)', padding: '25px', animation: 'fadeIn 0.2s ease', maxHeight: '90vh', overflowY: 'auto' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                    <h2 style={{ margin: 0, color: 'var(--txt)', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.4rem' }}>
                        <FaUserShield color="#e67e22"/> {initialData ? 'تعديل بيانات المساعد' : 'إضافة مساعد جديد'}
                    </h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--txt-mut)', cursor: 'pointer', fontSize: '1.2rem' }}><FaTimes /></button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '0.9rem' }}>اسم المساعد</label>
                        <input type="text" placeholder="مثال: أحمد محمود" value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: '12px', background: 'rgba(128,128,128,0.05)', border: '1px solid rgba(128,128,128,0.2)', color: 'var(--txt)', borderRadius: '8px', outline: 'none' }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                            <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '0.9rem' }}>رقم الهاتف (تسجيل الدخول)</label>
                            <input type="text" placeholder="01xxxxxxxxx" value={phone} onChange={e => setPhone(e.target.value)} style={{ width: '100%', padding: '12px', background: 'rgba(128,128,128,0.05)', border: '1px solid rgba(128,128,128,0.2)', color: 'var(--txt)', borderRadius: '8px', outline: 'none', direction: 'ltr', textAlign: 'right' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '0.9rem' }}>كلمة المرور</label>
                            <input type="password" placeholder="كلمة المرور" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '12px', background: 'rgba(128,128,128,0.05)', border: '1px solid rgba(128,128,128,0.2)', color: 'var(--txt)', borderRadius: '8px', outline: 'none' }} />
                        </div>
                    </div>

                    {/* 🚀 مربع الصلاحيات أخد لون شفاف يتأقلم مع السيمين */}
                    <div style={{ background: 'rgba(128,128,128,0.05)', padding: '20px', borderRadius: '10px', border: '1px solid rgba(128,128,128,0.1)', marginTop: '10px' }}>
                        <h4 style={{ margin: '0 0 15px 0', color: 'var(--txt)', fontSize: '1.1rem', textAlign: 'center' }}>صلاحيات المساعد (ما يمكنه إدارته)</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            {PERMISSIONS_LIST.map(perm => (
                                <label key={perm.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--txt)', cursor: 'pointer' }}>
                                    <input type="checkbox" checked={permissions.includes(perm.id)} onChange={() => handleTogglePermission(perm.id)} style={{ width: '18px', height: '18px', accentColor: '#e67e22' }} />
                                    {perm.label}
                                </label>
                            ))}
                        </div>
                    </div>

                    <button onClick={handleSubmit} style={{ width: '100%', padding: '15px', background: '#e67e22', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', marginTop: '10px' }}>
                        حفظ بيانات المساعد
                    </button>
                </div>
            </div>
        </div>
    );
}