// FILE: components/lecture/LectureContent/LectureContent.tsx
import React from 'react';
import Link from 'next/link';
import { FaLock, FaClipboardCheck, FaPencilAlt, FaFilePdf, FaDownload, FaArrowRight } from 'react-icons/fa';
import { PlaylistItem } from '../../../types';
import { Button } from '../../ui/Button'; // 💡 استدعاء زر الـ Enterprise

export default function LectureContent({ activeItem, lang }: { activeItem: PlaylistItem, lang: string }) {
    const isAr = lang === 'ar';

    if (activeItem.status === 'locked') {
        return (
            <div style={{ height: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--card)', borderRadius: '20px', border: '1px solid rgba(108,92,231,0.2)', textAlign: 'center', padding: '20px' }}>
                <FaLock style={{ fontSize: '4rem', color: '#7f8c8d', marginBottom: '20px' }} />
                <h2 style={{ marginBottom: '10px' }}>{isAr ? 'هذا المحتوى مغلق' : 'Content Locked'}</h2>
                <p style={{ opacity: 0.8 }}>{isAr ? 'يجب إنهاء المهام السابقة أولاً لفتح هذا الجزء.' : 'You must complete previous tasks to unlock this.'}</p>
            </div>
        );
    }

    if (activeItem.type === 'exam' || activeItem.type === 'homework') {
        const linkHref = activeItem.type === 'exam' ? `/exam/${activeItem.id}` : `/homework/${activeItem.id}`;
        const Icon = activeItem.type === 'exam' ? FaClipboardCheck : FaPencilAlt;
        const iconColor = activeItem.type === 'exam' ? '#e74c3c' : '#f1c40f';

        return (
            <div style={{ padding: '50px', background: 'var(--card)', borderRadius: '20px', border: '1px solid rgba(108,92,231,0.2)', textAlign: 'center' }}>
                <Icon style={{ fontSize: '4rem', color: iconColor, marginBottom: '20px' }} />
                <h2 style={{ fontSize: '2rem', marginBottom: '15px' }}>{isAr ? activeItem.titleAr : activeItem.titleEn}</h2>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px', opacity: 0.8, fontWeight: 'bold' }}>
                    <span>📋 {activeItem.questions} {isAr ? 'سؤال' : 'Questions'}</span>
                    {activeItem.timeLimit && <span>⏱️ {activeItem.timeLimit} {isAr ? 'دقيقة' : 'Mins'}</span>}
                </div>
                
                {/* 💡 ربط Link بـ Button الخارق بتاعنا عشان الشكل الانسيابي */}
                <Link href={linkHref} style={{ textDecoration: 'none' }}>
                    <Button 
                        size="lg" 
                        icon={<FaArrowRight style={{ transform: isAr ? 'rotate(180deg)' : 'none' }} />}
                        style={{ padding: '15px 40px', fontSize: '1.1rem' }}
                    >
                        {isAr ? 'ابدأ الحل الآن' : 'Start Now'}
                    </Button>
                </Link>
            </div>
        );
    }

    if (activeItem.type === 'pdf') {
        return (
            <div style={{ padding: '50px', background: 'var(--card)', borderRadius: '20px', border: '1px solid rgba(108,92,231,0.2)', textAlign: 'center' }}>
                <FaFilePdf style={{ fontSize: '5rem', color: '#e74c3c', marginBottom: '20px' }} />
                <h2 style={{ fontSize: '1.8rem', marginBottom: '15px' }}>{isAr ? activeItem.titleAr : activeItem.titleEn}</h2>
                <p style={{ opacity: 0.8, marginBottom: '30px' }}>{isAr ? 'يمكنك تصفح الملزمة أو تحميلها على جهازك.' : 'You can view or download the file.'}</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                    {/* 💡 استبدال زر الـ HTML بـ Button الخارق */}
                    <Button size="lg" icon={<FaDownload />}>
                        {isAr ? 'تحميل (PDF)' : 'Download PDF'}
                    </Button>
                </div>
            </div>
        );
    }

    return null;
}