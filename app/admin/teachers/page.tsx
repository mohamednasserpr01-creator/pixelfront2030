"use client";
import React, { useState, useEffect } from 'react';
import { 
    FaChalkboardTeacher, FaPlus, FaBan, FaCheckCircle, 
    FaUserEdit, FaTrash, FaBookOpen, FaFileExcel, FaDownload, FaInfoCircle, FaExclamationTriangle, FaArrowRight
} from 'react-icons/fa';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { useToast } from '../../../context/ToastContext';

const API_BASE_URL = 'http://localhost:5000/api';

export default function TeachersManagement() {
    const { showToast } = useToast();
    const [mounted, setMounted] = useState(false);
    
    const [activeTab, setActiveTab] = useState<'accepted' | 'banned'>('accepted');
    const [view, setView] = useState<'table' | 'form'>('table');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
    const [formData, setFormData] = useState({ id: '', name: '', phone: '', password: '' });

    const [modalConfig, setModalConfig] = useState<{ isOpen: boolean, type: 'ban' | 'unban' | 'delete', teacher: any }>({
        isOpen: false, type: 'ban', teacher: null
    });

    const [exportConfig, setExportConfig] = useState({ isOpen: false, teacherId: null, teacherName: '' });
    const [selectedStage, setSelectedStage] = useState('الكل');
    const [isExporting, setIsExporting] = useState(false);

    const [teachers, setTeachers] = useState<any[]>([]);
    const [educationalStages, setEducationalStages] = useState<any[]>([]);
    const [isStagesLoading, setIsStagesLoading] = useState(true);

    const fetchTeachers = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/teachers`);
            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data)) setTeachers(data);
                else if (data && Array.isArray(data.data)) setTeachers(data.data);
                else if (data && Array.isArray(data.items)) setTeachers(data.items);
                else setTeachers([]);
            } else setTeachers([]);
        } catch (error) {
            setTeachers([]);
        } finally {
            setIsLoading(false);
        }
    };

    // 🚀 تم تصحيح الرابط هنا ليتطابق مع الـ Route في الباك إند
    const fetchStages = async () => {
        setIsStagesLoading(true);
        try {
            // الرابط الصح بالشرطة (-)
            const response = await fetch(`${API_BASE_URL}/educational-stages`);
            if (response.ok) {
                const data = await response.json();
                
                let extractedStages = [];
                if (Array.isArray(data)) extractedStages = data;
                else if (data?.data && Array.isArray(data.data)) extractedStages = data.data;
                else if (data?.items && Array.isArray(data.items)) extractedStages = data.items;
                else if (data?.result && Array.isArray(data.result)) extractedStages = data.result;
                else if (data?.value && Array.isArray(data.value)) extractedStages = data.value;

                setEducationalStages(extractedStages);
            }
        } catch (error) {
            console.error("Failed to fetch educational stages", error);
        } finally {
            setIsStagesLoading(false);
        }
    };

    useEffect(() => {
        setMounted(true);
        fetchTeachers();
        fetchStages();
    }, []);

    const openAddForm = () => {
        setFormData({ id: '', name: '', phone: '', password: '' });
        setFormMode('add');
        setView('form');
    };

    const openEditForm = (teacher: any) => {
        setFormData({ id: teacher.id, name: teacher.name, phone: teacher.phone, password: '' });
        setFormMode('edit');
        setView('form');
    };

    const handleSave = async () => {
        if (!formData.name || !formData.phone) {
            showToast('يرجى ملء الاسم ورقم الهاتف', 'error');
            return;
        }

        setIsSaving(true);
        try {
            const url = formMode === 'add' ? `${API_BASE_URL}/teachers` : `${API_BASE_URL}/teachers/${formData.id}`;
            const method = formMode === 'add' ? 'POST' : 'PUT';

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: formData.name, phone: formData.phone, password: formData.password })
            });

            const data = await response.json().catch(() => null);

            if (response.ok) {
                showToast(formMode === 'add' ? 'تم إنشاء حساب المدرس بنجاح! 🎉' : 'تم تعديل بيانات المدرس بنجاح! 💾', 'success');
                fetchTeachers();
                setView('table');
            } else {
                const errorMessage = data?.message || data?.errors?.[0] || data?.title || 'حدث خطأ في الخادم';
                showToast(`خطأ: ${errorMessage}`, 'error');
            }
        } catch (error) {
            showToast('خطأ في الاتصال بالخادم. تأكد أن السيرفر يعمل.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const executeAction = async () => {
        if (!modalConfig.teacher) return;

        try {
            let url = '';
            let method = '';

            if (modalConfig.type === 'delete') {
                url = `${API_BASE_URL}/teachers/${modalConfig.teacher.id}`;
                method = 'DELETE';
            } else if (modalConfig.type === 'ban') {
                url = `${API_BASE_URL}/teachers/${modalConfig.teacher.id}/ban`;
                method = 'PATCH';
            } else if (modalConfig.type === 'unban') {
                url = `${API_BASE_URL}/teachers/${modalConfig.teacher.id}/unban`;
                method = 'PATCH';
            }

            const response = await fetch(url, { method });

            if (response.ok) {
                if (modalConfig.type === 'delete') showToast('تم حذف المدرس نهائياً 🗑️', 'success');
                else if (modalConfig.type === 'ban') showToast('تم حظر المدرس وإيقاف كورساته 🚫', 'error');
                else showToast('تم فك الحظر عن المدرس بنجاح ✅', 'success');
                fetchTeachers();
            } else {
                const data = await response.json().catch(() => null);
                const errorMessage = data?.message || 'حدث خطأ أثناء تنفيذ الإجراء';
                showToast(`خطأ: ${errorMessage}`, 'error');
            }
        } catch (error) {
            showToast('خطأ في الاتصال بالخادم', 'error');
        } finally {
            setModalConfig({ isOpen: false, type: 'ban', teacher: null });
        }
    };

    const handleExportExcel = async () => {
        setIsExporting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/teachers/${exportConfig.teacherId}/students?stage=${selectedStage}`);
            if (response.ok) {
                const data = await response.json();
                
                if (data.length === 0) {
                    showToast(`مفيش طلاب مشتركة مع المدرس ده (${exportConfig.teacherName}) فى الكورسات ولا المحاضرات ولا بنوك المعرفة ولا المكتبة ولا العروض`, 'error'); 
                    setIsExporting(false);
                    return;
                }

                const headers = ['اسم الطالب', 'رقم الهاتف', 'تليفون ولي الأمر', 'المرحلة', 'اسم الاشتراك', 'تاريخ الاشتراك'];
                const rows = data.map((s: any) => [
                    `"${s.studentName}"`,
                    `"${s.studentPhone}"`,
                    `"${s.parentPhone}"`,
                    `"${s.stage}"`,
                    `"${s.courseName}"`, 
                    `"${new Date(s.enrollmentDate).toLocaleDateString('ar-EG')}"`
                ].join(','));

                const csvContent = "\uFEFF" + headers.join(',') + "\n" + rows.join("\n");
                
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `طلاب_المدرس_${exportConfig.teacherName}_${selectedStage}.csv`;
                link.click();

                showToast('تم تحميل شيت الإكسيل بنجاح! 📊', 'success');
                setExportConfig({ isOpen: false, teacherId: null, teacherName: '' });
            }
        } catch (error) {
            showToast('حدث خطأ أثناء سحب البيانات', 'error');
        } finally {
            setIsExporting(false);
        }
    };

    const safeTeachers = Array.isArray(teachers) ? teachers : [];
    const filteredTeachers = safeTeachers.filter(t => t.status === activeTab);

    if (!mounted) return null;

    return (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', color: 'var(--txt)', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaChalkboardTeacher style={{ color: 'var(--p-purple)' }} /> إدارة المدرسين
                    </h1>
                </div>
                {view === 'table' ? (
                    <Button variant="primary" icon={<FaPlus />} onClick={openAddForm}>إضافة مدرس جديد</Button>
                ) : (
                    <Button variant="outline" icon={<FaArrowRight />} onClick={() => setView('table')}>العودة للقائمة</Button>
                )}
            </div>

            {view === 'table' && (
                <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', background: 'var(--card)', padding: '10px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <button onClick={() => setActiveTab('accepted')} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s', background: activeTab === 'accepted' ? 'var(--success)' : 'transparent', color: activeTab === 'accepted' ? 'white' : 'var(--txt)' }}>
                        <FaCheckCircle style={{ margin: '0 8px' }} /> المدرسين المقبولين
                    </button>
                    <button onClick={() => setActiveTab('banned')} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s', background: activeTab === 'banned' ? 'var(--danger)' : 'transparent', color: activeTab === 'banned' ? 'white' : 'var(--txt)' }}>
                        <FaBan style={{ margin: '0 8px' }} /> المدرسين المحظورين
                    </button>
                </div>
            )}

            {view === 'table' && (
                <div style={{ background: 'var(--card)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', textAlign: 'right', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--txt-mut)' }}>
                                    <th style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>الاسم</th>
                                    <th style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>كلمة المرور</th>
                                    <th style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>المواد الدراسية</th>
                                    <th style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>إحصائيات</th>
                                    <th style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>إجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr><td colSpan={5} style={{ padding: '30px', textAlign: 'center', color: 'var(--p-purple)' }}>جاري تحميل البيانات... ⏳</td></tr>
                                ) : filteredTeachers.length > 0 ? filteredTeachers.map((teacher: any) => (
                                    <tr key={teacher.id} style={{ borderBottom: '1px dashed rgba(255,255,255,0.05)', transition: '0.3s' }}>
                                        <td style={{ padding: '20px' }}><div style={{ fontWeight: 'bold', color: 'var(--txt)' }}>{teacher.name}</div><div style={{ fontSize: '0.85rem', color: 'var(--txt-mut)' }}>{teacher.phone}</div></td>
                                        <td style={{ padding: '20px', color: 'var(--warning)', fontWeight: 'bold', letterSpacing: '1px' }}>{teacher.password || teacher.passwordHash || 'مخفية من السيرفر'}</td>
                                        <td style={{ padding: '20px' }}>
                                            {teacher.subjects && teacher.subjects.length > 0 ? (
                                                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                                    {teacher.subjects.map((sub: string, idx: number) => <span key={idx} style={{ background: 'rgba(108,92,231,0.1)', color: 'var(--p-purple)', padding: '4px 10px', borderRadius: '5px', fontSize: '0.85rem', fontWeight: 'bold' }}>{sub}</span>)}
                                                </div>
                                            ) : <span style={{ color: 'var(--warning)', fontSize: '0.85rem' }}>لم يحدد بعد</span>}
                                        </td>
                                        
                                        <td style={{ padding: '20px' }}>
                                            <div style={{ display: 'flex', gap: '15px', color: 'var(--txt-mut)', fontSize: '0.9rem', alignItems: 'center' }}>
                                                <span title="عدد الكورسات" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                    <FaBookOpen style={{ color: 'var(--warning)' }} /> {teacher.coursesCount}
                                                </span>
                                                <button 
                                                    onClick={() => setExportConfig({ isOpen: true, teacherId: teacher.id, teacherName: teacher.name })} 
                                                    title="اضغط لتحميل شيت بيانات الطلاب (إكسيل)"
                                                    style={{ background: 'none', border: 'none', color: 'var(--txt-mut)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', padding: 0, fontSize: '0.9rem', transition: '0.2s' }}
                                                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--success)'}
                                                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--txt-mut)'}
                                                >
                                                    <FaFileExcel style={{ color: 'var(--success)' }} /> {teacher.studentsCount}
                                                </button>
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
                                )) : <tr><td colSpan={5} style={{ padding: '30px', textAlign: 'center', color: 'var(--txt-mut)' }}>لا يوجد مدرسين في هذه القائمة.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {view === 'form' && (
                <div style={{ background: 'var(--card)', padding: '30px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', animation: 'fadeIn 0.3s ease' }}>
                    <h2 style={{ marginBottom: '25px', color: 'var(--txt)', fontWeight: 900 }}>
                        {formMode === 'add' ? 'إضافة مدرس جديد' : 'تعديل بيانات المدرس'}
                    </h2>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                        <Input 
                            label="اسم المدرس" 
                            placeholder="أدخل الاسم أو اللقب (مثل: سنيورا بهيرة)" 
                            value={formData.name} 
                            onChange={(e) => setFormData({...formData, name: e.target.value})} 
                            autoComplete="off"
                        />
                        <Input 
                            label="رقم الهاتف (لتسجيل الدخول)" 
                            placeholder="01xxxxxxxxx" 
                            type="tel" 
                            value={formData.phone} 
                            onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                            autoComplete="new-password"
                        />
                        <Input 
                            label={formMode === 'add' ? "كلمة المرور" : "كلمة المرور الجديدة (اختياري)"} 
                            placeholder="********" 
                            type="text"
                            value={formData.password} 
                            onChange={(e) => setFormData({...formData, password: e.target.value})} 
                            autoComplete="new-password"
                        />
                    </div>

                    <div style={{ background: 'rgba(241, 196, 15, 0.1)', border: '1px solid var(--warning)', padding: '15px', borderRadius: '10px', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--warning)' }}>
                        <FaInfoCircle style={{ fontSize: '1.2rem' }} />
                        <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 'bold' }}>ملاحظة: يقوم المدرس بإضافة وتعديل مواده الدراسية من خلال لوحة التحكم الخاصة به بعد تسجيل الدخول.</p>
                    </div>

                    <div style={{ display: 'flex', gap: '15px' }}>
                        <Button variant="primary" icon={<FaCheckCircle />} onClick={handleSave} disabled={isSaving} style={{ opacity: isSaving ? 0.7 : 1 }}>
                            {isSaving ? 'جاري الحفظ...' : (formMode === 'add' ? 'حفظ وإنشاء حساب المدرس' : 'حفظ التعديلات')}
                        </Button>
                        <Button variant="outline" onClick={() => setView('table')} disabled={isSaving}>إلغاء</Button>
                    </div>
                </div>
            )}

            <Modal 
                isOpen={exportConfig.isOpen} 
                onClose={() => setExportConfig({ isOpen: false, teacherId: null, teacherName: '' })} 
                title={`تحميل طلاب المدرس: ${exportConfig.teacherName}`}
                maxWidth="400px"
            >
                <div style={{ padding: '10px 0' }}>
                    <p style={{ color: 'var(--txt)', marginBottom: '15px', fontWeight: 'bold' }}>اختر المرحلة الدراسية المطلوب سحب بياناتها:</p>
                    
                    <select 
                        value={selectedStage}
                        onChange={(e) => setSelectedStage(e.target.value)}
                        style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: 'var(--txt)', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '25px', outline: 'none' }}
                        disabled={isStagesLoading}
                    >
                        {isStagesLoading ? (
                            <option style={{ color: 'black' }}>جاري تحميل المراحل... ⏳</option>
                        ) : (
                            <>
                                <option value="الكل" style={{ color: 'black' }}>الكل (جميع المراحل)</option>
                                {educationalStages.length > 0 ? (
                                    educationalStages.map((stage: any, index: number) => {
                                        const stageName = stage.name || stage.Name || stage.title || stage.Title || `صف ${index + 1}`;
                                        return (
                                            <option key={stage.id || index} value={stageName} style={{ color: 'black' }}>
                                                {stageName}
                                            </option>
                                        );
                                    })
                                ) : (
                                    <option disabled style={{ color: 'red' }}>لا توجد صفوف مسجلة في النظام</option>
                                )}
                            </>
                        )}
                    </select>

                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                        <Button variant="outline" onClick={() => setExportConfig({ isOpen: false, teacherId: null, teacherName: '' })}>إلغاء</Button>
                        <Button variant="primary" icon={<FaDownload />} onClick={handleExportExcel} disabled={isExporting || isStagesLoading} style={{ background: 'var(--success)' }}>
                            {isExporting ? 'جاري تجهيز الشيت...' : 'تحميل الإكسيل'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}