// FILE: app/teacher/homework/page.tsx
"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaBookOpen, FaPlus, FaSearch } from 'react-icons/fa';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { useToast } from '../../../context/ToastContext';

export default function TeacherHomeworkPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [search, setSearch] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newHomeworkName, setNewHomeworkName] = useState('');

    const [homeworks, setHomeworks] = useState([
        { id: 1, title: 'واجب الباب الأول - الجزء النظري', questionsCount: 10, date: '2026-04-18' },
    ]);

    const handleCreateHomework = () => {
        if (!newHomeworkName.trim()) {
            showToast('يرجى إدخال اسم الواجب', 'error');
            return;
        }
        const newId = Date.now();
        setHomeworks([{ id: newId, title: newHomeworkName, questionsCount: 0, date: new Date().toISOString().split('T')[0] }, ...homeworks]);
        setIsCreateModalOpen(false);
        setNewHomeworkName('');
        showToast('تم إنشاء الواجب! جاري تحويلك لوضع الأسئلة...', 'success');
        setTimeout(() => router.push(`/teacher/homework/${newId}`), 1000);
    };

    return (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', color: 'var(--txt)', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaBookOpen style={{ color: 'var(--p-purple)' }} /> إدارة الواجبات
                    </h1>
                    <p style={{ color: 'var(--txt-mut)' }}>أنشئ واجباتك هنا لتكون جاهزة للربط بالمسار التعليمي لاحقاً.</p>
                </div>
                <Button variant="primary" icon={<FaPlus />} onClick={() => setIsCreateModalOpen(true)}>
                    إضافة واجب جديد
                </Button>
            </div>

            <div style={{ background: 'var(--card)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', background: 'rgba(0,0,0,0.2)', padding: '10px 15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <FaSearch style={{ color: 'var(--p-purple)' }} />
                    <input type="text" placeholder="ابحث عن واجب..." value={search} onChange={e => setSearch(e.target.value)} style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }} />
                </div>

                <table style={{ width: '100%', textAlign: 'right', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--txt-mut)' }}>
                            <th style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>اسم الواجب</th>
                            <th style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>عدد الأسئلة</th>
                            <th style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>تاريخ الإنشاء</th>
                            <th style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>إدارة</th>
                        </tr>
                    </thead>
                    <tbody>
                        {homeworks.map(hw => (
                            <tr key={hw.id} style={{ borderBottom: '1px dashed rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '15px', fontWeight: 'bold', color: 'var(--txt)' }}>{hw.title}</td>
                                <td style={{ padding: '15px', color: 'var(--txt-mut)' }}>{hw.questionsCount} سؤال</td>
                                <td style={{ padding: '15px', color: 'var(--txt-mut)' }}>{hw.date}</td>
                                <td style={{ padding: '15px', textAlign: 'center' }}>
                                    <Button variant="outline" size="sm" onClick={() => router.push(`/teacher/homework/${hw.id}`)}>
                                        وضع الأسئلة
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="إضافة واجب جديد" maxWidth="450px">
                <div style={{ padding: '10px 0' }}>
                    <Input 
                        label="اسم الواجب" 
                        placeholder="مثال: واجب الباب الأول" 
                        value={newHomeworkName} 
                        onChange={e => setNewHomeworkName(e.target.value)} 
                        onKeyDown={(e) => e.key === 'Enter' && handleCreateHomework()}
                    />
                    <Button variant="primary" fullWidth onClick={handleCreateHomework} style={{ marginTop: '20px' }}>
                        حفظ ومتابعة
                    </Button>
                </div>
            </Modal>
        </div>
    );
}