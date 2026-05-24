import React from 'react';
import { FaSearch, FaGraduationCap } from 'react-icons/fa';

interface Props { stages: any[]; activeStage: string; onStageChange: (stage: string) => void; searchValue: string; onSearchChange: (val: string) => void; }

export default function ExamsFilters({ stages, activeStage, onStageChange, searchValue, onSearchChange }: Props) {
    return (
        <div style={{ width: '100%' }}>
            {stages.length > 0 && (
                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '15px', marginBottom: '20px', borderBottom: '1px dashed rgba(255,255,255,0.1)', WebkitOverflowScrolling: 'touch', width: '100%' }}>
                    {stages.map(stage => (
                        <button key={stage.id} onClick={() => onStageChange(stage.id.toString())}
                            style={{
                                padding: '10px 20px', borderRadius: '30px', whiteSpace: 'nowrap', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', flexShrink: 0,
                                border: activeStage === stage.id.toString() ? 'none' : '1px solid rgba(255,255,255,0.1)', background: activeStage === stage.id.toString() ? 'var(--p-purple)' : 'transparent', color: activeStage === stage.id.toString() ? 'white' : 'var(--txt-mut)'
                            }}>
                            <FaGraduationCap /> {stage.name}
                        </button>
                    ))}
                </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', background: 'rgba(0,0,0,0.2)', padding: '12px 15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)', width: '100%', boxSizing: 'border-box' }}>
                <FaSearch style={{ color: 'var(--txt-mut)', flexShrink: 0 }} />
                <input type="text" placeholder="ابحث باسم الامتحان أو الباب..." value={searchValue} onChange={e => onSearchChange(e.target.value)} style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }} />
            </div>
        </div>
    );
}