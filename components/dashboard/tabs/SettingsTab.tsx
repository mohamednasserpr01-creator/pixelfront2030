// FILE: components/dashboard/tabs/SettingsTab.tsx
"use client";
import React, { useState } from 'react';
import { FaCog, FaSave, FaShieldAlt, FaMobileAlt, FaDesktop, FaUser, FaPhoneAlt, FaEnvelope, FaSignOutAlt, FaLock, FaBell } from 'react-icons/fa';

import { useAuth } from '../../../context/AuthContext';
import { dashboardData } from '../../../data/mock/dashboardData';
import { useSettings } from '../../../context/SettingsContext';

// 💡 استدعاء الـ UI System الخارق بتاعنا
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { useToast } from '../../../context/ToastContext';

export default function SettingsTab() {
    const { user } = useAuth(); 
    const { lang } = useSettings(); 
    const { showToast } = useToast(); 
    
    const isAr = lang === 'ar';

    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async (e?: React.FormEvent) => {
        if(e) e.preventDefault();
        setIsSaving(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            showToast(isAr ? 'تم حفظ بياناتك بنجاح! ✅' : 'Your data has been saved successfully! ✅', 'success');
        } catch (error) {
            showToast(isAr ? 'حدث خطأ أثناء الحفظ' : 'Error saving data', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="tab-pane active fade-in">
            <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaCog /> {isAr ? 'إعدادات الحساب والأمان' : 'Account & Security Settings'}
            </h2>
            
            <div className="settings-card">
                <h3 style={{ marginBottom: '25px', color: 'var(--txt)' }}>
                    {isAr ? 'البيانات الشخصية' : 'Personal Information'}
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                    <Input 
                        label={isAr ? 'الاسم الرباعي' : 'Full Name'}
                        defaultValue={user?.name || ""}
                        icon={<FaUser />}
                        inputSize="md"
                    />
                    
                    <Input 
                        label={isAr ? 'رقم الهاتف' : 'Phone Number'}
                        defaultValue={user?.phone || ""}
                        readOnly
                        disabled 
                        icon={<FaPhoneAlt />}
                        inputSize="md"
                        message={isAr ? 'لا يمكن تعديل رقم الهاتف المرتبط بالحساب' : 'Phone number linked to account cannot be changed'}
                    />
                    
                    <Input 
                        label={isAr ? 'البريد الإلكتروني' : 'Email Address'}
                        type="email"
                        placeholder="example@gmail.com"
                        icon={<FaEnvelope />}
                        inputSize="md"
                    />
                </div>
                
                <div style={{ marginTop: '30px', maxWidth: '250px' }}>
                    <Button 
                        fullWidth 
                        size="md" 
                        icon={!isSaving && <FaSave />} 
                        onClick={handleSave}
                        isLoading={isSaving}
                    >
                        {isAr ? 'حفظ البيانات' : 'Save Changes'}
                    </Button>
                </div>
            </div>

            <div className="settings-card">
                <h3 style={{ marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                    <FaLock style={{ color: 'var(--p-purple)' }} /> {isAr ? 'تغيير كلمة المرور' : 'Change Password'}
                </h3>
                <form onSubmit={handleSave}>
                    <div className="form-grid">
                        <div className="input-group">
                            <label>{isAr ? 'كلمة المرور الحالية' : 'Current Password'}</label>
                            <input type="password" placeholder="••••••••" required />
                        </div>
                        <div className="input-group">
                            <label>{isAr ? 'كلمة المرور الجديدة' : 'New Password'}</label>
                            <input type="password" placeholder="••••••••" required />
                        </div>
                    </div>
                    <button type="submit" className="btn-save">{isAr ? 'حفظ التعديلات' : 'Save Changes'}</button>
                </form>
            </div>

            <div className="settings-card">
                <h3 style={{ marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                    <FaBell style={{ color: 'var(--warning)' }} /> {isAr ? 'تفضيلات الإشعارات' : 'Notification Preferences'}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                        <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px' }} />
                        <span>{isAr ? 'إشعارات نزول حصص جديدة' : 'New Lectures Notifications'}</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                        <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px' }} />
                        <span>{isAr ? 'تذكير بمواعيد الواجبات والامتحانات' : 'Homework & Exams Reminders'}</span>
                    </label>
                </div>
            </div>
        </div>
    );
}