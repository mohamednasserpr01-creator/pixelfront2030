import React from 'react';
import { FaSearch } from 'react-icons/fa'; // تأكد إن مكتبة react-icons متطبة عندك

// تعريف الداتا اللي الشريط ده محتاجها عشان يشتغل
interface Category {
    id: string;
    nameAr: string;
    nameEn: string;
}

interface StoreSidebarProps {
    lang: string;
    categories: Category[];
    activeCategory: string;
    onCategoryChange: (categoryId: string) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export default function StoreSidebar({ 
    lang, 
    categories, 
    activeCategory, 
    onCategoryChange, 
    searchQuery, 
    onSearchChange 
}: StoreSidebarProps) {
    
    return (
        <aside style={{ 
            background: 'var(--card)', 
            padding: '20px', 
            borderRadius: '15px', 
            border: '1px solid rgba(108,92,231,0.2)',
            position: 'sticky', // عشان يفضل ثابت والطالب بينزل في الصفحة
            top: '120px' 
        }}>
            {/* 1. مربع البحث */}
            <div style={{ marginBottom: '25px', position: 'relative' }}>
                <input 
                    type="text" 
                    placeholder={lang === 'ar' ? 'ابحث عن مذكرة...' : 'Search for a book...'}
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '12px 15px',
                        paddingInlineStart: '40px', // عشان نسيب مكان للأيقونة
                        borderRadius: '10px',
                        border: '1px solid var(--h-bg)',
                        background: 'var(--bg)',
                        color: 'var(--txt)',
                        outline: 'none'
                    }}
                />
                <FaSearch style={{ position: 'absolute', top: '15px', insetInlineStart: '15px', color: 'var(--txt-mut)' }} />
            </div>

            {/* 2. فلتر الأقسام */}
            <h3 style={{ marginBottom: '15px', color: 'var(--p-purple)' }}>
                {lang === 'ar' ? 'الأقسام' : 'Categories'}
            </h3>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* زرار "الكل" */}
                <li>
                    <button 
                        onClick={() => onCategoryChange('all')}
                        style={{
                            width: '100%',
                            textAlign: lang === 'ar' ? 'right' : 'left',
                            padding: '10px 15px',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            background: activeCategory === 'all' ? 'var(--p-purple)' : 'transparent',
                            color: activeCategory === 'all' ? '#fff' : 'var(--txt)',
                            transition: '0.3s'
                        }}
                    >
                        {lang === 'ar' ? 'الكل' : 'All'}
                    </button>
                </li>
                
                {/* رسم باقي الأقسام ديناميكياً */}
                {categories.map((cat) => (
                    <li key={cat.id}>
                        <button 
                            onClick={() => onCategoryChange(cat.id)}
                            style={{
                                width: '100%',
                                textAlign: lang === 'ar' ? 'right' : 'left',
                                padding: '10px 15px',
                                borderRadius: '8px',
                                border: 'none',
                                cursor: 'pointer',
                                background: activeCategory === cat.id ? 'var(--p-purple)' : 'transparent',
                                color: activeCategory === cat.id ? '#fff' : 'var(--txt)',
                                transition: '0.3s'
                            }}
                        >
                            {lang === 'ar' ? cat.nameAr : cat.nameEn}
                        </button>
                    </li>
                ))}
            </ul>
        </aside>
    );
}