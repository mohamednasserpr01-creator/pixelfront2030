"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { FaHistory, FaSearch, FaDesktop, FaServer, FaChevronRight, FaChevronLeft, FaClock, FaCalendarAlt } from 'react-icons/fa';
import { ActionsTable } from './components/ActionsTable';
import { LogDetailsModal } from './components/LogDetailsModal';

// ==========================================
// 💡 Mock Data
// ==========================================
const MOCK_SESSIONS = Array.from({ length: 40 }).map((_, i) => ({
    id: `s${i}`,
    user: i % 4 === 0 ? 'أ. محمد ناصر' : (i % 2 === 0 ? 'أحمد محمود' : 'سارة طارق'),
    role: i % 4 === 0 ? 'مدرس' : 'مساعد',
    login: `2026-04-${String(24 - (i % 10)).padStart(2, '0')} 08:00 AM`,
    logout: i === 0 ? null : `2026-04-${String(24 - (i % 10)).padStart(2, '0')} 02:30 PM`,
    duration: i === 0 ? 'متصل الآن' : '6 ساعات و 30 دقيقة',
    device: i % 2 === 0 ? 'Windows 10 - Chrome' : 'MacBook - Safari',
    ip: `192.168.1.${10 + i}`
}));

const MOCK_ACTIONS = Array.from({ length: 85 }).map((_, i) => {
    const actions = ['add', 'edit', 'delete', 'view'];
    const modules = ['courses', 'lessons', 'exams', 'question_banks', 'library'];
    const users = ['أحمد محمود', 'سارة طارق', 'أ. محمد ناصر'];
    const action = actions[i % 4];
    return {
        id: `act-${i}`,
        user: users[i % 3],
        role: users[i % 3] === 'أ. محمد ناصر' ? 'مدرس' : 'مساعد',
        module: modules[i % 5],
        actionType: action,
        target: `عنصر تجريبي رقم ${i + 1}`,
        timestamp: `2026-04-${String(24 - (i % 15)).padStart(2, '0')} 10:${String((i * 13) % 60).padStart(2, '0')} AM`,
        dateOnly: `2026-04-${String(24 - (i % 15)).padStart(2, '0')}`,
        details: action === 'edit' ? { oldState: { title: `قديم ${i}` }, newState: { title: `جديد ${i}` } } : { info: 'تفاصيل العملية.' }
    };
});

export default function ActivityLogsPage() {
    const [isMounted, setIsMounted] = useState(false);
    const [activeTab, setActiveTab] = useState<'actions' | 'sessions'>('actions');
    
    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [filterUser, setFilterUser] = useState('all');
    const [filterModule, setFilterModule] = useState('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Pagination (20 rows per page)
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const [selectedDetails, setSelectedDetails] = useState<any | null>(null);

    useEffect(() => { setIsMounted(true); }, []);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const filteredActions = useMemo(() => {
        return MOCK_ACTIONS.filter(log => {
            const matchSearch = log.user.includes(debouncedSearch) || log.target.includes(debouncedSearch);
            const matchUser = filterUser === 'all' || log.user === filterUser;
            const matchModule = filterModule === 'all' || log.module === filterModule;
            
            let matchDate = true;
            if (startDate) matchDate = matchDate && log.dateOnly >= startDate;
            if (endDate) matchDate = matchDate && log.dateOnly <= endDate;

            return matchSearch && matchUser && matchModule && matchDate;
        });
    }, [debouncedSearch, filterUser, filterModule, startDate, endDate]);

    const filteredSessions = useMemo(() => {
        return MOCK_SESSIONS.filter(session => {
            const matchSearch = session.user.includes(debouncedSearch) || session.device.includes(debouncedSearch) || session.ip.includes(debouncedSearch);
            const matchUser = filterUser === 'all' || session.user === filterUser;
            
            let matchDate = true;
            const sessionDate = session.login.split(' ')[0];
            if (startDate) matchDate = matchDate && sessionDate >= startDate;
            if (endDate) matchDate = matchDate && sessionDate <= endDate;

            return matchSearch && matchUser && matchDate;
        });
    }, [debouncedSearch, filterUser, startDate, endDate]);

    const totalActionPages = Math.ceil(filteredActions.length / itemsPerPage);
    const paginatedActions = useMemo(() => filteredActions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [filteredActions, currentPage]);

    const totalSessionPages = Math.ceil(filteredSessions.length / itemsPerPage);
    const paginatedSessions = useMemo(() => filteredSessions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [filteredSessions, currentPage]);

    useEffect(() => { setCurrentPage(1); }, [activeTab, debouncedSearch, filterUser, filterModule, startDate, endDate]);

    if (!isMounted) return null;

    return (
        <div style={{ animation: 'fadeIn 0.4s ease', maxWidth: '1400px', margin: '0 auto', paddingBottom: '50px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', marginTop: '20px' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', margin: '0 0 5px 0', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaHistory color="#3498db" /> مركز المراقبة والسجلات
                    </h1>
                    <p style={{ color: 'var(--txt-mut)', margin: 0 }}>مراقبة دقيقة لكل إجراء وجلسة عمل (للمدرس والمساعدين).</p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '25px' }}>
                <button onClick={() => setActiveTab('actions')} style={{ background: 'transparent', border: 'none', borderBottom: activeTab === 'actions' ? '3px solid #3498db' : '3px solid transparent', padding: '0 0 15px 0', color: activeTab === 'actions' ? 'white' : 'var(--txt-mut)', fontWeight: activeTab === 'actions' ? 'bold' : 'normal', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px', transition: '0.2s' }}>
                    <FaServer /> سجل الحركات ({filteredActions.length})
                </button>
                <button onClick={() => setActiveTab('sessions')} style={{ background: 'transparent', border: 'none', borderBottom: activeTab === 'sessions' ? '3px solid #3498db' : '3px solid transparent', padding: '0 0 15px 0', color: activeTab === 'sessions' ? 'white' : 'var(--txt-mut)', fontWeight: activeTab === 'sessions' ? 'bold' : 'normal', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px', transition: '0.2s' }}>
                    <FaDesktop /> سجل الجلسات ({filteredSessions.length})
                </button>
            </div>

            {/* 🚀 Advanced Filters Bar */}
            <div style={{ background: 'var(--card)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '20px', display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: '1 1 200px' }}>
                    <FaSearch style={{ position: 'absolute', right: '15px', top: '14px', color: 'var(--txt-mut)' }} />
                    <input type="text" placeholder={activeTab === 'actions' ? "ابحث بالاسم أو الهدف..." : "ابحث بالاسم أو الجهاز..."} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ width: '100%', padding: '12px 40px 12px 15px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }} />
                </div>
                
                <select value={filterUser} onChange={e => setFilterUser(e.target.value)} style={{ flex: '1 1 150px', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }}>
                    <option value="all" style={{ background: '#1e1e2d' }}>الكل (مدرس ومساعدين)</option>
                    <option value="أ. محمد ناصر" style={{ background: '#1e1e2d' }}>المدرس: أ. محمد ناصر</option>
                    <option value="أحمد محمود" style={{ background: '#1e1e2d' }}>المساعد: أحمد محمود</option>
                    <option value="سارة طارق" style={{ background: '#1e1e2d' }}>المساعد: سارة طارق</option>
                </select>

                {activeTab === 'actions' && (
                    <select value={filterModule} onChange={e => setFilterModule(e.target.value)} style={{ flex: '1 1 150px', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }}>
                        <option value="all" style={{ background: '#1e1e2d' }}>كل الأقسام</option>
                        <option value="courses" style={{ background: '#1e1e2d' }}>الكورسات</option>
                        <option value="lessons" style={{ background: '#1e1e2d' }}>الحصص</option>
                        <option value="exams" style={{ background: '#1e1e2d' }}>الامتحانات</option>
                        <option value="question_banks" style={{ background: '#1e1e2d' }}>بنوك الأسئلة</option>
                        <option value="library" style={{ background: '#1e1e2d' }}>المكتبة</option>
                    </select>
                )}

                {/* 🚀 التصميم الجديد والشيك لفلاتر التاريخ */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: '1 1 350px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0 15px', flex: 1 }}>
                        <FaCalendarAlt color="var(--p-purple)" size={14} />
                        <span style={{ color: 'var(--txt-mut)', fontSize: '0.9rem', margin: '0 10px', whiteSpace: 'nowrap' }}>من:</span>
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ width: '100%', padding: '12px 0', background: 'transparent', border: 'none', color: 'white', outline: 'none', colorScheme: 'dark', fontFamily: 'inherit' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0 15px', flex: 1 }}>
                        <FaCalendarAlt color="var(--p-purple)" size={14} />
                        <span style={{ color: 'var(--txt-mut)', fontSize: '0.9rem', margin: '0 10px', whiteSpace: 'nowrap' }}>إلى:</span>
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ width: '100%', padding: '12px 0', background: 'transparent', border: 'none', color: 'white', outline: 'none', colorScheme: 'dark', fontFamily: 'inherit' }} />
                    </div>
                </div>
            </div>

            {/* Actions Tab */}
            {activeTab === 'actions' && (
                <div style={{ animation: 'fadeIn 0.3s ease' }}>
                    <ActionsTable logs={paginatedActions} onViewDetails={setSelectedDetails} />
                    
                    {totalActionPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginTop: '20px' }}>
                            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', width: '40px', height: '40px', borderRadius: '8px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}><FaChevronRight /></button>
                            <span style={{ color: 'var(--txt-mut)' }}>صفحة <strong style={{ color: 'white' }}>{currentPage}</strong> من {totalActionPages}</span>
                            <button disabled={currentPage === totalActionPages} onClick={() => setCurrentPage(p => p + 1)} style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', width: '40px', height: '40px', borderRadius: '8px', cursor: currentPage === totalActionPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalActionPages ? 0.5 : 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}><FaChevronLeft /></button>
                        </div>
                    )}
                </div>
            )}

            {/* Sessions Tab */}
            {activeTab === 'sessions' && (
                <div style={{ animation: 'fadeIn 0.3s ease' }}>
                    <div style={{ background: 'var(--card)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', overflowX: 'auto' }}>
                        <table style={{ width: '100%', minWidth: '900px', borderCollapse: 'collapse', textAlign: 'right', color: 'white' }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <th style={{ padding: '15px' }}>المستخدم</th>
                                    <th style={{ padding: '15px' }}>وقت الدخول</th>
                                    <th style={{ padding: '15px' }}>وقت الخروج</th>
                                    <th style={{ padding: '15px' }}>مدة الجلسة</th>
                                    <th style={{ padding: '15px' }}>الجهاز / IP</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedSessions.map(session => (
                                    <tr key={session.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }} className="table-row-hover">
                                        <td style={{ padding: '15px' }}>
                                            <div style={{ fontWeight: 'bold', color: session.role === 'مدرس' ? '#f1c40f' : 'white' }}>{session.user}</div>
                                            <div style={{ fontSize: '0.8rem', color: session.role === 'مدرس' ? 'rgba(241, 196, 15, 0.7)' : 'var(--txt-mut)' }}>{session.role}</div>
                                        </td>
                                        <td style={{ padding: '15px', color: '#2ecc71', fontSize: '0.9rem', direction: 'ltr', textAlign: 'right' }}>{session.login}</td>
                                        <td style={{ padding: '15px', color: '#e74c3c', fontSize: '0.9rem', direction: 'ltr', textAlign: 'right' }}>{session.logout || 'متصل الآن'}</td>
                                        <td style={{ padding: '15px', color: '#3498db', fontWeight: 'bold' }}><FaClock style={{ margin: '0 5px' }}/> {session.duration}</td>
                                        <td style={{ padding: '15px', color: 'var(--txt-mut)', fontSize: '0.85rem' }}>
                                            <div>{session.device}</div>
                                            <div style={{ fontFamily: 'monospace' }}>IP: {session.ip}</div>
                                        </td>
                                    </tr>
                                ))}
                                {paginatedSessions.length === 0 && (
                                    <tr><td colSpan={5} style={{ padding: '30px', textAlign: 'center', color: 'var(--txt-mut)' }}>لا توجد جلسات مطابقة للبحث أو التاريخ.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {totalSessionPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginTop: '20px' }}>
                            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', width: '40px', height: '40px', borderRadius: '8px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}><FaChevronRight /></button>
                            <span style={{ color: 'var(--txt-mut)' }}>صفحة <strong style={{ color: 'white' }}>{currentPage}</strong> من {totalSessionPages}</span>
                            <button disabled={currentPage === totalSessionPages} onClick={() => setCurrentPage(p => p + 1)} style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', width: '40px', height: '40px', borderRadius: '8px', cursor: currentPage === totalSessionPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalSessionPages ? 0.5 : 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}><FaChevronLeft /></button>
                        </div>
                    )}
                </div>
            )}

            <LogDetailsModal selectedDetails={selectedDetails} onClose={() => setSelectedDetails(null)} />
        </div>
    );
}