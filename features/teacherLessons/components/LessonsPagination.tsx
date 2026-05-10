// FILE: features/teacherLessons/components/LessonsPagination.tsx
import React from 'react';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';

interface Props {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    onPageChange: (page: number) => void;
}

export default function LessonsPagination({ currentPage, totalPages, totalItems, onPageChange }: Props) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', padding: '10px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ color: 'var(--txt-mut)', fontSize: '0.9rem' }}>
                إجمالي الحصص: <strong style={{ color: 'white' }}>{totalItems}</strong>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button 
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    style={{ background: currentPage === 1 ? 'transparent' : 'rgba(108,92,231,0.1)', color: currentPage === 1 ? 'rgba(255,255,255,0.2)' : 'var(--p-purple)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 15px', borderRadius: '8px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                    <FaChevronRight /> السابق
                </button>
                
                <span style={{ color: 'var(--txt)', fontWeight: 'bold', padding: '0 10px' }}>
                    صفحة {currentPage} من {totalPages}
                </span>
                
                <button 
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    style={{ background: currentPage === totalPages ? 'transparent' : 'rgba(108,92,231,0.1)', color: currentPage === totalPages ? 'rgba(255,255,255,0.2)' : 'var(--p-purple)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 15px', borderRadius: '8px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                    التالي <FaChevronLeft />
                </button>
            </div>
        </div>
    );
}