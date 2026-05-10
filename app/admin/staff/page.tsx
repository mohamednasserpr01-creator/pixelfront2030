// FILE: app/admin/staff/page.tsx
"use client";
import React, { useState } from 'react';
import { 
    FaUserShield, FaPlus, FaHistory, FaCheckCircle, 
    FaSearch, FaUserEdit, FaTrash, FaClock, FaEye, 
    FaArrowRight, FaExclamationTriangle 
} from 'react-icons/fa';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { useToast } from '../../../context/ToastContext';

const PERMISSIONS = [
    { id: 'all', label: 'التحكم الكامل (Super Admin)' },
    { id: 'teachers', label: 'إضافة وعرض المدرسين' },
    { id: 'students', label: 'عرض بيانات الطلاب بالكامل' },
    { id: 'grades', label: 'إنشاء صفوف دراسية وشعب' },
    { id: 'subjects', label: 'إنشاء مواد دراسية' },
    { id: 'offers', label: 'إضافة عروض على الكورسات' },
    { id: 'codes', label: 'عرض أكواد الشحن الخاصة بالطلاب' },
    { id: 'support', label: 'إدارة مواعيد الدعم الفني والنفسي' },
    { id: 'store', label: 'وحدة التحكم الخاصة بالمتجر' },
    { id: 'messages', label: 'إدارة رسائل الدعم الفني' } // 💡 تم إضافة الصلاحية الجديدة هنا
];

export default function StaffManagement() {
    const { showToast } = useToast();
    
    // 💡 إدارة التنقل بين الشاشات داخل نفس الصفحة
    const [mainTab, setMainTab] = useState<'staff' | 'globalLogs'>('staff');
    const [view, setView] = useState<'table' | 'form' | 'profile'>('table');
    
    // 💡 حالات التحكم في الفورم (إضافة أو تعديل)
    const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
    const [formData, setFormData] = useState({ id: 0, name: '', phone: '', password: '', role: 'موظف', permissions: [] as string[] });

    // 💡 حالة الحذف
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [staffToDelete, setStaffToDelete] = useState<any>(null);

    // 💡 حالة البروفايل الخاص
    const [selectedStaff, setSelectedStaff] = useState<any>(null);

    // قاعدة بيانات الموظفين (محاكاة)
    const [staffList, setStaffList] = useState([
        { id: 1, name: 'محمد ناصر', phone: '01012345678', role: 'Super Admin', status: 'نشط', permissions: ['all'] },
        { id: 2, name: 'أحمد محمود', phone: '01198765432', role: 'إدارة المتجر والأكواد', status: 'نشط', permissions: ['store', 'codes'] },
        { id: 3, name: 'سارة خالد', phone: '01234567890', role: 'خدمة العملاء', status: 'غير نشط', permissions: ['support', 'students', 'messages'] },
    ]);

    // قاعدة بيانات التحركات (محاكاة)
    const [logs, setLogs] = useState([
        { id: 1, user: 'أحمد محمود', action: 'إنشاء كود شحن', target: 'كارت مسيو بهيرة', time: 'منذ 5 دقائق', ip: '192.168.1.5' },
        { id: 2, user: 'سارة خالد', action: 'تعديل بيانات طالب', target: 'الطالب: يوسف أحمد', time: 'منذ 15 دقيقة', ip: '192.168.1.12' },
        { id: 3, user: 'محمد ناصر', action: 'تسجيل دخول للمنصة', target: 'الداشبورد', time: 'منذ 45 دقيقة', ip: '10.0.0.1' },
        { id: 4, user: 'أحمد محمود', action: 'تأكيد طلب متجر', target: 'طلب رقم #9822', time: 'منذ ساعتين', ip: '192.168.1.5' },
    ]);

    // 🟢 فتح فورم الإضافة
    const openAddForm = () => {
        setFormData({ id: 0, name: '', phone: '', password: '', role: 'موظف مخصص', permissions: [] });
        setFormMode('add');
        setView('form');
    };

    // 🟡 فتح فورم التعديل ببيانات الموظف
    const openEditForm = (staff: any) => {
        setFormData({ ...staff, password: '' });
        setFormMode('edit');
        setView('form');
    };

    // 🔵 فتح بروفايل الموظف (سجل التحركات الخاص)
    const openProfile = (staff: any) => {
        setSelectedStaff(staff);
        setView('profile');
    };

    // 💾 حفظ البيانات (إضافة أو تعديل)
    const handleSave = () => {
        if (!formData.name || !formData.phone) {
            showToast('يرجى ملء الاسم ورقم الهاتف', 'error');
            return;
        }

        if (formMode === 'add') {
            const newStaff = { ...formData, id: Date.now(), status: 'نشط' };
            setStaffList([newStaff, ...staffList]);
            showToast('تمت إضافة الموظف بنجاح! 🎉', 'success');
        } else {
            setStaffList(staffList.map(s => s.id === formData.id ? { ...s, name: formData.name, phone: formData.phone, permissions: formData.permissions } : s));
            showToast('تم تعديل بيانات الموظف بنجاح! 💾', 'success');
        }
        setView('table');
    };

    // 🔴 فتح نافذة الحذف وتأكيدها
    const requestDelete = (staff: any) => {
        setStaffToDelete(staff);
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        setStaffList(staffList.filter(s => s.id !== staffToDelete.id));
        setDeleteModalOpen(false);
        showToast('تم حذف الموظف نهائياً 🗑️', 'success');
    };

    // معالجة اختيار الصلاحيات في الفورم
    const togglePermission = (permId: string) => {
        setFormData(prev => {
            const hasPerm = prev.permissions.includes(permId);
            return {
                ...prev,
                permissions: hasPerm ? prev.permissions.filter(p => p !== permId) : [...prev.permissions, permId]
            };
        });
    };

    return (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', color: 'var(--txt)', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaUserShield style={{ color: 'var(--p-purple)' }} /> أدمنز المنصة
                    </h1>
                    <p style={{ color: 'var(--txt-mut)' }}>إدارة حسابات الموظفين، الصلاحيات، ومراقبة التحركات.</p>
                </div>
                {view === 'table' && mainTab === 'staff' && (
                    <Button variant="primary" icon={<FaPlus />} onClick={openAddForm}>
                        إضافة أدمن جديد
                    </Button>
                )}
                {(view === 'form' || view === 'profile') && (
                    <Button variant="outline" icon={<FaArrowRight />} onClick={() => setView('table')}>
                        العودة للقائمة
                    </Button>
                )}
            </div>

            {/* Tabs (يظهر فقط في وضع الجدول) */}
            {view === 'table' && (
                <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', background: 'var(--card)', padding: '10px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <button 
                        onClick={() => setMainTab('staff')}
                        style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s', background: mainTab === 'staff' ? 'var(--p-purple)' : 'transparent', color: mainTab === 'staff' ? 'white' : 'var(--txt)' }}
                    >
                        <FaUserShield style={{ margin: '0 8px' }} /> حسابات الموظفين
                    </button>
                    <button 
                        onClick={() => setMainTab('globalLogs')}
                        style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s', background: mainTab === 'globalLogs' ? 'var(--p-purple)' : 'transparent', color: mainTab === 'globalLogs' ? 'white' : 'var(--txt)' }}
                    >
                        <FaHistory style={{ margin: '0 8px' }} /> السجل العام (All Logs)
                    </button>
                </div>
            )}

            {/* ========================================= */}
            {/* 1. الشاشة الرئيسية (جدول الموظفين) */}
            {/* ========================================= */}
            {view === 'table' && mainTab === 'staff' && (
                <div style={{ background: 'var(--card)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', textAlign: 'right', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--txt-mut)' }}>
                                    <th style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>الاسم</th>
                                    <th style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>رقم الهاتف</th>
                                    <th style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>الدور</th>
                                    <th style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>الحالة</th>
                                    <th style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>إجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {staffList.map(staff => (
                                    <tr key={staff.id} style={{ borderBottom: '1px dashed rgba(255,255,255,0.05)', transition: '0.3s' }}>
                                        <td style={{ padding: '20px', fontWeight: 'bold', color: 'var(--txt)' }}>{staff.name}</td>
                                        <td style={{ padding: '20px', color: 'var(--txt-mut)' }}>{staff.phone}</td>
                                        <td style={{ padding: '20px', color: 'var(--p-purple)', fontWeight: 'bold', fontSize: '0.9rem' }}>{staff.role}</td>
                                        <td style={{ padding: '20px' }}>
                                            <span style={{ background: staff.status === 'نشط' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)', color: staff.status === 'نشط' ? 'var(--success)' : 'var(--danger)', padding: '5px 12px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                                {staff.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '20px', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                                                <button onClick={() => openProfile(staff)} title="عرض السجل الخاص" style={{ background: 'none', border: 'none', color: 'var(--success)', cursor: 'pointer', fontSize: '1.2rem' }}><FaEye /></button>
                                                <button onClick={() => openEditForm(staff)} title="تعديل البيانات" style={{ background: 'none', border: 'none', color: 'var(--warning)', cursor: 'pointer', fontSize: '1.2rem' }}><FaUserEdit /></button>
                                                <button onClick={() => requestDelete(staff)} title="حذف الموظف" style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '1.2rem' }}><FaTrash /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ========================================= */}
            {/* 2. شاشة البروفايل الخاص (سجل الموظف فقط) */}
            {/* ========================================= */}
            {view === 'profile' && selectedStaff && (
                <div style={{ animation: 'fadeIn 0.3s ease' }}>
                    <div style={{ background: 'var(--card)', padding: '25px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ width: '70px', height: '70px', background: 'var(--p-purple)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2rem', fontWeight: 900, color: 'white' }}>
                            {selectedStaff.name.charAt(0)}
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', color: 'var(--txt)', marginBottom: '5px' }}>{selectedStaff.name}</h2>
                            <p style={{ color: 'var(--txt-mut)', fontWeight: 'bold' }}>{selectedStaff.role} | {selectedStaff.phone}</p>
                        </div>
                    </div>

                    <h3 style={{ marginBottom: '15px', color: 'var(--txt)', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaHistory style={{ color: 'var(--p-purple)' }} /> سجل تحركات الموظف
                    </h3>
                    
                    <div style={{ background: 'var(--card)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', textAlign: 'right', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--txt-mut)' }}>
                                        <th style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>الحدث (Action)</th>
                                        <th style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>الهدف (Target)</th>
                                        <th style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>التوقيت</th>
                                        <th style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>IP Address</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.filter(log => log.user === selectedStaff.name).length > 0 ? (
                                        logs.filter(log => log.user === selectedStaff.name).map(log => (
                                            <tr key={log.id} style={{ borderBottom: '1px dashed rgba(255,255,255,0.05)' }}>
                                                <td style={{ padding: '20px', color: 'var(--success)', fontWeight: 'bold' }}>{log.action}</td>
                                                <td style={{ padding: '20px', color: 'var(--txt-mut)' }}>{log.target}</td>
                                                <td style={{ padding: '20px', color: 'var(--txt-mut)' }}><FaClock style={{ marginLeft: '5px', color: 'var(--p-purple)' }}/> {log.time}</td>
                                                <td style={{ padding: '20px', color: 'var(--txt-mut)', fontFamily: 'monospace' }}>{log.ip}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan={4} style={{ padding: '30px', textAlign: 'center', color: 'var(--txt-mut)' }}>لا توجد تحركات مسجلة لهذا الموظف.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================= */}
            {/* 3. شاشة الفورم (إضافة أو تعديل) */}
            {/* ========================================= */}
            {view === 'form' && (
                <div style={{ background: 'var(--card)', padding: '30px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', animation: 'fadeIn 0.3s ease' }}>
                    <h2 style={{ marginBottom: '20px', color: 'var(--txt)', fontWeight: 900 }}>
                        {formMode === 'add' ? 'إضافة أدمن جديد' : 'تعديل بيانات الموظف'}
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                        <Input label="اسم الموظف" placeholder="أدخل الاسم الرباعي" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                        <Input label="رقم الهاتف (لتسجيل الدخول)" placeholder="01xxxxxxxxx" type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                        <Input label={formMode === 'add' ? "كلمة المرور" : "كلمة المرور الجديدة (اختياري)"} placeholder="********" type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                    </div>

                    <h3 style={{ marginBottom: '15px', color: 'var(--txt)', fontWeight: 900, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>تحديد الصلاحيات:</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px', marginBottom: '30px' }}>
                        {PERMISSIONS.map(perm => (
                            <label key={perm.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '10px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <input 
                                    type="checkbox" 
                                    checked={formData.permissions.includes(perm.id)}
                                    onChange={() => togglePermission(perm.id)}
                                    style={{ width: '18px', height: '18px', accentColor: 'var(--p-purple)' }} 
                                />
                                <span style={{ color: 'var(--txt)', fontWeight: 'bold' }}>{perm.label}</span>
                            </label>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: '15px' }}>
                        <Button variant="primary" icon={<FaCheckCircle />} onClick={handleSave}>
                            {formMode === 'add' ? 'حفظ وإنشاء الحساب' : 'حفظ التعديلات'}
                        </Button>
                        <Button variant="outline" onClick={() => setView('table')}>إلغاء</Button>
                    </div>
                </div>
            )}

            {/* ========================================= */}
            {/* 4. السجل العام (All Logs) */}
            {/* ========================================= */}
            {view === 'table' && mainTab === 'globalLogs' && (
                <div style={{ background: 'var(--card)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '15px' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <FaSearch style={{ position: 'absolute', right: '15px', top: '15px', color: 'var(--txt-mut)' }} />
                            <input type="text" placeholder="ابحث باسم الموظف أو الحدث..." style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 40px 12px 15px', borderRadius: '10px', color: 'var(--txt)', outline: 'none' }} />
                        </div>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', textAlign: 'right', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--txt-mut)' }}>
                                    <th style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>الموظف</th>
                                    <th style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>الحدث (Action)</th>
                                    <th style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>الهدف (Target)</th>
                                    <th style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>التوقيت</th>
                                    <th style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>IP Address</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map(log => (
                                    <tr key={log.id} style={{ borderBottom: '1px dashed rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '20px', fontWeight: 'bold', color: 'var(--txt)' }}>{log.user}</td>
                                        <td style={{ padding: '20px', color: 'var(--success)', fontWeight: 'bold' }}>{log.action}</td>
                                        <td style={{ padding: '20px', color: 'var(--txt-mut)' }}>{log.target}</td>
                                        <td style={{ padding: '20px', color: 'var(--txt-mut)' }}><FaClock style={{ marginLeft: '5px', color: 'var(--p-purple)' }}/> {log.time}</td>
                                        <td style={{ padding: '20px', color: 'var(--txt-mut)', fontFamily: 'monospace' }}>{log.ip}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal لحذف الموظف */}
            <Modal 
                isOpen={deleteModalOpen} 
                onClose={() => setDeleteModalOpen(false)} 
                title="تأكيد الحذف"
                maxWidth="400px"
            >
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                    <FaExclamationTriangle style={{ fontSize: '3rem', color: 'var(--danger)', marginBottom: '15px' }} />
                    <p style={{ fontSize: '1.1rem', color: 'var(--txt)', marginBottom: '10px' }}>
                        هل أنت متأكد من حذف الموظف <strong>{staffToDelete?.name}</strong> نهائياً؟
                    </p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--txt-mut)', marginBottom: '25px' }}>لا يمكن التراجع عن هذه الخطوة وسيتم إلغاء وصوله للمنصة.</p>
                    
                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                        <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>تراجع</Button>
                        <Button variant="primary" style={{ background: 'var(--danger)' }} onClick={confirmDelete}>نعم، احذف الموظف</Button>
                    </div>
                </div>
            </Modal>

        </div>
    );
}