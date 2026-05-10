"use client";
import React, { useState, useEffect } from 'react';
import { FaSave } from 'react-icons/fa';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Modal } from '../../../../components/ui/Modal';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    student: any;
    onSave: (data: any) => void;
}

const customSelectStyle = {
    width: '100%', padding: '14px 16px', borderRadius: '12px', 
    border: '2px solid rgba(128,128,128,0.2)', background: 'var(--bg)', 
    color: 'var(--txt)', outline: 'none', fontSize: '1rem',
    fontWeight: 'bold', transition: '0.3s', appearance: 'none' as const, cursor: 'pointer'
};

export const EditStudentModal = ({ isOpen, onClose, student, onSave }: Props) => {
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        if (student) setFormData(student);
    }, [student, isOpen]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="تعديل بيانات الطالب" maxWidth="600px">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', padding: '10px 0' }}>
                <Input label="الاسم" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
                <Input label="المحافظة" value={formData.gov || ''} onChange={e => setFormData({...formData, gov: e.target.value})} />
                <Input label="تليفون الطالب" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} />
                <Input label="تليفون ولي الأمر" value={formData.parentPhone || ''} onChange={e => setFormData({...formData, parentPhone: e.target.value})} />
                <Input label="الباسورد" value={formData.password || ''} onChange={e => setFormData({...formData, password: e.target.value})} />
                
                <div className="pixel-input-wrapper">
                    <label className="pixel-input-label">المرحلة الدراسية</label>
                    <div className="pixel-input-inner">
                        <select value={formData.grade || ''} onChange={e => setFormData({...formData, grade: e.target.value})} style={customSelectStyle}>
                            <option value="الصف الأول الثانوي">الصف الأول الثانوي</option>
                            <option value="الصف الثاني الثانوي">الصف الثاني الثانوي</option>
                            <option value="الصف الثالث الثانوي">الصف الثالث الثانوي</option>
                        </select>
                    </div>
                </div>
                
                <div className="pixel-input-wrapper">
                    <label className="pixel-input-label">الشعبة (القسم)</label>
                    <div className="pixel-input-inner">
                        <select value={formData.major || ''} onChange={e => setFormData({...formData, major: e.target.value})} style={customSelectStyle}>
                            <option value="علمي علوم">علمي علوم</option>
                            <option value="علمي رياضة">علمي رياضة</option>
                            <option value="أدبي">أدبي</option>
                            <option value="عام (أولى وتانية)">عام (أولى وتانية)</option>
                        </select>
                    </div>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                    <Input label="العنوان التفصيلي" value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} />
                </div>
            </div>
            <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
                <Button variant="primary" fullWidth icon={<FaSave />} onClick={() => onSave(formData)}>حفظ التعديلات</Button>
                <Button variant="outline" fullWidth onClick={onClose}>إلغاء</Button>
            </div>
        </Modal>
    );
};