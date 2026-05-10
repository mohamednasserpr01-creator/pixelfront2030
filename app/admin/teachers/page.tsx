// FILE: app/admin/teachers/page.tsx
"use client";
import React, { useState } from 'react';
import { 
    FaChalkboardTeacher, FaPlus, FaBan, FaCheckCircle, 
    FaUserEdit, FaTrash, FaBookOpen, FaUsers, FaArrowRight, FaExclamationTriangle, FaInfoCircle 
} from 'react-icons/fa';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { useToast } from '../../../context/ToastContext';

export default function TeachersManagement() {
    const { showToast } = useToast();
    
    // حالات التنقل
    const [activeTab, setActiveTab] = useState<'accepted' | 'banned'>('accepted');
    const [view, setView] = useState<'table' | 'form'>('table');
    
    // حالات الفورم (تم إزالة المادة من هنا)
    const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
    const [formData, setFormData] = useState({ id: 0, name: '', phone: '', password: '' });

    // حالات الـ Modal (حظر / فك حظر / حذف)
    const [modalConfig, setModalConfig] = useState<{ isOpen: boolean, type: 'ban' | 'unban' | 'delete', teacher: any }>({
        isOpen: false, type: 'ban', teacher: null
    });

    // داتا المدرسين (المواد بقت Array عشان ممكن يدرس أكتر من مادة)
    const [teachers, setTeachers] = useState([
        { id: 1, name: 'أ. محمود الجوهري', phone: '01011122233', subjects: ['اللغة العربية', 'التربية الدينية'], status: 'accepted', coursesCount: 5, studentsCount: 1200 },
        { id: 2, name: 'م. خالد عبد الرحمن', phone: '01122233344', subjects: ['الفيزياء'], status: 'accepted', coursesCount: 3, studentsCount: 850 },
        { id: 3, name: 'سنيورا بهيرة', phone: '01233344455', subjects: ['اللغة الإيطالية'], status: 'accepted', coursesCount: 8, studentsCount: 3400 },
        { id: 4, name: 'أ. طارق سعيد', phone: '01544455566', subjects: ['الكيمياء'], status: 'banned', coursesCount: 2, studentsCount: 150 },
    ]);

    // 🟢 فتح فورم الإضافة
    const openAddForm = () => {
        setFormData({ id: 0, name: '', phone: '', password: '' });
        setFormMode('add');
        setView('form');
    };

    // 🟡 فتح فورم التعديل
    const openEditForm = (teacher: any) => {
        setFormData({ ...teacher, password: '' });
        setFormMode('edit');
        setView('form');
    };

    // 💾 حفظ البيانات (إضافة أو تعديل)
    const handleSave = () => {
        if (!formData.name || !formData.phone) {
            showToast('يرجى ملء الاسم ورقم الهاتف', 'error');
            return;
        }

        if (formMode === 'add') {
            const newTeacher = { 
                ...formData, 
                id: Date.now(), 
                status: 'accepted', 
                coursesCount: 0, 
                studentsCount: 0,
                subjects: [] // 💡 هينزل فاضي والمدرس يضيفه بعدين
            };
            setTeachers([newTeacher, ...teachers]);
            showToast('تم إنشاء حساب المدرس بنجاح! 🎉', 'success');
        } else {
            setTeachers(teachers.map(t => t.id === formData.id ? { ...t, name: formData.name, phone: formData.phone } : t));
            showToast('تم تعديل بيانات المدرس بنجاح! 💾', 'success');
        }
        setView('table');
    };

    // ⚡ تنفيذ الإجراءات (حظر / فك حظر / حذف)
    const executeAction = () => {
        if (!modalConfig.teacher) return;

        if (modalConfig.type === 'delete') {
            setTeachers(teachers.filter(t => t.id !== modalConfig.teacher.id));
            showToast('تم حذف المدرس نهائياً 🗑️', 'success');
        } else if (modalConfig.type === 'ban') {
            setTeachers(teachers.map(t => t.id === modalConfig.teacher.id ? { ...t, status: 'banned' } : t));
            showToast('تم حظر المدرس وإيقاف كورساته 🚫', 'error');
        } else if (modalConfig.type === 'unban') {
            setTeachers(teachers.map(t => t.id === modalConfig.teacher.id ? { ...t, status: 'accepted' } : t));
            showToast('تم فك الحظر عن المدرس بنجاح ✅', 'success');
        }
        setModalConfig({ isOpen: false, type: 'ban', teacher: null });
    };

    const filteredTeachers = teachers.filter(t => t.status === activeTab);

    return (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', color: 'var(--txt)', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaChalkboardTeacher style={{ color: 'var(--p-purple)' }} /> إدارة المدرسين
                    </h1>
                    <p style={{ color: 'var(--txt-mut)' }}>إضافة المدرسين، متابعة المقبولين، وإدارة المحظورين.</p>
                </div>
                {view === 'table' ? (
                    <Button variant="primary" icon={<FaPlus />} onClick={openAddForm}>
                        إضافة مدرس جديد
                    </Button>
                ) : (
                    <Button variant="outline" icon={<FaArrowRight />} onClick={() => setView('table')}>
                        العودة للقائمة
                    </Button>
                )}
            </div>

            {/* Tabs */}
            {view === 'table' && (
                <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', background: 'var(--card)', padding: '10px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <button 
                        onClick={() => setActiveTab('accepted')}
                        style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s', background: activeTab === 'accepted' ? 'var(--success)' : 'transparent', color: activeTab === 'accepted' ? 'white' : 'var(--txt)' }}
                    >
                        <FaCheckCircle style={{ margin: '0 8px' }} /> المدرسين المقبولين
                    </button>
                    <button 
                        onClick={() => setActiveTab('banned')}
                        style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s', background: activeTab === 'banned' ? 'var(--danger)' : 'transparent', color: activeTab === 'banned' ? 'white' : 'var(--txt)' }}
                    >
                        <FaBan style={{ margin: '0 8px' }} /> المدرسين المحظورين
                    </button>
                </div>
            )}

            {/* ========================================= */}
            {/* 1. جدول المدرسين */}
            {/* ========================================= */}
            {view === 'table' && (
                <div style={{ background: 'var(--card)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', textAlign: 'right', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--txt-mut)' }}>
                                    <th style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>الاسم</th>
                                    <th style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>المواد الدراسية</th>
                                    <th style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>إحصائيات</th>
                                    <th style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>إجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTeachers.length > 0 ? filteredTeachers.map(teacher => (
                                    <tr key={teacher.id} style={{ borderBottom: '1px dashed rgba(255,255,255,0.05)', transition: '0.3s' }}>
                                        <td style={{ padding: '20px' }}>
                                            <div style={{ fontWeight: 'bold', color: 'var(--txt)' }}>{teacher.name}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--txt-mut)' }}>{teacher.phone}</div>
                                        </td>
                                        <td style={{ padding: '20px' }}>
                                            {/* 💡 عرض المواد كـ Array */}
                                            {teacher.subjects && teacher.subjects.length > 0 ? (
                                                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                                    {teacher.subjects.map((sub, idx) => (
                                                        <span key={idx} style={{ background: 'rgba(108,92,231,0.1)', color: 'var(--p-purple)', padding: '4px 10px', borderRadius: '5px', fontSize: '0.85rem', fontWeight: 'bold' }}>{sub}</span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span style={{ color: 'var(--warning)', fontSize: '0.85rem' }}>لم يحدد بعد</span>
                                            )}
                                        </td>
                                        <td style={{ padding: '20px' }}>
                                            <div style={{ display: 'flex', gap: '15px', color: 'var(--txt-mut)', fontSize: '0.9rem' }}>
                                                <span title="عدد الكورسات"><FaBookOpen style={{ color: 'var(--warning)' }} /> {teacher.coursesCount}</span>
                                                <span title="إجمالي الطلاب"><FaUsers style={{ color: 'var(--success)' }} /> {teacher.studentsCount}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '20px', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                                                <button onClick={() => openEditForm(teacher)} title="تعديل البيانات" style={{ background: 'none', border: 'none', color: 'var(--warning)', cursor: 'pointer', fontSize: '1.2rem' }}><FaUserEdit /></button>
                                                
                                                {activeTab === 'accepted' ? (
                                                    <button onClick={() => setModalConfig({ isOpen: true, type: 'ban', teacher })} title="حظر المدرس" style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '1.2rem' }}><FaBan /></button>
                                                ) : (
                                                    <button onClick={() => setModalConfig({ isOpen: true, type: 'unban', teacher })} title="فك الحظر" style={{ background: 'none', border: 'none', color: 'var(--success)', cursor: 'pointer', fontSize: '1.2rem' }}><FaCheckCircle /></button>
                                                )}
                                                
                                                <button onClick={() => setModalConfig({ isOpen: true, type: 'delete', teacher })} title="حذف المدرس" style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '1.2rem', opacity: 0.7 }}><FaTrash /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={4} style={{ padding: '30px', textAlign: 'center', color: 'var(--txt-mut)' }}>لا يوجد مدرسين في هذه القائمة.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ========================================= */}
            {/* 2. شاشة الفورم (إضافة أو تعديل) */}
            {/* ========================================= */}
            {view === 'form' && (
                <div style={{ background: 'var(--card)', padding: '30px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', animation: 'fadeIn 0.3s ease' }}>
                    <h2 style={{ marginBottom: '25px', color: 'var(--txt)', fontWeight: 900 }}>
                        {formMode === 'add' ? 'إضافة مدرس جديد' : 'تعديل بيانات المدرس'}
                    </h2>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                        <Input label="اسم المدرس" placeholder="أدخل الاسم أو اللقب (مثل: سنيورا بهيرة)" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                        <Input label="رقم الهاتف (لتسجيل الدخول)" placeholder="01xxxxxxxxx" type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                        <Input label={formMode === 'add' ? "كلمة المرور" : "كلمة المرور الجديدة (اختياري)"} placeholder="********" type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                    </div>

                    <div style={{ background: 'rgba(241, 196, 15, 0.1)', border: '1px solid var(--warning)', padding: '15px', borderRadius: '10px', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--warning)' }}>
                        <FaInfoCircle style={{ fontSize: '1.2rem' }} />
                        <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 'bold' }}>ملاحظة: يقوم المدرس بإضافة وتعديل مواده الدراسية من خلال لوحة التحكم الخاصة به بعد تسجيل الدخول.</p>
                    </div>

                    <div style={{ display: 'flex', gap: '15px' }}>
                        <Button variant="primary" icon={<FaCheckCircle />} onClick={handleSave}>
                            {formMode === 'add' ? 'حفظ وإنشاء حساب المدرس' : 'حفظ التعديلات'}
                        </Button>
                        <Button variant="outline" onClick={() => setView('table')}>إلغاء</Button>
                    </div>
                </div>
            )}

            {/* ========================================= */}
            {/* Modal تأكيد الإجراءات */}
            {/* ========================================= */}
            <Modal 
                isOpen={modalConfig.isOpen} 
                onClose={() => setModalConfig({ isOpen: false, type: 'ban', teacher: null })} 
                title={modalConfig.type === 'delete' ? 'تأكيد الحذف' : (modalConfig.type === 'ban' ? 'تأكيد الحظر' : 'تأكيد فك الحظر')}
                maxWidth="400px"
            >
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                    <FaExclamationTriangle style={{ fontSize: '3rem', color: modalConfig.type === 'unban' ? 'var(--success)' : 'var(--danger)', marginBottom: '15px' }} />
                    <p style={{ fontSize: '1.1rem', color: 'var(--txt)', marginBottom: '10px' }}>
                        هل أنت متأكد من {modalConfig.type === 'delete' ? 'حذف' : (modalConfig.type === 'ban' ? 'حظر' : 'فك حظر')} المدرس <strong>{modalConfig.teacher?.name}</strong>؟
                    </p>
                    
                    {modalConfig.type === 'ban' && <p style={{ fontSize: '0.9rem', color: 'var(--txt-mut)', marginBottom: '25px' }}>سيتم إخفاء جميع كورساته عن الطلاب الجدد.</p>}
                    {modalConfig.type === 'delete' && <p style={{ fontSize: '0.9rem', color: 'var(--txt-mut)', marginBottom: '25px' }}>هذا الإجراء نهائي ولا يمكن التراجع عنه.</p>}

                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '20px' }}>
                        <Button variant="outline" onClick={() => setModalConfig({ isOpen: false, type: 'ban', teacher: null })}>تراجع</Button>
                        <Button variant="primary" style={{ background: modalConfig.type === 'unban' ? 'var(--success)' : 'var(--danger)' }} onClick={executeAction}>
                            نعم، قم بالتأكيد
                        </Button>
                    </div>
                </div>
            </Modal>

        </div>
    );
}