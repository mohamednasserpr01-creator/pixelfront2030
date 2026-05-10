// FILE: components/ui/Modal.tsx
"use client";
import React, { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import './ui.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    footer,
    maxWidth = '500px'
}) => {
    // 💡 منع عمل سكرول للصفحة الأصلية لما الـ Modal يفتح
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="pixel-modal-overlay" onClick={onClose} aria-modal="true" role="dialog">
            {/* e.stopPropagation() بتمنع الـ Modal يقفل لو دوست جواه، بيقفل بس لو دوست على الـ Overlay الأسود بره */}
            <div className="pixel-modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth }}>
                
                {/* 💡 شيلنا الشرط لأن onClose دايماً True، فهنعرض الـ Header بزرار الإغلاق دايماً */}
                <div className="pixel-modal-header">
                    {title && <h3 className="pixel-modal-title">{title}</h3>}
                    <button className="pixel-modal-close" onClick={onClose} aria-label="Close">
                        <FaTimes />
                    </button>
                </div>

                {/* المحتوى الداخلي */}
                <div className="pixel-modal-body">
                    {children}
                </div>

                {/* الجزء السفلي (لو حبيت تحط زراير حفظ أو إلغاء) */}
                {footer && (
                    <div className="pixel-modal-footer">
                        {footer}
                    </div>
                )}
                
            </div>
        </div>
    );
};