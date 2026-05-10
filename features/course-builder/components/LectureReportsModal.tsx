"use client";
import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { FaTimes, FaChartBar, FaFileExcel, FaSearch, FaUserGraduate, FaUserPlus, FaWallet, FaBarcode } from 'react-icons/fa';
import { Lecture } from '../types/curriculum.types';

interface Props { isOpen: boolean; onClose: () => void; lecture: Lecture | null; }

export const LectureReportsModal: React.FC<Props> = ({ isOpen, onClose, lecture }) => {
    // 🚀 1. ترتيب الـ Hooks في البداية
    const [searchQuery, setSearchQuery] = useState('');

    const isVideoItem = (type: string) => ['lesson', 'homework_lesson'].includes(type);

    const mockReports = useMemo(() => {
        if (!lecture) return [];
        return Array.from({ length: 20 }).map((_, i) => ({
            serialNumber: `100${i + 1}`, name: `طالب تجريبي ${i + 1}`, phone: `010${Math.floor(10000000 + Math.random() * 90000000)}`,
            parentPhone: `011${Math.floor(10000000 + Math.random() * 90000000)}`, governorate: i % 2 === 0 ? 'الإسكندرية' : 'القاهرة',
            subscription: i % 4 === 0 ? 'إضافة يدوية' : i % 4 === 1 ? 'محفظة' : 'كود حصة',
            enrolledAt: '2023-10-01 10:00', // 🚀 إضافة تاريخ الانضمام
            tracking: lecture.items.map(item => {
                const isVid = isVideoItem(item.type);
                const isAbsent = Math.random() > 0.8; 
                if (isAbsent) return { id: item.id, type: item.type, val: isVid ? 'لم يشاهد' : 'لم يمتحن' };
                const status = Math.random() > 0.5 ? 'passed' : 'failed';
                return { id: item.id, type: item.type, val: isVid ? `شاهد ${Math.floor(Math.random() * 100)}%` : `${Math.floor(Math.random() * 20)}/20 (${status === 'passed' ? 'ناجح' : 'راسب'})` };
            })
        }));
    }, [lecture]);

    const filteredReports = useMemo(() => {
        return mockReports.filter(r => r.name.includes(searchQuery) || r.phone.includes(searchQuery) || r.serialNumber.includes(searchQuery));
    }, [mockReports, searchQuery]);

    const lectureStats = useMemo(() => {
        return filteredReports.reduce((acc, curr) => {
            acc.total++;
            if (curr.subscription.includes('يدوية')) acc.manual++;
            else if (curr.subscription.includes('محفظة')) acc.wallet++;
            else acc.codes++;
            return acc;
        }, { total: 0, manual: 0, wallet: 0, codes: 0 });
    }, [filteredReports]);

    // 🚀 2. الحماية (Safe Check) تنزل تحت خالص
    if (!isOpen || !lecture) return null;

    const handleExportLectureEnrolled = () => {
        const headers = ['الرقم التسلسلي', 'اسم الطالب', 'رقم الهاتف', 'رقم ولي الأمر', 'المحافظة', 'تاريخ الانضمام', 'نوع الاشتراك'];
        const data = filteredReports.map(s => ({
            'الرقم التسلسلي': s.serialNumber, 'اسم الطالب': s.name, 'رقم الهاتف': s.phone, 'رقم ولي الأمر': s.parentPhone, 
            'المحافظة': s.governorate, 'تاريخ الانضمام': s.enrolledAt, 'نوع الاشتراك': s.subscription
        }));

        const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });
        const workbook = XLSX.utils.book_new();
        worksheet['!views'] = [{ rightToLeft: true, state: 'frozen', ySplit: 1 }];
        worksheet['!cols'] = headers.map(() => ({ wch: 20 }));
        XLSX.utils.book_append_sheet(workbook, worksheet, "المسجلين بالمحاضرة");
        XLSX.writeFile(workbook, `Enrolled_Lecture_${lecture.title}.xlsx`);
    };

    const handleExportLectureUnwatched = () => {
        const unwatched = filteredReports.filter(s => s.tracking.some(t => isVideoItem(t.type) && t.val === 'لم يشاهد'));
        if(unwatched.length === 0) return alert("الجميع شاهدوا فيديوهات المحاضرة.");

        const headers = ['الرقم التسلسلي', 'اسم الطالب', 'رقم الهاتف', 'رقم ولي الأمر', 'المحافظة', 'تاريخ الانضمام', 'ملاحظة'];
        const data = unwatched.map(s => ({
            'الرقم التسلسلي': s.serialNumber, 'اسم الطالب': s.name, 'رقم الهاتف': s.phone, 'رقم ولي الأمر': s.parentPhone, 
            'المحافظة': s.governorate, 'تاريخ الانضمام': s.enrolledAt, 'ملاحظة': 'لم يشاهد فيديو'
        }));

        const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });
        const workbook = XLSX.utils.book_new();
        worksheet['!views'] = [{ rightToLeft: true, state: 'frozen', ySplit: 1 }];
        worksheet['!cols'] = headers.map(() => ({ wch: 20 }));
        XLSX.utils.book_append_sheet(workbook, worksheet, "لم يشاهدوا الفيديوهات");
        XLSX.writeFile(workbook, `Unwatched_Lecture_${lecture.title}.xlsx`);
    };

    const handleExportLectureMissedExams = () => {
        const missedExams = filteredReports.filter(s => s.tracking.some(t => !isVideoItem(t.type) && t.val === 'لم يمتحن'));
        if(missedExams.length === 0) return alert("الجميع امتحنوا التقييمات.");

        const headers = ['الرقم التسلسلي', 'اسم الطالب', 'رقم الهاتف', 'رقم ولي الأمر', 'المحافظة', 'تاريخ الانضمام', 'ملاحظة'];
        const data = missedExams.map(s => ({
            'الرقم التسلسلي': s.serialNumber, 'اسم الطالب': s.name, 'رقم الهاتف': s.phone, 'رقم ولي الأمر': s.parentPhone, 
            'المحافظة': s.governorate, 'تاريخ الانضمام': s.enrolledAt, 'ملاحظة': 'لم يمتحن في المحاضرة'
        }));

        const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });
        const workbook = XLSX.utils.book_new();
        worksheet['!views'] = [{ rightToLeft: true, state: 'frozen', ySplit: 1 }];
        worksheet['!cols'] = headers.map(() => ({ wch: 20 }));
        XLSX.utils.book_append_sheet(workbook, worksheet, "لم يمتحنوا بالمحاضرة");
        XLSX.writeFile(workbook, `MissedExams_Lecture_${lecture.title}.xlsx`);
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
            <div style={{ background: '#1a1a2e', padding: '30px', borderRadius: '15px', width: '95vw', maxWidth: '1200px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <div><h3 style={{ margin: '0 0 5px 0', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}><FaChartBar color="#f1c40f" /> التقرير الشامل للمحاضرة: {lecture.title}</h3></div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--txt-mut)', cursor: 'pointer', fontSize: '1.2rem' }}><FaTimes /></button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                    <div style={{ background: 'rgba(52, 152, 219, 0.1)', border: '1px solid rgba(52, 152, 219, 0.3)', padding: '12px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <FaUserGraduate size={24} color="#3498db" />
                        <div><div style={{ color: 'var(--txt-mut)', fontSize: '0.8rem' }}>بالمحاضرة</div><div style={{ color: 'white', fontSize: '1.3rem', fontWeight: 'bold' }}>{lectureStats.total}</div></div>
                    </div>
                    <div style={{ background: 'rgba(155, 89, 182, 0.1)', border: '1px solid rgba(155, 89, 182, 0.3)', padding: '12px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <FaUserPlus size={24} color="#9b59b6" />
                        <div><div style={{ color: 'var(--txt-mut)', fontSize: '0.8rem' }}>إضافة يدوية</div><div style={{ color: 'white', fontSize: '1.3rem', fontWeight: 'bold' }}>{lectureStats.manual}</div></div>
                    </div>
                    <div style={{ background: 'rgba(46, 204, 113, 0.1)', border: '1px solid rgba(46, 204, 113, 0.3)', padding: '12px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <FaWallet size={24} color="#2ecc71" />
                        <div><div style={{ color: 'var(--txt-mut)', fontSize: '0.8rem' }}>رصيد محفظة</div><div style={{ color: 'white', fontSize: '1.3rem', fontWeight: 'bold' }}>{lectureStats.wallet}</div></div>
                    </div>
                    <div style={{ background: 'rgba(241, 196, 15, 0.1)', border: '1px solid rgba(241, 196, 15, 0.3)', padding: '12px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <FaBarcode size={24} color="#f1c40f" />
                        <div><div style={{ color: 'var(--txt-mut)', fontSize: '0.8rem' }}>أكواد</div><div style={{ color: 'white', fontSize: '1.3rem', fontWeight: 'bold' }}>{lectureStats.codes}</div></div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', width: '300px' }}>
                        <FaSearch style={{ position: 'absolute', right: '15px', top: '12px', color: 'var(--txt-mut)' }} />
                        <input type="text" placeholder="ابحث بالرقم أو التسلسل..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '100%', padding: '10px 40px 10px 15px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <button onClick={handleExportLectureEnrolled} style={{ background: 'rgba(39, 174, 96, 0.2)', color: '#2ecc71', border: '1px solid #27ae60', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                            <FaFileExcel /> المسجلين بالمحاضرة
                        </button>
                        <button onClick={handleExportLectureUnwatched} style={{ background: 'rgba(52, 152, 219, 0.2)', color: '#3498db', border: '1px solid #3498db', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                            <FaFileExcel /> لم يشاهدوا
                        </button>
                        <button onClick={handleExportLectureMissedExams} style={{ background: 'rgba(231, 76, 60, 0.2)', color: '#e74c3c', border: '1px solid #e74c3c', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                            <FaFileExcel /> لم يمتحنوا
                        </button>
                    </div>
                </div>
                <div style={{ overflow: 'auto', flex: 1, background: 'rgba(0,0,0,0.2)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white', textAlign: 'right', minWidth: '1200px' }}>
                        <thead style={{ position: 'sticky', top: 0, background: '#1a1a2e', zIndex: 1 }}>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <th style={{ padding: '15px', minWidth: '80px' }}>تسلسل</th>
                                <th style={{ padding: '15px', minWidth: '150px' }}>الطالب</th>
                                <th style={{ padding: '15px', minWidth: '120px' }}>الاشتراك</th>
                                {lecture.items.map(item => (
                                    <th key={item.id} style={{ padding: '15px', minWidth: '150px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--txt-mut)' }}>{isVideoItem(item.type) ? '📺 شرح' : '📝 تقييم'}</div>
                                        <div>{item.title}</div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReports.map(report => (
                                <tr key={report.serialNumber} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '15px', fontWeight: 'bold', color: 'var(--p-purple)' }}>{report.serialNumber}</td>
                                    <td style={{ padding: '15px' }}><div style={{ fontWeight: 'bold' }}>{report.name}</div><div style={{ fontSize: '0.8rem', color: 'var(--txt-mut)' }}>{report.phone}</div></td>
                                    <td style={{ padding: '15px', color: '#f39c12', fontSize: '0.9rem' }}>{report.subscription}</td>
                                    {report.tracking.map((t, idx) => (
                                        <td key={idx} style={{ padding: '15px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.02)', fontWeight: 'bold', color: t.val.includes('ناجح') || t.val.includes('100%') ? '#2ecc71' : t.val.includes('راسب') || t.val.includes('لم') ? '#e74c3c' : '#3498db' }}>{t.val}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};