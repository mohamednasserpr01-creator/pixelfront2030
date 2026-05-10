// FILE: components/lecture/LectureSidebar/LectureSidebar.tsx
"use client";
import React from 'react';
import { FaLock, FaCheck, FaPlay, FaClipboardCheck, FaPencilAlt, FaFilePdf } from 'react-icons/fa';
import { LectureData, PlaylistItem } from '../../../types';

// 💡 استدعاء نظام الإشعارات
import { useToast } from '../../../context/ToastContext';

interface Props {
    lecture: LectureData;
    activeItem: PlaylistItem;
    setActiveItem: (item: PlaylistItem) => void;
    lang: string;
}

export default function LectureSidebar({ lecture, activeItem, setActiveItem, lang }: Props) {
    const { showToast } = useToast();
    const isAr = lang === 'ar';

    // 💡 سحر الـ Enterprise: حساب نسبة الإنجاز الحقيقية أوتوماتيكياً!
    const totalItems = lecture.playlist.length;
    const completedItems = lecture.playlist.filter(item => item.status === 'completed').length;
    const progressPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    const getIcon = (type: string) => { 
        switch(type) { 
            case 'exam': return <FaClipboardCheck />; 
            case 'video': return <FaPlay />; 
            case 'homework': return <FaPencilAlt />; 
            case 'pdf': return <FaFilePdf />; 
            default: return <FaPlay />; 
        } 
    };

    // 💡 دالة احترافية للتعامل مع الضغط على الدروس
    const handleItemClick = (item: PlaylistItem) => {
        if (item.status === 'locked') {
            showToast(
                isAr ? 'هذا المحتوى مغلق! يجب إنهاء المتطلبات السابقة أولاً 🔒' : 'This content is locked! Complete previous requirements first 🔒', 
                'error' // استخدمنا error عشان ده التايب اللي متعرّف في الـ Toast
            );
            return;
        }
        setActiveItem(item);
    };

    return (
        <aside className="playlist-sidebar">
            <div className="playlist-header">
                <h3>{isAr ? 'محتويات المحاضرة' : 'Lecture Content'}</h3>
                
                {/* 💡 شريط التقدم أصبح ديناميكي */}
                <div style={{ fontSize: '0.8rem', fontWeight: 'bold', opacity: 0.8 }}>
                    {isAr ? 'نسبة الإنجاز:' : 'Progress:'} {progressPercentage}%
                </div>
                <div className="progress-container">
                    <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
                </div>
            </div>

            <div className="playlist-items">
                {lecture.playlist.map((item) => (
                    <div 
                        key={item.id} 
                        className={`pl-item ${item.status} ${activeItem.id === item.id ? 'active' : ''}`}
                        onClick={() => handleItemClick(item)}
                    >
                        <div className="pl-icon">
                            {item.status === 'locked' ? <FaLock /> : (item.status === 'completed' ? <FaCheck /> : getIcon(item.type))}
                        </div>
                        <div className="pl-info">
                            <h4>
                                {isAr ? item.titleAr : item.titleEn} 
                                {item.isReq && <span className="req-badge">{isAr ? 'إجباري' : 'Req'}</span>}
                            </h4>
                            <span className="pl-meta">
                                {item.status === 'locked' ? (isAr ? 'مغلق' : 'Locked') : 
                                (item.status === 'completed' ? (isAr ? 'تم الاجتياز' : 'Completed') : 
                                (item.time ? `${item.time} ${isAr ? 'دقيقة' : 'Mins'}` : (isAr ? 'متاح الآن' : 'Available')))}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
}