import React from 'react';
import { FaRandom, FaSlidersH } from 'react-icons/fa';
import { Input } from '@/components/ui/Input';
import { ExamState } from '../types';

interface Props { state: ExamState; dispatch: React.Dispatch<any>; }

export default function ExamSettings({ state, dispatch }: Props) {
    const { title, durationMinutes, language, randomSettings } = state;
    return (
        <div style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 style={{ color: 'var(--txt)', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}><FaSlidersH style={{color: 'var(--p-purple)'}}/> الإعدادات الأساسية</h3>
                
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 2, minWidth: '200px' }}>
                        <Input label="اسم الامتحان" value={title} onChange={e => dispatch({ type: 'SET_TITLE', payload: e.target.value })} />
                    </div>
                    <div style={{ flex: 1, minWidth: '150px' }}>
                        <Input label="الوقت بالدقائق (0 = مفتوح)" type="number" value={durationMinutes.toString()} onChange={e => dispatch({ type: 'SET_DURATION', payload: Number(e.target.value) })} />
                    </div>
                    <div style={{ flex: 1, minWidth: '150px' }}>
                        {/* 💡 حقل اختيار لغة الامتحان */}
                        <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>لغة الأسئلة</label>
                        <select value={language} onChange={e => dispatch({ type: 'SET_LANGUAGE', payload: e.target.value })} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }}>
                            <option value="ar" style={{background: '#1e1e2d'}}>عربي (أ، ب، ج، د)</option>
                            <option value="en" style={{background: '#1e1e2d'}}>إنجليزي (A, B, C, D)</option>
                        </select>
                    </div>
                </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', border: '1px dashed var(--p-purple)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ color: 'var(--p-purple)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}><FaRandom /> محرك الأسئلة العشوائية</h3>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: 'white', fontWeight: 'bold' }}>تفعيل العشوائية
                        <input type="checkbox" checked={randomSettings.enabled} onChange={e => dispatch({ type: 'UPDATE_RANDOM_SETTINGS', payload: { enabled: e.target.checked } })} style={{ width: '20px', height: '20px', accentColor: 'var(--p-purple)' }} />
                    </label>
                </div>

                {randomSettings.enabled && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                            <div style={{ flex: 1 }}><Input label="إجمالي الأسئلة للطالب" type="number" value={randomSettings.questionCount.toString()} onChange={e => dispatch({ type: 'UPDATE_RANDOM_SETTINGS', payload: { questionCount: Number(e.target.value) } })} /></div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center' }}>
                                <label style={{ color: 'var(--txt-mut)' }}><input type="checkbox" checked={randomSettings.shuffleQuestions} onChange={e => dispatch({ type: 'UPDATE_RANDOM_SETTINGS', payload: { shuffleQuestions: e.target.checked } })} /> خلط الأسئلة</label>
                                <label style={{ color: 'var(--txt-mut)' }}><input type="checkbox" checked={randomSettings.shuffleOptions} onChange={e => dispatch({ type: 'UPDATE_RANDOM_SETTINGS', payload: { shuffleOptions: e.target.checked } })} /> خلط الاختيارات</label>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}