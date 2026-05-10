"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { FaPlay, FaPause, FaBackward, FaForward, FaTachometerAlt, FaVolumeUp, FaExpand, FaEye, FaExclamationTriangle, FaLock, FaHeadset } from 'react-icons/fa';

import { useToast } from '../../../context/ToastContext'; 
import { useSettings } from '../../../context/SettingsContext'; 
import { trackingService } from '../../../services/trackingService';
import { PlaylistItem } from '../../../types';
import { Button } from '../../ui/Button'; 

interface VideoPlayerProps {
    activeItem: PlaylistItem;
    studentName: string;
    onVideoEnded?: () => void; // 💡 دالة الانتقال للدرس التالي
}

export default function VideoPlayer({ activeItem, studentName, onVideoEnded }: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const playerContainerRef = useRef<HTMLDivElement>(null);
    
    const { showToast } = useToast();
    const { lang } = useSettings();
    const isAr = lang === 'ar';

    const currentUserId = studentName || "UNKNOWN_USER";

    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTimeStr, setCurrentTimeStr] = useState("00:00");
    const [durationStr, setDurationStr] = useState("00:00");
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);
    const [wmPos, setWmPos] = useState({ top: '50%', left: '50%' });

    // 💡 States for Progress Resume System
    const [showResumeToast, setShowResumeToast] = useState(false);
    const [savedTime, setSavedTime] = useState(0);

    const maxViews = 3; 
    const remainingViews = 2; // (للتجربة، عدلها للوجيك الحقيقي)

    const localStorageKey = `pixel_vid_progress_${activeItem.id}`;

    // 💡 1. استرجاع الوقت المحفوظ عند تحميل الفيديو
    useEffect(() => {
        if (remainingViews <= 0) return;

        const storedTime = localStorage.getItem(localStorageKey);
        if (storedTime && Number(storedTime) > 5) { // لو متفرج أكتر من 5 ثواني
            setSavedTime(Number(storedTime));
            setShowResumeToast(true);
        }

        // تصفير الفيديو عند تغيير الدرس
        if (videoRef.current) {
            setIsPlaying(false); 
            setProgress(0); 
            setCurrentTimeStr("00:00");
            setShowSpeedMenu(false);
            videoRef.current.load();
        }
    }, [activeItem.id, remainingViews]); // يعتمد على الـ ID بس عشان ميعملش Loop

    // حركة العلامة المائية
    useEffect(() => {
        const wmInterval = setInterval(() => {
            setWmPos({ top: `${Math.floor(Math.random() * 80)}%`, left: `${Math.floor(Math.random() * 80)}%` });
        }, 4000);
        return () => clearInterval(wmInterval);
    }, []);

    // 💡 2. محرك التراكينج القوي (يشتغل كل 5 ثواني أثناء التشغيل فقط)
    useEffect(() => {
        let trackingInterval: NodeJS.Timeout;
        if (isPlaying && videoRef.current) {
            trackingInterval = setInterval(() => {
                const currentSec = videoRef.current!.currentTime;
                
                // حفظ محلي في المتصفح
                localStorage.setItem(localStorageKey, currentSec.toString());
                
                // إرسال للسيرفر (Analytics & Progress)
                trackingService.track({
                    userId: currentUserId,
                    lectureId: activeItem.id,
                    eventType: 'video_progress_sync',
                    eventData: { 
                        currentTime: currentSec, 
                        totalDuration: videoRef.current!.duration,
                        percentage: Math.round((currentSec / videoRef.current!.duration) * 100)
                    }
                });
            }, 5000); // 👈 Tracking Every 5 Seconds
        }
        return () => clearInterval(trackingInterval);
    }, [isPlaying, activeItem.id, currentUserId, localStorageKey]);

    const formatTime = (sec: number) => { 
        let m = Math.floor(sec / 60); 
        let s = Math.floor(sec % 60); 
        return `${m}:${s < 10 ? '0' + s : s}`; 
    };

    const togglePlay = () => { 
        if (!videoRef.current) return;
        if (videoRef.current.paused) {
            videoRef.current.play();
            setIsPlaying(true);
            setShowResumeToast(false); // إخفاء الإشعار لو داس تشغيل يدوياً
        } else {
            videoRef.current.pause();
            setIsPlaying(false);
        } 
    };

    // 💡 3. استئناف الفيديو
    const handleResumeVideo = () => {
        if (videoRef.current && savedTime > 0) {
            videoRef.current.currentTime = savedTime;
            videoRef.current.play();
            setIsPlaying(true);
            setShowResumeToast(false);
        }
    };

    const handleRestartVideo = () => {
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play();
            setIsPlaying(true);
            setShowResumeToast(false);
            localStorage.removeItem(localStorageKey);
        }
    };

    const handleTimeUpdate = () => { 
        if (videoRef.current && videoRef.current.duration) { 
            setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100); 
            setCurrentTimeStr(formatTime(videoRef.current.currentTime)); 
        } 
    };

    const handleLoadedMetadata = () => { 
        if (videoRef.current) setDurationStr(formatTime(videoRef.current.duration)); 
    };

    // 💡 4. Auto Next بعد الانتهاء
    const handleVideoEnded = () => {
        setIsPlaying(false);
        localStorage.removeItem(localStorageKey); // مسح التخزين المحلي لأنه خلص
        showToast(isAr ? 'تم إنجاز الفيديو بنجاح! 🎓 جاري الانتقال...' : 'Video completed! 🎓 Moving to next...', 'success');
        
        trackingService.track({
            userId: currentUserId,
            lectureId: activeItem.id,
            eventType: 'video_complete',
            eventData: { duration: videoRef.current?.duration, watchPercentage: 100 }
        });

        // 👈 الانتقال للدرس التالي
        if (onVideoEnded) {
            setTimeout(() => onVideoEnded(), 2000); // تأخير بسيط عشان الطالب يقرأ الإشعار
        }
    };

    const skipTime = (amount: number) => { 
        if (videoRef.current) videoRef.current.currentTime += amount;
    };

    const setSpeed = (speed: number) => { 
        if (videoRef.current) {
            videoRef.current.playbackRate = speed; 
            setShowSpeedMenu(false); 
        }
    };

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => { 
        const area = e.currentTarget; 
        const clickX = e.nativeEvent.offsetX; 
        if (videoRef.current) {
            const newTime = (clickX / area.offsetWidth) * videoRef.current.duration;
            videoRef.current.currentTime = newTime; 
        }
    };

    if (remainingViews <= 0) {
        return (
            <div style={{ height: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--card)', borderRadius: '20px', border: '2px solid var(--danger)', textAlign: 'center', padding: '30px', marginBottom: '20px' }}>
                <FaLock style={{ fontSize: '4.5rem', color: 'var(--danger)', marginBottom: '20px' }} />
                <h2 style={{ marginBottom: '15px', color: 'var(--txt)', fontSize: '1.8rem' }}>{isAr ? 'انتهت مشاهداتك لهذا الفيديو' : 'Views Exhausted'}</h2>
                <p style={{ opacity: 0.8, color: 'var(--txt-mut)', marginBottom: '25px', fontSize: '1.1rem', maxWidth: '500px' }}>
                    {isAr ? 'لقد استنفدت الحد الأقصى لعدد مرات مشاهدة هذه الحصة. يرجى التواصل مع الدعم الفني.' : 'You have reached the maximum views. Contact support.'}
                </p>
                <Link href="/contact" style={{ textDecoration: 'none' }}><Button icon={<FaHeadset />} variant="danger">{isAr ? 'تواصل مع الدعم الفني' : 'Contact Support'}</Button></Link>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
            
            <div className={`pixel-player ${!isPlaying ? 'paused' : ''}`} ref={playerContainerRef} onContextMenu={e => e.preventDefault()}>
                
                {/* 💡 شاشة الاستئناف (Resume) */}
                {showResumeToast && (
                    <div className="resume-toast">
                        <span>{isAr ? `توقفت عند الدقيقة ${formatTime(savedTime)}، هل تريد الاستكمال؟` : `Resume from ${formatTime(savedTime)}?`}</span>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button className="resume-btn-yes" onClick={handleResumeVideo}>{isAr ? 'نعم، استكمل' : 'Resume'}</button>
                            <button className="resume-btn-no" onClick={handleRestartVideo}>{isAr ? 'البدء من جديد' : 'Restart'}</button>
                        </div>
                    </div>
                )}

                <div className="watermark" style={{ top: wmPos.top, left: wmPos.left }}>{studentName}</div>
                <div className="video-cage" onClick={togglePlay}></div>
                
                <video 
                    ref={videoRef} 
                    src={activeItem.videoSrc} 
                    poster={activeItem.poster} 
                    onTimeUpdate={handleTimeUpdate} 
                    onLoadedMetadata={handleLoadedMetadata} 
                    onEnded={handleVideoEnded} 
                    playsInline
                ></video>
                
                <div className="player-controls" onClick={e => e.stopPropagation()}>
                    <div className="progress-area" onClick={handleProgressClick}>
                        <div className="progress-filled" style={{ width: `${progress}%` }}></div>
                    </div>
                    
                    <div className="controls-row">
                        <div className="controls-left">
                            <button className="ctrl-btn" onClick={togglePlay}>{isPlaying ? <FaPause /> : <FaPlay />}</button>
                            <button className="ctrl-btn" onClick={() => skipTime(isAr ? 10 : -10)}><FaBackward /></button>
                            <button className="ctrl-btn" onClick={() => skipTime(isAr ? -10 : 10)}><FaForward /></button>
                            <div className="time-display">{currentTimeStr} / {durationStr}</div>
                        </div>
                        
                        <div className="controls-right">
                            <div className="speed-menu">
                                <button className="ctrl-btn" onClick={() => setShowSpeedMenu(!showSpeedMenu)}><FaTachometerAlt /></button>
                                <div className={`menu-popup ${showSpeedMenu ? 'show' : ''}`}>
                                    <button onClick={() => setSpeed(2)}>2x</button>
                                    <button onClick={() => setSpeed(1.5)}>1.5x</button>
                                    <button onClick={() => setSpeed(1)}>1x</button>
                                </div>
                            </div>
                            <button className="ctrl-btn"><FaVolumeUp /></button>
                            <button className="ctrl-btn" onClick={() => { if(!document.fullscreenElement) playerContainerRef.current?.requestFullscreen(); else document.exitFullscreen(); }}><FaExpand /></button>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ background: remainingViews <= 1 ? 'rgba(231, 76, 60, 0.1)' : 'var(--card)', border: `1px solid ${remainingViews <= 1 ? 'var(--danger)' : 'rgba(108, 92, 231, 0.2)'}`, padding: '15px 20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaEye style={{ color: remainingViews <= 1 ? 'var(--danger)' : 'var(--p-purple)', fontSize: '1.2rem' }} />
                    <span style={{ fontWeight: 900, color: 'var(--txt)', fontSize: '1rem' }}>{isAr ? 'المشاهدات المتبقية:' : 'Remaining Views:'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    {remainingViews <= 1 && (
                        <span style={{ color: 'var(--danger)', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}><FaExclamationTriangle />{isAr ? 'تنبيه: هذه المشاهدة الأخيرة!' : 'Warning: Last view!'}</span>
                    )}
                    <div style={{ background: 'var(--bg)', padding: '5px 15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 900, color: remainingViews <= 1 ? 'var(--danger)' : 'var(--success)', fontSize: '1.1rem' }}>
                        {remainingViews} / {maxViews}
                    </div>
                </div>
            </div>
        </div>
    );
}