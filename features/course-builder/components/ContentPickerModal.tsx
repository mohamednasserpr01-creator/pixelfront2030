"use client";
import React, { useState } from 'react';
import { FaBookOpen, FaTimes, FaSearch, FaPlay, FaVideo, FaVial, FaPenNib } from 'react-icons/fa';
import { LectureItem } from '../types/curriculum.types';
import { getIconForType } from '../utils/icon.utils';

// 💡 داتا وهمية للتجربة (لاحظ تنوع الأنواع عشان نجرب الفلاتر)
const mockLibrary: Partial<LectureItem>[] = [
    { id: 'lib-1', type: 'lesson', title: 'حصة: قوانين كيرشوف', hasPdf: true, hasRef: true },
    { id: 'lib-2', type: 'homework_lesson', title: 'حصة حل: أسئلة بنك المعرفة' },
    { id: 'lib-3', type: 'homework', title: 'واجب: الباب الأول كامل' },
    { id: 'lib-4', type: 'exam', title: 'امتحان: شامل على الكهربية' },
];

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (item: Partial<LectureItem>) => void;
}

export const ContentPickerModal: React.FC<Props> = ({ isOpen, onClose, onSelect }) => {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    if (!isOpen) return null;

    const filteredLibrary = mockLibrary.filter(item => {
        const matchSearch = item.title!.includes(search);
        const matchFilter = filter === 'all' || item.type === filter;
        return matchSearch && matchFilter;
    });

    // 🚀 تعريف تابات الفلترة
    const filterTabs = [
        { id: 'all', label: 'الكل', icon: null },
        { id: 'lesson', label: 'حصة شرح', icon: <FaPlay size={10} /> },
        { id: 'homework_lesson', label: 'حصة حل', icon: <FaVideo size={10} /> },
        { id: 'exam', label: 'امتحانات', icon: <FaVial size={10} /> },
        { id: 'homework', label: 'واجبات', icon: <FaPenNib size={10} /> },
    ];

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, animation: 'fadeIn 0.2s ease' }}>
            <div style={{ background: '#1e1e2d', width: '100%', maxWidth: '700px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '85vh' }}>
                
                {/* الهيدر */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <h3 style={{ margin: 0, color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}><FaBookOpen color="var(--p-purple)"/> مكتبة المحتوى</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--txt-mut)', cursor: 'pointer' }}><FaTimes size={20}/></button>
                </div>

                <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    {/* 🚀 أزرار الفلترة الجديدة */}
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
                        {filterTabs.map(tab => (
                            <button 
                                key={tab.id} 
                                onClick={() => setFilter(tab.id)} 
                                style={{ 
                                    padding: '8px 15px', borderRadius: '20px', border: '1px solid', 
                                    borderColor: filter === tab.id ? 'var(--p-purple)' : 'rgba(255,255,255,0.1)', 
                                    background: filter === tab.id ? 'rgba(155, 89, 182, 0.2)' : 'rgba(0,0,0,0.2)', 
                                    color: filter === tab.id ? 'white' : 'var(--txt-mut)', 
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', 
                                    fontSize: '0.85rem', transition: '0.2s' 
                                }}
                            >
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                    </div>
                    
                    {/* 🔍 مربع البحث المعدل */}
                    <div style={{ position: 'relative' }}>
                        <FaSearch style={{ position: 'absolute', right: '15px', top: '14px', color: 'var(--txt-mut)' }} />
                        <input 
                            type="text" 
                            placeholder="ابحث باسم المحتوى..." 
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)} 
                            style={{ width: '100%', padding: '12px 15px 12px 40px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }} 
                        />
                    </div>
                </div>

                <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
                    {/* 🚀 حالة عدم وجود نتائج */}
                    {filteredLibrary.length === 0 ? (
                        <div style={{ textAlign: 'center', color: 'var(--txt-mut)', padding: '40px 20px' }}>
                            <FaSearch size={40} style={{ opacity: 0.2, marginBottom: '15px' }} />
                            <p>لا يوجد محتوى يطابق بحثك أو الفلتر المختار.</p>
                        </div>
                    ) : (
                        filteredLibrary.map(item => (
                            <div 
                                key={item.id} 
                                onClick={() => { onSelect(item); onClose(); }} 
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', marginBottom: '10px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.02)', transition: '0.2s' }}
                                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} 
                                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.2)'}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    {getIconForType(item.type!)} 
                                    <span style={{ color: 'white', fontSize: '0.95rem' }}>{item.title}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};