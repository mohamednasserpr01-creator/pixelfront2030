"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { 
    FaUserGraduate, FaSearch, FaMapMarkerAlt, 
    FaCheckCircle, FaExclamationTriangle, 
    FaFileExcel, FaUsers, FaUserPlus, FaBan,
    FaSyncAlt, FaWallet, FaEnvelope, FaCheckSquare,
    FaArrowRight, FaUserEdit, FaNetworkWired,
    FaClock, FaDesktop, FaChartLine, FaChalkboardTeacher,
    FaFileAlt, FaUndo, FaBarcode, FaSignInAlt, FaPlayCircle, FaSave, FaUnlock
} from 'react-icons/fa';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../context/ToastContext';

// Components
import { StudentsFilters } from './components/StudentsFilters';
import { StudentsTable } from './components/StudentsTable';
import { StudentProfile } from './components/StudentProfile'; 
// 🚀 استدعاء الخريطة المعزولة اللي ظبطناها
import { StudentsMap } from './components/StudentsMap'; 

// ==========================================
// 💡 MOCK DATA GENERATOR 
// ==========================================
const EGYPT_GOVS = ['القاهرة', 'الإسكندرية', 'الجيزة', 'الشرقية', 'الدقهلية', 'البحيرة'];
const MAJORS = ['علمي علوم', 'علمي رياضة', 'أدبي', 'عام (أولى وتانية)'];

const generateMockStudents = () => {
    return Array.from({ length: 200 }, (_, i) => ({
        id: i + 1,
        serial: `PX-${1000 + i}`,
        name: `طالب تجريبي رقم ${i + 1}`,
        phone: `010${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
        parentPhone: `011${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
        password: `pass${Math.floor(Math.random() * 9999)}`,
        grade: i % 3 === 0 ? 'الصف الأول الثانوي' : (i % 2 === 0 ? 'الصف الثاني الثانوي' : 'الصف الثالث الثانوي'),
        major: MAJORS[i % 4],
        gov: EGYPT_GOVS[i % EGYPT_GOVS.length],
        address: `شارع ${Math.floor(Math.random() * 100) + 1}، بجوار المحطة، ${EGYPT_GOVS[i % EGYPT_GOVS.length]}`,
        status: i % 8 === 0 ? 'banned' : 'active',
        balance: Math.floor(Math.random() * 500),
        joinedAt: `2026-04-${Math.floor(Math.random() * 30 + 1).toString().padStart(2, '0')}`,
        lastDevice: i % 2 === 0 ? 'iPhone 13 Pro (iOS)' : 'Windows 11 (Chrome)',
        lastIP: `192.168.1.${Math.floor(Math.random() * 255)}`,
        lastLogin: `منذ ${Math.floor(Math.random() * 12 + 1)} ساعة`,
        
        purchasedCourses: [
            { id: `c-${i}-1`, title: 'كورس المراجعة النهائية', teacher: 'أ. محمد ناصر', price: 250, date: '2026-04-10' }
        ],
        purchasedLectures: [
            { id: `l-${i}-1`, title: 'محاضرة الباب الأول', teacher: 'أ. محمود مجدي', price: 50, date: '2026-04-12' }
        ],

        academicRecord: [
            { id: 'exam-1', title: 'امتحان الباب الأول', type: 'امتحان', score: 18, total: 20, date: '2026-05-10', status: 'passed' },
            { id: 'exam-2', title: 'واجب الحصة الثانية', type: 'واجب', score: 4, total: 10, date: '2026-05-12', status: 'failed' },
        ],

        chargingLogs: [
            { id: 1, serial: '8402721259374812', code: '****-****-1234', amount: 50, date: '2026-04-01', teacherName: 'أ. محمد ناصر' }
        ],
        timeline: [
            { id: 1, type: 'login', text: 'تسجيل دخول ناجح للمنصة', time: 'اليوم - 08:00 صباحاً' }
        ]
    }));
};

export default function StudentsManagement() {
    const { showToast } = useToast();
    const [mounted, setMounted] = useState(false);

    const [view, setView] = useState<'dashboard' | 'profile'>('dashboard');
    const [dashboardTab, setDashboardTab] = useState<'table' | 'map'>('table'); 
    
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [students, setStudents] = useState<any[]>([]);

    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'banned'>('all');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    useEffect(() => { 
        setStudents(generateMockStudents()); 
        setMounted(true); 
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const filteredStudents = useMemo(() => {
        return students.filter(student => {
            const query = debouncedSearch.trim().toLowerCase();
            const matchesSearch = student.name.toLowerCase().includes(query) || student.phone.includes(query) || student.serial.toLowerCase().includes(query);
            const matchesGrade = selectedGrade === 'all' || student.grade === selectedGrade;
            const matchesStatus = selectedStatus === 'all' || student.status === selectedStatus;
            return matchesSearch && matchesGrade && matchesStatus;
        });
    }, [students, debouncedSearch, selectedGrade, selectedStatus]);

    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
    const currentStudents = useMemo(() => filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [filteredStudents, currentPage]);

    const activeCount = useMemo(() => students.filter(s => s.status === 'active').length, [students]);
    const bannedCount = useMemo(() => students.filter(s => s.status === 'banned').length, [students]);

    const toggleSelectAll = () => setSelectedIds(selectedIds.length === currentStudents.length ? [] : currentStudents.map(s => s.id));
    const toggleSelectOne = (id: number) => setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);

    const handleUpdateStudent = (updatedStudent: any) => {
        setStudents(students.map(s => s.id === updatedStudent.id ? updatedStudent : s));
        setSelectedStudent(updatedStudent);
    };

    const handleRefund = (studentId: number, itemId: string, type: 'course' | 'lecture', amount: number) => {
        if (!confirm('هل أنت متأكد من إلغاء الاشتراك واسترداد الرصيد لمحفظة الطالب؟')) return;
        setStudents(prevStudents => prevStudents.map(s => {
            if (s.id === studentId) {
                const newBalance = s.balance + amount;
                const newCourses = type === 'course' ? s.purchasedCourses.filter((c: any) => c.id !== itemId) : s.purchasedCourses;
                const newLectures = type === 'lecture' ? s.purchasedLectures.filter((l: any) => l.id !== itemId) : s.purchasedLectures;
                const newTimeline = [{ id: Date.now(), type: 'refund', text: `تم إلغاء اشتراك واسترداد ${amount} ج.م للمحفظة`, time: 'الآن' }, ...s.timeline];
                const updated = { ...s, balance: newBalance, purchasedCourses: newCourses, purchasedLectures: newLectures, timeline: newTimeline };
                if (selectedStudent && selectedStudent.id === studentId) setSelectedStudent(updated);
                return updated;
            }
            return s;
        }));
        showToast(`تم إرجاع ${amount} ج.م للمحفظة بنجاح! 💰`, 'success');
    };

    const handleResetExam = (studentId: number, examId: string) => {
        if (!confirm('هل أنت متأكد من مسح درجة هذا التقييم وإتاحته للطالب من جديد؟')) return;

        setStudents(prevStudents => prevStudents.map(s => {
            if (s.id === studentId) {
                const newRecord = s.academicRecord.map((record: any) => {
                    if (record.id === examId) {
                        return { ...record, status: 'not_started', score: 0, date: '-' };
                    }
                    return record;
                });

                const newTimeline = [{ id: Date.now(), type: 'system', text: `تم تصفير نتيجة تقييم من قِبل الإدارة`, time: 'الآن' }, ...s.timeline];
                const updated = { ...s, academicRecord: newRecord, timeline: newTimeline };
                
                if (selectedStudent && selectedStudent.id === studentId) setSelectedStudent(updated);
                return updated;
            }
            return s;
        }));
        showToast(`تم تصفير التقييم وإتاحته للطالب بنجاح! 🔄`, 'success');
    };

    if (!mounted) return null;

    if (view === 'dashboard') {
        return (
            <div style={{ animation: 'fadeIn 0.5s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', color: 'var(--txt)', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FaUserGraduate style={{ color: 'var(--p-purple)' }} /> شؤون الطلاب
                        </h1>
                        <p style={{ color: 'var(--txt-mut)' }}>نظام الإدارة الشامل، العمليات المجمعة، والتحليلات.</p>
                    </div>
                    <Button variant="primary" icon={<FaFileExcel />} onClick={() => showToast('جاري استخراج الشيت...', 'info')} style={{ background: '#217346', color: 'white' }}>
                        استخراج (Excel)
                    </Button>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', background: 'var(--card)', padding: '10px', borderRadius: '15px', border: '1px solid rgba(128,128,128,0.2)' }}>
                    <button onClick={() => setDashboardTab('table')} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s', background: dashboardTab === 'table' ? 'var(--p-purple)' : 'transparent', color: dashboardTab === 'table' ? 'white' : 'var(--txt)' }}><FaSearch style={{ margin: '0 8px' }} /> قاعدة بيانات الطلاب</button>
                    <button onClick={() => setDashboardTab('map')} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s', background: dashboardTab === 'map' ? 'var(--danger)' : 'transparent', color: dashboardTab === 'map' ? 'white' : 'var(--txt)' }}><FaMapMarkerAlt style={{ margin: '0 8px' }} /> خريطة المحافظات التفاعلية</button>
                </div>

                {dashboardTab === 'table' && (
                    <>
                        <StudentsFilters 
                            studentsCount={students.length} activeCount={activeCount} bannedCount={bannedCount}
                            selectedStatus={selectedStatus} onStatusChange={(val) => { setSelectedStatus(val); setCurrentPage(1); }}
                            searchQuery={searchQuery} onSearchChange={(val) => { setSearchQuery(val); setCurrentPage(1); }}
                            selectedGrade={selectedGrade} onGradeChange={(val) => { setSelectedGrade(val); setCurrentPage(1); }}
                        />

                        {selectedIds.length > 0 && (
                            <div style={{ background: 'linear-gradient(90deg, var(--p-purple), #ff007f)', padding: '15px 20px', borderRadius: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', animation: 'fadeIn 0.3s ease' }}>
                                <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}><FaCheckSquare size={20} /> تم تحديد {selectedIds.length} طالب</div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button onClick={() => { showToast(`تم تصفير الأجهزة لـ ${selectedIds.length} طالب`, 'success'); setSelectedIds([]); }} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', padding: '8px 15px', borderRadius: '8px', color: 'white', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}><FaSyncAlt /> تصفير IP</button>
                                    {selectedStatus === 'banned' ? (
                                        <button onClick={() => { setStudents(students.map(s => selectedIds.includes(s.id) ? { ...s, status: 'active' } : s)); setSelectedIds([]); showToast('تم فك الحظر', 'success'); }} style={{ background: 'var(--success)', border: 'none', padding: '8px 15px', borderRadius: '8px', color: 'white', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}><FaUnlock /> فك الحظر</button>
                                    ) : (
                                        <button onClick={() => { setStudents(students.map(s => selectedIds.includes(s.id) ? { ...s, status: 'banned' } : s)); setSelectedIds([]); showToast('تم الحظر', 'error'); }} style={{ background: 'var(--danger)', border: 'none', padding: '8px 15px', borderRadius: '8px', color: 'white', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}><FaBan /> حظر</button>
                                    )}
                                </div>
                            </div>
                        )}

                        <StudentsTable 
                            students={currentStudents} selectedIds={selectedIds} 
                            onToggleAll={toggleSelectAll} onToggleOne={toggleSelectOne} 
                            onOpenProfile={(student) => { setSelectedStudent(student); setView('profile'); }} 
                        />
                        
                        {totalPages > 1 && (
                            <div style={{ padding: '15px', display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} style={{ padding: '8px 15px', background: 'var(--card)', border: '1px solid var(--border-color)', color: 'var(--txt)', borderRadius: '8px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}>السابق</button>
                                <span style={{ padding: '8px 15px', fontWeight: 'bold', color: 'var(--p-purple)' }}>{currentPage} / {totalPages}</span>
                                <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)} style={{ padding: '8px 15px', background: 'var(--card)', border: '1px solid var(--border-color)', color: 'var(--txt)', borderRadius: '8px', cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer' }}>التالي</button>
                            </div>
                        )}
                    </>
                )}

                {/* 🚀 عرض الخريطة المعزولة اللي ظبطناها مع بعض */}
                {dashboardTab === 'map' && (
                    <StudentsMap />
                )}
            </div>
        );
    }

    if (view === 'profile' && selectedStudent) {
        return (
            <StudentProfile 
                student={selectedStudent} 
                onBack={() => setView('dashboard')} 
                onUpdate={handleUpdateStudent} 
                onRefund={handleRefund} 
                onResetExam={handleResetExam} 
            />
        );
    }

    return null;
}