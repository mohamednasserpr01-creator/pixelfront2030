"use client";
import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';

import { 
    FaPhoneAlt, FaWhatsapp, FaFacebookF, FaInstagram, FaTiktok, 
    FaPlay, FaMicrophone, FaPaperPlane, FaCommentAlt, FaLock, FaBolt,
    FaSearch, FaSortAmountDown, FaChevronDown
} from 'react-icons/fa';

import { useSettings } from '../../../context/SettingsContext';
import { useDebounce } from '../../../hooks/useDebounce';
import { teacherService, TeacherProfileData, TeacherCourse } from '../../../services/teacher.service';

const sortOptions = [
    { id: 'newest', labelAr: 'الأحدث أولاً', labelEn: 'Newest First' },
    { id: 'oldest', labelAr: 'الأقدم أولاً', labelEn: 'Oldest First' },
    { id: 'name', labelAr: 'الترتيب الأبجدي', labelEn: 'Alphabetical' }
];

export default function TeacherProfile() {
    const params = useParams();
    const teacherId = params.id as string;
    
    const { lang } = useSettings();
    const isAr = lang === 'ar';

    const [mounted, setMounted] = useState(false);
    const [teacher, setTeacher] = useState<TeacherProfileData | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Courses State 
    const [courseSearch, setCourseSearch] = useState("");
    const [courseSort, setCourseSort] = useState("newest");
    const [visibleCourses, setVisibleCourses] = useState(8); // خليناهم 8 مبدئياً عشان يملوا صفين (4x2)
    const debouncedCourseSearch = useDebounce(courseSearch, 300);

    // Dropdown State
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
    const sortDropdownRef = useRef<HTMLDivElement>(null);

    // Chatbot State
    const [chatInput, setChatInput] = useState("");
    const [replyFormat, setReplyFormat] = useState("text");
    const [isRecording, setIsRecording] = useState(false);
    const [messages, setMessages] = useState<{id: number, sender: 'bot'|'user', type: 'text'|'voice', content: string}[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const chatBoxRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
        if (teacherId) {
            teacherService.getTeacherProfile(teacherId).then((data) => {
                setTeacher(data);
                setMessages([{ 
                    id: 1, sender: 'bot', type: 'text', 
                    content: isAr ? `أهلاً بيك! أنا المساعد الذكي لـ ${data.nameAr}. اختار طريقة الرد (نص أو صوت) واسألني في المنهج!` : `Welcome! I'm ${data.nameEn}'s AI.` 
                }]);
            });
        }
    }, [teacherId, isAr]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
                setIsSortDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if(chatBoxRef.current) chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }, [messages, isTyping]);

    const processedCourses = useMemo(() => {
        if (!teacher) return [];
        let filtered = teacher.courses.filter((c: TeacherCourse) => 
            (isAr ? c.titleAr : c.titleEn).toLowerCase().includes(debouncedCourseSearch.toLowerCase())
        );

        if (courseSort === 'newest') {
            filtered.sort((a, b) => b.id - a.id);
        } else if (courseSort === 'oldest') {
            filtered.sort((a, b) => a.id - b.id);
        } else if (courseSort === 'name') {
            filtered.sort((a, b) => (isAr ? a.titleAr : a.titleEn).localeCompare(isAr ? b.titleAr : b.titleEn));
        }

        return filtered;
    }, [teacher, debouncedCourseSearch, courseSort, isAr]);

    const coursesToShow = processedCourses.slice(0, visibleCourses);
    const hasMore = visibleCourses < processedCourses.length;
    const activeSortLabel = sortOptions.find(o => o.id === courseSort)?.[isAr ? 'labelAr' : 'labelEn'];

    const handleSendChat = () => {
        if(!chatInput.trim()) return;
        const newMsgId = Date.now();
        setMessages(prev => [...prev, { id: newMsgId, sender: 'user', type: 'text', content: chatInput }]);
        setChatInput("");
        setIsTyping(true);

        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, { 
                id: Date.now() + 1, 
                sender: 'bot', 
                type: replyFormat as 'text'|'voice', 
                content: replyFormat === 'text' ? (isAr ? "بالنسبة لسؤالك، أول خطوة هي تحديد الجمهور المستهدف بدقة." : "For your question, the first step is targeting the audience.") : "0:15" 
            }]);
        }, 1500);
    };

    const toggleMic = () => {
        setIsRecording(!isRecording);
        if(!isRecording) {
            setTimeout(() => { 
                setChatInput(isAr ? "اشرحلي إزاي أعمل خطة تسويقية؟" : "Explain how to make a marketing plan?"); 
                setIsRecording(false); 
            }, 2000);
        }
    };

    if (!mounted || !teacher) return (
        <main className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <div style={{ width: '50px', height: '50px', border: '4px solid rgba(108,92,231,0.2)', borderTopColor: 'var(--p-purple)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <style dangerouslySetInnerHTML={{__html: `@keyframes spin { 100% { transform: rotate(360deg); } }`}} />
        </main>
    );

    return (
        <main className="page-wrapper">
            <style>{`
                .profile-banner { max-width: 1200px; margin: 30px auto; padding: 0; }
                
                /* 🚀 إزالة הـ Gradient وتوحيد اللون السادة الفخم للكارت */
                .banner-card { 
                    background: rgba(30, 30, 45, 0.5); /* نفس لون كروت الكورسات بالظبط */
                    border-radius: 20px; 
                    border: 1px solid rgba(255,255,255,0.05); 
                    padding: 40px 50px; 
                    display: flex; 
                    align-items: center; 
                    gap: 40px; 
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1); 
                }
                
                .prof-img { width: 180px; height: 180px; border-radius: 50%; border: 4px solid var(--p-purple); object-fit: cover; box-shadow: 0 0 25px rgba(108,92,231,0.3); z-index: 2; flex-shrink: 0; }
                
                .prof-info { flex: 1; z-index: 2; text-align: right; }
                html[dir="ltr"] .prof-info { text-align: left; }
                
                .prof-badge { display: inline-block; background: var(--p-purple); color: white; padding: 6px 18px; border-radius: 50px; font-weight: bold; margin-bottom: 15px; font-size: 0.95rem; }
                .prof-info h1 { font-size: clamp(2rem, 4vw, 3rem); font-weight: 900; margin-bottom: 10px; color: var(--txt); }
                .prof-bio { font-size: 1.1rem; opacity: 0.9; margin-bottom: 25px; line-height: 1.8; color: var(--txt); font-weight: bold; }
                
                .prof-socials { display: flex; gap: 15px; flex-wrap: wrap; justify-content: flex-start; }
                .prof-socials a { width: 45px; height: 45px; border-radius: 50%; background: rgba(108,92,231,0.1); color: var(--p-purple); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; text-decoration: none; border: 1px solid rgba(108,92,231,0.3); transition: 0.3s; }
                .prof-socials a:hover { background: var(--p-purple); color: white; transform: translateY(-5px); box-shadow: 0 5px 15px rgba(108,92,231,0.4); }
                .prof-socials .phone-btn { width: auto; padding: 0 20px; border-radius: 50px; font-weight: bold; gap: 8px; }

                /* 🚀 Courses Controls */
                .courses-section { max-width: 1200px; margin: 50px auto; }
                .section-title { font-size: 2rem; margin-bottom: 30px; border-right: 5px solid var(--p-purple); padding-right: 15px; color: var(--txt); font-weight: 900; }
                html[dir="ltr"] .section-title { border-right: none; border-left: 5px solid var(--p-purple); padding-right: 0; padding-left: 15px; }
                
                .course-controls { max-width: 900px; margin: 0 auto 40px; display: flex; gap: 15px; align-items: center; justify-content: center; flex-wrap: wrap; }
                
                .course-search { flex: 2; min-width: 250px; position: relative; width: 100%; }
                .course-search input { width: 100%; height: 55px; padding: 0 50px 0 25px; border-radius: 50px; border: 2px solid rgba(108,92,231,0.2); background: var(--card); color: var(--txt); font-size: 1.05rem; outline: none; transition: 0.3s; font-weight: bold; box-shadow: 0 5px 20px rgba(0,0,0,0.05); }
                html[dir="ltr"] .course-search input { padding: 0 25px 0 50px; }
                .course-search input:focus { border-color: var(--p-purple); box-shadow: 0 5px 25px rgba(108,92,231,0.2); }
                .c-search-icon { position: absolute; right: 25px; top: 50%; transform: translateY(-50%); color: var(--p-purple); font-size: 1.2rem; pointer-events: none; }
                html[dir="ltr"] .c-search-icon { right: auto; left: 25px; }
                
                /* 🚀 Custom Dropdown */
                .custom-select-wrapper { flex: 1; min-width: 250px; position: relative; width: 100%; }
                .custom-select-header {
                    display: flex; justify-content: space-between; align-items: center;
                    width: 100%; height: 55px; padding: 0 25px;
                    border-radius: 50px; border: 2px solid rgba(108,92,231,0.2);
                    background: var(--card); color: var(--txt); font-size: 1.05rem;
                    font-weight: bold; cursor: pointer; transition: 0.3s;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.05);
                }
                .custom-select-header:hover, .custom-select-header.open { border-color: var(--p-purple); box-shadow: 0 5px 25px rgba(108,92,231,0.2); }
                .sort-icon { color: var(--p-purple); margin-inline-end: 10px; }
                .chevron-icon { color: var(--txt-mut); transition: 0.3s; }
                .chevron-icon.open { transform: rotate(180deg); color: var(--p-purple); }

                .custom-select-list {
                    position: absolute; top: calc(100% + 10px); left: 0; width: 100%;
                    background: var(--card); border: 2px solid var(--p-purple);
                    border-radius: 20px; overflow: hidden; z-index: 1000;
                    box-shadow: 0 15px 40px rgba(0,0,0,0.4);
                    max-height: 250px; overflow-y: auto;
                    opacity: 0; visibility: hidden; transform: translateY(-10px);
                    transition: 0.3s ease; backdrop-filter: blur(15px);
                }
                .custom-select-list.active { opacity: 1; visibility: visible; transform: translateY(0); }
                
                .custom-select-list::-webkit-scrollbar { width: 6px; }
                .custom-select-list::-webkit-scrollbar-track { background: transparent; }
                .custom-select-list::-webkit-scrollbar-thumb { background: rgba(108,92,231,0.5); border-radius: 10px; }

                .custom-select-item {
                    padding: 15px 20px; cursor: pointer; transition: 0.2s;
                    border-bottom: 1px dashed rgba(255,255,255,0.05);
                    color: var(--txt); font-weight: bold; font-size: 1rem;
                }
                .custom-select-item:last-child { border-bottom: none; }
                .custom-select-item:hover { background: rgba(108,92,231,0.1); color: var(--p-purple); padding-inline-start: 25px; }
                .custom-select-item.selected { background: var(--p-purple); color: white; }

                /* ========================================================== */
                /* 🚀 Courses Grid - التعديل الأهم: 4 كروت في الكمبيوتر */
                /* ========================================================== */
                .courses-grid { 
                    display: grid; 
                    grid-template-columns: repeat(1, 1fr); 
                    gap: 20px; 
                    margin-bottom: 50px; 
                }
                @media (min-width: 600px) { .courses-grid { grid-template-columns: repeat(2, 1fr); } }
                @media (min-width: 900px) { .courses-grid { grid-template-columns: repeat(3, 1fr); } }
                /* 💡 إجبار الشاشة إنها تاخد 4 كروت لما تكون العرض كبير */
                @media (min-width: 1200px) { .courses-grid { grid-template-columns: repeat(4, 1fr); gap: 20px; } }
                
                .course-card { 
                    background: rgba(30, 30, 45, 0.5);
                    border-radius: 15px; 
                    border: 1px solid rgba(255,255,255,0.05); 
                    transition: 0.3s; 
                    display: flex; 
                    flex-direction: column; 
                    overflow: hidden; 
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                }
                
                .course-card:hover { transform: translateY(-5px); border-color: var(--p-purple); box-shadow: 0 10px 30px rgba(108,92,231,0.1); }
                
                /* 💡 تصغير ارتفاع الصورة شوية عشان الكارت ميبقاش طويل بزيادة لما يكونوا 4 */
                .course-img-wrapper {
                    position: relative;
                    width: 100%;
                    height: 150px;
                    background: var(--bg);
                }

                .course-content {
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    text-align: right; 
                }
                html[dir="ltr"] .course-content { text-align: left; }

                .course-content h3 { font-size: 1.15rem; margin-bottom: 8px; color: var(--txt); font-weight: 900; }
                .course-content p { font-size: 0.85rem; color: var(--txt-mut); margin-bottom: 20px; font-weight: bold; line-height: 1.6; flex-grow: 1; }
                
                .card-btn { text-align: center; background: #6c5ce7; color: white; padding: 10px; border-radius: 8px; text-decoration: none; font-weight: bold; display: block; transition: 0.3s; font-size: 1rem; margin-top: auto; }
                .card-btn:hover { background: #5a4bcf; }
                
                .btn-outline-more { display: block; margin: 40px auto 0; padding: 12px 35px; border-radius: 50px; border: 2px solid var(--p-purple); background: transparent; color: var(--p-purple); font-weight: bold; cursor: pointer; transition: 0.3s; font-size: 1.1rem; }
                .btn-outline-more:hover { background: var(--p-purple); color: white; }

                /* 🚀 AI Chat Section */
                .ask-section { max-width: 900px; margin: 60px auto; }
                .ai-glass-card { background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(108, 92, 231, 0.15)); border: 1px solid rgba(108,92,231,0.4); border-radius: 25px; padding: 30px; display: flex; flex-direction: column; box-shadow: 0 15px 40px rgba(0,0,0,0.3); }
                
                .chat-header { margin-bottom: 20px; display: flex; align-items: center; gap: 15px; border-bottom: 1px solid rgba(108,92,231,0.2); padding-bottom: 15px; }
                .chat-header h3 { font-size: 1.4rem; display: flex; align-items: center; gap: 8px; margin-bottom: 2px; color: var(--txt); font-weight: 900; }
                .status-dot { width: 10px; height: 10px; background: #2ecc71; border-radius: 50%; display: inline-block; box-shadow: 0 0 8px #2ecc71; }
                
                .chat-box { height: 400px; min-height: 400px; max-height: 400px; background: var(--card); border: 1px solid rgba(108,92,231,0.2); border-radius: 15px 15px 0 0; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 15px; scrollbar-width: thin; scrollbar-color: var(--p-purple) transparent; }
                .msg { width: fit-content; max-width: 80%; padding: 12px 18px; border-radius: 15px; font-size: 1rem; line-height: 1.5; font-weight: bold; }
                .msg.bot { background: rgba(108,92,231,0.15); border: 1px solid rgba(108,92,231,0.3); align-self: flex-start; border-bottom-right-radius: 2px; color: var(--txt); }
                html[dir="ltr"] .msg.bot { border-bottom-right-radius: 15px; border-bottom-left-radius: 2px; }
                .msg.user { background: var(--p-purple); color: white; align-self: flex-end; border-bottom-left-radius: 2px; }
                html[dir="ltr"] .msg.user { border-bottom-left-radius: 15px; border-bottom-right-radius: 2px; }

                .voice-note { display: flex; align-items: center; gap: 10px; background: rgba(0,0,0,0.2); padding: 8px 15px; border-radius: 50px; margin-top: 5px; border: 1px solid rgba(108,92,231,0.4); width: fit-content; }
                .play-btn { width: 35px; height: 35px; border-radius: 50%; background: var(--p-purple); color: white; border: none; display: flex; justify-content: center; align-items: center; cursor: pointer; }
                .waveform { flex: 1; height: 20px; display: flex; align-items: center; gap: 2px; }
                .wave-line { width: 3px; background: var(--p-purple); border-radius: 5px; height: 100%; opacity: 0.6; }
                .vn-duration { font-size: 0.8rem; opacity: 0.8; font-weight: bold; color: var(--txt); }
                
                .chat-bottom-wrapper { position: relative; border: 1px solid rgba(108,92,231,0.2); border-top: none; border-radius: 0 0 15px 15px; background: var(--card); padding: 15px; overflow: hidden; }
                .chat-options { display: flex; gap: 15px; margin-bottom: 15px; font-size: 0.9rem; font-weight: bold; color: var(--txt); }
                .radio-label { display: flex; align-items: center; gap: 5px; cursor: pointer; opacity: 0.8; transition: 0.3s; }
                .radio-label:hover { opacity: 1; color: var(--p-purple); }
                .radio-label input { accent-color: var(--p-purple); cursor: pointer; width: 16px; height: 16px; }
                
                .chat-controls { display: flex; gap: 10px; }
                .chat-controls input { flex: 1; padding: 15px 20px; border-radius: 50px; border: 1px solid rgba(108,92,231,0.4); background: var(--bg); color: var(--txt); outline: none; font-size: 1rem; font-weight: bold; }
                .chat-controls input:focus { border-color: var(--p-purple); }
                .btn-voice, .btn-send { width: 50px; height: 50px; border-radius: 50%; border: none; display: flex; justify-content: center; align-items: center; cursor: pointer; font-size: 1.2rem; transition: 0.3s; }
                .btn-voice { background: rgba(108,92,231,0.2); color: var(--p-purple); }
                .btn-voice:hover, .btn-voice.recording { background: #e74c3c; color: white; box-shadow: 0 0 15px rgba(231, 76, 60, 0.5); }
                .btn-send { background: var(--p-purple); color: white; }
                .btn-send:hover { background: #5a4bcf; transform: scale(1.05); }

                .chat-lock-overlay { position: absolute; inset: 0; background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(4px); display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 10px; z-index: 10; transition: opacity 0.3s; }
                .chat-lock-overlay p { font-weight: bold; font-size: 1rem; text-align: center; margin-bottom: 5px; color: white; }
                .btn-login-now { background: var(--p-purple); color: white; border: none; padding: 10px 20px; border-radius: 10px; font-weight: bold; cursor: pointer; font-size: 1rem; }

                /* 📱 موبايل ريسبونسيف */
                @media (max-width: 900px) { 
                    .banner-card { flex-direction: column; text-align: center; padding: 30px 20px; gap: 20px; } 
                    .prof-info { text-align: center; }
                    .prof-socials { justify-content: center; } 
                    .course-controls { flex-direction: column; padding: 0 10px; gap: 12px; }
                    .course-search, .custom-select-wrapper { width: 100%; flex: unset; }
                }
            `}</style>

            {/* ======== Profile Banner ======== */}
            <section className="profile-banner">
                <div className="banner-card">
                    {/* 💡 الصورة الشخصية */}
                    <div style={{ position: 'relative', width: '180px', height: '180px', flexShrink: 0, borderRadius: '50%', border: '4px solid var(--p-purple)', boxShadow: '0 0 25px rgba(108,92,231,0.3)', zIndex: 2, overflow: 'hidden' }}>
                        <Image src={teacher.img} alt={teacher.nameEn} fill style={{ objectFit: 'cover' }} priority sizes="(max-width: 768px) 180px, 180px" />
                    </div>
                    
                    <div className="prof-info">
                        <span className="prof-badge">{isAr ? teacher.subjectAr : teacher.subjectEn}</span>
                        <h1>{isAr ? teacher.nameAr : teacher.nameEn}</h1>
                        <p className="prof-bio">{isAr ? teacher.bioAr : teacher.bioEn}</p>
                        <div className="prof-socials">
                            <a href={`tel:${teacher.phone}`} className="phone-btn"><FaPhoneAlt /> {teacher.phone}</a>
                            {teacher.socials.whatsapp && <a href={teacher.socials.whatsapp} target="_blank" rel="noreferrer"><FaWhatsapp /></a>}
                            {teacher.socials.facebook && <a href={teacher.socials.facebook} target="_blank" rel="noreferrer"><FaFacebookF /></a>}
                            {teacher.socials.instagram && <a href={teacher.socials.instagram} target="_blank" rel="noreferrer"><FaInstagram /></a>}
                            {teacher.socials.tiktok && <a href={teacher.socials.tiktok} target="_blank" rel="noreferrer"><FaTiktok /></a>}
                        </div>
                    </div>
                </div>
            </section>

            {/* ======== Courses Section ======== */}
            <section className="courses-section">
                <h2 className="section-title">
                    {isAr ? 'كورسات المدرس' : "Teacher's Courses"}
                </h2>
                
                <div className="course-controls">
                    <div className="course-search">
                        <FaSearch className="c-search-icon" />
                        <input 
                            type="text" 
                            placeholder={isAr ? 'ابحث في كورسات المدرس...' : 'Search in courses...'} 
                            value={courseSearch}
                            onChange={(e) => setCourseSearch(e.target.value)}
                        />
                    </div>

                    <div className="custom-select-wrapper" ref={sortDropdownRef}>
                        <div 
                            className={`custom-select-header ${isSortDropdownOpen ? 'open' : ''}`}
                            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                        >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <FaSortAmountDown className="sort-icon" />
                                {activeSortLabel}
                            </div>
                            <FaChevronDown className={`chevron-icon ${isSortDropdownOpen ? 'open' : ''}`} />
                        </div>

                        <div className={`custom-select-list ${isSortDropdownOpen ? 'active' : ''}`}>
                            {sortOptions.map(opt => (
                                <div 
                                    key={opt.id} 
                                    className={`custom-select-item ${courseSort === opt.id ? 'selected' : ''}`}
                                    onClick={() => {
                                        setCourseSort(opt.id);
                                        setIsSortDropdownOpen(false);
                                    }}
                                >
                                    {isAr ? opt.labelAr : opt.labelEn}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* 🚀 الـ Grid بقى 4 كروت جنب بعض */}
                <div className="courses-grid">
                    {coursesToShow.length > 0 ? (
                        coursesToShow.map((c: TeacherCourse) => (
                            <div key={c.id} className="course-card">
                                <div className="course-img-wrapper">
                                    <Image src={c.img} alt={c.titleEn} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" />
                                </div>
                                
                                <div className="course-content">
                                    <h3>{isAr ? c.titleAr : c.titleEn}</h3>
                                    <p>{isAr ? c.descAr : c.descEn}</p>
                                    <Link href={`/courses/${c.id}`} className="card-btn">
                                        {isAr ? 'تفاصيل الكورس' : 'Course Details'}
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', opacity: 0.7 }}>
                            <p>{isAr ? 'لا توجد كورسات مطابقة لبحثك.' : 'No courses match your search.'}</p>
                        </div>
                    )}
                </div>

                {hasMore && (
                    <button className="btn-outline-more" onClick={() => setVisibleCourses(prev => prev + 8)}>
                        {isAr ? 'عرض المزيد من الكورسات' : 'Load More Courses'}
                    </button>
                )}
            </section>

            {/* ======== Ask Teacher (AI Chat) ======== */}
            <section className="ask-section">
                <div className="ai-glass-card">
                    <div className="chat-header">
                        <div style={{ position: 'relative', width: '50px', height: '50px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--p-purple)', flexShrink: 0 }}>
                            <Image src={teacher.img} alt="Teacher" fill style={{ objectFit: 'cover' }} sizes="50px" />
                        </div>
                        <div>
                            <h3>{isAr ? `اسأل ${teacher.nameAr}` : `Ask ${teacher.nameEn}`} <span className="status-dot"></span></h3>
                            <span style={{ fontSize: '0.85rem', opacity: 0.7, color: 'var(--txt-mut)', fontWeight: 'bold' }}>
                                {isAr ? 'مساعد ذكي مدرب على المنهج' : 'AI Assistant trained on curriculum'}
                            </span>
                        </div>
                        <FaBolt style={{ color: '#00d2ff', fontSize: '1.5rem', marginRight: isAr ? 'auto' : '0', marginLeft: isAr ? '0' : 'auto' }} />
                    </div>
                    
                    <div className="chat-box" ref={chatBoxRef}>
                        {messages.map(msg => (
                            <div key={msg.id} className={`msg ${msg.sender}`}>
                                {msg.type === 'text' ? (
                                    <p style={{ margin: 0 }}>{msg.content}</p>
                                ) : (
                                    <div>
                                        <span style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>{isAr ? 'إجابة سؤالك جاهزة في الريكورد ده:' : 'Your answer is ready in this record:'}</span>
                                        <div className="voice-note">
                                            <button className="play-btn"><FaPlay size={12} /></button>
                                            <div className="waveform">
                                                <div className="wave-line" style={{ height: '40%' }}></div><div className="wave-line" style={{ height: '80%' }}></div>
                                                <div className="wave-line" style={{ height: '60%' }}></div><div className="wave-line" style={{ height: '100%' }}></div>
                                            </div>
                                            <span className="vn-duration">{msg.content}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        {isTyping && (
                            <div className="msg bot">
                                <p style={{ margin: 0, opacity: 0.7 }}>{isAr ? 'جاري التحليل...' : 'Analyzing...'}</p>
                            </div>
                        )}
                    </div>

                    <div className="chat-bottom-wrapper">
                        {!isLoggedIn && (
                            <div className="chat-lock-overlay">
                                <FaLock size={30} style={{ color: 'var(--p-purple)' }} />
                                <p>{isAr ? 'يجب تسجيل الدخول للتحدث مع المدرس' : 'You must log in to chat'}</p>
                                <button className="btn-login-now" onClick={() => setIsLoggedIn(true)}>
                                    {isAr ? 'تسجيل الدخول الآن' : 'Login Now'}
                                </button>
                            </div>
                        )}

                        <div className="chat-options">
                            <span>{isAr ? 'طريقة الرد:' : 'Reply format:'}</span>
                            <label className="radio-label">
                                <input type="radio" name="replyFormat" value="voice" checked={replyFormat === 'voice'} onChange={(e) => setReplyFormat(e.target.value)} /> 
                                <FaMicrophone /> {isAr ? 'رسالة صوتية' : 'Voice'}
                            </label>
                            <label className="radio-label">
                                <input type="radio" name="replyFormat" value="text" checked={replyFormat === 'text'} onChange={(e) => setReplyFormat(e.target.value)} /> 
                                <FaCommentAlt /> {isAr ? 'نص كتابي' : 'Text'}
                            </label>
                        </div>
                        
                        <div className="chat-controls">
                            <button className={`btn-voice ${isRecording ? 'recording' : ''}`} onClick={toggleMic}>
                                <FaMicrophone />
                            </button>
                            <input 
                                type="text" 
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendChat()}
                                placeholder={isAr ? 'اكتب سؤالك هنا...' : 'Ask your question...'} 
                                disabled={!isLoggedIn}
                            />
                            <button className="btn-send" onClick={handleSendChat} disabled={!isLoggedIn}>
                                <FaPaperPlane />
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}