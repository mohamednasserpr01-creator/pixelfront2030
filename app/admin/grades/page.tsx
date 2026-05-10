"use client";
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx'; // 🚀 استدعاء مكتبة الإكسيل
import { 
    FaLayerGroup, FaPlus, FaEdit, FaTrash, 
    FaGraduationCap, FaTags, FaBookOpen, FaFileExcel 
} from 'react-icons/fa';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { useToast } from '../../../context/ToastContext';

// 🚀 1. فصل الداتا: داتا الصفوف والشعب لوحدها
const initialGrades = [
    {
        id: 'g1', name: 'الصف الأول الثانوي',
        streams: [{ id: 's1', name: 'عام' }]
    },
    {
        id: 'g2', name: 'الصف الثاني الثانوي',
        streams: [{ id: 's2', name: 'علمي' }, { id: 's3', name: 'أدبي' }]
    }
];

// 🚀 2. فصل الداتا: قاموس المواد لوحده خالص
const initialSubjects = [
    { id: 'sub1', name: 'الفيزياء' },
    { id: 'sub2', name: 'الكيمياء' },
    { id: 'sub3', name: 'اللغة العربية' },
    { id: 'sub4', name: 'الرياضيات' },
    { id: 'sub5', name: 'التاريخ' },
];

export default function GradesManagement() {
    const { showToast } = useToast();
    const [mounted, setMounted] = useState(false);
    
    // States مفصولة
    const [grades, setGrades] = useState(initialGrades);
    const [subjects, setSubjects] = useState(initialSubjects);

    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        mode: 'add' | 'edit';
        type: 'grade' | 'stream' | 'subject';
        parentId?: string; 
        data?: any; 
    }>({ isOpen: false, mode: 'add', type: 'grade' });

    const [inputValue, setInputValue] = useState('');

    useEffect(() => setMounted(true), []);

    const openModal = (mode: 'add' | 'edit', type: 'grade' | 'stream' | 'subject', parentId?: string, data?: any) => {
        setInputValue(data ? data.name : '');
        setModalConfig({ isOpen: true, mode, type, parentId, data });
    };

    const closeModal = () => {
        setModalConfig({ isOpen: false, mode: 'add', type: 'grade' });
        setInputValue('');
    };

    const handleSave = () => {
        if (!inputValue.trim()) {
            showToast('يرجى إدخال الاسم', 'error');
            return;
        }

        const newId = Math.random().toString(36).substr(2, 9);

        if (modalConfig.mode === 'add') {
            if (modalConfig.type === 'grade') {
                setGrades([...grades, { id: newId, name: inputValue, streams: [] }]);
            } 
            else if (modalConfig.type === 'stream') {
                setGrades(grades.map(g => g.id === modalConfig.parentId ? { ...g, streams: [...g.streams, { id: newId, name: inputValue }] } : g));
            } 
            // 🚀 حفظ المادة في القاموس المنفصل
            else if (modalConfig.type === 'subject') {
                setSubjects([...subjects, { id: newId, name: inputValue }]);
            }
            showToast('تمت الإضافة بنجاح! ✅', 'success');
        } 
        else if (modalConfig.mode === 'edit') {
            if (modalConfig.type === 'grade') {
                setGrades(grades.map(g => g.id === modalConfig.data.id ? { ...g, name: inputValue } : g));
            } 
            else if (modalConfig.type === 'stream') {
                setGrades(grades.map(g => g.id === modalConfig.parentId ? { ...g, streams: g.streams.map(s => s.id === modalConfig.data.id ? { ...s, name: inputValue } : s) } : g));
            } 
            // 🚀 تعديل المادة في القاموس المنفصل
            else if (modalConfig.type === 'subject') {
                setSubjects(subjects.map(sub => sub.id === modalConfig.data.id ? { ...sub, name: inputValue } : sub));
            }
            showToast('تم التعديل بنجاح! 💾', 'success');
        }

        closeModal();
    };

    const handleDelete = (type: 'grade' | 'stream' | 'subject', id: string, name: string, parentId?: string) => {
        if (confirm(`هل أنت متأكد من حذف (${name})؟`)) {
            if (type === 'grade') {
                setGrades(grades.filter(g => g.id !== id));
            } else if (type === 'stream') {
                setGrades(grades.map(g => g.id === parentId ? { ...g, streams: g.streams.filter(s => s.id !== id) } : g));
            } else if (type === 'subject') {
                setSubjects(subjects.filter(sub => sub.id !== id));
            }
            showToast(`تم حذف ${name} بنجاح! 🗑️`, 'success');
        }
    };

    // 🚀 دالة استخراج ملف الإكسيل (للمرحلة أو الشعبة) ببيانات كاملة
    const exportStudentsToExcel = (targetName: string, type: 'grade' | 'stream') => {
        showToast(`جاري استخراج بيانات طلاب ${targetName}...`, 'info');
        
        const EGYPT_GOVS = ['القاهرة', 'الإسكندرية', 'الجيزة', 'الشرقية', 'الدقهلية', 'البحيرة'];
        const SCHOOLS = ['مدرسة التوفيقية', 'مدرسة السعيدية', 'مدرسة النور', 'مدرسة الأبطال', 'مدرسة المستقبل'];

        // توليد داتا وهمية شاملة لكل بيانات الطالب
        const mockStudents = Array.from({ length: Math.floor(Math.random() * 50) + 20 }).map((_, i) => {
            const gov = EGYPT_GOVS[i % EGYPT_GOVS.length];
            return {
                'م': i + 1,
                'الرقم التسلسلي': `PX-${1000 + i}`,
                'اسم الطالب': `طالب تجريبي ${i + 1}`,
                'المرحلة الدراسية': type === 'grade' ? targetName : targetName.split(' - ')[0],
                'الشعبة': type === 'stream' ? targetName.split(' - ')[1] : 'عام',
                'رقم هاتف الطالب': `010${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
                'رقم هاتف ولي الأمر': `011${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
                'المحافظة': gov,
                'العنوان التفصيلي': `شارع ${Math.floor(Math.random() * 100) + 1}، بجوار المحطة، ${gov}`,
                'المدرسة': SCHOOLS[i % SCHOOLS.length],
                'رصيد المحفظة': Math.floor(Math.random() * 500) + ' ج.م',
                'تاريخ الانضمام': `2026-04-${Math.floor(Math.random() * 30 + 1).toString().padStart(2, '0')}`,
                'حالة الحساب': i % 8 === 0 ? 'محظور' : 'نشط',
            };
        });

        const ws = XLSX.utils.json_to_sheet(mockStudents);
        const wb = XLSX.utils.book_new();
        ws['!views'] = [{ rightToLeft: true }]; // الإكسيل يفتح من اليمين لليسار
        
        // تظبيط عرض العواميد عشان الكلام يظهر مرتاح وميخشش في بعضه
        ws['!cols'] = [
            { wch: 5 }, { wch: 15 }, { wch: 25 }, { wch: 20 }, { wch: 15 }, 
            { wch: 18 }, { wch: 18 }, { wch: 15 }, { wch: 40 }, { wch: 20 }, 
            { wch: 15 }, { wch: 15 }, { wch: 12 }
        ];

        XLSX.utils.book_append_sheet(wb, ws, "بيانات الطلاب");
        XLSX.writeFile(wb, `Students_${targetName.replace(/\s+/g, '_')}.xlsx`);
        showToast('تم تحميل شيت الإكسيل بنجاح! 📊', 'success');
    };

    if (!mounted) return null;

    return (
        <div style={{ animation: 'fadeIn 0.5s ease', maxWidth: '1200px', margin: '0 auto', paddingBottom: '50px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', color: 'var(--txt)', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 5px 0' }}>
                        <FaLayerGroup style={{ color: 'var(--p-purple)' }} /> شجرة المنهج الدراسي
                    </h1>
                    <p style={{ color: 'var(--txt-mut)', margin: 0 }}>إدارة الصفوف، الشعب الدراسية، وقاموس المواد التعليمية.</p>
                </div>
            </div>

            {/* ========================================================= */}
            {/* 🚀 القسم الأول: الصفوف والشعب (مع زراير الإكسيل) */}
            {/* ========================================================= */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: 'var(--txt)', fontSize: '1.4rem' }}>الصفوف والشعب الدراسية</h2>
                <Button variant="primary" icon={<FaPlus />} onClick={() => openModal('add', 'grade')}>
                    إضافة صف دراسي
                </Button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '50px' }}>
                {grades.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--txt-mut)', background: 'var(--card)', borderRadius: '15px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                        لا توجد صفوف دراسية مسجلة حالياً.
                    </div>
                ) : (
                    grades.map(grade => (
                        <div key={grade.id} style={{ background: 'var(--card)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                            
                            {/* هيدر الصف الدراسي */}
                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '3px solid var(--p-purple)', flexWrap: 'wrap', gap: '15px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{ width: '45px', height: '45px', background: 'rgba(108,92,231,0.1)', color: 'var(--p-purple)', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem' }}>
                                        <FaGraduationCap />
                                    </div>
                                    <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--txt)', margin: 0 }}>{grade.name}</h2>
                                    {/* 🚀 زرار إكسيل الصف بالكامل */}
                                    <button onClick={() => exportStudentsToExcel(grade.name, 'grade')} style={{ background: 'rgba(39, 174, 96, 0.1)', color: '#2ecc71', border: '1px solid rgba(39, 174, 96, 0.3)', padding: '5px 10px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', fontWeight: 'bold' }} title={`تحميل جميع طلاب ${grade.name}`}>
                                        <FaFileExcel /> داتا الطلاب
                                    </button>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <Button variant="outline" size="sm" icon={<FaPlus />} onClick={() => openModal('add', 'stream', grade.id)}>إضافة شعبة</Button>
                                    <button onClick={() => openModal('edit', 'grade', undefined, grade)} style={{ background: 'none', border: 'none', color: 'var(--txt-mut)', cursor: 'pointer', fontSize: '1.1rem' }}><FaEdit /></button>
                                    <button onClick={() => handleDelete('grade', grade.id, grade.name)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '1.1rem', opacity: 0.7 }}><FaTrash /></button>
                                </div>
                            </div>

                            {/* الشعب بداخل الصف */}
                            <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
                                {grade.streams.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '20px', color: 'var(--txt-mut)', gridColumn: '1 / -1' }}>لا توجد شعب مسجلة في هذا الصف.</div>
                                ) : (
                                    grade.streams.map(stream => (
                                        <div key={stream.id} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <FaTags style={{ color: 'var(--warning)' }} />
                                                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--txt)', margin: 0 }}>شعبة: <span style={{ color: 'var(--warning)' }}>{stream.name}</span></h3>
                                            </div>
                                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                {/* 🚀 زرار إكسيل الشعبة */}
                                                <button onClick={() => exportStudentsToExcel(`${grade.name} - ${stream.name}`, 'stream')} style={{ background: 'none', border: 'none', color: '#2ecc71', cursor: 'pointer', fontSize: '1.1rem' }} title={`تحميل طلاب شعبة ${stream.name}`}><FaFileExcel /></button>
                                                <div style={{ width: '1px', height: '15px', background: 'rgba(255,255,255,0.1)' }}></div>
                                                <button onClick={() => openModal('edit', 'stream', grade.id, stream)} style={{ background: 'none', border: 'none', color: 'var(--txt-mut)', cursor: 'pointer' }}><FaEdit /></button>
                                                <button onClick={() => handleDelete('stream', stream.id, stream.name, grade.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', opacity: 0.7 }}><FaTrash /></button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* ========================================================= */}
            {/* 🚀 القسم الثاني: القاموس العام للمواد الدراسية (مفصول تماماً) */}
            {/* ========================================================= */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '40px' }}>
                <div>
                    <h2 style={{ color: 'var(--txt)', fontSize: '1.4rem', margin: '0 0 5px 0' }}>القاموس العام للمواد الدراسية</h2>
                    <p style={{ color: 'var(--txt-mut)', fontSize: '0.9rem', margin: 0 }}>هذه المواد ستظهر للمدرسين ليختاروا منها عند إنشاء حساباتهم.</p>
                </div>
                <Button variant="primary" icon={<FaPlus />} onClick={() => openModal('add', 'subject')} style={{ background: '#3498db' }}>
                    إضافة مادة للقاموس
                </Button>
            </div>

            <div style={{ background: 'var(--card)', padding: '25px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                {subjects.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--txt-mut)', padding: '30px' }}>القاموس فارغ. يرجى إضافة مواد.</div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                        {subjects.map(sub => (
                            <div key={sub.id} style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(52, 152, 219, 0.2)', borderRadius: '10px', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: '0.2s' }} className="hover-card">
                                <div style={{ fontWeight: 'bold', color: 'var(--txt)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <FaBookOpen style={{ color: '#3498db' }}/> {sub.name}
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button onClick={() => openModal('edit', 'subject', undefined, sub)} style={{ background: 'none', border: 'none', color: 'var(--txt-mut)', cursor: 'pointer' }}><FaEdit /></button>
                                    <button onClick={() => handleDelete('subject', sub.id, sub.name)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', opacity: 0.7 }}><FaTrash /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style jsx>{`
                .hover-card:hover { border-color: #3498db !important; transform: translateY(-3px); background: rgba(52, 152, 219, 0.05) !important; }
            `}</style>

            {/* Modal */}
            <Modal 
                isOpen={modalConfig.isOpen} 
                onClose={closeModal} 
                title={`${modalConfig.mode === 'add' ? 'إضافة' : 'تعديل'} ${modalConfig.type === 'grade' ? 'صف دراسي' : modalConfig.type === 'stream' ? 'شعبة' : 'مادة دراسية'}`} 
                maxWidth="400px"
            >
                <div style={{ padding: '10px 0' }}>
                    <Input 
                        label={`اسم الـ ${modalConfig.type === 'grade' ? 'الصف' : modalConfig.type === 'stream' ? 'شعبة' : 'مادة'} باللغة العربية`} 
                        placeholder={modalConfig.type === 'grade' ? "مثال: الصف الأول الثانوي" : modalConfig.type === 'stream' ? "مثال: علمي رياضة" : "مثال: فيزياء"} 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => { if(e.key === 'Enter') handleSave() }}
                    />
                    <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
                        <Button variant="primary" fullWidth onClick={handleSave} style={{ background: modalConfig.type === 'subject' ? '#3498db' : 'var(--p-purple)' }}>حفظ البيانات</Button>
                        <Button variant="outline" fullWidth onClick={closeModal}>إلغاء</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}