// FILE: components/exam/ExamTimer.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { FaHourglassHalf } from 'react-icons/fa';

interface Props {
    initialTimeLimit: number; // الوقت بالدقائق
    onTimeUp: () => void;
}

export default function ExamTimer({ initialTimeLimit, onTimeUp }: Props) {
    const [timeLeft, setTimeLeft] = useState(initialTimeLimit * 60);

    useEffect(() => {
        if (timeLeft <= 0) {
            onTimeUp();
            return;
        }
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, onTimeUp]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const isDanger = timeLeft < 60;

    return (
        <div 
            style={{ 
                display: 'flex', alignItems: 'center', gap: '10px', 
                background: isDanger ? 'rgba(231, 76, 60, 0.1)' : 'var(--h-bg)', 
                color: isDanger ? '#e74c3c' : 'var(--warning)', 
                padding: '10px 20px', borderRadius: '50px', 
                fontWeight: 'bold', fontSize: '1.2rem',
                transition: 'all 0.3s ease',
                // 💡 لمسة Enterprise: التايمر بينبض لما الوقت يقل عن دقيقة
                animation: isDanger ? 'pulse 1s infinite' : 'none' 
            }}
        >
            <FaHourglassHalf /> {formatTime(timeLeft)}
        </div>
    );
}