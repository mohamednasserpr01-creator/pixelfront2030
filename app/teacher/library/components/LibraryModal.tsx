"use client";
import React, { useState, useEffect, useRef } from 'react';
import { FaTimes, FaFilePdf, FaUpload, FaTrash } from 'react-icons/fa';

interface LibraryFile {
    id: string;
    title: string;
    subject: string;
    stage: string;
    size: string;
    fileName?: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: LibraryFile) => void;
    initialData?: LibraryFile | null;
}

export const LibraryModal: React.FC<Props> = ({ isOpen, onClose, onSave, initialData }) => {
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('physics');
    const [stage, setStage] = useState('sec3');
    const [fileName, setFileName] = useState('');
    const [fileSize, setFileSize] = useState('');
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setSubject(initialData.subject);
            setStage(initialData.stage);
            setFileSize(initialData.size);
            setFileName(initialData.fileName || 'ملف_مرفوع_مسبقاً.pdf');
        } else {
            setTitle(''); setSubject('physics'); setStage('sec3'); 
            setFileName(''); setFileSize('');
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                alert('يرجى رفع ملفات بصيغة PDF فقط!');
                return;
            }
            setFileName(file.name);
            const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
            setFileSize(`MB ${sizeInMB}`);
        }
        e.target.value = ''; 
    };

    const handleSave = () => {
        if (!title.trim()) return alert('يرجى إدخال اسم المذكرة أو الكتاب');
        if (!fileName && !initialData) return alert('يرجى إرفاق ملف الـ PDF');

        onSave({
            id: initialData?.id || Date.now().toString(),
            title,
            subject,
            stage,
            size: fileSize || 'MB 1.5',
            fileName
        });
        onClose();
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
            <div style={{ background: '#1a1a2e', width: '100%', maxWidth: '500px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)', padding: '30px', animation: 'fadeIn 0.3s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                    <h3 style={{ margin: 0, color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaFilePdf color="#e74c3c"/> {initialData ? 'تعديل بيانات الملف' : 'إضافة ملف جديد للمكتبة'}
                    </h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--txt-mut)', cursor: 'pointer', fontSize: '1.2rem' }}><FaTimes /></button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' }}>
                    <div>
                        <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '0.9rem' }}>اسم المذكرة / الملف</label>
                        <input type="text" placeholder="مثال: ملخص قوانين الفيزياء - الباب الأول" value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }} />
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '0.9rem' }}>المادة</label>
                            <select value={subject} onChange={e => setSubject(e.target.value)} style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }}>
                                <option value="physics" style={{ background: '#1e1e2d' }}>فيزياء</option>
                                <option value="chemistry" style={{ background: '#1e1e2d' }}>كيمياء</option>
                                <option value="arabic" style={{ background: '#1e1e2d' }}>لغة عربية</option>
                                <option value="math" style={{ background: '#1e1e2d' }}>رياضيات</option>
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '0.9rem' }}>المرحلة</label>
                            <select value={stage} onChange={e => setStage(e.target.value)} style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }}>
                                <option value="sec1" style={{ background: '#1e1e2d' }}>الأول الثانوي</option>
                                <option value="sec2" style={{ background: '#1e1e2d' }}>الثاني الثانوي</option>
                                <option value="sec3" style={{ background: '#1e1e2d' }}>الثالث الثانوي</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '0.9rem' }}>ملف الـ PDF</label>
                        <input type="file" accept=".pdf" ref={fileInputRef} onChange={handleFileUpload} style={{ display: 'none' }} />
                        
                        {!fileName ? (
                            <div onClick={() => fileInputRef.current?.click()} style={{ width: '100%', padding: '25px', background: 'rgba(231, 76, 60, 0.05)', border: '2px dashed rgba(231, 76, 60, 0.4)', borderRadius: '10px', textAlign: 'center', cursor: 'pointer', color: 'var(--txt-mut)', transition: '0.2s' }}>
                                <FaUpload size={24} style={{ marginBottom: '10px', color: '#e74c3c' }} />
                                <div>اضغط هنا لرفع ملف PDF من جهازك</div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(46, 204, 113, 0.1)', border: '1px solid #2ecc71', padding: '15px', borderRadius: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white', overflow: 'hidden' }}>
                                    {/* 🚀 تم الإصلاح هنا: وضعنا flexShrink في الـ style */}
                                    <FaFilePdf color="#e74c3c" size={24} style={{ flexShrink: 0 }} />
                                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '250px' }}>
                                        <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{fileName}</div>
                                        <div style={{ color: '#2ecc71', fontSize: '0.8rem' }}>الحجم: {fileSize}</div>
                                    </div>
                                </div>
                                <button onClick={() => { setFileName(''); setFileSize(''); }} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', padding: '5px' }} title="حذف وإعادة الرفع">
                                    <FaTrash />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <button onClick={handleSave} style={{ width: '100%', background: 'var(--p-purple)', color: 'white', border: 'none', padding: '15px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                    <FaUpload /> حفظ ونشر في المكتبة
                </button>
            </div>
        </div>
    );
};