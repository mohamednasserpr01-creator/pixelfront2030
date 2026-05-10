"use client";
import React, { useState, useEffect } from 'react';
import { FaFolderOpen, FaPlus, FaSearch, FaTrash, FaEdit, FaFilePdf, FaDownload } from 'react-icons/fa';
import { LibraryModal } from './components/LibraryModal';

const mockFiles = [
    { id: '1', title: 'تجميعة أهم أسئلة النحو', subject: 'arabic', stage: 'sec3', size: 'MB 3.0', downloads: 1250, date: '2023-10-01' },
    { id: '2', title: 'كتاب الامتحان في الفيزياء (جزء التدريبات)', subject: 'physics', stage: 'sec2', size: 'MB 12.4', downloads: 840, date: '2023-10-05' },
    { id: '3', title: 'ملخص قوانين الفيزياء - الباب الأول', subject: 'physics', stage: 'sec3', size: 'MB 2.5', downloads: 3200, date: '2023-09-15' },
];

const STAGES: Record<string, string> = { 'sec1': 'الصف الأول الثانوي', 'sec2': 'الصف الثاني الثانوي', 'sec3': 'الصف الثالث الثانوي' };

export default function TeacherLibraryPage() {
    const [isMounted, setIsMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStage, setFilterStage] = useState('all');
    
    const [files, setFiles] = useState(mockFiles);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFile, setEditingFile] = useState<any | null>(null);

    useEffect(() => { setIsMounted(true); }, []);
    if (!isMounted) return null;

    const filteredFiles = files.filter(f => {
        const matchesSearch = f.title.includes(searchQuery);
        const matchesStage = filterStage === 'all' || f.stage === filterStage;
        return matchesSearch && matchesStage;
    });

    const handleSaveFile = (data: any) => {
        if (editingFile) {
            setFiles(files.map(f => f.id === data.id ? { ...f, ...data } : f));
        } else {
            setFiles([{ ...data, downloads: 0, date: new Date().toISOString().split('T')[0] }, ...files]);
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('هل أنت متأكد من حذف هذا الملف نهائياً من المكتبة؟ لن يتمكن الطلاب من تحميله بعد الآن.')) {
            setFiles(files.filter(f => f.id !== id));
        }
    };

    return (
        <div style={{ animation: 'fadeIn 0.4s ease', maxWidth: '1200px', margin: '0 auto', paddingBottom: '50px' }}>
            
            {/* 🚀 Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', marginTop: '20px', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', margin: '0 0 5px 0', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaFolderOpen color="var(--p-purple)" /> المكتبة الخاصة للمدرس
                    </h1>
                    <p style={{ color: 'var(--txt-mut)', margin: 0 }}>ارفع مذكراتك وكتبك الخارجية لطلابك بصيغة PDF مجاناً.</p>
                </div>
                <button onClick={() => { setEditingFile(null); setIsModalOpen(true); }} style={{ background: 'var(--p-purple)', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', transition: '0.2s', boxShadow: '0 5px 15px rgba(108,92,231,0.3)' }} className="btn-hover">
                    <FaPlus /> إضافة ملف جديد
                </button>
            </div>

            {/* 🚀 الإحصائيات والفلاتر */}
            <div style={{ background: 'var(--card)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '30px', display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', paddingRight: '15px', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>{files.length}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--txt-mut)' }}>إجمالي الملفات</div>
                    </div>
                </div>

                <div style={{ position: 'relative', flex: '1 1 250px' }}>
                    <FaSearch style={{ position: 'absolute', right: '15px', top: '14px', color: 'var(--txt-mut)' }} />
                    <input type="text" placeholder="ابحث باسم المذكرة..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ width: '100%', padding: '12px 40px 12px 15px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }} />
                </div>

                <select value={filterStage} onChange={e => setFilterStage(e.target.value)} style={{ flex: '0 1 200px', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }}>
                    <option value="all" style={{ background: '#1e1e2d' }}>تصفية بالمرحلة (الكل)</option>
                    <option value="sec1" style={{ background: '#1e1e2d' }}>الصف الأول الثانوي</option>
                    <option value="sec2" style={{ background: '#1e1e2d' }}>الصف الثاني الثانوي</option>
                    <option value="sec3" style={{ background: '#1e1e2d' }}>الصف الثالث الثانوي</option>
                </select>
            </div>

            {/* 🚀 شبكة الملفات المرفوعة */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {filteredFiles.map(file => {
                    let iconColor = '#e74c3c'; 
                    if(file.subject === 'physics') iconColor = '#3498db';
                    if(file.subject === 'chemistry') iconColor = '#2ecc71';
                    if(file.subject === 'arabic') iconColor = '#e67e22';

                    return (
                        <div key={file.id} style={{ background: 'var(--card)', borderRadius: '15px', padding: '20px', border: '1px solid rgba(108,92,231,0.1)', textAlign: 'center', position: 'relative', transition: '0.3s', display: 'flex', flexDirection: 'column' }} className="hover-card">
                            
                            <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '8px' }}>
                                <button onClick={() => { setEditingFile(file); setIsModalOpen(true); }} style={{ background: 'rgba(52, 152, 219, 0.2)', color: '#3498db', border: 'none', width: '30px', height: '30px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="تعديل"><FaEdit/></button>
                                <button onClick={() => handleDelete(file.id)} style={{ background: 'rgba(231, 76, 60, 0.2)', color: '#e74c3c', border: 'none', width: '30px', height: '30px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="حذف"><FaTrash/></button>
                            </div>

                            <div style={{ margin: '30px 0 15px 0' }}>
                                <FaFilePdf style={{ fontSize: '4rem', color: iconColor }} />
                            </div>
                            
                            <div style={{ color: 'var(--txt-mut)', fontSize: '0.85rem', marginBottom: '5px' }}>{STAGES[file.stage]}</div>
                            <h3 style={{ margin: '0 0 15px 0', fontSize: '1.2rem', color: 'var(--txt)', lineHeight: '1.5' }}>{file.title}</h3>
                            
                            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px' }}>
                                <span style={{ color: 'var(--txt-mut)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}><FaDownload/> {file.downloads} مرة</span>
                                <span style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold' }}>{file.size}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredFiles.length === 0 && (
                <div style={{ textAlign: 'center', padding: '50px', color: 'var(--txt-mut)', background: 'var(--card)', borderRadius: '15px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                    لا توجد ملفات مطابقة للبحث أو الفلتر.
                </div>
            )}

            <style jsx>{`
                .hover-card:hover { transform: translateY(-5px); border-color: var(--p-purple) !important; box-shadow: 0 10px 20px rgba(0,0,0,0.2); }
                .btn-hover:hover { transform: scale(1.02); }
            `}</style>

            <LibraryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveFile} initialData={editingFile} />
        </div>
    );
}