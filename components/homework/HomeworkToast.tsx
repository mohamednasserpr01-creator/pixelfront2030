// FILE: components/homework/HomeworkToast.tsx
import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

interface Props {
    msg: string | null;
    lang: string;
}

export default function HomeworkToast({ msg, lang }: Props) {
    return (
        <div className={`toast ${msg ? 'show' : ''}`} style={{ 
            position: 'fixed', 
            bottom: '30px', 
            right: lang === 'ar' ? '30px' : 'auto', 
            left: lang === 'ar' ? 'auto' : '30px', 
            background: '#2ecc71', 
            color: 'white', 
            padding: '15px 25px', 
            borderRadius: '10px', 
            fontWeight: 'bold', 
            boxShadow: '0 5px 20px rgba(0,0,0,0.3)', 
            transform: msg ? 'translateY(0)' : 'translateY(100px)', 
            opacity: msg ? 1 : 0, 
            transition: '0.4s ease', 
            zIndex: 9999, 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            pointerEvents: 'none' 
        }}>
            <FaCheckCircle /> <span>{msg}</span>
        </div>
    );
}