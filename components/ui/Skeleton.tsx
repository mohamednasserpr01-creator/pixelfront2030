// FILE: components/ui/Skeleton.tsx
import React from 'react';
import './ui.css';

interface SkeletonProps {
    variant?: 'rectangular' | 'circle' | 'text';
    width?: string | number;
    height?: string | number;
    className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
    variant = 'rectangular', 
    width = '100%', 
    height = '20px', 
    className = '' 
}) => {
    // تحديد الكلاس بناءً على النوع (دائري، نص، أو كارت عادي)
    const variantClass = variant === 'circle' ? 'pixel-skeleton-circle' 
                       : variant === 'text' ? 'pixel-skeleton-text' 
                       : '';

    return (
        <div 
            className={`pixel-skeleton ${variantClass} ${className}`}
            style={{ width, height }}
            aria-hidden="true" /* عشان الـ Screen Readers تتجاهله لأنه مجرد شكل جمالي */
        />
    );
};