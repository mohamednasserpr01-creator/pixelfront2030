"use client";
import React, { useState, useMemo } from 'react';
import { FaTimes, FaPenNib, FaSearch, FaCheckCircle, FaClock, FaChevronLeft, FaSave, FaImage } from 'react-icons/fa';
import { LectureItem } from '../types/curriculum.types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    item: LectureItem | null;
}

// 💡 واجهة بيانات الإجابة المقالية
interface Submission {
    id: string;
    studentName: string;
    studentPhone: string;
    answerText: string;
    answerImage?: string; // لو الطالب رافع صورة للحل
    maxScore: number;
    currentScore: number | null;
    feedback: string;
    status: 'pending' | 'graded';
    submittedAt: string;
}

export const ItemGradingModal: React.FC<Props> = ({ isOpen, onClose, item }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<'all' | 'pending' | 'graded'>('pending');
    const [selectedSubId, setSelectedSubId] = useState<string | null>(null);

    // 💡 داتا وهمية للأسئلة المقالية
    const [submissions, setSubmissions] = useState<Submission[]>([
        { id: 'sub-1', studentName: 'أحمد محمود', studentPhone: '01012345678', answerText: 'قانون أوم ينص على أن فرق الجهد يتناسب طردياً مع شدة التيار عند ثبوت درجة الحرارة.', maxScore: 5, currentScore: null, feedback: '', status: 'pending', submittedAt: 'منذ ساعتين' },
        { id: 'sub-2', studentName: 'سارة علي', studentPhone: '01198765432', answerText: 'التيار الكهربي هو فيض من الشحنات...', answerImage: 'https://via.placeholder.com/400x200?text=Student+Answer+Image', maxScore: 5, currentScore: null, feedback: '', status: 'pending', submittedAt: 'منذ 3 ساعات' },
        { id: 'sub-3', studentName: 'كريم حسن', studentPhone: '01234567890', answerText: 'المقاومة هي الممانعة التي يلقاها التيار...', maxScore: 5, currentScore: 4, feedback: 'إجابة جيدة ولكن تنقصها وحدات القياس.', status: 'graded', submittedAt: 'منذ يوم' },
    ]);

    if (!isOpen || !item) return null;

    const filteredSubmissions = submissions.filter(sub => {
        const matchesSearch = sub.studentName.includes(searchQuery) || sub.studentPhone.includes(searchQuery);
        const matchesFilter = filter === 'all' ? true : sub.status === filter;
        return matchesSearch && matchesFilter;
    });

    const selectedSub = submissions.find(s => s.id === selectedSubId) || null;
    const currentIndex = filteredSubmissions.findIndex(s => s.id === selectedSubId);

    // 🚀 دوال الحفظ والانتقال السريع
    const handleSaveScore = (score: number, feedback: string, autoNext: boolean = false) => {
        if (!selectedSub) return;
        
        setSubmissions(prev => prev.map(s => 
            s.id === selectedSub.id ? { ...s, currentScore: score, feedback, status: 'graded' } : s
        ));

        if (autoNext && currentIndex < filteredSubmissions.length - 1) {
            setSelectedSubId(filteredSubmissions[currentIndex + 1].id);
        } else if (autoNext) {
            alert("🎉 تم الانتهاء من تصحيح جميع الإجابات في هذه القائمة!");
            setSelectedSubId(null);
        }
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
            <div style={{ background: '#1a1a2e', borderRadius: '15px', width: '95vw', maxWidth: '1300px', height: '90vh', display: 'flex', flexDirection: 'column', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                
                {/* 🚀 الهيدر العُلوي */}
                <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)' }}>
                    <div>
                        <h2 style={{ margin: '0 0 5px 0', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FaPenNib color="#3498db" /> مركز التصحيح المقالي: {item.title}
                        </h2>
                        <div style={{ fontSize: '0.9rem', color: 'var(--txt-mut)' }}>
                            إجمالي: {submissions.length} | بانتظار التصحيح: <span style={{ color: '#f39c12', fontWeight: 'bold' }}>{submissions.filter(s => s.status === 'pending').length}</span> | تم التصحيح: <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>{submissions.filter(s => s.status === 'graded').length}</span>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--txt-mut)', cursor: 'pointer', fontSize: '1.5rem' }}><FaTimes /></button>
                </div>

                <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                    {/* 🚀 القائمة الجانبية (يمين) - قائمة الطلاب */}
                    <div style={{ width: '350px', borderLeft: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.1)' }}>
                        <div style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ position: 'relative', marginBottom: '15px' }}>
                                <FaSearch style={{ position: 'absolute', right: '15px', top: '12px', color: 'var(--txt-mut)' }} />
                                <input type="text" placeholder="ابحث بالطالب..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '100%', padding: '10px 40px 10px 15px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '5px', background: 'rgba(0,0,0,0.2)', padding: '5px', borderRadius: '8px' }}>
                                {['pending', 'graded', 'all'].map(f => (
                                    <button key={f} onClick={() => setFilter(f as any)} style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '5px', background: filter === f ? 'var(--p-purple)' : 'transparent', color: filter === f ? 'white' : 'var(--txt-mut)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: filter === f ? 'bold' : 'normal' }}>
                                        {f === 'pending' ? 'بانتظار التصحيح' : f === 'graded' ? 'تم التصحيح' : 'الكل'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
                            {filteredSubmissions.length === 0 ? (
                                <div style={{ textAlign: 'center', color: 'var(--txt-mut)', marginTop: '50px' }}>لا توجد إجابات مطابقة</div>
                            ) : (
                                filteredSubmissions.map(sub => (
                                    <div 
                                        key={sub.id} 
                                        onClick={() => setSelectedSubId(sub.id)}
                                        style={{ padding: '15px', borderRadius: '10px', marginBottom: '10px', cursor: 'pointer', border: `1px solid ${selectedSubId === sub.id ? '#3498db' : 'rgba(255,255,255,0.05)'}`, background: selectedSubId === sub.id ? 'rgba(52, 152, 219, 0.1)' : 'transparent', transition: '0.2s' }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                            <strong style={{ color: 'white' }}>{sub.studentName}</strong>
                                            {sub.status === 'graded' ? <FaCheckCircle color="#2ecc71" title="تم التصحيح" /> : <FaClock color="#f39c12" title="بانتظار التصحيح" />}
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--txt-mut)' }}>
                                            <span>{sub.studentPhone}</span>
                                            {sub.status === 'graded' && <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>{sub.currentScore} / {sub.maxScore}</span>}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* 🚀 منطقة التصحيح (يسار) */}
                    <div style={{ flex: 1, padding: '30px', overflowY: 'auto', background: '#1a1a2e' }}>
                        {!selectedSub ? (
                            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--txt-mut)' }}>
                                <FaPenNib size={60} style={{ opacity: 0.2, marginBottom: '20px' }} />
                                <h3>اختر طالباً من القائمة للبدء في التصحيح</h3>
                            </div>
                        ) : (
                            <GradingPanel submission={selectedSub} onSave={handleSaveScore} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// 💡 مكون فرعي لواجهة التصحيح نفسها عشان الكود ميكبرش
const GradingPanel: React.FC<{ submission: Submission, onSave: (score: number, feedback: string, autoNext: boolean) => void }> = ({ submission, onSave }) => {
    const [score, setScore] = useState<string>(submission.currentScore !== null ? String(submission.currentScore) : '');
    const [feedback, setFeedback] = useState<string>(submission.feedback || '');

    // تحديث الـ state لما نغير الطالب
    React.useEffect(() => {
        setScore(submission.currentScore !== null ? String(submission.currentScore) : '');
        setFeedback(submission.feedback || '');
    }, [submission]);

    return (
        <div style={{ animation: 'fadeIn 0.3s ease', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
                <div>
                    <h2 style={{ color: 'white', margin: '0 0 5px 0' }}>إجابة الطالب: {submission.studentName}</h2>
                    <span style={{ color: 'var(--txt-mut)', fontSize: '0.9rem' }}>تم التسليم: {submission.submittedAt}</span>
                </div>
                <div style={{ background: 'rgba(52, 152, 219, 0.1)', color: '#3498db', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold', border: '1px solid rgba(52, 152, 219, 0.3)' }}>
                    الدرجة القصوى للسؤال: {submission.maxScore}
                </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '30px' }}>
                <h4 style={{ margin: '0 0 15px 0', color: 'var(--p-purple)' }}>نص الإجابة:</h4>
                <p style={{ color: 'white', lineHeight: '1.8', fontSize: '1.1rem', margin: 0 }}>{submission.answerText}</p>
                
                {submission.answerImage && (
                    <div style={{ marginTop: '20px', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '20px' }}>
                        <h4 style={{ margin: '0 0 15px 0', color: 'var(--p-purple)', display: 'flex', alignItems: 'center', gap: '8px' }}><FaImage /> المرفقات:</h4>
                        <img src={submission.answerImage} alt="إجابة الطالب" style={{ maxWidth: '100%', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }} />
                    </div>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', marginBottom: '30px' }}>
                <div>
                    <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '10px' }}>الدرجة المستحقة</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input 
                            type="number" 
                            min="0" 
                            max={submission.maxScore}
                            value={score} 
                            onChange={(e) => setScore(e.target.value)} 
                            style={{ width: '100px', padding: '15px', background: 'rgba(0,0,0,0.3)', border: '1px solid #3498db', color: 'white', borderRadius: '10px', outline: 'none', fontSize: '1.2rem', textAlign: 'center', fontWeight: 'bold' }} 
                        />
                        <span style={{ color: 'var(--txt-mut)', fontSize: '1.2rem' }}>/ {submission.maxScore}</span>
                    </div>
                </div>
                <div>
                    <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '10px' }}>ملاحظات المدرس للطالب (اختياري)</label>
                    <textarea 
                        value={feedback} 
                        onChange={(e) => setFeedback(e.target.value)} 
                        rows={3} 
                        placeholder="اكتب ملاحظاتك على الإجابة هنا..." 
                        style={{ width: '100%', padding: '15px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '10px', outline: 'none', resize: 'none', fontFamily: 'inherit' }} 
                    />
                </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
                <button 
                    onClick={() => onSave(Number(score), feedback, true)}
                    disabled={score === '' || Number(score) < 0 || Number(score) > submission.maxScore}
                    style={{ flex: 1, background: '#2ecc71', color: 'white', border: 'none', padding: '15px', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 'bold', cursor: score === '' ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', opacity: score === '' ? 0.5 : 1 }}
                >
                    <FaSave /> حفظ والتالي <FaChevronLeft />
                </button>
                <button 
                    onClick={() => onSave(Number(score), feedback, false)}
                    disabled={score === '' || Number(score) < 0 || Number(score) > submission.maxScore}
                    style={{ background: 'transparent', color: '#3498db', border: '1px solid #3498db', padding: '15px 30px', borderRadius: '10px', fontSize: '1rem', fontWeight: 'bold', cursor: score === '' ? 'not-allowed' : 'pointer', opacity: score === '' ? 0.5 : 1 }}
                >
                    حفظ فقط
                </button>
            </div>
        </div>
    );
};