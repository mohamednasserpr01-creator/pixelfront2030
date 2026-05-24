import React from 'react';
import { FaSlidersH, FaCalendarAlt } from 'react-icons/fa';
import { Input } from '@/components/ui/Input';
import { HomeworkState } from '../types';

interface Props { 
    state: HomeworkState & { stage?: string }; 
    dispatch: React.Dispatch<any>; 
    stagesList?: any[]; 
}

export default function HomeworkSettings({ state, dispatch, stagesList = [] }: Props) {
    const { title, language, dueDate, allowLateSubmission, stage } = state;
    
    return (
        <div style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', gap: '25px' }}>
            
            <div style={{ background: 'var(--card)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(128,128,128,0.2)' }}>
                <h3 style={{ color: 'var(--txt)', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                    <FaSlidersH style={{color: '#f39c12'}}/> الإعدادات الأساسية للواجب
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', alignItems: 'end' }}>
                    
                    <div>
                        <Input label="اسم الواجب" value={title} onChange={e => dispatch({ type: 'SET_TITLE', payload: e.target.value })} />
                    </div>
                    
                    {/* 🚀 السليكت بوكس بتاع المرحلة الدراسية مع ألوان صريحة */}
                    <div>
                        <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>المرحلة الدراسية</label>
                        <select 
                            value={stage || ''} 
                            onChange={e => dispatch({ type: 'SET_STAGE', payload: e.target.value })} 
                            style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', borderRadius: '8px', outline: 'none', height: '48px' }}
                        >
                            <option value="" disabled style={{background: '#1e1e2d', color: '#ffffff'}}>-- اختر المرحلة --</option>
                            {stagesList.filter(s => s.id !== 'all').map(s => (
                                <option key={s.id} value={s.id} style={{background: '#1e1e2d', color: '#ffffff'}}>{s.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* 🚀 السليكت بوكس بتاع اللغة مع ألوان صريحة */}
                    <div>
                        <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>لغة الأسئلة</label>
                        <select value={language} onChange={e => dispatch({ type: 'SET_LANGUAGE', payload: e.target.value })} style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', borderRadius: '8px', outline: 'none', height: '48px' }}>
                            <option value="ar" style={{background: '#1e1e2d', color: '#ffffff'}}>عربي (أ، ب، ج، د)</option>
                            <option value="en" style={{background: '#1e1e2d', color: '#ffffff'}}>إنجليزي (A, B, C, D)</option>
                        </select>
                    </div>
                    
                </div>
            </div>

            <div style={{ background: 'var(--card)', padding: '20px', borderRadius: '12px', border: '1px dashed #f39c12' }}>
                <h3 style={{ color: '#f39c12', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', margin: 0 }}>
                    <FaCalendarAlt /> إعدادات التسليم (الديدلاين)
                </h3>
                
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ flex: 1, minWidth: '250px' }}>
                        <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>آخر موعد للتسليم</label>
                        <input 
                            type="datetime-local" 
                            value={dueDate} 
                            onChange={e => dispatch({ type: 'SET_DUE_DATE', payload: e.target.value })}
                            style={{ width: '100%', padding: '12px', background: 'rgba(128,128,128,0.05)', border: '1px solid rgba(128,128,128,0.2)', color: '#ffffff', borderRadius: '8px', outline: 'none', colorScheme: 'dark' }}
                        />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center', marginTop: '25px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--txt)', cursor: 'pointer', fontWeight: 'bold' }}>
                            <input type="checkbox" checked={allowLateSubmission} onChange={e => dispatch({ type: 'SET_ALLOW_LATE', payload: e.target.checked })} style={{ width: '20px', height: '20px', accentColor: '#f39c12' }} /> 
                            السماح للطلاب بالتسليم بعد انتهاء الموعد
                        </label>
                        <small style={{ color: 'var(--txt-mut)', marginRight: '30px' }}>* سيتم وضع علامة "تسليم متأخر" على إجاباتهم</small>
                    </div>
                </div>
            </div>
            
        </div>
    );
}