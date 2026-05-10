"use client";
import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowRight, FaFolderPlus, FaFolder, FaPlus, FaEdit, FaTrash, FaCheckCircle, FaPenNib, FaTimes } from 'react-icons/fa';
import { QuestionModal } from '@/app/teacher/question-banks/components/QuestionModal';

const initialUnits = [
    { id: 'u1', title: 'الباب الأول: التيار الكهربي', questions: [
        { id: 'q1', type: 'mcq', text: 'وحدة قياس شدة التيار هي:', options: [{id:'1', text:'أمبير'}, {id:'2', text:'فولت'}], correctOptionId: '1', explanation: 'الأمبير هو الوحدة الأساسية للتيار في النظام الدولي.' }
    ]},
    { id: 'u2', title: 'الباب الثاني: التأثير المغناطيسي', questions: [] }
];

export default function BankContentPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    
    const [units, setUnits] = useState(initialUnits);
    const [activeUnitId, setActiveUnitId] = useState<string | null>(initialUnits[0]?.id || null);
    
    const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<any | null>(null);

    // 🚀 حالات مودال إضافة الوحدة (بديل الـ prompt العقيم)
    const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
    const [newUnitTitle, setNewUnitTitle] = useState('');

    const activeUnit = units.find(u => u.id === activeUnitId);

    // 🚀 دالة إضافة الوحدة الجديدة باستخدام المودال
    const handleAddUnitConfirm = () => {
        if (newUnitTitle.trim() !== '') {
            const newUnit = { id: Date.now().toString(), title: newUnitTitle, questions: [] };
            setUnits([...units, newUnit]);
            setActiveUnitId(newUnit.id);
            setNewUnitTitle('');
            setIsUnitModalOpen(false);
        } else {
            alert('يرجى إدخال اسم الباب/الوحدة');
        }
    };

    const handleSaveQuestion = (q: any) => {
        setUnits(units.map(u => {
            if (u.id === activeUnitId) {
                const exists = u.questions.find(oldQ => oldQ.id === q.id);
                if (exists) {
                    return { ...u, questions: u.questions.map(oldQ => oldQ.id === q.id ? q : oldQ) }; 
                } else {
                    return { ...u, questions: [...u.questions, q] }; 
                }
            }
            return u;
        }));
    };

    const handleDeleteQuestion = (qId: string) => {
        if(confirm('هل أنت متأكد من حذف هذا السؤال؟')) {
            setUnits(units.map(u => u.id === activeUnitId ? { ...u, questions: u.questions.filter(q => q.id !== qId) } : u));
        }
    };

    return (
        <div style={{ animation: 'fadeIn 0.4s ease', maxWidth: '1400px', margin: '0 auto', paddingBottom: '50px', height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', marginTop: '20px', flexShrink: 0 }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <button onClick={() => router.push('/teacher/question-banks')} style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--txt)', width: '45px', height: '45px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FaArrowRight />
                    </button>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', margin: '0 0 5px 0', color: 'white', fontWeight: 'bold' }}>بنك أسئلة الفيزياء الشامل</h1>
                        <div style={{ color: 'var(--txt-mut)', fontSize: '0.9rem' }}>إدارة الفصول والأسئلة الخاصة بهذا البنك</div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', flex: 1, overflow: 'hidden' }}>
                
                {/* 🚀 الشريط الجانبي: الأبواب والوحدات */}
                <div style={{ width: '300px', background: 'var(--card)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ color: 'white', fontSize: '1.1rem' }}>الأبواب والوحدات</strong>
                    </div>
                    
                    <div style={{ flex: 1, overflowY: 'auto', padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {units.map(unit => (
                            <button 
                                key={unit.id} 
                                onClick={() => setActiveUnitId(unit.id)}
                                style={{ width: '100%', textAlign: 'right', padding: '15px', borderRadius: '10px', border: activeUnitId === unit.id ? '1px solid var(--p-purple)' : '1px solid rgba(255,255,255,0.05)', background: activeUnitId === unit.id ? 'rgba(108,92,231,0.1)' : 'rgba(0,0,0,0.2)', color: activeUnitId === unit.id ? 'white' : 'var(--txt-mut)', cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: activeUnitId === unit.id ? 'bold' : 'normal' }}
                            >
                                <FaFolder color={activeUnitId === unit.id ? 'var(--p-purple)' : 'var(--txt-mut)'} />
                                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{unit.title}</span>
                                <span style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>{unit.questions.length}</span>
                            </button>
                        ))}
                    </div>

                    {/* 🚀 زرار فتح مودال إضافة الباب */}
                    <div style={{ padding: '15px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <button onClick={() => setIsUnitModalOpen(true)} style={{ width: '100%', background: 'transparent', border: '2px dashed rgba(155, 89, 182, 0.5)', color: '#9b59b6', padding: '12px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 'bold', transition: '0.2s' }}>
                            <FaFolderPlus size={16}/> إضافة باب/وحدة جديدة
                        </button>
                    </div>
                </div>

                {/* 🚀 منطقة عرض الأسئلة */}
                <div style={{ flex: 1, background: 'rgba(0,0,0,0.2)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {activeUnit ? (
                        <>
                            <div style={{ padding: '20px 25px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'var(--card)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h2 style={{ margin: '0 0 5px 0', color: 'white', fontSize: '1.3rem' }}>{activeUnit.title}</h2>
                                    <span style={{ color: 'var(--txt-mut)', fontSize: '0.9rem' }}>إجمالي الأسئلة: {activeUnit.questions.length} سؤال</span>
                                </div>
                                <button onClick={() => { setEditingQuestion(null); setIsQuestionModalOpen(true); }} style={{ background: 'var(--p-purple)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 5px 15px rgba(108,92,231,0.3)' }}>
                                    <FaPlus /> إضافة سؤال
                                </button>
                            </div>

                            <div style={{ flex: 1, overflowY: 'auto', padding: '25px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {activeUnit.questions.length === 0 ? (
                                    <div style={{ textAlign: 'center', color: 'var(--txt-mut)', padding: '50px', background: 'rgba(255,255,255,0.02)', borderRadius: '15px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                        <FaPenNib size={40} style={{ opacity: 0.5, marginBottom: '15px' }} />
                                        <p>لا توجد أسئلة في هذه الوحدة حتى الآن. ابدأ بإضافة سؤالك الأول!</p>
                                    </div>
                                ) : (
                                    activeUnit.questions.map((q: any, idx) => (
                                        <div key={q.id} style={{ background: 'var(--card)', padding: '25px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                                                <div style={{ color: 'white', fontSize: '1.1rem', fontWeight: 'bold', lineHeight: '1.6', paddingLeft: '50px' }}>
                                                    <span style={{ color: 'var(--p-purple)', marginRight: '8px' }}>{idx + 1}.</span> {q.text}
                                                    
                                                    {/* 🚀 لو السؤال فيه صورة هتتعرض هنا للمدرس */}
                                                    {q.imageUrl && (
                                                        <div style={{ marginTop: '10px' }}>
                                                            <img src={q.imageUrl} alt="صورة السؤال" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '10px', objectFit: 'contain', border: '1px solid rgba(255,255,255,0.1)' }} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <button onClick={() => { setEditingQuestion(q); setIsQuestionModalOpen(true); }} style={{ background: 'rgba(52, 152, 219, 0.1)', color: '#3498db', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }} title="تعديل"><FaEdit /></button>
                                                    <button onClick={() => handleDeleteQuestion(q.id)} style={{ background: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }} title="حذف"><FaTrash /></button>
                                                </div>
                                            </div>

                                            {q.type === 'mcq' && q.options && (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                                                    {q.options.map((opt: any) => (
                                                        <div key={opt.id} style={{ background: q.correctOptionId === opt.id ? 'rgba(46, 204, 113, 0.1)' : 'rgba(0,0,0,0.2)', border: q.correctOptionId === opt.id ? '1px solid rgba(46, 204, 113, 0.3)' : '1px solid rgba(255,255,255,0.05)', color: q.correctOptionId === opt.id ? '#2ecc71' : 'var(--txt-mut)', padding: '12px 15px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                            {q.correctOptionId === opt.id ? <FaCheckCircle /> : <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '2px solid var(--txt-mut)' }}/>}
                                                            {opt.text}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {q.type === 'essay' && (
                                                <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(230, 126, 34, 0.1)', border: '1px dashed #e67e22', color: '#e67e22', borderRadius: '10px', fontSize: '0.9rem' }}>
                                                    ✍️ سؤال مقالي (يتم تصحيحه يدوياً أو بواسطة نموذج الذكاء الاصطناعي)
                                                </div>
                                            )}

                                            {q.explanation && (
                                                <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.02)', borderLeft: '3px solid #3498db', borderRadius: '0 8px 8px 0', color: 'var(--txt-mut)', fontSize: '0.9rem' }}>
                                                    <strong>💡 التفسير:</strong> {q.explanation}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    ) : (
                        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--txt-mut)' }}>
                            يرجى إنشاء واختيار وحدة من القائمة لعرض أسئلتها.
                        </div>
                    )}
                </div>
            </div>

            <QuestionModal isOpen={isQuestionModalOpen} onClose={() => setIsQuestionModalOpen(false)} initialData={editingQuestion} onSave={handleSaveQuestion} />

            {/* 🚀 مودال إضافة الباب الشيك */}
            {isUnitModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', zIndex: 99999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
                    <div style={{ background: '#1a1a2e', width: '100%', maxWidth: '400px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)', padding: '25px', animation: 'fadeIn 0.2s ease' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}><FaFolderPlus color="#9b59b6"/> إضافة باب جديد</h3>
                            <button onClick={() => setIsUnitModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--txt-mut)', cursor: 'pointer', fontSize: '1.2rem' }}><FaTimes /></button>
                        </div>
                        <input type="text" placeholder="مثال: الباب الثالث: الحث الكهرومغناطيسي" autoFocus value={newUnitTitle} onChange={e => setNewUnitTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddUnitConfirm()} style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none', marginBottom: '20px' }} />
                        <button onClick={handleAddUnitConfirm} style={{ width: '100%', background: '#9b59b6', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>إنشاء وحفظ</button>
                    </div>
                </div>
            )}

        </div>
    );
}