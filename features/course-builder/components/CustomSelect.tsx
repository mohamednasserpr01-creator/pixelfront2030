"use client";
import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

interface CustomSelectProps {
    value: string;
    onChange: (val: string) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
    emptyMessage?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({ 
    value, 
    onChange, 
    options, 
    placeholder = "اختر...", 
    emptyMessage = "لا يوجد خيارات" 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find(o => o.value === value);

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            {/* الزرار الأساسي */}
            <div 
                onClick={() => setIsOpen(!isOpen)} 
                style={{ 
                    width: '100%', padding: '12px 15px', background: 'rgba(0,0,0,0.3)', 
                    border: `1px solid ${isOpen ? 'var(--p-purple)' : 'rgba(255,255,255,0.1)'}`, 
                    color: 'white', borderRadius: '8px', cursor: 'pointer', 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                    transition: '0.2s' 
                }}
            >
                <span style={{ color: selectedOption ? 'white' : 'var(--txt-mut)', fontSize: '0.9rem' }}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <FaChevronDown style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: '0.2s', color: 'var(--txt-mut)', fontSize: '0.8rem' }} />
            </div>

            {/* الخيارات */}
            {isOpen && (
                <>
                    {/* طبقة شفافة للإغلاق عند الضغط خارجاً */}
                    <div onClick={() => setIsOpen(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100000 }} />
                    <div style={{ 
                        position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '8px', 
                        background: '#252538', border: '1px solid rgba(255,255,255,0.05)', 
                        borderRadius: '8px', zIndex: 100001, maxHeight: '200px', 
                        overflowY: 'auto', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', 
                        animation: 'fadeIn 0.2s ease' 
                    }}>
                        {options.length === 0 ? (
                            <div style={{ padding: '12px 15px', color: 'var(--txt-mut)', fontSize: '0.9rem', textAlign: 'center' }}>{emptyMessage}</div>
                        ) : (
                            options.map(opt => (
                                <div 
                                    key={opt.value}
                                    onClick={() => { onChange(opt.value); setIsOpen(false); }}
                                    style={{ 
                                        padding: '12px 15px', cursor: 'pointer', 
                                        color: value === opt.value ? 'white' : 'var(--txt-mut)', 
                                        background: value === opt.value ? 'var(--p-purple)' : 'transparent', 
                                        borderBottom: '1px solid rgba(255,255,255,0.02)', 
                                        transition: '0.2s', fontSize: '0.9rem' 
                                    }}
                                    onMouseOver={(e) => { if(value !== opt.value) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'white'; } }}
                                    onMouseOut={(e) => { if(value !== opt.value) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--txt-mut)'; } }}
                                >
                                    {opt.label}
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
};