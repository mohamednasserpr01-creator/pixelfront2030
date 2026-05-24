import React from 'react';
import { FaRandom, FaSlidersH } from 'react-icons/fa';
import { Input } from '@/components/ui/Input';
import { ExamState } from '../types';

interface Props { 
    state: ExamState; 
    dispatch: React.Dispatch<any>; 
    stages: any[]; 
}

export default function ExamSettings({ state, dispatch, stages }: Props) {
    const { title, stage, durationMinutes, language, randomSettings } = state;
    
    // 🚀 كود التنسيق الموحد عشان الحقول تترص (2 يمين و 2 شمال) بالمسطرة
    const colStyle: React.CSSProperties = { flex: '1 1 45%', minWidth: '250px' };
    const labelStyle: React.CSSProperties = { display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' };
    const selectStyle: React.CSSProperties = { width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none', height: '48px', boxSizing: 'border-box', fontFamily: 'inherit' };

    return (
        <div style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', gap: '25px' }}>
            
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '25px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 style={{ color: 'var(--txt)', display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 25px 0' }}><FaSlidersH style={{color: 'var(--p-purple)'}}/> الإعدادات الأساسية</h3>
                
                {/* 🚀 قسمناهم باستخدام Flexbox مع حساب 45% عشان يقسم الشاشة نصين بالظبط */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'flex-start' }}>
                    
                    {/* الحقل 1 */}
                    <div style={colStyle}>
                        <Input label="اسم الامتحان" value={title} onChange={e => dispatch({ type: 'SET_TITLE', payload: e.target.value })} />
                    </div>
                    
                    {/* الحقل 2 */}
                    <div style={colStyle}>
                        <label style={labelStyle}>المرحلة الدراسية</label>
                        <select 
                            value={stage || ''} 
                            onChange={e => dispatch({ type: 'SET_STAGE', payload: e.target.value })} 
                            style={selectStyle}
                        >
                            <option value="" disabled style={{background: '#1e1e2d'}}>-- اختر المرحلة --</option>
                            {stages?.map(s => <option key={s.id} value={s.id} style={{background: '#1e1e2d'}}>{s.name}</option>)}
                        </select>
                    </div>

                    {/* الحقل 3 */}
                    <div style={colStyle}>
                        <Input label="الوقت بالدقائق (0 = مفتوح)" type="number" value={durationMinutes?.toString() || '0'} onChange={e => dispatch({ type: 'SET_DURATION', payload: Number(e.target.value) })} />
                    </div>
                    
                    {/* الحقل 4 */}
                    <div style={colStyle}>
                        <label style={labelStyle}>لغة الأسئلة</label>
                        <select 
                            value={language} 
                            onChange={e => dispatch({ type: 'SET_LANGUAGE', payload: e.target.value })} 
                            style={selectStyle}
                        >
                            <option value="ar" style={{background: '#1e1e2d'}}>عربي (أ، ب، ج، د)</option>
                            <option value="en" style={{background: '#1e1e2d'}}>إنجليزي (A, B, C, D)</option>
                        </select>
                    </div>
                    
                </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '25px', borderRadius: '12px', border: '1px dashed var(--p-purple)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                    <h3 style={{ color: 'var(--p-purple)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}><FaRandom /> محرك الأسئلة العشوائية</h3>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: 'white', fontWeight: 'bold' }}>تفعيل العشوائية
                        <input type="checkbox" checked={randomSettings?.enabled || false} onChange={e => dispatch({ type: 'UPDATE_RANDOM_SETTINGS', payload: { enabled: e.target.checked } })} style={{ width: '20px', height: '20px', accentColor: 'var(--p-purple)' }} />
                    </label>
                </div>

                {randomSettings?.enabled && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* 🚀 نفس الـ Layout هنا عشان يبقى متناسق مع اللي فوق */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                            <div style={colStyle}>
                                <Input label="إجمالي الأسئلة للطالب" type="number" value={randomSettings.questionCount.toString()} onChange={e => dispatch({ type: 'UPDATE_RANDOM_SETTINGS', payload: { questionCount: Number(e.target.value) } })} />
                            </div>
                            
                            <div style={{ ...colStyle, display: 'flex', flexDirection: 'column', gap: '15px', justifyContent: 'center' }}>
                                <label style={{ color: 'var(--txt)', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                    <input type="checkbox" checked={randomSettings.shuffleQuestions} onChange={e => dispatch({ type: 'UPDATE_RANDOM_SETTINGS', payload: { shuffleQuestions: e.target.checked } })} style={{ width: '18px', height: '18px', accentColor: 'var(--p-purple)' }} /> خلط الأسئلة للطلاب
                                </label>
                                <label style={{ color: 'var(--txt)', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                    <input type="checkbox" checked={randomSettings.shuffleOptions} onChange={e => dispatch({ type: 'UPDATE_RANDOM_SETTINGS', payload: { shuffleOptions: e.target.checked } })} style={{ width: '18px', height: '18px', accentColor: 'var(--p-purple)' }} /> خلط الاختيارات (A, B, C, D)
                                </label>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
        </div>
    );
}