"use client";
import React, { useState } from 'react';
import * as XLSX from 'xlsx'; 
import { FaBookOpen, FaChevronDown, FaChevronUp, FaPlus, FaFileExcel, FaChartBar, FaCog } from 'react-icons/fa';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Lecture, LectureItem as LectureItemType } from '../types/curriculum.types';
import { LectureItem } from './LectureItem';
import styles from '../styles/builder.module.css';

interface Props {
    lecture: Lecture;
    onUpdateLecture: (lectureId: string, updates: Partial<Lecture>) => void;
    onOpenContentPicker: (lectureId: string) => void;
    onOpenSettings: (item: LectureItemType) => void;
    onOpenReports: (item: LectureItemType) => void; 
    onOpenLectureReports: (lecture: Lecture) => void;
    onOpenGrading: (item: LectureItemType) => void; 
    onOpenLectureSettings?: (lecture: Lecture) => void; // 🚀 ضفنا الدالة هنا
}

export const LectureCard: React.FC<Props> = ({ lecture, onUpdateLecture, onOpenContentPicker, onOpenSettings, onOpenReports, onOpenLectureReports, onOpenGrading, onOpenLectureSettings }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(lecture.title);

    const handleTitleSave = () => {
        setIsEditing(false);
        if (title.trim() !== '' && title !== lecture.title) onUpdateLecture(lecture.id, { title });
        else setTitle(lecture.title);
    };

    const isVideoItem = (type: string) => ['lesson', 'homework_lesson'].includes(type);

    const handleExportLectureReport = () => {
        alert(`جاري تحميل تقرير شامل وخاص بـ المتخلفين لـ: ${lecture.title}`);
        
        const mockStudents = Array.from({ length: 30 }).map((_, i) => {
            const hasMissedExam = Math.random() > 0.7; 
            return {
                serialNumber: `100${i + 1}`, name: `طالب مسجل بالمحاضرة ${i + 1}`, phone: `010${Math.floor(10000000 + Math.random() * 90000000)}`,
                parentPhone: `011${Math.floor(10000000 + Math.random() * 90000000)}`, governorate: i % 2 === 0 ? 'الإسكندرية' : 'القاهرة',
                address: 'عنوان الطالب بالتفصيل', subscription: i % 2 === 0 ? 'كود حصة' : 'رصيد محفظة',
                tracking: lecture.items.map(item => {
                    const isVid = isVideoItem(item.type);
                    if (!isVid && hasMissedExam) return { id: item.id, type: item.type, val: 'لم يمتحن' };
                    const status = Math.random() > 0.5 ? 'passed' : 'failed';
                    return { id: item.id, type: item.type, val: isVid ? `شاهد ${Math.floor(Math.random() * 100)}%` : `${Math.floor(Math.random() * 20)}/20 (${status === 'passed' ? 'ناجح' : 'راسب'})` };
                })
            };
        });

        const headers = ['الرقم التسلسلي', 'اسم الطالب', 'رقم الهاتف', 'رقم ولي الأمر', 'المحافظة', 'العنوان', 'نوع الاشتراك'];
        const dynamicHeaders = lecture.items.map(item => `[${isVideoItem(item.type) ? 'شرح' : 'تقييم'}] ${item.title}`);
        const fullHeaders = [...headers, ...dynamicHeaders];

        const formatRow = (s: any) => {
            const row: any = { 'الرقم التسلسلي': s.serialNumber, 'اسم الطالب': s.name, 'رقم الهاتف': s.phone, 'رقم ولي الأمر': s.parentPhone, 'المحافظة': s.governorate, 'العنوان': s.address, 'نوع الاشتراك': s.subscription };
            s.tracking.forEach((t: any, index: number) => { row[dynamicHeaders[index]] = t.val; });
            return row;
        };

        const workbook = XLSX.utils.book_new();
        const wsAll = XLSX.utils.json_to_sheet(mockStudents.map(formatRow), { header: fullHeaders });
        wsAll['!views'] = [{ rightToLeft: true, state: 'frozen', ySplit: 1 }];
        wsAll['!cols'] = fullHeaders.map(() => ({ wch: 20 }));
        XLSX.utils.book_append_sheet(workbook, wsAll, "المسجلين بالمحاضرة");

        const absentees = mockStudents.filter(s => s.tracking.some(t => !isVideoItem(t.type) && t.val === 'لم يمتحن'));
        if (absentees.length > 0) {
            const wsAbsentees = XLSX.utils.json_to_sheet(absentees.map(formatRow), { header: fullHeaders });
            wsAbsentees['!views'] = [{ rightToLeft: true, state: 'frozen', ySplit: 1 }];
            wsAbsentees['!cols'] = fullHeaders.map(() => ({ wch: 20 }));
            XLSX.utils.book_append_sheet(workbook, wsAbsentees, "المتخلفين عن الامتحانات");
        }

        XLSX.writeFile(workbook, `Report_Lecture_${lecture.title}.xlsx`);
    };

    return (
        <div className={styles.cardWrapper}>
            <div className={styles.cardHeader}>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '5px' }}>
                    <div className={styles.cardTitleSection}>
                        <FaBookOpen style={{ color: 'var(--p-purple)' }} size={20} />
                        {isEditing ? <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} onBlur={handleTitleSave} onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()} className={styles.titleInput} /> : <h3 onClick={() => setIsEditing(true)} className={styles.titleText}>{title}</h3>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px', paddingRight: '28px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.8rem', color: lecture.requirePrevious ? '#e74c3c' : 'var(--txt-mut)' }}>
                            <input type="checkbox" checked={!!lecture.requirePrevious} onChange={(e) => onUpdateLecture(lecture.id, { requirePrevious: e.target.checked })} /> إجبار اجتياز المحاضرة السابقة أولاً
                        </label>
                    </div>
                </div>

                <div className={styles.cardControls} style={{ alignSelf: 'flex-start', marginTop: '5px', display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    {/* 🚀 الزرار بقى بينادي الدالة المضبوطة */}
                    <button 
                        onClick={() => onOpenLectureSettings && onOpenLectureSettings(lecture)} 
                        style={{ background: 'rgba(155, 89, 182, 0.2)', color: '#9b59b6', border: '1px solid rgba(155, 89, 182, 0.4)', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', fontWeight: 'bold', transition: '0.2s' }} 
                        title="إعدادات المحاضرة"
                    >
                        <FaCog /> الإعدادات
                    </button>

                    <button onClick={() => onOpenLectureReports(lecture)} style={{ background: 'rgba(241, 196, 15, 0.2)', color: '#f1c40f', border: '1px solid #f1c40f', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem' }} title="عرض تقرير المحاضرة"><FaChartBar /> التقرير</button>
                    <button onClick={handleExportLectureReport} style={{ background: 'rgba(39, 174, 96, 0.2)', color: '#2ecc71', border: '1px solid #27ae60', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem' }} title="تصدير تقرير إكسيل لهذه المحاضرة بكل حصصها"><FaFileExcel /> الإكسيل</button>
                    <span className={styles.itemsCount}>{lecture.items.length} عناصر</span>
                    <button onClick={() => setIsExpanded(!isExpanded)} className={styles.iconBtn} style={{ borderRadius: '50%' }}>{isExpanded ? <FaChevronUp /> : <FaChevronDown />}</button>
                </div>
            </div>

            {isExpanded && (
                <div className={styles.cardBody}>
                    <SortableContext items={lecture.items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                        {lecture.items.map((item) => (
                            <LectureItem 
                                key={item.id} 
                                item={item} 
                                onOpenSettings={onOpenSettings} 
                                onOpenReports={onOpenReports} 
                                onOpenGrading={onOpenGrading} 
                            />
                        ))}
                    </SortableContext>
                    <button onClick={() => onOpenContentPicker(lecture.id)} className={styles.addContentBtn}><FaPlus /> إضافة محتوى للمحاضرة</button>
                </div>
            )}
        </div>
    );
};