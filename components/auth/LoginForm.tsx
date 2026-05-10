// FILE: components/auth/LoginForm.tsx
"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSignInAlt, FaWhatsapp, FaPhoneAlt, FaLock } from 'react-icons/fa';
import { useRouter } from 'next/navigation'; // 💡 استدعاء التوجيه

import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { useToast } from '../../context/ToastContext'; 

import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface Props {
    onSwitchView: () => void;
}

export default function LoginForm({ onSwitchView }: Props) {
    const [loginData, setLoginData] = useState({ phone: '', pass: '' });
    const [isLoading, setIsLoading] = useState(false); 

    const { login } = useAuth();
    const { lang } = useSettings();
    const { showToast } = useToast(); 
    const router = useRouter(); // 💡 تعريف التوجيه

    const handleLogin = async () => {
        const isAr = lang === 'ar';
        
        if (!loginData.phone || !loginData.pass) {
            return showToast(isAr ? "يرجى إدخال رقم الهاتف وكلمة المرور." : "Please enter phone number and password.", "error");
        }
        
        if (loginData.phone.length < 11) {
            return showToast(isAr ? "رقم الهاتف غير صحيح، يجب أن يتكون من 11 رقم." : "Invalid phone number, must be 11 digits.", "error");
        }

        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            
            await login(loginData.phone, loginData.pass);
            showToast(isAr ? "تم تسجيل الدخول بنجاح!" : "Logged in successfully!", "success");
            
            // 💡 التوجيه لصفحة الداش بورد بعد النجاح
            router.push('/dashboard');
        } catch (error: any) {
            showToast(error.message || (isAr ? "حدث خطأ أثناء تسجيل الدخول." : "An error occurred during login."), "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div key="login" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            
            <h2 style={{ marginBottom: '25px', fontWeight: 900, color: 'var(--txt)', textAlign: 'center' }}>
                {lang === 'ar' ? 'تسجيل الدخول' : 'Login'}
            </h2>
            
            {/* 💡 ضفنا form टैग عشان نقفل الـ Autocomplete بشكل قاطع */}
            <form autoComplete="off" onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                <Input 
                    type="tel" 
                    name="phone-pixel" // 💡 تغيير الاسم بيخدع المتصفح
                    autoComplete="off" // 💡 منع الاقتراحات
                    placeholder={lang === 'ar' ? "رقم الهاتف" : "Phone Number"} 
                    value={loginData.phone} 
                    onChange={e => setLoginData({...loginData, phone: e.target.value})} 
                    icon={<FaPhoneAlt />}
                    inputSize="lg"
                />
                
                <Input 
                    type="password" 
                    name="pass-pixel"
                    autoComplete="new-password" // 💡 التريكة السحرية لمنع باسوردات المتصفح القديمة
                    placeholder={lang === 'ar' ? "كلمة المرور" : "Password"} 
                    value={loginData.pass} 
                    onChange={e => setLoginData({...loginData, pass: e.target.value})} 
                    icon={<FaLock />}
                    inputSize="lg"
                />
            </form>

            <a href="https://wa.me/201221466441" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--success, #2ecc71)', marginTop: '15px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>
                {lang === 'ar' ? 'نسيت كلمة السر؟ تواصل معنا' : 'Forgot Password? Contact us'} <FaWhatsapp style={{ fontSize: '1.2rem' }} />
            </a>

            <div style={{ marginTop: '25px' }}>
                <Button 
                    fullWidth 
                    size="lg" 
                    onClick={handleLogin} 
                    isLoading={isLoading}
                    icon={!isLoading && <FaSignInAlt />}
                >
                    {lang === 'ar' ? 'دخول' : 'Login'}
                </Button>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '25px', color: 'var(--txt-mut)', fontSize: '0.95rem' }}>
                {lang === 'ar' ? 'طالب جديد؟' : 'New student?'} 
                <span onClick={onSwitchView} style={{ color: 'var(--p-purple)', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline', margin: '0 5px' }}>
                    {lang === 'ar' ? 'سجل الآن' : 'Register Now'}
                </span>
            </div>

        </motion.div>
    );
}