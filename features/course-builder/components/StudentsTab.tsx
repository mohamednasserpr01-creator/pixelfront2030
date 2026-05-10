"use client";
import React, { useState } from 'react';
import { FaUserGraduate, FaSearch, FaFileExcel, FaUserPlus, FaChevronRight, FaChevronLeft, FaListOl, FaWallet, FaBarcode, FaUserSlash, FaCheckCircle } from 'react-icons/fa';
import { Lecture } from '../types/curriculum.types';
import { useCourseStudents } from '../hooks/useCourseStudents';
import { AddStudentModal } from './AddStudentModal';
import { StudentProfileModal } from './StudentProfileModal';
import { EnrolledStudent } from '../types/course-students.types';

interface Props { courseId: string; curriculum: Lecture[]; }

export const StudentsTab: React.FC<Props> = ({ courseId, curriculum }) => {
    const {
        students, totalStudents, currentPage, setCurrentPage, totalPages,
        isLoading, searchQuery, setSearchQuery, 
        courseStats, 
        handleExportCourseEnrolled, handleExportAllExams, handleExportCourseAbsentees, handleExportMasterExcel,
        isAddStudentModalOpen, setIsAddStudentModalOpen
    } = useCourseStudents(courseId, curriculum);

    const [selectedProfile, setSelectedProfile] = useState<EnrolledStudent | null>(null);
    const [localStudents, setLocalStudents] = useState<EnrolledStudent[]>([]);

    React.useEffect(() => { setLocalStudents(students); }, [students]);

    const getSubscriptionLabel = (type: string) => {
        const labels: Record<string, string> = { 'manual_teacher': 'إضافة يدوية', 'wallet': 'رصيد محفظة', 'offer_code': 'كود عرض', 'course_code': 'كود كورس', 'lecture_code': 'كود حصة' };
        return labels[type] || type;
    };

    const toggleBlockStudent = (studentId: string, studentName: string, currentStatus: boolean) => {
        const newStatus = !currentStatus;
        if (confirm(`هل أنت متأكد من ${newStatus ? 'حظر' : 'فك الحظر عن'} الطالب (${studentName}) من هذا الكورس؟`)) {
            setLocalStudents(prev => prev.map(s => s.id === studentId ? { ...s, isBlocked: newStatus } : s));
        }
    };

    if (isLoading) return <div style={{ textAlign: 'center', padding: '50px', color: 'white' }}>جاري التحميل... ⏳</div>;

    return (
        <div style={{ animation: 'fadeIn 0.4s ease', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap', gap: '15px' }}>
                <div style={{ position: 'relative', width: '350px' }}>
                    <FaSearch style={{ position: 'absolute', right: '15px', top: '12px', color: 'var(--txt-mut)' }} />
                    <input type="text" placeholder="ابحث بالاسم أو الرقم..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} style={{ width: '100%', padding: '10px 40px 10px 15px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button onClick={handleExportMasterExcel} style={{ background: 'rgba(52, 152, 219, 0.2)', color: '#3498db', border: '1px solid #3498db', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}><FaFileExcel /> التقرير الشامل</button>
                    <button onClick={handleExportAllExams} style={{ background: 'rgba(241, 196, 15, 0.2)', color: '#f1c40f', border: '1px solid #f1c40f', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}><FaListOl /> درجات الامتحانات</button>
                    <button onClick={handleExportCourseEnrolled} style={{ background: 'rgba(39, 174, 96, 0.2)', color: '#2ecc71', border: '1px solid #27ae60', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}><FaFileExcel /> المسجلين بالكورس</button>
                    <button onClick={handleExportCourseAbsentees} style={{ background: 'rgba(231, 76, 60, 0.2)', color: '#e74c3c', border: '1px solid #e74c3c', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}><FaFileExcel /> متخلفين إطلاقاً</button>
                    <button onClick={() => setIsAddStudentModalOpen(true)} style={{ background: 'var(--p-purple)', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}><FaUserPlus /> إضافة يدوية</button>
                </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', overflowX: 'auto' }}>
                <table style={{ width: '100%', minWidth: '1000px', borderCollapse: 'collapse', color: 'white', textAlign: 'right' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <th style={{ padding: '15px' }}>م</th>
                            <th style={{ padding: '15px' }}>تسلسل</th>
                            <th style={{ padding: '15px' }}>اسم الطالب</th>
                            <th style={{ padding: '15px' }}>نوع الاشتراك</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>الإنجاز</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>إجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {localStudents.map((student, index) => (
                            <tr key={student.id} style={{ borderBottom: '1px dashed rgba(255,255,255,0.05)', background: student.isBlocked ? 'rgba(231, 76, 60, 0.05)' : 'transparent', transition: '0.2s' }}>
                                <td style={{ padding: '15px', color: 'var(--txt-mut)' }}>{(currentPage - 1) * 50 + index + 1}</td>
                                <td style={{ padding: '15px', fontWeight: 'bold', color: 'var(--p-purple)' }}>{student.serialNumber}</td>
                                <td style={{ padding: '15px', fontWeight: 'bold', color: student.isBlocked ? '#e74c3c' : 'white' }}>{student.name} {student.isBlocked && <span style={{ fontSize: '0.7rem', background: '#e74c3c', color: 'white', padding: '2px 5px', borderRadius: '3px', marginRight: '8px' }}>محظور</span>}</td>
                                <td style={{ padding: '15px', color: '#f39c12', fontSize: '0.9rem' }}>{getSubscriptionLabel(student.paymentMethod)}</td>
                                <td style={{ padding: '15px', textAlign: 'center', fontWeight: 'bold', color: (student.progress || 0) > 80 ? '#2ecc71' : (student.progress || 0) > 40 ? '#f1c40f' : '#e74c3c' }}>{student.progress || 0}%</td>
                                <td style={{ padding: '15px', textAlign: 'center' }}>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                        <button onClick={() => setSelectedProfile(student)} style={{ background: 'rgba(52, 152, 219, 0.1)', color: '#3498db', border: '1px solid #3498db', padding: '6px 12px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.85rem' }}>متابعة</button>
                                        {student.isBlocked ? (
                                            <button onClick={() => toggleBlockStudent(student.id, student.name, student.isBlocked)} style={{ background: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71', border: '1px solid #27ae60', padding: '6px 12px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}><FaCheckCircle /> تفعيل</button>
                                        ) : (
                                            <button onClick={() => toggleBlockStudent(student.id, student.name, student.isBlocked)} style={{ background: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c', border: '1px solid #e74c3c', padding: '6px 12px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}><FaUserSlash /> حظر</button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AddStudentModal isOpen={isAddStudentModalOpen} onClose={() => setIsAddStudentModalOpen(false)} curriculum={curriculum} onAdd={(phone) => alert(`تم الإرسال: ${phone}`)} />
            <StudentProfileModal isOpen={!!selectedProfile} onClose={() => setSelectedProfile(null)} student={selectedProfile} />
        </div>
    );
};