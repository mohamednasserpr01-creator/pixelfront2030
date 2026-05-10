"use client";
import React, { useState, useEffect } from 'react';
import { FaCog, FaTimes, FaLock, FaEye, FaCertificate, FaUserSecret } from 'react-icons/fa';
import { Lecture, LectureItem } from '../types/curriculum.types';
import { CustomSelect } from './CustomSelect';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    item: LectureItem | null;
    curriculum: Lecture[];
    onSave: (itemId: string, updates: Partial<LectureItem>) => void;
}

export const ItemSettingsDrawer: React.FC<Props> = ({ isOpen, onClose, item, curriculum, onSave }) => {
    const [prereqType, setPrereqType] = useState('none');
    const [selectedExam, setSelectedExam] = useState('');
    const [selectedHw, setSelectedHw] = useState('');
    const [altExam, setAltExam] = useState('none');
    const [viewsLimit, setViewsLimit] = useState(3);
    const [passScore, setPassScore] = useState(50);
    
    const [issueCertificate, setIssueCertificate] = useState(false);
    const [certificateMinScore, setCertificateMinScore] = useState(80);
    const [requireRetake, setRequireRetake] = useState(false);
    const [retakeThreshold, setRetakeThreshold] = useState(50);
    const [showAnswers, setShowAnswers] = useState(false);
    const [isRetakeOnly, setIsRetakeOnly] = useState(false); 

    useEffect(() => {
        if (item) {
            setPrereqType(item.prerequisite?.type || 'none');
            setSelectedExam(item.prerequisite?.type === 'specific_exam' ? item.prerequisite.targetId || '' : '');
            setSelectedHw(item.prerequisite?.type === 'specific_hw' ? item.prerequisite.targetId || '' : '');
            setAltExam(item.altExamId || 'none');
            setViewsLimit(item.viewsLimit || 3);
            setPassScore(item.passScore || 50);
            
            setIssueCertificate(item.issueCertificate || false);
            setCertificateMinScore(item.certificateMinScore || 80);
            setRequireRetake(item.requireRetake || false);
            setRetakeThreshold(item.retakeThreshold || 50);
            setShowAnswers(item.showAnswers || false);
            setIsRetakeOnly(item.isRetakeOnly || false); 
        }
    }, [item]);

    if (!isOpen || !item) return null;

    const courseExams = curriculum.flatMap(l => l.items).filter(i => i.type === 'exam');
    const courseHomeworks = curriculum.flatMap(l => l.items).filter(i => i.type === 'homework');

    const handleSave = () => {
        onSave(item.id, {
            viewsLimit, passScore, altExamId: requireRetake && altExam !== 'none' ? altExam : undefined,
            issueCertificate, certificateMinScore: issueCertificate ? certificateMinScore : undefined,
            requireRetake, retakeThreshold: requireRetake ? retakeThreshold : undefined,
            showAnswers, isRetakeOnly,
            
            prerequisite: {
                type: prereqType as any,
                targetId: prereqType === 'specific_exam' ? selectedExam : prereqType === 'specific_hw' ? selectedHw : undefined
            }
        });
        onClose();
    };

    return (
        <>
            <div onClick={onClose} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', zIndex: 99998, animation: 'fadeIn 0.2s ease' }} />
            
            <div style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: '450px', maxWidth: '100%', background: '#1e1e2d', borderRight: '1px solid rgba(255,255,255,0.05)', zIndex: 99999, boxShadow: '10px 0 50px rgba(0,0,0,0.8)', padding: '30px', transform: isOpen ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)', overflowY: 'auto' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
                    <div>
                        <h3 style={{ margin: '0 0 5px 0', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}><FaCog color="var(--txt-mut)"/> إعدادات المحتوى</h3>
                        <p style={{ margin: 0, color: 'var(--p-purple)', fontSize: '0.9rem', fontWeight: 'bold' }}>{item.title}</p>
                    </div>
                    <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--txt-mut)', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaTimes /></button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.02)' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', marginBottom: '10px', fontSize: '0.95rem' }}><FaLock color="#e74c3c"/> شرط فتح المحتوى</label>
                        <CustomSelect 
                            value={prereqType} onChange={setPrereqType} 
                            options={[
                                { value: 'none', label: 'بدون شروط (متاح فوراً)' },
                                { value: 'prev', label: 'بعد إكمال العنصر السابق' },
                                { value: 'specific_exam', label: 'بعد النجاح في امتحان معين' },
                                { value: 'specific_hw', label: 'بعد تسليم واجب معين' }
                            ]} 
                        />
                        {prereqType === 'specific_exam' && (
                            <div style={{ marginTop: '15px' }}><span style={{ fontSize: '0.8rem', color: 'var(--txt-mut)', display: 'block', marginBottom: '5px' }}>اختر الامتحان:</span><CustomSelect value={selectedExam} onChange={setSelectedExam} options={courseExams.map(ex => ({ value: ex.id, label: ex.title }))} /></div>
                        )}
                        {prereqType === 'specific_hw' && (
                            <div style={{ marginTop: '15px' }}><span style={{ fontSize: '0.8rem', color: 'var(--txt-mut)', display: 'block', marginBottom: '5px' }}>اختر الواجب:</span><CustomSelect value={selectedHw} onChange={setSelectedHw} options={courseHomeworks.map(hw => ({ value: hw.id, label: hw.title }))} /></div>
                        )}
                    </div>

                    {(item.type === 'lesson' || item.type === 'homework_lesson') && (
                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.02)' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', marginBottom: '10px', fontSize: '0.95rem' }}><FaEye color="#3498db"/> عدد المشاهدات المسموحة</label>
                            <input type="number" value={viewsLimit} onChange={(e) => setViewsLimit(Number(e.target.value))} style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }} />
                        </div>
                    )}

                    {item.type === 'exam' && (
                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.02)' }}>
                            <h4 style={{ color: 'white', margin: '0 0 15px 0', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}><FaCertificate color="#f1c40f"/> إعدادات الامتحان الخاصة</h4>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#e67e22', cursor: 'pointer', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <input type="checkbox" checked={isRetakeOnly} onChange={(e) => setIsRetakeOnly(e.target.checked)} style={{ accentColor: '#e67e22', width: '16px', height: '16px' }} />
                                <span style={{ flex: 1 }}>تخصيص للإعادة فقط (يُخفى افتراضياً)</span><FaUserSecret size={18} />
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white', cursor: 'pointer', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <input type="checkbox" checked={showAnswers} onChange={(e) => setShowAnswers(e.target.checked)} style={{ accentColor: 'var(--p-purple)', width: '16px', height: '16px' }} />
                                مراجعة الإجابات الصحيحة بعد التسليم
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--txt-mut)', cursor: 'pointer', marginBottom: '10px' }}>
                                <input type="checkbox" checked={issueCertificate} onChange={(e) => setIssueCertificate(e.target.checked)} /> إصدار شهادة تقدير
                            </label>
                            {issueCertificate && (
                                <div style={{ marginBottom: '15px', paddingRight: '25px', animation: 'fadeIn 0.2s ease' }}><span style={{ fontSize: '0.8rem', color: 'var(--txt-mut)', display: 'block', marginBottom: '5px' }}>الدرجة المطلوبة للشهادة (%):</span><input type="number" value={certificateMinScore} onChange={(e) => setCertificateMinScore(Number(e.target.value))} style={{ width: '100%', padding: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '5px', outline: 'none' }} /></div>
                            )}
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--txt-mut)', cursor: 'pointer', marginBottom: '10px', marginTop: '15px', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '15px' }}>
                                <input type="checkbox" checked={requireRetake} onChange={(e) => setRequireRetake(e.target.checked)} disabled={isRetakeOnly} /> تفعيل امتحان إعادة
                            </label>
                            {requireRetake && !isRetakeOnly && (
                                <div style={{ paddingRight: '25px', animation: 'fadeIn 0.2s ease' }}>
                                    <div style={{ marginBottom: '10px' }}><span style={{ fontSize: '0.8rem', color: 'var(--txt-mut)', display: 'block', marginBottom: '5px' }}>يُسمح للإعادة لمن حصل أقل من (%):</span><input type="number" value={retakeThreshold} onChange={(e) => setRetakeThreshold(Number(e.target.value))} style={{ width: '100%', padding: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '5px', outline: 'none' }} /></div>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--txt-mut)', display: 'block', marginBottom: '5px' }}>اختر امتحان الإعادة المرتبط:</span>
                                    <CustomSelect value={altExam} onChange={setAltExam} options={[{ value: 'none', label: 'اختر امتحان...' }, ...courseExams.filter(ex => ex.id !== item.id).map(ex => ({ value: ex.id, label: ex.title + (ex.isRetakeOnly ? ' (مخصص للإعادة)' : '') }))]} />
                                </div>
                            )}
                        </div>
                    )}

                    <button onClick={handleSave} style={{ width: '100%', background: 'var(--p-purple)', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
                        حفظ الإعدادات والتأكيد
                    </button>
                </div>
            </div>
        </>
    );
};