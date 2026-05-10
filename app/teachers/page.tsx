"use client";
import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { FaSearch, FaChevronRight, FaChevronLeft, FaFrown, FaFilter, FaChevronDown } from 'react-icons/fa';
import { useSettings } from '../../context/SettingsContext';

// ==========================================
// 💡 MOCK DATA: بيانات المدرسين
// ==========================================
const teachersData = [
    { id: 1, nameAr: "أ. محمد ناصر", nameEn: "Mr. Mohamed Nasser", subjectId: "marketing", subjectAr: "التسويق الرقمي", subjectEn: "Digital Marketing", bioAr: "خبير التسويق الرقمي وإدارة منصات التواصل الاجتماعي.", bioEn: "Digital marketing expert with years of experience.", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400" },
    { id: 2, nameAr: "أ. أحمد سمير", nameEn: "Mr. Ahmed Samir", subjectId: "arabic", subjectAr: "اللغة العربية", subjectEn: "Arabic", bioAr: "مدرس أول لغة عربية، متخصص في تبسيط النحو للبلاغة.", bioEn: "Senior Arabic teacher specialized in simplifying grammar.", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400" },
    { id: 3, nameAr: "أ. محمود طارق", nameEn: "Mr. Mahmoud Tarek", subjectId: "arabic", subjectAr: "اللغة العربية", subjectEn: "Arabic", bioAr: "خبير في تدريس النصوص والأدب بأساليب حديثة.", bioEn: "Expert in teaching literature with modern methods.", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400" },
    { id: 4, nameAr: "د. مصطفى كمال", nameEn: "Dr. Mostafa Kamal", subjectId: "physics", subjectAr: "الفيزياء", subjectEn: "Physics", bioAr: "مقدم تجارب علمية مبسطة لفهم قوانين الفيزياء.", bioEn: "Presents simplified scientific experiments for physics.", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400" },
    { id: 5, nameAr: "م. سارة جمال", nameEn: "Eng. Sarah Gamal", subjectId: "math", subjectAr: "الرياضيات", subjectEn: "Mathematics", bioAr: "مهندسة متخصصة في شرح الرياضيات بأسلوب مبتكر.", bioEn: "Engineer specialized in teaching mathematics.", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400" },
    { id: 6, nameAr: "أ. خالد حسن", nameEn: "Mr. Khaled Hassan", subjectId: "chemistry", subjectAr: "الكيمياء", subjectEn: "Chemistry", bioAr: "شرح وافي للكيمياء العضوية مع تجارب تفاعلية.", bioEn: "Comprehensive teaching of organic chemistry.", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400" }
];

const subjects = [
    { id: "all", nameAr: "كل المواد الدراسية", nameEn: "All Subjects" },
    { id: "arabic", nameAr: "لغة عربية", nameEn: "Arabic" },
    { id: "physics", nameAr: "فيزياء", nameEn: "Physics" },
    { id: "math", nameAr: "رياضيات", nameEn: "Math" },
    { id: "chemistry", nameAr: "كيمياء", nameEn: "Chemistry" },
    { id: "marketing", nameAr: "التسويق الرقمي", nameEn: "Marketing" }
];

export default function TeachersPage() {
    const { lang } = useSettings();
    const isAr = lang === 'ar';
    const [mounted, setMounted] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; 

    const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
    
    // 💡 States الخاصة بالقائمة المنسدلة المخصصة
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // 💡 إغلاق القائمة عند الضغط خارجها
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredTeachers = useMemo(() => {
        return teachersData.filter(t => {
            const matchesSubject = activeFilter === 'all' || t.subjectId === activeFilter;
            const matchesSearch = t.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  t.nameEn.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesSubject && matchesSearch;
        });
    }, [searchQuery, activeFilter]);

    const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
    const paginatedTeachers = filteredTeachers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, activeFilter]);

    if (!mounted) return null;

    // الحصول على اسم الفلتر النشط لعرضه في زر الدروب داون
    const activeSubjectName = subjects.find(s => s.id === activeFilter)?.[isAr ? 'nameAr' : 'nameEn'];

    return (
        <main className="page-wrapper" style={{ position: 'relative', overflow: 'hidden' }}>
            
            <style>{`
                /* Floating Bubbles */
                .bubble { position: absolute; background: var(--p-purple); opacity: 0.15; border-radius: 50%; z-index: -1; animation: floatUp 15s infinite linear; }
                @keyframes floatUp { 
                    0% { transform: translateY(110vh) scale(0.5); opacity: 0.1; } 
                    50% { opacity: 0.2; } 
                    100% { transform: translateY(-10vh) scale(1.2); opacity: 0; } 
                }

                .page-header { text-align: center; padding: 20px 20px 10px; margin-bottom: 30px; }
                .page-header h1 { font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 900; margin-bottom: 15px; color: var(--p-purple); text-shadow: 0 4px 20px rgba(108,92,231,0.2); }
                .page-header p { font-size: 1.15rem; font-weight: bold; opacity: 0.8; max-width: 650px; margin: 0 auto; color: var(--txt); line-height: 1.8; }

                /* 🚀 Controls Container */
                .controls-container { 
                    max-width: 900px; 
                    width: 100%;
                    margin: 0 auto 50px; 
                    display: flex; 
                    gap: 15px; 
                    align-items: center; 
                    justify-content: center; 
                }
                
                .search-box-custom { flex: 2; position: relative; width: 100%; }
                .search-box-custom input { 
                    width: 100%; 
                    height: 55px; 
                    padding: 0 50px 0 20px; 
                    border-radius: 50px; 
                    border: 2px solid rgba(108,92,231,0.2); 
                    background: var(--card); 
                    color: var(--txt); 
                    font-size: 1.1rem; 
                    outline: none; 
                    transition: 0.3s; 
                    font-weight: bold; 
                    box-shadow: 0 5px 20px rgba(0,0,0,0.05); 
                }
                html[dir="ltr"] .search-box-custom input { padding: 0 20px 0 50px; }
                .search-box-custom input:focus { border-color: var(--p-purple); box-shadow: 0 5px 25px rgba(108,92,231,0.2); }
                .search-icon-custom { position: absolute; right: 20px; top: 50%; transform: translateY(-50%); color: var(--p-purple); font-size: 1.2rem; pointer-events: none; }
                html[dir="ltr"] .search-icon-custom { right: auto; left: 20px; }

                /* 🚀 Custom React Dropdown Styles */
                .custom-select-wrapper { flex: 1; position: relative; width: 100%; min-width: 250px; }
                .custom-select-header {
                    display: flex; justify-content: space-between; align-items: center;
                    width: 100%; height: 55px; padding: 0 20px;
                    border-radius: 50px; border: 2px solid rgba(108,92,231,0.2);
                    background: var(--card); color: var(--txt); font-size: 1.05rem;
                    font-weight: bold; cursor: pointer; transition: 0.3s;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.05);
                }
                .custom-select-header:hover, .custom-select-header.open { border-color: var(--p-purple); box-shadow: 0 5px 25px rgba(108,92,231,0.2); }
                .filter-icon { color: var(--p-purple); margin-inline-end: 10px; }
                .chevron-icon { color: var(--txt-mut); transition: 0.3s; }
                .chevron-icon.open { transform: rotate(180deg); color: var(--p-purple); }

                .custom-select-list {
                    position: absolute; top: calc(100% + 10px); left: 0; right: 0;
                    background: var(--card); border: 2px solid var(--p-purple);
                    border-radius: 20px; overflow: hidden; z-index: 100;
                    box-shadow: 0 15px 40px rgba(0,0,0,0.4);
                    max-height: 250px; overflow-y: auto;
                    animation: fadeInDown 0.2s ease forwards;
                    backdrop-filter: blur(15px);
                }
                
                /* Custom Scrollbar for Dropdown */
                .custom-select-list::-webkit-scrollbar { width: 6px; }
                .custom-select-list::-webkit-scrollbar-track { background: transparent; }
                .custom-select-list::-webkit-scrollbar-thumb { background: rgba(108,92,231,0.5); border-radius: 10px; }

                .custom-select-item {
                    padding: 15px 20px; cursor: pointer; transition: 0.2s;
                    border-bottom: 1px dashed rgba(255,255,255,0.05);
                    color: var(--txt); font-weight: bold; font-size: 1rem;
                    display: flex; align-items: center; justify-content: space-between;
                }
                .custom-select-item:last-child { border-bottom: none; }
                .custom-select-item:hover { background: rgba(108,92,231,0.1); color: var(--p-purple); padding-inline-start: 25px; }
                .custom-select-item.active { background: var(--p-purple); color: white; }

                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* 📱 موبايل ريسبونسيف احترافي */
                @media (max-width: 768px) {
                    .controls-container { flex-direction: column; padding: 0 10px; gap: 15px; width: 100%; }
                    .search-box-custom, .custom-select-wrapper { width: 100%; flex: unset; }
                }

                /* Teachers Grid */
                .teachers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 40px; margin-bottom: 50px; width: 100%; }
                .teacher-card-custom { background: var(--card); border-radius: 25px; overflow: hidden; border: 1px solid rgba(108,92,231,0.15); box-shadow: 0 10px 30px rgba(0,0,0,0.05); transition: 0.4s; text-align: center; padding-bottom: 30px; animation: fadeIn 0.5s ease; }
                .teacher-card-custom:hover { transform: translateY(-10px); border-color: var(--p-purple); box-shadow: 0 15px 40px rgba(108,92,231,0.2); }
                .teacher-cover { height: 120px; background: linear-gradient(45deg, var(--p-purple), #ff007f); position: relative; }
                
                /* Skeleton Loading */
                .t-img-wrapper { width: 140px; height: 140px; border-radius: 50%; border: 6px solid var(--bg); position: absolute; bottom: -70px; left: 50%; transform: translateX(-50%); background: var(--card); overflow: hidden; }
                .skeleton::before { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(108,92,231,0.2) 50%, rgba(255,255,255,0.05) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; z-index: 1; }
                .light-mode .skeleton::before { background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); }
                @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
                .teacher-img { width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.5s ease; position: relative; z-index: 2; }
                .teacher-img.loaded { opacity: 1; }
                .t-img-wrapper.loaded::before { display: none; }
                
                .teacher-info { padding: 90px 25px 10px; display: flex; flex-direction: column; height: calc(100% - 120px); }
                .subject-badge { display: inline-block; background: rgba(108,92,231,0.1); color: var(--p-purple); padding: 5px 15px; border-radius: 50px; font-size: 0.9rem; font-weight: 900; margin: 0 auto 15px; border: 1px solid rgba(108,92,231,0.3); }
                .teacher-info h3 { font-size: 1.6rem; margin-bottom: 10px; color: var(--txt); font-weight: 900; }
                .teacher-info p { font-size: 1rem; color: var(--txt-mut); margin-bottom: 25px; line-height: 1.6; font-weight: bold; flex-grow: 1; }
                
                .view-btn-custom { width: 100%; background: var(--p-purple); color: white; padding: 12px 25px; border-radius: 12px; text-decoration: none; font-weight: 900; transition: 0.3s; border: none; font-size: 1.1rem; cursor: pointer; }
                .view-btn-custom:hover { background: #5a4bcf; transform: scale(1.03); }

                /* Pagination */
                .pagination-custom { display: flex; justify-content: center; gap: 10px; margin-top: 20px; }
                .page-btn { width: 45px; height: 45px; border-radius: 50%; background: var(--card); border: 2px solid rgba(108,92,231,0.3); color: var(--txt); font-weight: bold; cursor: pointer; transition: 0.3s; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; }
                .page-btn:hover:not(:disabled) { background: rgba(108,92,231,0.2); }
                .page-btn.active { background: var(--p-purple); color: white; border-color: var(--p-purple); }
                .page-btn:disabled { opacity: 0.5; cursor: not-allowed; }
            `}</style>

            <div className="bubble" style={{ width: '100px', height: '100px', left: '5%', animationDelay: '0s' }}></div>
            <div className="bubble" style={{ width: '50px', height: '50px', left: '85%', animationDelay: '2s' }}></div>
            <div className="bubble" style={{ width: '70px', height: '70px', left: '50%', animationDelay: '5s' }}></div>

            <section className="page-header">
                <h1>{isAr ? 'نخبة التدريس' : 'Top Teachers'}</h1>
                <p>{isAr ? 'تعرف على أفضل المدرسين على مستوى الجمهورية، واختر من يناسبك للبدء في رحلة التفوق.' : 'Meet the best teachers nationwide, and choose who suits you to start your journey to excellence.'}</p>
            </section>

            {/* 🚀 قسم التحكم الجديد (بحث + Custom Dropdown) */}
            <div className="controls-container">
                
                <div className="search-box-custom">
                    <FaSearch className="search-icon-custom" />
                    <input 
                        type="text" 
                        placeholder={isAr ? 'ابحث باسم المدرس...' : 'Search by teacher name...'} 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* 🚀 Custom React Dropdown بديل الـ Select العقيم */}
                <div className="custom-select-wrapper" ref={dropdownRef}>
                    <div 
                        className={`custom-select-header ${isDropdownOpen ? 'open' : ''}`}
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <FaFilter className="filter-icon" />
                            {activeSubjectName}
                        </div>
                        <FaChevronDown className={`chevron-icon ${isDropdownOpen ? 'open' : ''}`} />
                    </div>

                    {isDropdownOpen && (
                        <div className="custom-select-list">
                            {subjects.map(sub => (
                                <div 
                                    key={sub.id} 
                                    className={`custom-select-item ${activeFilter === sub.id ? 'active' : ''}`}
                                    onClick={() => {
                                        setActiveFilter(sub.id);
                                        setIsDropdownOpen(false);
                                    }}
                                >
                                    {isAr ? sub.nameAr : sub.nameEn}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>

            {filteredTeachers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', background: 'var(--card)', borderRadius: '25px', border: '2px dashed rgba(108,92,231,0.3)' }}>
                    <FaFrown style={{ fontSize: '4rem', color: 'var(--p-purple)', marginBottom: '20px' }} />
                    <h2 style={{ color: 'var(--txt)' }}>
                        {isAr ? 'عفواً، لا يوجد مدرس بهذا الاسم أو في هذه المادة.' : 'Sorry, no teacher found matching your criteria.'}
                    </h2>
                </div>
            ) : (
                <div className="teachers-grid">
                    {paginatedTeachers.map((t) => (
                        <div key={t.id} className="teacher-card-custom">
                            <div className="teacher-cover">
                                <div className={`t-img-wrapper skeleton ${loadedImages[t.id] ? 'loaded' : ''}`}>
                                    <img 
                                        src={t.img} 
                                        alt={t.nameEn} 
                                        className={`teacher-img ${loadedImages[t.id] ? 'loaded' : ''}`}
                                        onLoad={() => setLoadedImages(prev => ({ ...prev, [t.id]: true }))}
                                    />
                                </div>
                            </div>
                            <div className="teacher-info">
                                <div><span className="subject-badge">{isAr ? t.subjectAr : t.subjectEn}</span></div>
                                <h3>{isAr ? t.nameAr : t.nameEn}</h3>
                                <p>{isAr ? t.bioAr : t.bioEn}</p>
                                <Link href={`/teachers/${t.id}`} style={{ textDecoration: 'none', width: '100%' }}>
                                    <button className="view-btn-custom">
                                        {isAr ? 'الملف الشخصي' : 'View Profile'}
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="pagination-custom">
                    <button 
                        className="page-btn" 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                        disabled={currentPage === 1}
                    >
                        {isAr ? <FaChevronRight /> : <FaChevronLeft />}
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                        <button 
                            key={num} 
                            className={`page-btn ${currentPage === num ? 'active' : ''}`}
                            onClick={() => setCurrentPage(num)}
                        >
                            {num}
                        </button>
                    ))}

                    <button 
                        className="page-btn" 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                        disabled={currentPage === totalPages}
                    >
                        {isAr ? <FaChevronLeft /> : <FaChevronRight />}
                    </button>
                </div>
            )}
        </main>
    );
}