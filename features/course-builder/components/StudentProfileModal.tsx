"use client";
import React, { useState } from 'react';
import { FaTimes, FaUserGraduate, FaHistory, FaCheckCircle, FaPlayCircle, FaMapMarkerAlt, FaPhoneAlt, FaLock, FaUnlock, FaShieldAlt } from 'react-icons/fa';
import { EnrolledStudent } from '../types/course-students.types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    student: EnrolledStudent | null;
}

export const StudentProfileModal: React.FC<Props> = ({ isOpen, onClose, student: initialStudent }) => {
    const [activeTab, setActiveTab] = useState<'timeline' | 'permissions'>('timeline');
    const [student, setStudent] = useState<EnrolledStudent | null>(initialStudent);

    React.useEffect(() => { setStudent(initialStudent); }, [initialStudent]);

    if (!isOpen || !student) return null;

    const getSubscriptionLabel = (type: string) => {
        const labels: Record<string, string> = { 'manual_teacher': 'إضافة يدوية', 'wallet': 'رصيد محفظة', 'offer_code': 'كود عرض', 'course_code': 'كود كورس', 'lecture_code': 'كود حصة' };
        return labels[type] || type;
    };

    const toggleLectureAccess = (lectureId: string) => {
        setStudent(prev => {
            if (!prev) return prev;
            const hasAccess = prev.accessibleLectures?.includes(lectureId) ?? true;
            let newAccess = [...(prev.accessibleLectures || [])];
            
            if (hasAccess) {
                newAccess = newAccess.filter(id => id !== lectureId);
            } else {
                newAccess.push(lectureId);
            }
            
            return { ...prev, accessibleLectures: newAccess };
        });
    };

    const mockCourseLectures = [
        { id: 'lec-1', title: 'المحاضرة الأولى: التأسيس' },
        { id: 'lec-2', title: 'المحاضرة الثانية: قوانين كيرشوف' },
        { id: 'lec-3', title: 'المحاضرة الثالثة: التدريبات الشاملة' }
    ];

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
            <div style={{ background: '#1a1a2e', padding: '30px', borderRadius: '15px', width: '850px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', border: '1px solid rgba(255,255,255,0.1)' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: student.isBlocked ? 'var(--danger)' : 'var(--p-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', color: 'white' }}>
                            <FaUserGraduate />
                        </div>
                        <div>
                            <h2 style={{ margin: '0 0 8px 0', color: student.isBlocked ? 'var(--danger)' : 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                {student.name} <span style={{ fontSize: '0.9rem', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '5px', color: 'var(--txt-mut)' }}>تسلسل: {student.serialNumber}</span>
                            </h2>
                            <div style={{ color: 'var(--txt-mut)', fontSize: '0.9rem', display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><FaPhoneAlt size={12} /> {student.phone}</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><FaMapMarkerAlt size={12} /> {student.governorate}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--txt-mut)', cursor: 'pointer', fontSize: '1.2rem' }}><FaTimes /></button>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '12px' }}>
                    <button onClick={() => setActiveTab('timeline')} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s', background: activeTab === 'timeline' ? 'var(--p-purple)' : 'transparent', color: activeTab === 'timeline' ? 'white' : 'var(--txt-mut)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <FaHistory /> سجل نشاط الطالب
                    </button>
                    <button onClick={() => setActiveTab('permissions')} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s', background: activeTab === 'permissions' ? '#e67e22' : 'transparent', color: activeTab === 'permissions' ? 'white' : 'var(--txt-mut)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <FaShieldAlt /> إدارة الصلاحيات والمحاضرات
                    </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', paddingRight: '5px' }}>
                    
                    {activeTab === 'timeline' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', animation: 'fadeIn 0.3s ease' }}>
                            {student.trackingDetails.length === 0 ? (
                                <div style={{ color: 'var(--txt-mut)', textAlign: 'center', padding: '20px' }}>لا يوجد نشاط.</div>
                            ) : (
                                student.trackingDetails.map((track, idx) => (
                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            {track.type === 'lesson' ? <FaPlayCircle size={24} color="#3498db" /> : <FaCheckCircle size={24} color={track.status === 'passed' ? '#2ecc71' : '#e74c3c'} />}
                                            <div>
                                                <div style={{ color: 'white', fontWeight: 'bold' }}>{track.itemTitle || `عنصر ${track.itemId}`}</div>
                                            </div>
                                        </div>
                                        <div style={{ fontWeight: 'bold', color: track.type === 'lesson' ? '#3498db' : track.status === 'passed' ? '#2ecc71' : '#e74c3c' }}>
                                            {track.type === 'lesson' ? `شاهد ${track.watchPercentage}%` : `${track.score} / ${track.maxScore}`}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'permissions' && (
                        <div style={{ animation: 'fadeIn 0.3s ease' }}>
                            <div style={{ background: 'rgba(230, 126, 34, 0.1)', border: '1px solid rgba(230, 126, 34, 0.3)', padding: '15px', borderRadius: '10px', marginBottom: '20px', color: 'white', fontSize: '0.9rem', lineHeight: '1.6' }}>
                                💡 يمكنك من هنا سحب صلاحية الدخول لمحاضرة معينة من هذا الطالب تحديداً (غلق المحاضرة)، أو إعطائه صلاحية استثنائية لمحاضرة لم يقم بشرائها.
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {mockCourseLectures.map(lec => {
                                    const hasAccess = student.accessibleLectures?.includes(lec.id) ?? true; 
                                    
                                    return (
                                        <div key={lec.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', border: `1px solid ${hasAccess ? 'rgba(46, 204, 113, 0.2)' : 'rgba(231, 76, 60, 0.2)'}`, transition: '0.3s' }}>
                                            <div>
                                                <h4 style={{ margin: '0 0 5px 0', color: hasAccess ? 'white' : 'var(--txt-mut)', textDecoration: hasAccess ? 'none' : 'line-through' }}>{lec.title}</h4>
                                                <div style={{ fontSize: '0.85rem', color: hasAccess ? '#2ecc71' : '#e74c3c', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                    {hasAccess ? <><FaUnlock /> متاح للطالب</> : <><FaLock /> مغلق ومسحوب الصلاحية</>}
                                                </div>
                                            </div>
                                            
                                            <button 
                                                style={{ background: hasAccess ? 'rgba(231, 76, 60, 0.1)' : 'rgba(46, 204, 113, 0.1)', color: hasAccess ? '#e74c3c' : '#2ecc71', border: `1px solid ${hasAccess ? '#e74c3c' : '#2ecc71'}`, width: '120px', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                                                onClick={() => toggleLectureAccess(lec.id)}
                                            >
                                                {hasAccess ? 'إغلاق المحاضرة' : 'فتح المحاضرة'}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};