"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaBookOpen, FaPlus, FaSearch, FaTrash, FaEdit, FaGraduationCap } from 'react-icons/fa';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { useToast } from '../../../context/ToastContext';
import { homeworkService } from '../../../features/teacherHomeworks/services/homeworkService';

const API_BASE_URL = 'http://localhost:5290/api';

export default function TeacherHomeworkPage() {
    const router = useRouter();
    const { showToast } = useToast();
    
    const [search, setSearch] = useState('');
    const [activeStage, setActiveStage] = useState('all');
    const [stagesList, setStagesList] = useState<any[]>([]);
    
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newHomework, setNewHomework] = useState({ title: '', stage: '' });
    
    const [homeworks, setHomeworks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        const fetchStages = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const res = await fetch(`${API_BASE_URL}/educational-stages`, { headers: { 'Authorization': `Bearer ${token}` } });
                if (res.ok) {
                    const result = await res.json();
                    const stagesArray = result.data || result.items || result || [];
                    setStagesList([{ id: 'all', name: 'جميع المراحل' }, ...stagesArray]);
                }
            } catch (error) { console.error("Error fetching stages:", error); }
        };
        fetchStages();
    }, []);

    const fetchHomeworks = async () => {
        setIsLoading(true);
        try {
            const data = await homeworkService.getAll(activeStage);
            setHomeworks(data);
        } catch (error) {
            showToast('فشل في تحميل الواجبات', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchHomeworks(); }, [activeStage]);

    const handleCreateHomework = async () => {
        if (!newHomework.title.trim() || !newHomework.stage) {
            showToast('يرجى إدخال اسم الواجب واختيار المرحلة', 'error');
            return;
        }
        setIsCreating(true);
        try {
            const newHw = await homeworkService.create(newHomework);
            showToast('تم إنشاء الواجب بنجاح!', 'success');
            setIsCreateModalOpen(false);
            setNewHomework({ title: '', stage: '' });
            setTimeout(() => router.push(`/teacher/homework/${newHw.id}`), 1000);
        } catch (error: any) {
            showToast(error.message || 'خطأ في الإنشاء', 'error');
        } finally {
            setIsCreating(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('هل أنت متأكد من مسح الواجب نهائياً؟')) return;
        try {
            await homeworkService.delete(id);
            showToast('تم المسح بنجاح', 'success');
            fetchHomeworks();
        } catch (error) { showToast('فشل المسح', 'error'); }
    };

    const filteredHomeworks = homeworks.filter(hw => hw.title?.includes(search));

    return (
        /* 🚀 تأمين الشاشة بالكامل ومنع أي عنصر من التمدد خارجها */
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '100vw', boxSizing: 'border-box', overflowX: 'hidden', padding: '10px', animation: 'fadeIn 0.5s ease' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px', width: '100%' }}>
                <div style={{ flex: '1 1 100%' }}>
                    <h1 style={{ fontSize: '1.5rem', color: 'var(--txt)', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 5px 0' }}>
                        <FaBookOpen style={{ color: '#f39c12' }} /> إدارة الواجبات
                    </h1>
                    <p style={{ color: 'var(--txt-mut)', fontSize: '0.9rem', margin: 0 }}>أنشئ واجباتك هنا وخصصها حسب المرحلة.</p>
                </div>
                <div style={{ flex: '1 1 100%' }}>
                    <Button variant="primary" icon={<FaPlus />} onClick={() => setIsCreateModalOpen(true)} style={{ width: '100%', justifyContent: 'center', background: '#f39c12', color: '#fff', border: 'none' }}>
                        إضافة واجب جديد
                    </Button>
                </div>
            </div>

            <div style={{ background: 'var(--card)', padding: '15px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', width: '100%', boxSizing: 'border-box' }}>
                
                {/* 🚀 سكرول آمن للمراحل */}
                {stagesList.length > 0 && (
                    <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '15px', borderBottom: '1px dashed rgba(255,255,255,0.1)', WebkitOverflowScrolling: 'touch', width: '100%' }}>
                        {stagesList.map(stage => (
                            <button key={stage.id} onClick={() => setActiveStage(stage.id.toString())}
                                style={{
                                    padding: '8px 15px', borderRadius: '30px', whiteSpace: 'nowrap', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', flexShrink: 0, fontSize: '0.9rem',
                                    border: activeStage === stage.id.toString() ? 'none' : '1px solid rgba(255,255,255,0.1)', 
                                    background: activeStage === stage.id.toString() ? '#f39c12' : 'transparent', 
                                    color: activeStage === stage.id.toString() ? 'white' : 'var(--txt-mut)'
                                }}>
                                <FaGraduationCap /> {stage.name}
                            </button>
                        ))}
                    </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', background: 'rgba(0,0,0,0.2)', padding: '10px 15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)', width: '100%', boxSizing: 'border-box' }}>
                    <FaSearch style={{ color: '#f39c12', flexShrink: 0 }} />
                    <input type="text" placeholder="ابحث عن واجب..." value={search} onChange={e => setSearch(e.target.value)} style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }} />
                </div>

                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '30px', color: 'var(--txt-mut)' }}>جاري التحميل... ⏳</div>
                ) : (
                    /* 🚀 الحاوية السحرية لمنع تمدد الشاشة بسبب الجدول */
                    <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: '10px' }}>
                        <table style={{ width: '100%', minWidth: '600px', textAlign: 'right', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--txt-mut)' }}>
                                    <th style={{ padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>اسم الواجب</th>
                                    <th style={{ padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>المرحلة</th>
                                    <th style={{ padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>عدد الأسئلة</th>
                                    <th style={{ padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>إدارة</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredHomeworks.length > 0 ? filteredHomeworks.map(hw => {
                                    const hwStageStr = String(hw.stage || '').toLowerCase();
                                    const stageName = stagesList.find(s => String(s.id || '').toLowerCase() === hwStageStr)?.name || 'غير محددة';
                                    
                                    return (
                                        <tr key={hw.id} style={{ borderBottom: '1px dashed rgba(255,255,255,0.05)' }}>
                                            <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--txt)', whiteSpace: 'nowrap' }}>
                                                {hw.title}
                                                <div style={{ color: 'var(--txt-mut)', fontSize: '0.75rem', marginTop: '5px' }}>{new Date(hw.createdAt).toLocaleDateString('ar-EG')}</div>
                                            </td>
                                            <td style={{ padding: '12px', whiteSpace: 'nowrap' }}><span style={{ background: 'rgba(243, 156, 18, 0.1)', color: '#f39c12', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold' }}>{stageName}</span></td>
                                            <td style={{ padding: '12px', color: 'var(--txt-mut)', whiteSpace: 'nowrap' }}>{hw.questionsCount || 0} سؤال</td>
                                            <td style={{ padding: '12px', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                    <button onClick={() => router.push(`/teacher/homework/${hw.id}`)} style={{ background: 'rgba(243, 156, 18, 0.1)', color: '#f39c12', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', fontWeight: 'bold' }}><FaEdit /> وضع الأسئلة</button>
                                                    <button onClick={() => handleDelete(hw.id)} style={{ background: 'rgba(231,76,60,0.1)', color: 'var(--danger)', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', fontWeight: 'bold' }}><FaTrash /> مسح</button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                }) : <tr><td colSpan={4} style={{ textAlign: 'center', padding: '30px', color: 'var(--txt-mut)' }}>لا توجد واجبات.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="إضافة واجب جديد" maxWidth="400px">
                <div style={{ padding: '10px 0', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <Input label="اسم الواجب" placeholder="مثال: واجب الدرس الأول" value={newHomework.title} onChange={e => setNewHomework({...newHomework, title: e.target.value})} />
                    <div>
                        <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>المرحلة الدراسية</label>
                        <select value={newHomework.stage} onChange={e => setNewHomework({...newHomework, stage: e.target.value})} style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '10px', outline: 'none' }}>
                            <option value="" disabled style={{background: '#1e1e2d'}}>-- اختر المرحلة الدراسية --</option>
                            {stagesList.filter(s => s.id !== 'all').map(s => <option key={s.id} value={s.id} style={{background: '#1e1e2d'}}>{s.name}</option>)}
                        </select>
                    </div>
                    <Button variant="primary" fullWidth onClick={handleCreateHomework} style={{ marginTop: '10px', background: '#f39c12', color: '#fff', border: 'none' }} disabled={isCreating}>
                        {isCreating ? 'جاري الإنشاء...' : 'حفظ ومتابعة'}
                    </Button>
                </div>
            </Modal>
        </div>
    );
}