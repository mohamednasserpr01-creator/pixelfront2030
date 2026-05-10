"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaDatabase, FaPlus, FaSearch, FaTrash, FaFolderOpen } from 'react-icons/fa';
import { QuestionBankModal } from './components/QuestionBankModal';

export default function QuestionBanksPage() {
    const [isMounted, setIsMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [banks, setBanks] = useState([
        { id: '1', title: 'بنك أسئلة الفيزياء الشامل', subject: 'فيزياء', stage: 'الصف الثالث الثانوي', questionsCount: 485, createdAt: '2023-09-01' },
        { id: '2', title: 'تدريبات الباب الأول والثاني', subject: 'فيزياء', stage: 'الصف الثالث الثانوي', questionsCount: 120, createdAt: '2023-10-15' },
    ]);

    useEffect(() => { setIsMounted(true); }, []);
    if (!isMounted) return null;

    const filteredBanks = banks.filter(b => b.title.includes(searchQuery) || b.subject.includes(searchQuery));

    return (
        <div style={{ animation: 'fadeIn 0.4s ease', maxWidth: '1200px', margin: '0 auto', paddingBottom: '50px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', marginTop: '20px', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', margin: '0 0 5px 0', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaDatabase color="var(--p-purple)" /> بنوك الأسئلة
                    </h1>
                    <p style={{ color: 'var(--txt-mut)', margin: 0 }}>مستودعك المركزي لإنشاء وإدارة وتصنيف جميع الأسئلة</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} style={{ background: 'var(--p-purple)', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', transition: '0.2s', boxShadow: '0 5px 15px rgba(108,92,231,0.3)' }} className="btn-hover">
                    <FaPlus /> إنشاء بنك جديد
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div style={{ background: 'var(--card)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(52, 152, 219, 0.1)', color: '#3498db', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem' }}><FaFolderOpen /></div>
                    <div><div style={{ color: 'var(--txt-mut)', fontSize: '0.9rem' }}>إجمالي البنوك</div><div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>{banks.length}</div></div>
                </div>
                <div style={{ background: 'var(--card)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem' }}><FaDatabase /></div>
                    <div><div style={{ color: 'var(--txt-mut)', fontSize: '0.9rem' }}>إجمالي الأسئلة</div><div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>{banks.reduce((acc, curr) => acc + curr.questionsCount, 0)}</div></div>
                </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '20px', display: 'flex', gap: '15px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <FaSearch style={{ position: 'absolute', right: '15px', top: '14px', color: 'var(--txt-mut)' }} />
                    <input type="text" placeholder="ابحث باسم البنك أو المادة..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ width: '100%', padding: '12px 40px 12px 15px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }} />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {filteredBanks.map(bank => (
                    <div key={bank.id} style={{ background: 'var(--card)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', padding: '20px', transition: '0.3s' }} className="hover-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                            <h3 style={{ margin: 0, color: 'white', fontSize: '1.2rem', lineHeight: '1.4' }}>{bank.title}</h3>
                            <span style={{ background: 'rgba(155, 89, 182, 0.1)', color: '#9b59b6', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}>{bank.subject}</span>
                        </div>
                        <div style={{ color: 'var(--txt-mut)', fontSize: '0.9rem', marginBottom: '8px' }}>المرحلة: <strong style={{ color: 'var(--txt)' }}>{bank.stage}</strong></div>
                        <div style={{ color: 'var(--txt-mut)', fontSize: '0.9rem', marginBottom: '20px' }}>عدد الأسئلة: <strong style={{ color: '#3498db' }}>{bank.questionsCount} سؤال</strong></div>
                        
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <Link href={`/teacher/question-banks/${bank.id}`} style={{ flex: 1, textDecoration: 'none' }}>
                                <button style={{ width: '100%', background: 'rgba(52, 152, 219, 0.1)', color: '#3498db', border: '1px solid #3498db', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}>إدارة البنك وإضافة أسئلة</button>
                            </Link>
                            <button onClick={() => {
                                if(confirm('هل أنت متأكد من حذف هذا البنك بالكامل؟')) setBanks(banks.filter(b => b.id !== bank.id));
                            }} style={{ background: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c', border: '1px solid transparent', width: '40px', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: '0.2s' }} title="حذف البنك">
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* 🚀 تصليح الـ Type الخاص بـ data */}
            <QuestionBankModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={(data: { title: string; subject: string; stage: string }) => {
                setBanks([{ id: Date.now().toString(), ...data, questionsCount: 0, createdAt: new Date().toISOString().split('T')[0] }, ...banks]);
                setIsModalOpen(false);
            }} />
        </div>
    );
}