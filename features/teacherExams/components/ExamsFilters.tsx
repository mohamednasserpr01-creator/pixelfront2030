// FILE: features/teacherExams/components/ExamsFilters.tsx
import React from 'react';
import { FaSearch, FaGraduationCap } from 'react-icons/fa';

const STAGES = [
    { id: 'all', name: 'جميع المراحل' },
    { id: 'prep3', name: 'الصف الثالث الإعدادي' },
    { id: 'sec1', name: 'الصف الأول الثانوي' },
    { id: 'sec2', name: 'الصف الثاني الثانوي' },
    { id: 'sec3', name: 'الصف الثالث الثانوي' },
];

interface Props {
    activeStage: string;
    onStageChange: (stage: string) => void;
    searchValue: string;
    onSearchChange: (val: string) => void;
}

export default function ExamsFilters({ activeStage, onStageChange, searchValue, onSearchChange }: Props) {
    return (
        <>
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '15px', marginBottom: '20px', borderBottom: '1px dashed rgba(255,255,255,0.1)' }}>
                {STAGES.map(stage => (
                    <button 
                        key={stage.id}
                        onClick={() => onStageChange(stage.id)}
                        style={{
                            padding: '10px 20px', borderRadius: '30px', whiteSpace: 'nowrap', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: '0.3s',
                            border: activeStage === stage.id ? 'none' : '1px solid rgba(255,255,255,0.1)',
                            background: activeStage === stage.id ? 'var(--p-purple)' : 'transparent',
                            color: activeStage === stage.id ? 'white' : 'var(--txt-mut)',
                            boxShadow: activeStage === stage.id ? '0 4px 15px rgba(108,92,231,0.3)' : 'none'
                        }}
                    >
                        <FaGraduationCap /> {stage.name}
                    </button>
                ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', background: 'rgba(0,0,0,0.2)', padding: '12px 15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <FaSearch style={{ color: 'var(--txt-mut)' }} />
                <input 
                    type="text" 
                    placeholder="ابحث باسم الامتحان أو الباب..." 
                    value={searchValue} 
                    onChange={e => onSearchChange(e.target.value)} 
                    style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }} 
                />
            </div>
        </>
    );
}