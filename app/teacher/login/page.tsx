"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaChalkboardTeacher, FaSignInAlt, FaInfoCircle } from 'react-icons/fa';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/context/ToastContext';

const API_BASE_URL = 'http://localhost:5000/api';

export default function TeacherLogin() {
    const router = useRouter();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    
    // 🚀 حالة جديدة عشان زرار تذكرني
    const [rememberMe, setRememberMe] = useState(false); 
    
    const [formData, setFormData] = useState({
        identifier: '', 
        password: ''
    });

    // 🚀 أول ما الصفحة تفتح، ندور هل هو كان دايس حفظ قبل كده ولا لأ
    useEffect(() => {
        const savedPhone = localStorage.getItem('rememberedTeacherPhone');
        if (savedPhone) {
            setFormData(prev => ({ ...prev, identifier: savedPhone }));
            setRememberMe(true);
        }
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.identifier || !formData.password) {
            showToast('يرجى إدخال بيانات الدخول كاملة', 'error');
            return;
        }

        setIsLoading(true);
        try {
            const payload = {
                phoneNumber: formData.identifier, 
                password: formData.password
            };

            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json().catch(() => null);
            const token = data?.accessToken || data?.AccessToken || data?.token || data?.data?.accessToken;

            if (response.ok && token) {
                localStorage.setItem('accessToken', token);
                
                const user = data?.user || data?.User || data?.data?.user;
                if (user) {
                    localStorage.setItem('userData', JSON.stringify(user));
                }

                // 🚀 لو دايس حفظ، نحفظ الرقم.. لو مش دايس، نمسحه
                if (rememberMe) {
                    localStorage.setItem('rememberedTeacherPhone', formData.identifier);
                } else {
                    localStorage.removeItem('rememberedTeacherPhone');
                }

                showToast('تم تسجيل الدخول بنجاح! جاري تحويلك... 🚀', 'success');
                setTimeout(() => {
                    // 🚀 توجيه المدرس لصفحة الداشبورد الرئيسية الخاصة به
                    router.push('/teacher/dashboard'); 
                }, 1000);
            } else {
                const errorMessage = data?.message || data?.title || 'بيانات الدخول غير صحيحة، أو ليس لديك صلاحية.';
                showToast(`خطأ: ${errorMessage}`, 'error');
            }
        } catch (error) {
            showToast('خطأ في الاتصال بالخادم. تأكد من تشغيل الباك إند.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '20px' }}>
            <div style={{ width: '100%', maxWidth: '450px', background: 'var(--card)', padding: '40px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', animation: 'fadeIn 0.5s ease', textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', background: 'rgba(108, 92, 231, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', border: '1px solid var(--p-purple)' }}>
                    <FaChalkboardTeacher style={{ fontSize: '2.5rem', color: 'var(--p-purple)' }} />
                </div>
                <h1 style={{ color: 'var(--txt)', fontSize: '1.8rem', fontWeight: 900, marginBottom: '10px' }}>بوابة المعلمين</h1>
                <p style={{ color: 'var(--txt-mut)', marginBottom: '30px', fontSize: '0.95rem' }}>سجل دخولك لإدارة كورساتك وطلابك</p>

                {/* 🚀 ضفنا autoComplete="off" هنا */}
                <form onSubmit={handleLogin} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'right' }}>
                    <div>
                        <Input 
                            label="رقم الهاتف" 
                            type="tel" 
                            placeholder="مثال: 01029546964" 
                            value={formData.identifier} 
                            onChange={(e) => setFormData({...formData, identifier: e.target.value})} 
                            autoComplete="new-password" /* 🚀 دي الخدعة اللي بتخرس المتصفح */
                        />
                    </div>
                    <div>
                        <Input 
                            label="كلمة المرور" 
                            type="password" 
                            placeholder="••••••••" 
                            value={formData.password} 
                            onChange={(e) => setFormData({...formData, password: e.target.value})} 
                            autoComplete="new-password" /* 🚀 دي الخدعة اللي بتخرس المتصفح */
                        />
                    </div>

                    {/* 🚀 زرار حفظ البيانات (تذكرني) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '-5px' }}>
                        <input
                            type="checkbox"
                            id="rememberMe"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--p-purple)' }}
                        />
                        <label htmlFor="rememberMe" style={{ color: 'var(--txt)', fontSize: '0.95rem', cursor: 'pointer', userSelect: 'none', fontWeight: 'bold' }}>
                            تذكر رقم الهاتف
                        </label>
                    </div>

                    <Button variant="primary" fullWidth icon={<FaSignInAlt />} disabled={isLoading} style={{ padding: '15px', fontSize: '1.1rem', marginTop: '10px' }}>
                        {isLoading ? 'جاري التحقق...' : 'دخول للمنصة'}
                    </Button>
                </form>

                <div style={{ marginTop: '30px', padding: '15px', background: 'rgba(241, 196, 15, 0.05)', border: '1px dashed rgba(241, 196, 15, 0.3)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', color: '#f1c40f', textAlign: 'right' }}>
                    <FaInfoCircle size={24} style={{ flexShrink: 0 }} />
                    <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: '1.5' }}>غير مسموح بإنشاء حسابات جديدة من هنا. إذا كنت معلماً جديداً، يرجى التواصل مع الإدارة للحصول على بيانات الدخول.</p>
                </div>
            </div>
        </div>
    );
}