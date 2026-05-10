"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation'; // 💡 1. الاستخدام الصحيح للبارامترز
import { FaExclamationTriangle, FaSyncAlt } from 'react-icons/fa';

import { useSettings } from '../../../../../context/SettingsContext';
import { lectureService } from '../../../../../services/lectureService';
import { PlaylistItem } from '../../../../../types'; 

import LectureSidebar from '../../../../../components/lecture/LectureSidebar/LectureSidebar';
import { Skeleton } from '../../../../../components/ui/Skeleton';
import { Button } from '../../../../../components/ui/Button'; // 💡 استدعاء الأزرار للـ Error State
import './LectureRoom.css';

// 💡 تحميل المكونات الثقيلة بـ Lazy Load
const VideoPlayer = dynamic(
    () => import('../../../../../components/lecture/VideoPlayer/VideoPlayer'), 
    { ssr: false, loading: () => <Skeleton variant="rectangular" height="400px" /> }
);

const LectureChat = dynamic(
    () => import('../../../../../components/lecture/LectureChat/LectureChat'), 
    { ssr: false, loading: () => <Skeleton variant="rectangular" height="350px" /> }
);

const LectureContent = dynamic(
    () => import('../../../../../components/lecture/LectureContent/LectureContent'), 
    { ssr: false, loading: () => <Skeleton variant="rectangular" height="400px" /> }
);

export default function LectureRoom() {
    // 💡 1. الطريقة الصحيحة للتعامل مع الـ Params في الـ App Router Client Components
    const params = useParams();
    const courseId = params.id as string;
    const lectureId = params.lectureId as string;

    const { lang } = useSettings();
    const isAr = lang === 'ar';

    const [activeItem, setActiveItem] = useState<PlaylistItem | null>(null);

    // 💡 5. قوة React Query (StaleTime, Retry, Refetch)
    const { data: lecture, isLoading, isError, refetch, isRefetching } = useQuery({
        queryKey: ['lecture', courseId, lectureId],
        queryFn: () => lectureService.getLecture(courseId, lectureId),
        staleTime: 5 * 60 * 1000, // الداتا تفضل فريش 5 دقايق
        retry: 2, // لو فشل يحاول مرتين كمان قبل ما يضرب الإيرور
    });

    // 💡 2. حل مشكلة الـ useEffect الخطيرة (Functional State Update)
    useEffect(() => {
        if (lecture && lecture.playlist.length > 0) {
            setActiveItem(prev => {
                // لو مفيش عنصر مفعل، هات أول واحد متاح
                if (!prev) {
                    return lecture.playlist.find((i: PlaylistItem) => ['active', 'available', 'completed'].includes(i.status)) || lecture.playlist[0];
                }
                return prev;
            });
        }
    }, [lecture]);

    // 💡 ميزة "Auto Next": الانتقال التلقائي للعنصر التالي بعد انتهاء الفيديو
    const handleAutoNext = useCallback(() => {
        if (!lecture || !activeItem) return;
        const currentIndex = lecture.playlist.findIndex(i => i.id === activeItem.id);
        const nextItem = lecture.playlist[currentIndex + 1];
        
        if (nextItem && nextItem.status !== 'locked') {
            setActiveItem(nextItem);
        }
    }, [lecture, activeItem]);


    // 💡 شاشة التحميل (Suspense Fallback)
    if (isLoading || !activeItem) return (
        <main className="page-wrapper lecture-wrapper">
            <div className="lec-skeleton-wrapper">
                <div className="lec-skeleton-sidebar"><Skeleton variant="rectangular" height="500px" /></div>
                <div className="lec-skeleton-main">
                    <Skeleton variant="rectangular" height="400px" />
                    <Skeleton variant="text" height="40px" width="60%" />
                    <Skeleton variant="text" height="20px" width="100%" />
                    <Skeleton variant="text" height="20px" width="80%" />
                </div>
            </div>
        </main>
    );

    // 💡 3. شاشة الخطأ القوية (Enterprise Error State)
    if (isError || !lecture) return (
        <main className="page-wrapper lec-error-state">
            <FaExclamationTriangle className="lec-error-icon" />
            <h2 className="lec-error-title">
                {isAr ? 'عفواً، حدث خطأ في الاتصال بالخادم.' : 'Connection Error.'}
            </h2>
            <p className="lec-error-desc">
                {isAr ? 'لم نتمكن من جلب بيانات المحاضرة، قد يكون هناك مشكلة في الإنترنت أو يتم تحديث الخادم حالياً.' : 'Failed to load lecture data. Please check your connection or try again.'}
            </p>
            <Button 
                variant="primary" 
                icon={<FaSyncAlt />} 
                onClick={() => refetch()} 
                isLoading={isRefetching}
            >
                {isAr ? 'إعادة المحاولة' : 'Retry'}
            </Button>
        </main>
    );

    // 💡 4. الشاشة الرئيسية بدون ولا سطر Inline Style زحمة
    return (
        <main className="page-wrapper lecture-wrapper">
            <div className="lecture-page-container">
                
                {/* القائمة الجانبية */}
                <div className="lecture-sidebar-area">
                    <LectureSidebar lecture={lecture} activeItem={activeItem} setActiveItem={setActiveItem} lang={lang} />
                </div>

                {/* مساحة العرض الرئيسية */}
                <div className="lecture-main-area lecture-main-col">
                    
                    {activeItem.type === 'video' && activeItem.status !== 'locked' ? (
                        <VideoPlayer 
                            activeItem={activeItem} 
                            studentName={lecture.studentName} 
                            onVideoEnded={handleAutoNext} // 👈 تمرير دالة الانتقال التلقائي
                        />
                    ) : (
                        <LectureContent activeItem={activeItem} lang={lang} />
                    )}

                    <div className="lec-details-card">
                        <h1 className="lec-details-title">
                            {isAr ? activeItem.titleAr : activeItem.titleEn}
                        </h1>
                        <p className="lec-details-desc">
                            {isAr ? lecture.descAr : lecture.descEn}
                        </p>
                    </div>

                    <LectureChat lang={lang} />
                    
                </div>
            </div>
        </main>
    );
}