"use client";
import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowRight, FaFolderPlus, FaFolder, FaPlus, FaEdit, FaTrash, FaCheckCircle, FaPenNib, FaTimes, FaSpinner, FaCog } from 'react-icons/fa';
import { QuestionModal } from '@/app/teacher/question-banks/components/QuestionModal';
import { QuestionBankModal } from '@/app/teacher/question-banks/components/QuestionBankModal'; 
import { fetchAPI } from '@/lib/api/client';
import { useToast } from '@/context/ToastContext';

export default function BankContentPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const { showToast } = useToast();
    
    const [bankDetails, setBankDetails] = useState<any>(null);
    const [units, setUnits] = useState<any[]>([]);
    const [activeUnitId, setActiveUnitId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<any | null>(null);

    const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
    const [newUnitTitle, setNewUnitTitle] = useState('');

    const [isEditBankModalOpen, setIsEditBankModalOpen] = useState(false);

    const loadBankDetails = async () => {
        try {
            setIsLoading(true);
            const data = await fetchAPI<any>(`/QuestionBanks/${resolvedParams.id}`);
            if (data) {
                setBankDetails(data);
                setUnits(data.units || data.Units || []);
                if ((data.units?.length > 0 || data.Units?.length > 0) && !activeUnitId) {
                    setActiveUnitId(data.units?.[0]?.id || data.Units?.[0]?.id);
                }
            }
        } catch (error) {
            showToast('حدث خطأ أثناء تحميل تفاصيل البنك', 'error');
            router.push('/teacher/question-banks');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { loadBankDetails(); }, [resolvedParams.id]);

    const activeUnit = units.find(u => u.id === activeUnitId || u.Id === activeUnitId);

    const handleUpdateBank = async (data: { title: string; subject: string; stage: string; image: string }) => {
        try {
            await fetchAPI(`/QuestionBanks/${resolvedParams.id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
            showToast('تم حفظ التعديلات بنجاح! 💾', 'success');
            await loadBankDetails(); 
            setIsEditBankModalOpen(false);
        } catch (error) {
            showToast('حدث خطأ أثناء تعديل بيانات البنك', 'error');
        }
    };

    const handleAddUnitConfirm = async () => {
        if (newUnitTitle.trim() !== '') {
            try {
                await fetchAPI(`/QuestionBanks/${resolvedParams.id}/units`, {
                    method: 'POST',
                    body: JSON.stringify(newUnitTitle)
                });
                setNewUnitTitle('');
                setIsUnitModalOpen(false);
                await loadBankDetails(); 
            } catch (error) {
                showToast('حدث خطأ أثناء إضافة الباب', 'error');
            }
        } else {
            showToast('يرجى إدخال اسم الباب/الوحدة', 'error');
        }
    };

    const handleSaveQuestion = async (q: any) => {
        if (!activeUnitId) return;
        try {
            await fetchAPI(`/QuestionBanks/units/${activeUnitId}/questions`, {
                method: 'POST',
                body: JSON.stringify(q)
            });
            showToast('تم حفظ السؤال بنجاح', 'success');
            await loadBankDetails(); 
        } catch (error) {
            showToast('حدث خطأ أثناء حفظ السؤال', 'error');
        }
    };

    const handleDeleteQuestion = async (qId: string) => {
        if(confirm('هل أنت متأكد من حذف هذا السؤال؟')) {
            try {
                await fetchAPI(`/QuestionBanks/questions/${qId}`, { method: 'DELETE' });
                showToast('تم حذف السؤال', 'success');
                await loadBankDetails();
            } catch (error) {
                showToast('حدث خطأ أثناء الحذف', 'error');
            }
        }
    };

    if (isLoading) {
        return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><FaSpinner className="fa-spin" size={40} color="var(--p-purple)" /></div>;
    }

    return (
        <div style={{ animation: 'fadeIn 0.4s ease', maxWidth: '1400px', margin: '0 auto', paddingBottom: '50px', height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', marginTop: '20px', flexShrink: 0 }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <button onClick={() => router.push('/teacher/question-banks')} style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--txt)', width: '45px', height: '45px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FaArrowRight />
                    </button>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', margin: '0 0 5px 0', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {bankDetails?.title || bankDetails?.Title || 'جاري التحميل...'}
                            <button onClick={() => setIsEditBankModalOpen(true)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'var(--txt-mut)', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }} title="إعدادات البنك" onMouseOver={e => e.currentTarget.style.color='var(--p-purple)'} onMouseOut={e => e.currentTarget.style.color='var(--txt-mut)'}>
                                <FaCog />
                            </button>
                        </h1>
                        <div style={{ color: 'var(--txt-mut)', fontSize: '0.9rem' }}>
                            المرحلة: <span style={{color: 'var(--p-purple)', fontWeight: 'bold'}}>{bankDetails?.stage || bankDetails?.Stage || 'غير محدد'}</span> | 
                            المادة: <span style={{color: '#3498db', fontWeight: 'bold', marginRight: '5px'}}>{bankDetails?.subject || bankDetails?.Subject || 'غير محدد'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', flex: 1, overflow: 'hidden' }}>
                <div style={{ width: '300px', background: 'var(--card)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ color: 'white', fontSize: '1.1rem' }}>الأبواب والوحدات</strong>
                    </div>
                    
                    <div style={{ flex: 1, overflowY: 'auto', padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {units.map((unit: any) => (
                            <button 
                                key={unit.id || unit.Id} 
                                onClick={() => setActiveUnitId(unit.id || unit.Id)}
                                style={{ width: '100%', textAlign: 'right', padding: '15px', borderRadius: '10px', border: activeUnitId === (unit.id || unit.Id) ? '1px solid var(--p-purple)' : '1px solid rgba(255,255,255,0.05)', background: activeUnitId === (unit.id || unit.Id) ? 'rgba(108,92,231,0.1)' : 'rgba(0,0,0,0.2)', color: activeUnitId === (unit.id || unit.Id) ? 'white' : 'var(--txt-mut)', cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: activeUnitId === (unit.id || unit.Id) ? 'bold' : 'normal' }}
                            >
                                <FaFolder color={activeUnitId === (unit.id || unit.Id) ? 'var(--p-purple)' : 'var(--txt-mut)'} />
                                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{unit.title || unit.Title}</span>
                                <span style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>{(unit.questions || unit.Questions || []).length}</span>
                            </button>
                        ))}
                    </div>

                    <div style={{ padding: '15px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <button onClick={() => setIsUnitModalOpen(true)} style={{ width: '100%', background: 'transparent', border: '2px dashed rgba(155, 89, 182, 0.5)', color: '#9b59b6', padding: '12px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 'bold', transition: '0.2s' }}>
                            <FaFolderPlus size={16}/> إضافة باب/وحدة جديدة
                        </button>
                    </div>
                </div>

                <div style={{ flex: 1, background: 'rgba(0,0,0,0.2)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {activeUnit ? (
                        <>
                            <div style={{ padding: '20px 25px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'var(--card)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h2 style={{ margin: '0 0 5px 0', color: 'white', fontSize: '1.3rem' }}>{activeUnit.title || activeUnit.Title}</h2>
                                    <span style={{ color: 'var(--txt-mut)', fontSize: '0.9rem' }}>إجمالي الأسئلة: {(activeUnit.questions || activeUnit.Questions || []).length} سؤال</span>
                                </div>
                                <button onClick={() => { setEditingQuestion(null); setIsQuestionModalOpen(true); }} style={{ background: 'var(--p-purple)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 5px 15px rgba(108,92,231,0.3)' }}>
                                    <FaPlus /> إضافة سؤال
                                </button>
                            </div>

                            <div style={{ flex: 1, overflowY: 'auto', padding: '25px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {!(activeUnit.questions || activeUnit.Questions) || (activeUnit.questions || activeUnit.Questions).length === 0 ? (
                                    <div style={{ textAlign: 'center', color: 'var(--txt-mut)', padding: '50px', background: 'rgba(255,255,255,0.02)', borderRadius: '15px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                        <FaPenNib size={40} style={{ opacity: 0.5, marginBottom: '15px' }} />
                                        <p>لا توجد أسئلة في هذه الوحدة حتى الآن. ابدأ بإضافة سؤالك الأول!</p>
                                    </div>
                                ) : (
                                    (activeUnit.questions || activeUnit.Questions).map((q: any, idx: number) => (
                                        <div key={q.id || q.Id} style={{ background: 'var(--card)', padding: '25px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                                                <div style={{ color: 'white', fontSize: '1.1rem', fontWeight: 'bold', lineHeight: '1.6', paddingLeft: '50px' }}>
                                                    <span style={{ color: 'var(--p-purple)', marginRight: '8px' }}>{idx + 1}.</span> {q.text || q.Text}
                                                    
                                                    {q.imageUrl && (
                                                        <div style={{ marginTop: '10px' }}>
                                                            <img src={q.imageUrl} alt="صورة السؤال" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '10px', objectFit: 'contain', border: '1px solid rgba(255,255,255,0.1)' }} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <button onClick={() => { setEditingQuestion(q); setIsQuestionModalOpen(true); }} style={{ background: 'rgba(52, 152, 219, 0.1)', color: '#3498db', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }} title="تعديل"><FaEdit /></button>
                                                    <button onClick={() => handleDeleteQuestion(q.id || q.Id)} style={{ background: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }} title="حذف"><FaTrash /></button>
                                                </div>
                                            </div>

                                            {q.type === 'mcq' && (q.options || q.Options) && (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                                                    {(q.options || q.Options).map((opt: any) => (
                                                        <div key={opt.id || opt.Id} style={{ background: (q.correctOptionId || q.CorrectOptionId) === (opt.id || opt.Id) ? 'rgba(46, 204, 113, 0.1)' : 'rgba(0,0,0,0.2)', border: (q.correctOptionId || q.CorrectOptionId) === (opt.id || opt.Id) ? '1px solid rgba(46, 204, 113, 0.3)' : '1px solid rgba(255,255,255,0.05)', color: (q.correctOptionId || q.CorrectOptionId) === (opt.id || opt.Id) ? '#2ecc71' : 'var(--txt-mut)', padding: '12px 15px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                            {(q.correctOptionId || q.CorrectOptionId) === (opt.id || opt.Id) ? <FaCheckCircle /> : <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '2px solid var(--txt-mut)' }}/>}
                                                            {opt.text || opt.Text}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {q.type === 'essay' && (
                                                <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(230, 126, 34, 0.1)', border: '1px dashed #e67e22', color: '#e67e22', borderRadius: '10px', fontSize: '0.9rem' }}>
                                                    ✍️ سؤال مقالي (يتم تصحيحه يدوياً أو بواسطة نموذج الذكاء الاصطناعي)
                                                </div>
                                            )}

                                            {(q.explanation || q.Explanation) && (
                                                <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.02)', borderLeft: '3px solid #3498db', borderRadius: '0 8px 8px 0', color: 'var(--txt-mut)', fontSize: '0.9rem' }}>
                                                    <strong>💡 التفسير:</strong> {q.explanation || q.Explanation}
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
            
            <QuestionBankModal isOpen={isEditBankModalOpen} onClose={() => setIsEditBankModalOpen(false)} onSave={handleUpdateBank} initialData={bankDetails} />

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