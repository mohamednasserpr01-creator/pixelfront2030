"use client";
import React, { useState, useEffect } from 'react';
import { FaSearch, FaGraduationCap } from 'react-icons/fa';

interface Stage {
    id: string | number;
    name: string;
}

interface Props {
    activeStage: string;
    onStageChange: (stage: string) => void;
    searchValue: string;
    onSearchChange: (val: string) => void;
}

// 🚀 تم تصحيح البورت ليتوافق مع السيرفر الجديد
const API_BASE_URL = 'http://localhost:5290/api';

export default function LessonsFilters({ activeStage, onStageChange, searchValue, onSearchChange }: Props) {
    const [stages, setStages] = useState<Stage[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStages = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await fetch(`${API_BASE_URL}/educational-stages`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (response.ok) {
                    const result = await response.json();
                    
                    // 🚀 بنفتح الظرف بتاع الباك إند وناخد الـ Array اللي جوه data
                    const stagesArray = result.data || result; 
                    setStages(Array.isArray(stagesArray) ? stagesArray : []);
                }
            } catch (error) {
                console.error("Failed to fetch educational stages", error);
                setStages([]); // عشان نضمن إنها دايماً Array وماتضربش إيرور
            } finally {
                setIsLoading(false);
            }
        };

        fetchStages();
    }, []);

    return (
        <>
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '15px', marginBottom: '20px', borderBottom: '1px dashed rgba(255,255,255,0.1)' }}>
                
                <button 
                    onClick={() => onStageChange('all')}
                    style={{
                        padding: '10px 20px', borderRadius: '30px', whiteSpace: 'nowrap', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: '0.3s',
                        border: activeStage === 'all' ? 'none' : '1px solid rgba(255,255,255,0.1)',
                        background: activeStage === 'all' ? 'var(--p-purple)' : 'transparent',
                        color: activeStage === 'all' ? 'white' : 'var(--txt-mut)',
                        boxShadow: activeStage === 'all' ? '0 4px 15px rgba(108,92,231,0.3)' : 'none'
                    }}
                >
                    <FaGraduationCap /> جميع المراحل
                </button>

                {isLoading ? (
                    <span style={{ color: 'var(--txt-mut)', alignSelf: 'center', fontSize: '0.9rem', margin: '0 10px' }}>جاري تحميل المراحل...</span>
                ) : (
                    stages.map(stage => (
                        <button 
                            key={stage.id}
                            onClick={() => onStageChange(stage.id.toString())}
                            style={{
                                padding: '10px 20px', borderRadius: '30px', whiteSpace: 'nowrap', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: '0.3s',
                                border: activeStage === stage.id.toString() ? 'none' : '1px solid rgba(255,255,255,0.1)',
                                background: activeStage === stage.id.toString() ? 'var(--p-purple)' : 'transparent',
                                color: activeStage === stage.id.toString() ? 'white' : 'var(--txt-mut)',
                                boxShadow: activeStage === stage.id.toString() ? '0 4px 15px rgba(108,92,231,0.3)' : 'none'
                            }}
                        >
                            <FaGraduationCap /> {stage.name}
                        </button>
                    ))
                )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', background: 'rgba(0,0,0,0.2)', padding: '12px 15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <FaSearch style={{ color: 'var(--txt-mut)' }} />
                <input 
                    type="text" 
                    placeholder="ابحث باسم الحصة أو الباب..." 
                    value={searchValue} 
                    onChange={e => onSearchChange(e.target.value)} 
                    style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }} 
                />
            </div>
        </>
    );
}