"use client";
import React from 'react';
import { FaUsers, FaCheckCircle, FaBan, FaSearch } from 'react-icons/fa';

interface Props {
    studentsCount: number;
    activeCount: number;
    bannedCount: number;
    selectedStatus: string;
    onStatusChange: (status: any) => void;
    searchQuery: string;
    onSearchChange: (val: string) => void;
    selectedGrade: string;
    onGradeChange: (val: string) => void;
}

export const StudentsFilters = React.memo(({ 
    studentsCount, activeCount, bannedCount, 
    selectedStatus, onStatusChange, 
    searchQuery, onSearchChange, 
    selectedGrade, onGradeChange 
}: Props) => {
    return (
        <>
            {/* 🚀 إحصائيات سريعة نظيفة تتأقلم مع السيم */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px' }}>
                <div onClick={() => onStatusChange('all')} style={{ background: 'var(--card)', padding: '20px', borderRadius: '15px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', transition: '0.3s' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(108,92,231,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--p-purple)', fontSize: '1.5rem' }}><FaUsers /></div>
                    <div>
                        <div style={{ color: 'var(--txt-mut)', fontSize: '0.9rem', fontWeight: 'bold' }}>إجمالي الطلاب</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--txt)' }}>{studentsCount}</div>
                    </div>
                </div>
                <div onClick={() => onStatusChange('active')} style={{ background: 'var(--card)', padding: '20px', borderRadius: '15px', border: selectedStatus === 'active' ? '1px solid var(--success)' : '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', transition: '0.3s' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(46, 204, 113, 0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--success)', fontSize: '1.5rem' }}><FaCheckCircle /></div>
                    <div>
                        <div style={{ color: 'var(--txt-mut)', fontSize: '0.9rem', fontWeight: 'bold' }}>حسابات نشطة</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--txt)' }}>{activeCount}</div>
                    </div>
                </div>
                <div onClick={() => onStatusChange('banned')} style={{ background: 'var(--card)', padding: '20px', borderRadius: '15px', border: selectedStatus === 'banned' ? '1px solid var(--danger)' : '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', transition: '0.3s' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(231, 76, 60, 0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--danger)', fontSize: '1.5rem' }}><FaBan /></div>
                    <div>
                        <div style={{ color: 'var(--txt-mut)', fontSize: '0.9rem', fontWeight: 'bold' }}>حسابات محظورة</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--danger)' }}>{bannedCount}</div>
                    </div>
                </div>
            </div>

            {/* 🚀 فلاتر البحث النظيفة */}
            <div style={{ background: 'var(--card)', padding: '20px', borderRadius: '20px', border: '1px solid var(--border-color)', marginBottom: '20px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 300px', position: 'relative' }}>
                    <FaSearch style={{ position: 'absolute', right: '15px', top: '15px', color: 'var(--p-purple)' }} />
                    <input type="text" placeholder="بحث باسم، تليفون، كود..." value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border-color)', padding: '12px 40px 12px 15px', borderRadius: '10px', color: 'var(--txt)', outline: 'none' }} />
                </div>
                <select value={selectedGrade} onChange={(e) => onGradeChange(e.target.value)} style={{ flex: '1 1 200px', background: 'var(--bg)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '10px', color: 'var(--txt)', outline: 'none' }}>
                    <option value="all">كل المراحل الدراسية</option>
                    <option value="الصف الأول الثانوي">الصف الأول الثانوي</option>
                    <option value="الصف الثاني الثانوي">الصف الثاني الثانوي</option>
                    <option value="الصف الثالث الثانوي">الصف الثالث الثانوي</option>
                </select>
                <select value={selectedStatus} onChange={(e) => onStatusChange(e.target.value)} style={{ flex: '1 1 200px', background: 'var(--bg)', border: selectedStatus === 'banned' ? '1px solid var(--danger)' : '1px solid var(--border-color)', padding: '12px', borderRadius: '10px', color: selectedStatus === 'banned' ? 'var(--danger)' : 'var(--txt)', outline: 'none', fontWeight: 'bold' }}>
                    <option value="all">كل الحالات</option>
                    <option value="active">حسابات نشطة ✅</option>
                    <option value="banned">حسابات محظورة 🚫</option>
                </select>
            </div>
        </>
    );
});