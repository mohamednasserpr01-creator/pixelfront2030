"use client";
import React, { useState, useEffect, use } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
    FaArrowRight, FaUserTie, FaBookOpen, FaHistory, 
    FaUsers, FaBarcode, FaEdit, FaTrash, FaPlus, FaCog 
} from 'react-icons/fa';
import { Button } from '../../../../components/ui/Button';
import { Modal } from '../../../../components/ui/Modal';
import { Input } from '../../../../components/ui/Input';
import { useToast } from '../../../../context/ToastContext';
import styles from '../Offers.module.css';

interface Teacher { id: number; name: string; addedAt: string; }
interface Course { id: number; name: string; teacher: string; addedAt: string; }
interface Student { id: number; name: string; phone: string; addedAt: string; }
interface ModHistory { id: number; by: string; date: string; action: string; from: string; to: string; }

interface Offer {
    id: number; title: string; stage: string; stream: string;
    startDate: string; endDate: string; originalPrice: number; price: number;
    status: 'active' | 'upcoming' | 'expired'; image: string; desc: string;
    codesCount: number; teachers: Teacher[]; courses: Course[];
    students: Student[]; modHistory: ModHistory[];
}

export default function OfferDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const { showToast } = useToast();
    const [mounted, setMounted] = useState(false);
    
    const [offer, setOffer] = useState<Offer | null>(null);
    const [activeTab, setActiveTab] = useState<'teachers' | 'courses' | 'students' | 'history'>('teachers');

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddTeacherModalOpen, setIsAddTeacherModalOpen] = useState(false);
    const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);

    useEffect(() => {
        setOffer({
            id: Number(resolvedParams.id), title: 'عرض بطل الثانوية', stage: 'الصف الثالث الثانوي', stream: 'علمي علوم',
            startDate: '2026-04-01', endDate: '2026-05-01', originalPrice: 1000, price: 600, 
            status: 'active', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=500',
            desc: 'أقوى باقة مراجعات نهائية تشمل الفيزياء، الكيمياء، والأحياء.', codesCount: 842,
            teachers: [{ id: 1, name: 'أ/مارك منصور', addedAt: '4/6/2026' }],
            courses: [{ id: 1, name: 'مراجعة الفيزياء', teacher: 'أ/مارك منصور', addedAt: '4/6/2026' }],
            students: [{ id: 1, name: 'رقية سامح', phone: '01205709988', addedAt: '4/6/2026' }],
            modHistory: [{ id: 1, by: 'Administrator', date: '4/6/2026', action: 'إنشاء العرض', from: '-', to: '-' }]
        });
        setMounted(true);
    }, [resolvedParams.id]);

    const handleAddTeacher = () => {
        if(!offer) return;
        const newTeacher = { id: Date.now(), name: 'مدرس جديد تم ربطه', addedAt: new Date().toLocaleDateString() };
        setOffer({ ...offer, teachers: [...offer.teachers, newTeacher] });
        setIsAddTeacherModalOpen(false);
        showToast('تم ربط المدرس بنجاح', 'success');
    };

    const handleAddCourse = () => {
        if(!offer) return;
        const newCourse = { id: Date.now(), name: 'كورس جديد', teacher: 'المدرس المربوط', addedAt: new Date().toLocaleDateString() };
        setOffer({ ...offer, courses: [...offer.courses, newCourse] });
        setIsAddCourseModalOpen(false);
        showToast('تم ربط الكورس بنجاح', 'success');
    };

    if (!mounted || !offer) return null;

    return (
        <div className={styles.container}>
            <Button variant="outline" icon={<FaArrowRight />} onClick={() => router.push('/admin/offers')} style={{ marginBottom: '20px' }}>الرجوع للعروض</Button>

            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                
                <div style={{ flex: '1 1 350px', background: 'var(--card)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '30px' }}>
                    <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid var(--bg)', marginTop: '-60px', marginBottom: '20px', overflow: 'hidden' }}>
                        <img src={offer.image} alt="offer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ width: '100%', padding: '0 25px', display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '1rem', color: 'var(--txt-mut)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>اسم العرض:</span> <strong style={{ color: 'white' }}>{offer.title}</strong></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>السعر الفعلي:</span> <strong style={{ color: 'var(--success)', fontSize: '1.2rem' }}>{offer.price} ج.م</strong></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>السعر قبل الخصم:</span> <strong style={{ textDecoration: 'line-through' }}>{offer.originalPrice} ج.م</strong></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>عدد المدرسين:</span> <strong style={{ color: 'white' }}>{offer.teachers.length}</strong></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>عدد الكورسات:</span> <strong style={{ color: 'white' }}>{offer.courses.length}</strong></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>المشتركين:</span> <strong style={{ color: 'white' }}>{offer.students.length}</strong></div>
                    </div>
                    
                    {/* 🚀 الزرار الزيادة اتشال من هنا */}
                    <div style={{ marginTop: '25px', width: '85%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <Button variant="outline" fullWidth icon={<FaEdit />} onClick={() => setIsEditModalOpen(true)}>تعديل العرض</Button>
                    </div>
                </div>

                <div style={{ flex: '2 1 700px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className={styles.tabsContainer}>
                        <button className={`${styles.tabBtn} ${activeTab === 'teachers' ? styles.active : ''}`} onClick={() => setActiveTab('teachers')}><FaUserTie/> المدرسين</button>
                        <button className={`${styles.tabBtn} ${activeTab === 'courses' ? styles.active : ''}`} onClick={() => setActiveTab('courses')}><FaBookOpen/> الكورسات</button>
                        <button className={`${styles.tabBtn} ${activeTab === 'students' ? styles.active : ''}`} onClick={() => setActiveTab('students')}><FaUsers/> الطلاب المشتركين</button>
                        <button className={`${styles.tabBtn} ${activeTab === 'history' ? styles.active : ''}`} onClick={() => setActiveTab('history')}><FaHistory/> سجل التعديلات</button>
                    </div>

                    <div style={{ background: 'var(--card)', borderRadius: '15px', padding: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ color: 'white' }}>
                                {activeTab === 'teachers' ? 'المدرسين المشمولين' : activeTab === 'courses' ? 'الكورسات المشمولة' : activeTab === 'students' ? 'الطلاب المشتركين' : 'سجل التعديلات'}
                            </h3>
                            {activeTab === 'teachers' && <Button variant="outline" size="sm" icon={<FaPlus/>} onClick={() => setIsAddTeacherModalOpen(true)}>إضافة مدرس</Button>}
                            {activeTab === 'courses' && <Button variant="outline" size="sm" icon={<FaPlus/>} onClick={() => setIsAddCourseModalOpen(true)}>إضافة كورس</Button>}
                        </div>

                        <table style={{ width: '100%', textAlign: 'right', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ color: 'var(--p-purple)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    <th style={{ padding: '15px' }}>#</th>
                                    <th style={{ padding: '15px' }}>{activeTab === 'history' ? 'بواسطة' : 'الاسم'}</th>
                                    {activeTab === 'students' && <th style={{ padding: '15px' }}>رقم التليفون</th>}
                                    {activeTab === 'history' && <th style={{ padding: '15px' }}>الحدث</th>}
                                    <th style={{ padding: '15px' }}>التاريخ</th>
                                    {activeTab !== 'history' && activeTab !== 'students' && <th style={{ padding: '15px' }}>إجراء</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {(activeTab === 'teachers' ? offer.teachers : activeTab === 'courses' ? offer.courses : activeTab === 'students' ? offer.students : offer.modHistory).map((item: any, idx: number) => (
                                    <tr key={item.id} style={{ borderBottom: '1px dashed rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '15px', color: 'var(--txt-mut)' }}>{idx + 1}</td>
                                        <td style={{ padding: '15px', color: 'white', fontWeight: 'bold' }}>{item.name || item.by}</td>
                                        {activeTab === 'students' && <td style={{ padding: '15px', color: 'var(--warning)' }}>{item.phone}</td>}
                                        {activeTab === 'history' && <td style={{ padding: '15px', color: 'var(--success)' }}>{item.action}</td>}
                                        <td style={{ padding: '15px', color: 'var(--txt-mut)' }}>{item.addedAt || item.date}</td>
                                        {activeTab !== 'history' && activeTab !== 'students' && (
                                            <td style={{ padding: '15px' }}><button style={{ background: 'rgba(231,76,60,0.1)', color: 'var(--danger)', border: 'none', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' }}>حذف</button></td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="تعديل العرض" maxWidth="600px">
                <div className={styles.formGrid}>
                    <div style={{ gridColumn: '1 / -1' }}><div className={styles.formLabel}>اسم العرض</div><input className={styles.formInput} defaultValue={offer.title} /></div>
                    <div><div className={styles.formLabel}>السعر الأصلي</div><input type="number" className={styles.formInput} defaultValue={offer.originalPrice} /></div>
                    <div><div className={styles.formLabel}>سعر العرض</div><input type="number" className={styles.formInput} defaultValue={offer.price} /></div>
                </div>
                <Button variant="primary" fullWidth style={{ marginTop: '20px' }} onClick={() => setIsEditModalOpen(false)}>حفظ التعديلات</Button>
            </Modal>

            <Modal isOpen={isAddTeacherModalOpen} onClose={() => setIsAddTeacherModalOpen(false)} title="ربط مدرس بالعرض" maxWidth="400px">
                <select className={styles.formSelect}><option>أ/محمد ناصر</option></select>
                <Button variant="primary" fullWidth style={{ marginTop: '20px' }} onClick={handleAddTeacher}>حفظ المدرس</Button>
            </Modal>

            <Modal isOpen={isAddCourseModalOpen} onClose={() => setIsAddCourseModalOpen(false)} title="ربط كورس بالعرض" maxWidth="400px">
                <select className={styles.formSelect}><option>الباب الأول - فيزياء</option></select>
                <Button variant="primary" fullWidth style={{ marginTop: '20px' }} onClick={handleAddCourse}>حفظ الكورس</Button>
            </Modal>
        </div>
    );
}