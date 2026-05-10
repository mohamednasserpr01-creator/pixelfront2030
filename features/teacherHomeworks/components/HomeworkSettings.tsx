import React from 'react';
import { FaSlidersH, FaCalendarAlt } from 'react-icons/fa';
import { Input } from '@/components/ui/Input';
import { HomeworkState } from '../types';

interface Props { state: HomeworkState; dispatch: React.Dispatch<any>; }

export default function HomeworkSettings({ state, dispatch }: Props) {
    const { title, language, dueDate, allowLateSubmission } = state;
    return (
        <div style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', gap: '25px' }}>
            
            {/* 🚀 تنظيف الكارت الأول */}
            <div style={{ background: 'var(--card)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(128,128,128,0.2)' }}>
                <h3 style={{ color: 'var(--txt)', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                    <FaSlidersH style={{color: 'var(--p-purple)'}}/> الإعدادات الأساسية للواجب
                </h3>
                
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '20px' }}>
                    <div style={{ flex: 2, minWidth: '200px' }}>
                        <Input label="اسم الواجب" value={title} onChange={e => dispatch({ type: 'SET_TITLE', payload: e.target.value })} />
                    </div>
                    <div style={{ flex: 1, minWidth: '150px' }}>
                        <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>لغة الأسئلة</label>
                        {/* 🚀 تنظيف الـ Select */}
                        <select value={language} onChange={e => dispatch({ type: 'SET_LANGUAGE', payload: e.target.value })} style={{ width: '100%', padding: '12px', background: 'rgba(128,128,128,0.05)', border: '1px solid rgba(128,128,128,0.2)', color: 'var(--txt)', borderRadius: '8px', outline: 'none' }}>
                            <option value="ar" style={{background: 'var(--card)', color: 'var(--txt)'}}>عربي (أ، ب، ج، د)</option>
                            <option value="en" style={{background: 'var(--card)', color: 'var(--txt)'}}>إنجليزي (A, B, C, D)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* 🚀 تنظيف كارت الديدلاين */}
            <div style={{ background: 'var(--card)', padding: '20px', borderRadius: '12px', border: '1px dashed #f39c12' }}>
                <h3 style={{ color: '#f39c12', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', margin: 0 }}>
                    <FaCalendarAlt /> إعدادات التسليم (الديدلاين)
                </h3>
                
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ flex: 1, minWidth: '250px' }}>
                        <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>آخر موعد للتسليم</label>
                        {/* 🚀 تنظيف الـ Date Input */}
                        <input 
                            type="datetime-local" 
                            value={dueDate} 
                            onChange={e => dispatch({ type: 'SET_DUE_DATE', payload: e.target.value })}
                            style={{ width: '100%', padding: '12px', background: 'rgba(128,128,128,0.05)', border: '1px solid rgba(128,128,128,0.2)', color: 'var(--txt)', borderRadius: '8px', outline: 'none', colorScheme: 'var(--txt) == "#ffffff" ? "dark" : "light"' }}
                        />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center', marginTop: '25px' }}>
                        {/* 🚀 تنظيف التيكست هنا */}
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