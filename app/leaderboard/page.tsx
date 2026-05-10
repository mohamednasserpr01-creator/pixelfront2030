"use client";
import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
    FaTrophy, FaMedal, FaInfoCircle, FaSearch, FaCaretUp, FaCaretDown, FaMinus, FaStar,
    FaMapMarkerAlt, FaFileAlt, FaPlayCircle, FaPenNib, FaChartLine, FaFireAlt, FaExclamationTriangle, FaSyncAlt
} from 'react-icons/fa';

import { useSettings } from '../../context/SettingsContext';
import { useDebounce } from '../../hooks/useDebounce';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import styles from './Leaderboard.module.css';

// ==========================================
// 💡 STRICT INTERFACES
// ==========================================
export type FormState = 'W' | 'L' | 'D';
export type RankChange = 'up' | 'down' | 'same';
export type LeagueTier = 'Diamond' | 'Gold' | 'Silver' | 'Bronze';

export interface PointsBreakdown {
    lectures: number;
    exams: number;
    homework: number;
}

export interface FormRecord {
    id: string;
    result: FormState;
}

export interface Badge {
    id: string;
    icon: string;
    name: string;
}

export interface StudentRank {
    id: string;
    rank: number;
    name: string;
    governorate: string;
    avatar: string;
    league: LeagueTier;
    streak: number; 
    badges: Badge[];
    totalPoints: number;
    rankChange: RankChange;
    form: FormRecord[];
    breakdown: PointsBreakdown;
    isCurrentUser?: boolean;
}

// ==========================================
// 💡 MOCK BACKEND SERVICE
// ==========================================
const GOVERNORATES = ['القاهرة', 'الإسكندرية', 'الجيزة', 'الشرقية', 'الدقهلية'];
const LEAGUES: LeagueTier[] = ['Diamond', 'Gold', 'Silver', 'Bronze'];

const generateMockDB = (): StudentRank[] => {
    return Array.from({ length: 150 }).map((_, i) => {
        const total = Math.floor(Math.random() * 5000) + 1000;
        return {
            id: `stu-${i + 1}`,
            rank: 0, 
            name: i === 0 ? 'أحمد محمود النجار' : i === 1 ? 'سارة طارق إبراهيم' : i === 15 ? 'يوسف خالد (أنت)' : `طالب متفوق ${i + 1}`,
            governorate: GOVERNORATES[i % GOVERNORATES.length],
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 15}&style=circle&backgroundColor=${i===0?'f1c40f':i===1?'bdc3c7':'6c5ce7'}`,
            league: LEAGUES[i % 4],
            streak: Math.floor(Math.random() * 30),
            badges: i % 3 === 0 ? [{ id: `b1-${i}`, icon: '⚡', name: 'سريع التعلم' }] : [],
            totalPoints: total,
            rankChange: (Math.random() > 0.6 ? 'up' : Math.random() > 0.3 ? 'down' : 'same') as RankChange,
            form: Array.from({ length: 5 }, (_, idx) => ({ id: `f-${i}-${idx}`, result: ['W', 'L', 'D'][Math.floor(Math.random() * 3)] as FormState })),
            breakdown: { lectures: total * 0.4, exams: total * 0.4, homework: total * 0.2 },
            isCurrentUser: i === 15 
        };
    }).sort((a, b) => b.totalPoints - a.totalPoints).map((stu, idx) => ({ ...stu, rank: idx + 1 }));
};

const MOCK_DB = generateMockDB();

// 🚀 Security Fix: الباك إند بيرجع أول 20 بس عشان نمنع سحب الداتا
const fetchLeaderboard = async (stage: string, subject: string, search: string) => {
    await new Promise(resolve => setTimeout(resolve, 600)); 
    
    let filtered = [...MOCK_DB];
    if (search) {
        filtered = filtered.filter(s => s.name.includes(search) || s.governorate.includes(search));
    }

    // 🔒 نقتطع أول 20 طالب فقط (لا يوجد Pagination)
    const data = filtered.slice(0, 20); 
    
    // 💡 نبعت بيانات الطالب الحالي حتى لو مش في أول 20 عشان الشريط اللي تحت
    const currentUser = MOCK_DB.find(s => s.isCurrentUser);

    return { data, currentUser };
};

export default function LeaderboardPage() {
    const { lang } = useSettings();
    const router = useRouter();
    const isAr = lang === 'ar';
    const queryClient = useQueryClient();

    const [activeStage, setActiveStage] = useState('sec3');
    const [activeSubject, setActiveSubject] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<StudentRank | null>(null);

    const debouncedSearch = useDebounce(searchQuery, 500);

    // 🚀 React Query Fetching
    const { data, isLoading, isError, refetch, isFetching } = useQuery({
        queryKey: ['leaderboard', activeStage, activeSubject, debouncedSearch],
        queryFn: () => fetchLeaderboard(activeStage, activeSubject, debouncedSearch),
        staleTime: 60000, 
        retry: 2, 
    });

    if (isError) return (
        <main className={styles.pageWrapper} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <FaExclamationTriangle style={{ fontSize: '4rem', color: 'var(--danger)', marginBottom: '20px' }} />
            <h2 style={{ color: 'var(--txt)', marginBottom: '10px' }}>{isAr ? 'عذراً، تعذر الاتصال بالخادم.' : 'Connection Error.'}</h2>
            <p style={{ color: 'var(--txt-mut)', marginBottom: '20px' }}>{isAr ? 'يرجى التحقق من اتصالك بالإنترنت والمحاولة مجدداً.' : 'Please check your connection and try again.'}</p>
            <Button variant="primary" icon={<FaSyncAlt />} onClick={() => refetch()} isLoading={isFetching}>
                {isAr ? 'إعادة المحاولة' : 'Retry'}
            </Button>
        </main>
    );

    const getRankBorderColor = (rank: number) => {
        if (rank === 1) return '#f1c40f';
        if (rank === 2) return '#bdc3c7';
        if (rank === 3) return '#cd7f32';
        if (rank <= 10) return 'var(--p-purple)';
        return 'transparent';
    };

    const getLeagueColor = (league: LeagueTier) => {
        switch(league) {
            case 'Diamond': return '#00d2ff';
            case 'Gold': return '#f1c40f';
            case 'Silver': return '#bdc3c7';
            case 'Bronze': return '#cd7f32';
            default: return 'var(--txt-mut)';
        }
    };

    const leaderboardData = data?.data || [];
    // 💡 عشان مفيش Pagination، الـ Top 3 هياخدوا أول 3 والجدول هياخد الباقي (بشرط مفيش بحث)
    const topThree = !debouncedSearch ? leaderboardData.slice(0, 3) : [];
    const tableData = !debouncedSearch ? leaderboardData.slice(3) : leaderboardData;

    return (
        <main className={styles.pageWrapper}>
            <div className={styles.fantasyHeader}>
                <h1 className={styles.fantasyTitle}>
                    <FaTrophy style={{ color: '#f1c40f' }} /> {isAr ? 'أفضل 20 طالب (Top 20)' : 'Top 20 Students'}
                </h1>
                <button className={styles.infoBtn} onClick={() => setShowInfoModal(true)}>
                    <FaInfoCircle /> {isAr ? 'دليل الدوري والنقاط' : 'League & Points Guide'}
                </button>
            </div>

            <div className={styles.plFiltersBar}>
                <select className={styles.plSelect} value={activeStage} onChange={e => setActiveStage(e.target.value)}>
                    <option value="sec1" style={{background: 'var(--bg)'}}>{isAr ? 'الصف الأول الثانوي' : 'Grade 10'}</option>
                    <option value="sec2" style={{background: 'var(--bg)'}}>{isAr ? 'الصف الثاني الثانوي' : 'Grade 11'}</option>
                    <option value="sec3" style={{background: 'var(--bg)'}}>{isAr ? 'الصف الثالث الثانوي' : 'Grade 12'}</option>
                </select>

                <select className={styles.plSelect} value={activeSubject} onChange={e => setActiveSubject(e.target.value)}>
                    <option value="all" style={{background: 'var(--bg)'}}>{isAr ? 'الترتيب العام' : 'Overall Rank'}</option>
                    <option value="physics" style={{background: 'var(--bg)'}}>{isAr ? 'الفيزياء' : 'Physics'}</option>
                    <option value="chemistry" style={{background: 'var(--bg)'}}>{isAr ? 'الكيمياء' : 'Chemistry'}</option>
                </select>

                <div className={styles.plSearch}>
                    <input 
                        type="text" 
                        placeholder={isAr ? 'ابحث باسم الطالب أو المحافظة...' : 'Search student or city...'}
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                    <FaSearch />
                </div>
            </div>

            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--p-purple)' }}>
                    <div style={{ width: '50px', height: '50px', border: '4px solid var(--p-purple)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 15px' }}></div>
                    <h3>{isAr ? 'جاري تحميل المنافسة...' : 'Loading Competition...'}</h3>
                </div>
            ) : (
                <>
                    {/* 🚀 Podium (Top 3) */}
                    {topThree.length >= 3 && (
                        <div className={styles.podiumContainer}>
                            <div className={`${styles.podiumCard} ${styles.podiumRank2}`}>
                                <div className={styles.podiumAvatar}>
                                    <Image src={topThree[1].avatar} alt="Rank 2" fill style={{ borderRadius: '50%' }} />
                                    <FaMedal className={styles.medalIcon} style={{ color: '#bdc3c7' }} />
                                </div>
                                <div className={styles.podiumName}>{topThree[1].name}</div>
                                <div style={{ color: getLeagueColor(topThree[1].league), fontSize: '0.8rem', fontWeight: 'bold' }}>{topThree[1].league} League</div>
                                <button className={styles.pointsBadge} onClick={() => setSelectedStudent(topThree[1])}>
                                    <FaStar color="#f1c40f" size={14}/> {topThree[1].totalPoints}
                                </button>
                            </div>
                            
                            <div className={`${styles.podiumCard} ${styles.podiumRank1}`}>
                                <div className={styles.podiumAvatar}>
                                    <Image src={topThree[0].avatar} alt="Rank 1" fill style={{ borderRadius: '50%' }} />
                                    <FaTrophy className={styles.medalIcon} style={{ color: '#f1c40f' }} />
                                </div>
                                <div className={styles.podiumName}>{topThree[0].name}</div>
                                <div style={{ color: getLeagueColor(topThree[0].league), fontSize: '0.8rem', fontWeight: 'bold' }}>{topThree[0].league} League 💎</div>
                                <button className={styles.pointsBadge} style={{ background: 'rgba(241, 196, 15, 0.1)', color: '#f1c40f', borderColor: '#f1c40f' }} onClick={() => setSelectedStudent(topThree[0])}>
                                    <FaStar color="#f1c40f" /> {topThree[0].totalPoints}
                                </button>
                            </div>

                            <div className={`${styles.podiumCard} ${styles.podiumRank3}`}>
                                <div className={styles.podiumAvatar}>
                                    <Image src={topThree[2].avatar} alt="Rank 3" fill style={{ borderRadius: '50%' }} />
                                    <FaMedal className={styles.medalIcon} style={{ color: '#cd7f32' }} />
                                </div>
                                <div className={styles.podiumName}>{topThree[2].name}</div>
                                <div style={{ color: getLeagueColor(topThree[2].league), fontSize: '0.8rem', fontWeight: 'bold' }}>{topThree[2].league} League</div>
                                <button className={styles.pointsBadge} onClick={() => setSelectedStudent(topThree[2])}>
                                    <FaStar color="#f1c40f" size={14}/> {topThree[2].totalPoints}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* 🚀 Main Table */}
                    <div className={styles.lbTableContainer}>
                        <table className={styles.lbTable}>
                            <thead>
                                <tr>
                                    <th style={{ width: '80px' }}>{isAr ? 'المركز' : 'Pos'}</th>
                                    <th>{isAr ? 'الطالب والدوري' : 'Student & League'}</th>
                                    <th style={{ textAlign: 'center' }}>{isAr ? 'الشعلة' : 'Streak'}</th>
                                    <th style={{ textAlign: 'center' }}>{isAr ? 'النقاط' : 'Pts'}</th>
                                    <th>{isAr ? 'المستوى (آخر 5)' : 'Form'}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.length > 0 ? tableData.map((student) => (
                                    <tr key={student.id} className={styles.lbRow} onClick={() => setSelectedStudent(student)} style={{ background: student.isCurrentUser ? 'rgba(108,92,231,0.1)' : '' }}>
                                        <td>
                                            <div className={styles.colRank}>
                                                <div className={styles.rankBorder} style={{ background: getRankBorderColor(student.rank) }}></div>
                                                <span>{student.rank}</span>
                                                {student.rankChange === 'up' && <FaCaretUp className={`${styles.trendIcon} ${styles.trendUp}`} />}
                                                {student.rankChange === 'down' && <FaCaretDown className={`${styles.trendIcon} ${styles.trendDown}`} />}
                                                {student.rankChange === 'same' && <FaMinus className={`${styles.trendIcon} ${styles.trendSame}`} />}
                                            </div>
                                        </td>
                                        <td>
                                            <div className={styles.colStudent}>
                                                <div className={styles.stuAvatar}>
                                                    <Image src={student.avatar} alt={student.name} fill style={{ borderRadius: '50%' }} />
                                                </div>
                                                <div>
                                                    <div className={styles.stuName}>
                                                        {student.name} {student.isCurrentUser && <span style={{ color: 'var(--p-purple)', fontSize: '0.8rem' }}>({isAr ? 'أنت' : 'You'})</span>}
                                                    </div>
                                                    <div className={styles.stuGov}>
                                                        <FaMapMarkerAlt size={10} /> {student.governorate} | 
                                                        <span style={{ color: getLeagueColor(student.league), fontWeight: 'bold' }}>{student.league}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={styles.colStat} style={{ textAlign: 'center' }}>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(230, 126, 34, 0.1)', color: '#e67e22', padding: '5px 10px', borderRadius: '8px' }}>
                                                <FaFireAlt /> {student.streak}
                                            </span>
                                        </td>
                                        <td className={styles.colTotal} style={{ textAlign: 'center' }}>{student.totalPoints}</td>
                                        <td>
                                            <div className={styles.colForm}>
                                                {student.form.map((f) => (
                                                    <div key={f.id} className={`${styles.formCircle} ${styles[`form${f.result}` as keyof typeof styles]}`}>
                                                        {f.result}
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--txt-mut)' }}>
                                            {isAr ? 'لا يوجد طلاب مطابقين لبحثك.' : 'No students match your search.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* 🚀 My Rank Sticky Bar */}
            {data?.currentUser && !isLoading && (
                <div className={styles.myRankBar}>
                    <div className={styles.myRankInfo}>
                        <div className={styles.stuAvatar}>
                            <Image src={data.currentUser.avatar} alt="You" fill style={{ borderRadius: '50%' }} />
                        </div>
                        <div>
                            <div style={{ color: 'var(--txt-mut)', fontSize: '0.85rem', fontWeight: 'bold' }}>{isAr ? 'مركزك الحالي' : 'Your Current Rank'}</div>
                            <div style={{ color: 'white', fontWeight: 900, fontSize: '1.2rem' }}>{data.currentUser.name}</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ color: 'var(--txt-mut)', fontSize: '0.85rem' }}>{isAr ? 'الشعلة' : 'Streak'}</div>
                            <div style={{ color: '#e67e22', fontWeight: 900, fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '5px' }}><FaFireAlt /> {data.currentUser.streak}</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ color: 'var(--txt-mut)', fontSize: '0.85rem', marginBottom: '2px' }}>{isAr ? 'الترتيب' : 'Rank'}</div>
                            <div className={styles.myRankPosition}>#{data.currentUser.rank}</div>
                        </div>
                        <Button variant="primary" onClick={() => router.push('/dashboard')} style={{ background: 'var(--p-purple)' }}>
                            {isAr ? 'تحليل أدائي' : 'My Analytics'}
                        </Button>
                    </div>
                </div>
            )}

            {/* 💡 MODAL: Points Breakdown */}
            <Modal isOpen={!!selectedStudent} onClose={() => setSelectedStudent(null)} title={isAr ? "التحليل الرقمي 📊" : "Analytics 📊"} maxWidth="500px">
                {selectedStudent && (
                    <div style={{ padding: '10px 0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px', background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '15px' }}>
                            <div style={{ width: '60px', height: '60px', position: 'relative' }}>
                                <Image src={selectedStudent.avatar} alt="Avatar" fill style={{ borderRadius: '50%' }} />
                            </div>
                            <div>
                                <h3 style={{ margin: '0 0 5px 0', color: 'white' }}>{selectedStudent.name}</h3>
                                <div style={{ color: getLeagueColor(selectedStudent.league), fontWeight: 'bold' }}>{selectedStudent.league} League</div>
                            </div>
                            <div style={{ marginInlineStart: 'auto', textAlign: 'center' }}>
                                <div style={{ color: '#f1c40f', fontSize: '1.5rem', fontWeight: 900 }}>{selectedStudent.totalPoints}</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div style={{ background: 'rgba(231, 76, 60, 0.1)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(231, 76, 60, 0.2)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}><FaFileAlt color="#e74c3c"/> الامتحانات</span>
                                    <span style={{ color: '#e74c3c', fontWeight: 900 }}>{selectedStudent.breakdown.exams}</span>
                                </div>
                                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
                                    <div style={{ height: '100%', background: '#e74c3c', borderRadius: '3px', width: `${(selectedStudent.breakdown.exams / selectedStudent.totalPoints) * 100}%` }}></div>
                                </div>
                            </div>
                            <div style={{ background: 'rgba(52, 152, 219, 0.1)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(52, 152, 219, 0.2)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}><FaPlayCircle color="#3498db"/> المحاضرات</span>
                                    <span style={{ color: '#3498db', fontWeight: 900 }}>{selectedStudent.breakdown.lectures}</span>
                                </div>
                                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
                                    <div style={{ height: '100%', background: '#3498db', borderRadius: '3px', width: `${(selectedStudent.breakdown.lectures / selectedStudent.totalPoints) * 100}%` }}></div>
                                </div>
                            </div>
                            <div style={{ background: 'rgba(46, 204, 113, 0.1)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(46, 204, 113, 0.2)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}><FaPenNib color="#2ecc71"/> الواجبات</span>
                                    <span style={{ color: '#2ecc71', fontWeight: 900 }}>{selectedStudent.breakdown.homework}</span>
                                </div>
                                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
                                    <div style={{ height: '100%', background: '#2ecc71', borderRadius: '3px', width: `${(selectedStudent.breakdown.homework / selectedStudent.totalPoints) * 100}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* 💡 MODAL: Guidelines (المُحدث مع الشعلة والروابط) */}
            <Modal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)} title={isAr ? "دليل الدوريات والنقاط 🏆" : "League & Points Guide 🏆"} maxWidth="550px">
                <div style={{ padding: '10px 0' }}>
                    <p style={{ color: 'var(--txt-mut)', lineHeight: '1.6', marginBottom: '20px' }}>
                        {isAr ? 'يتم عرض أول 20 طالب فقط في قائمة الشرف العامة لحماية الخصوصية وضمان التنافس العادل. ترتيبك يعتمد على مجهودك החقيقي عبر القواعد التالية:' : 'Only Top 20 are shown. Your ranking depends on these rules:'}
                    </p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ background: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem', flexShrink: 0 }}><FaFileAlt /></div>
                            <div>
                                <h4 style={{ margin: '0 0 5px 0', color: 'white' }}>{isAr ? 'الامتحانات والتقييمات' : 'Exams & Quizzes'}</h4>
                                <p style={{ margin: 0, color: 'var(--txt-mut)', fontSize: '0.9rem', lineHeight: '1.5' }}>{isAr ? 'لكل 1% تحصل عليه في الامتحان، تُضاف 10 نقاط إلى رصيدك. (مثال: 90% = 900 نقطة).' : 'For every 1% in exams, 10 points are added.'}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ background: 'rgba(52, 152, 219, 0.1)', color: '#3498db', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem', flexShrink: 0 }}><FaPlayCircle /></div>
                            <div>
                                <h4 style={{ margin: '0 0 5px 0', color: 'white' }}>{isAr ? 'مشاهدة الحصص' : 'Watching Lectures'}</h4>
                                <p style={{ margin: 0, color: 'var(--txt-mut)', fontSize: '0.9rem', lineHeight: '1.5' }}>{isAr ? 'إنهاء المحاضرة بالكامل يمنحك 50 نقطة. المشاهدة الجزئية لا تُحتسب.' : 'Completing a full lecture grants 50 points.'}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ background: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem', flexShrink: 0 }}><FaPenNib /></div>
                            <div>
                                <h4 style={{ margin: '0 0 5px 0', color: 'white' }}>{isAr ? 'الواجبات' : 'Homeworks'}</h4>
                                <p style={{ margin: 0, color: 'var(--txt-mut)', fontSize: '0.9rem', lineHeight: '1.5' }}>{isAr ? 'تسليم الواجب قبل الموعد يمنحك 100 نقطة. التأخير يخصم 50 نقطة!' : 'On-time submission gives 100 pts. Late submission deducts 50 pts.'}</p>
                            </div>
                        </div>

                        {/* 🔥 توضيح الشعلة (Streak) */}
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', background: 'rgba(230, 126, 34, 0.1)', padding: '15px', borderRadius: '10px', border: '1px dashed rgba(230, 126, 34, 0.4)' }}>
                            <div style={{ color: '#e67e22', width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem', flexShrink: 0 }}><FaFireAlt /></div>
                            <div>
                                <h4 style={{ margin: '0 0 5px 0', color: '#e67e22' }}>{isAr ? 'الشعلة (Streak)' : 'Daily Streak'}</h4>
                                <p style={{ margin: 0, color: 'var(--txt-mut)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                    {isAr 
                                        ? 'حافظ على دخولك اليومي وحل مهمة واحدة على الأقل. الشعلة تضاعف نقاطك المكتسبة (x1.5). احذر، الانقطاع يوماً واحداً يعيد شعلتك للصفر!' 
                                        : 'Maintain daily logins to multiply points by 1.5x. Missing a day resets it to zero!'}
                                </p>
                            </div>
                        </div>

                    </div>

                    <div style={{ marginTop: '25px' }}>
                        <h4 style={{ color: 'white', marginBottom: '10px', textAlign: 'center' }}>{isAr ? 'الدوريات (Leagues)' : 'Leagues'}</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', textAlign: 'center' }}>
                            <div style={{ background: 'rgba(0,210,255,0.1)', border: '1px solid #00d2ff', padding: '15px', borderRadius: '10px' }}><h4 style={{color:'#00d2ff', margin:0}}>Diamond</h4><small style={{color:'var(--txt-mut)'}}>Top 5%</small></div>
                            <div style={{ background: 'rgba(241,196,15,0.1)', border: '1px solid #f1c40f', padding: '15px', borderRadius: '10px' }}><h4 style={{color:'#f1c40f', margin:0}}>Gold</h4><small style={{color:'var(--txt-mut)'}}>Top 20%</small></div>
                            <div style={{ background: 'rgba(189,195,199,0.1)', border: '1px solid #bdc3c7', padding: '15px', borderRadius: '10px' }}><h4 style={{color:'#bdc3c7', margin:0}}>Silver</h4><small style={{color:'var(--txt-mut)'}}>Top 50%</small></div>
                            <div style={{ background: 'rgba(205,127,50,0.1)', border: '1px solid #cd7f32', padding: '15px', borderRadius: '10px' }}><h4 style={{color:'#cd7f32', margin:0}}>Bronze</h4><small style={{color:'var(--txt-mut)'}}>Rest</small></div>
                        </div>
                    </div>

                    <div style={{ marginTop: '20px', background: 'rgba(255,255,255,0.05)', color: 'var(--txt-mut)', padding: '15px', borderRadius: '10px', textAlign: 'center', fontSize: '0.85rem' }}>
                        {isAr ? '⚡ يتم تحديث الترتيب يومياً في منتصف الليل (بتوقيت الخادم).' : '⚡ Leaderboard is updated daily at midnight.'}
                    </div>
                </div>
            </Modal>
        </main>
    );
}