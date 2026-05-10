import { useState, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { EnrolledStudent, SubscriptionType } from '../types/course-students.types';
import { Lecture } from '../types/curriculum.types';
import { CourseStudentsService } from '../services/course-students.service';

const translateSubscription = (type: string) => {
    const map: Record<string, string> = { 'manual_teacher': 'إضافة يدوية', 'wallet': 'محفظة', 'offer_code': 'كود عرض', 'course_code': 'كود كورس', 'lecture_code': 'كود حصة' };
    return map[type] || type;
};

const isVideoItem = (type: string) => ['lesson', 'homework_lesson'].includes(type);

const generateMockStudents = (count: number): EnrolledStudent[] => {
    const subs: SubscriptionType[] = ['manual_teacher', 'wallet', 'offer_code', 'course_code', 'lecture_code'];
    return Array.from({ length: count }).map((_, i) => {
        const isTotalAbsentee = i % 5 === 0;
        return {
            id: `STU-${i + 1}`, serialNumber: `100${i + 1}`, name: `طالب رقم ${i + 1}`, phone: `010000000${i}`, parentPhone: `011000000${i}`,
            governorate: i % 2 === 0 ? 'الإسكندرية' : 'القاهرة', address: 'شارع كذا', enrolledAt: '2023-10-01',
            paymentMethod: subs[i % subs.length], paymentDetails: 'كود / خصم', isBlocked: false, progress: isTotalAbsentee ? 0 : 80, accessibleLectures: [],
            trackingDetails: [ 
                { itemId: 'item-1', type: 'lesson', status: isTotalAbsentee ? 'not_started' : 'completed', watchPercentage: isTotalAbsentee ? 0 : 100, viewsCount: isTotalAbsentee ? 0 : 2 },
                { itemId: 'item-2', type: 'homework', status: isTotalAbsentee ? 'not_started' : 'submitted', score: isTotalAbsentee ? 0 : 9, maxScore: 10 },
                { itemId: 'item-3', type: 'exam', status: isTotalAbsentee ? 'not_started' : 'passed', score: isTotalAbsentee ? 0 : 18, maxScore: 20 }
            ]
        };
    });
};

export const useCourseStudents = (courseId: string, curriculum: Lecture[]) => {
    const [allStudents, setAllStudents] = useState<EnrolledStudent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 50;
    const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => { setAllStudents(generateMockStudents(120)); setIsLoading(false); }, 800);
    }, [courseId]);

    const handleToggleBlock = async (studentId: string, currentStatus: boolean) => {
        setAllStudents(prev => prev.map(s => s.id === studentId ? { ...s, isBlocked: !currentStatus } : s));
    };

    const filteredStudents = useMemo(() => {
        if (!searchQuery) return allStudents;
        return allStudents.filter(s => s.name.includes(searchQuery) || s.phone.includes(searchQuery) || s.serialNumber.includes(searchQuery));
    }, [allStudents, searchQuery]);

    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
    const paginatedStudents = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredStudents.slice(start, start + itemsPerPage);
    }, [filteredStudents, currentPage]);

    // 🚀 الإحصائيات السريعة لـ الداشبورد
    const courseStats = useMemo(() => {
        return filteredStudents.reduce((acc, curr) => {
            acc.total++;
            if (curr.paymentMethod === 'manual_teacher') acc.manual++;
            else if (curr.paymentMethod === 'wallet') acc.wallet++;
            else acc.codes++; // أكواد عروض، كورسات، حصص
            return acc;
        }, { total: 0, manual: 0, wallet: 0, codes: 0 });
    }, [filteredStudents]);

    const handleExportCourseEnrolled = () => {
        const headers = ['الرقم التسلسلي', 'اسم الطالب', 'رقم الطالب', 'رقم ولي الأمر', 'المحافظة', 'العنوان', 'تاريخ الانضمام', 'نوع الاشتراك'];
        const data = filteredStudents.map(s => ({
            'الرقم التسلسلي': s.serialNumber, 'اسم الطالب': s.name, 'رقم الطالب': s.phone, 'رقم ولي الأمر': s.parentPhone,
            'المحافظة': s.governorate, 'العنوان': s.address, 'تاريخ الانضمام': s.enrolledAt, 'نوع الاشتراك': translateSubscription(s.paymentMethod)
        }));
        const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });
        const workbook = XLSX.utils.book_new();
        worksheet['!views'] = [{ rightToLeft: true, state: 'frozen', ySplit: 1 }];
        worksheet['!cols'] = headers.map(() => ({ wch: 20 }));
        XLSX.utils.book_append_sheet(workbook, worksheet, "المسجلين بالكورس");
        XLSX.writeFile(workbook, `Enrolled_Course_Students.xlsx`);
    };

    const handleExportAllExams = () => {
        // 🚀 تم إضافة تاريخ الانضمام هنا
        const baseHeaders = ['الرقم التسلسلي', 'اسم الطالب', 'رقم الطالب', 'المحافظة', 'تاريخ الانضمام', 'نوع الاشتراك'];
        const examHeaders: string[] = [];
        const examIds: string[] = []; 
        curriculum.forEach(lec => {
            lec.items.forEach(item => {
                if (!isVideoItem(item.type)) { examHeaders.push(`[${lec.title}] ${item.title}`); examIds.push(item.id); }
            });
        });

        if (examIds.length === 0) return alert("لا يوجد امتحانات لتصديرها.");

        const data = filteredStudents.map(student => {
            // 🚀 تم إضافة تاريخ الانضمام هنا في الداتا
            const row: any = { 
                'الرقم التسلسلي': student.serialNumber, 'اسم الطالب': student.name, 'رقم الطالب': student.phone, 
                'المحافظة': student.governorate, 'تاريخ الانضمام': student.enrolledAt, 'نوع الاشتراك': translateSubscription(student.paymentMethod) 
            };
            examIds.forEach((id, index) => {
                const record = student.trackingDetails.find(t => t.itemId === id);
                if (!record || record.status === 'not_started') row[examHeaders[index]] = 'غياب';
                else row[examHeaders[index]] = `${record.score}/${record.maxScore} (${record.status === 'passed' ? 'ناجح' : 'راسب'})`;
            });
            return row;
        });

        const worksheet = XLSX.utils.json_to_sheet(data, { header: [...baseHeaders, ...examHeaders] });
        const workbook = XLSX.utils.book_new();
        worksheet['!views'] = [{ rightToLeft: true, state: 'frozen', ySplit: 1 }];
        worksheet['!cols'] = [...baseHeaders, ...examHeaders].map(() => ({ wch: 20 }));
        XLSX.utils.book_append_sheet(workbook, worksheet, "درجات جميع الامتحانات");
        XLSX.writeFile(workbook, `All_Exams_Grades.xlsx`);
    };

    const handleExportCourseAbsentees = () => {
        const examIds: string[] = []; 
        curriculum.forEach(lec => { lec.items.forEach(item => { if (!isVideoItem(item.type)) examIds.push(item.id); }); });

        const absentees = filteredStudents.filter(student => {
            let hasExam = false;
            examIds.forEach(id => {
                const record = student.trackingDetails.find(t => t.itemId === id);
                if (record && record.status !== 'not_started') hasExam = true;
            });
            return !hasExam;
        });

        if (absentees.length === 0) return alert("ممتاز! لا يوجد طلاب متخلفين عن كل الامتحانات.");

        // 🚀 تم إضافة تاريخ الانضمام هنا
        const headers = ['الرقم التسلسلي', 'اسم الطالب', 'رقم الطالب', 'رقم ولي الأمر', 'المحافظة', 'تاريخ الانضمام', 'نوع الاشتراك', 'ملاحظة'];
        const data = absentees.map(s => ({
            'الرقم التسلسلي': s.serialNumber, 'اسم الطالب': s.name, 'رقم الطالب': s.phone, 'رقم ولي الأمر': s.parentPhone,
            'المحافظة': s.governorate, 'تاريخ الانضمام': s.enrolledAt, 'نوع الاشتراك': translateSubscription(s.paymentMethod), 'ملاحظة': 'لم يمتحن أي امتحان بالكورس'
        }));

        const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });
        const workbook = XLSX.utils.book_new();
        worksheet['!views'] = [{ rightToLeft: true, state: 'frozen', ySplit: 1 }];
        worksheet['!cols'] = headers.map(() => ({ wch: 20 }));
        XLSX.utils.book_append_sheet(workbook, worksheet, "متخلفين عن الكورس");
        XLSX.writeFile(workbook, `Total_Absentees_Course.xlsx`);
    };

    const handleExportMasterExcel = () => {
        alert("⏳ جاري تجهيز الشيت الشامل (جميع البيانات والتحركات)...");

        const baseHeaders = ['الرقم التسلسلي', 'اسم الطالب', 'رقم الطالب', 'رقم ولي الأمر', 'المحافظة', 'تاريخ الانضمام', 'نوع الاشتراك', 'الإنجاز'];
        const trackingHeaders: string[] = [];
        const itemIds: string[] = []; 
        
        curriculum.forEach(lec => {
            lec.items.forEach(item => {
                const typeLabel = isVideoItem(item.type) ? '📺 شرح' : '📝 تقييم';
                trackingHeaders.push(`[${lec.title}] ${typeLabel}: ${item.title}`);
                itemIds.push(item.id);
            });
        });

        const excelData = filteredStudents.map(student => {
            const row: any = {
                'الرقم التسلسلي': student.serialNumber, 'اسم الطالب': student.name, 'رقم الطالب': student.phone, 'رقم ولي الأمر': student.parentPhone,
                'المحافظة': student.governorate, 'تاريخ الانضمام': student.enrolledAt,
                'نوع الاشتراك': translateSubscription(student.paymentMethod), 'الإنجاز': `${student.progress}%`
            };

            itemIds.forEach((id, index) => {
                const record = student.trackingDetails.find(t => t.itemId === id);
                if (!record) row[trackingHeaders[index]] = 'لم يدخل';
                else if (isVideoItem(record.type)) row[trackingHeaders[index]] = `شاهد ${record.watchPercentage}% (${record.viewsCount} مرة)`;
                else row[trackingHeaders[index]] = `${record.score}/${record.maxScore} (${record.status === 'passed' ? 'ناجح' : 'راسب'})`;
            });
            return row;
        });

        const worksheet = XLSX.utils.json_to_sheet(excelData, { header: [...baseHeaders, ...trackingHeaders] });
        const workbook = XLSX.utils.book_new();
        worksheet['!views'] = [{ rightToLeft: true, state: 'frozen', ySplit: 1, xSplit: 2 }];
        worksheet['!cols'] = [...baseHeaders, ...trackingHeaders].map(() => ({ wch: 20 }));
        XLSX.utils.book_append_sheet(workbook, worksheet, "التقرير الشامل");
        XLSX.writeFile(workbook, `Master_Course_Report_${courseId}.xlsx`);
    };

    return {
        students: paginatedStudents, totalStudents: filteredStudents.length, currentPage, setCurrentPage, totalPages,
        isLoading, searchQuery, setSearchQuery, 
        courseStats, 
        handleExportCourseEnrolled, handleExportAllExams, handleExportCourseAbsentees, handleExportMasterExcel,
        handleToggleBlock, isAddStudentModalOpen, setIsAddStudentModalOpen,
    };
};