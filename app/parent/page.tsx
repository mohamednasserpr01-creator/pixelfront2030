"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useToast } from '../../context/ToastContext';
// 💡 ضفنا أيقونات العين هنا
import { FaUserShield, FaSignInAlt, FaGraduationCap, FaCircle, FaWhatsapp, FaChalkboardTeacher, FaCalendarCheck, FaStar, FaTasks, FaChartLine, FaClipboardCheck, FaClock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import styles from './ParentPage.module.css';

export default function ParentPage() {
    const { lang } = useSettings();
    const { showToast } = useToast();
    const isAr = lang === 'ar';

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const [activeTab, setActiveTab] = useState<'exams' | 'homework'>('exams');
    const [isLoading, setIsLoading] = useState(false);
    
    // 💡 حالات العين وحفظ البيانات
    const [showCode, setShowCode] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    // 💡 سحب بيانات ولي الأمر المحفوظة أول ما يفتح الصفحة
    useEffect(() => {
        const savedPhone = localStorage.getItem('pixel_parent_phone');
        const savedCode = localStorage.getItem('pixel_parent_code');
        if (savedPhone && savedCode) {
            setPhone(savedPhone);
            setCode(savedCode);
            setRememberMe(true);
        }
    }, []);

    // توليد داتا وهمية للكورسات
    const coursesData = useMemo(() => {
        const subjects = ["فيزياء", "كيمياء", "أحياء", "لغة عربية", "إنجليزي", "رياضيات"];
        return Array.from({ length: 50 }, (_, i) => {
            const percent = Math.floor(Math.random() * 100);
            const colorVar = percent >= 75 ? 'var(--success)' : (percent >= 50 ? 'var(--warning)' : 'var(--danger)');
            return {
                id: i, title: `كورس المراجعة رقم ${i + 1} (${subjects[Math.floor(Math.random() * subjects.length)]})`,
                percent, colorVar
            };
        });
    }, []);

    // توليد داتا وهمية للامتحانات
    const examsData = useMemo(() => Array.from({ length: 60 }, (_, i) => {
        const score = Math.floor(Math.random() * 20);
        const statusClass = score >= 15 ? 'rgba(46, 204, 113, 0.1)' : (score >= 10 ? 'rgba(241, 196, 15, 0.1)' : 'rgba(231, 76, 60, 0.1)');
        const colorClass = score >= 15 ? 'var(--success)' : (score >= 10 ? 'var(--warning)' : 'var(--danger)');
        return { id: i, title: `امتحان حصة رقم ${i + 1}`, score, statusClass, colorClass };
    }), []);

    // توليد داتا وهمية للواجبات
    const homeworkData = useMemo(() => Array.from({ length: 50 }, (_, i) => {
        const score = Math.floor(Math.random() * 10);
        const statusClass = score >= 8 ? 'rgba(46, 204, 113, 0.1)' : (score >= 5 ? 'rgba(241, 196, 15, 0.1)' : 'rgba(231, 76, 60, 0.1)');
        const colorClass = score >= 8 ? 'var(--success)' : (score >= 5 ? 'var(--warning)' : 'var(--danger)');
        return { id: i, title: `واجب رقم ${i + 1}`, score, statusClass, colorClass };
    }), []);

    const handleLogin = () => {
        if (phone.length < 11 || !code.trim()) {
            showToast(isAr ? 'يرجى التأكد من إدخال البيانات المطلوبة للتحقق.' : 'Please enter valid login details.', 'error');
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setIsLoggedIn(true);

            // 💡 حفظ أو مسح الكود بناءً على اختيار ولي الأمر
            if (rememberMe) {
                localStorage.setItem('pixel_parent_phone', phone);
                localStorage.setItem('pixel_parent_code', code);
            } else {
                localStorage.removeItem('pixel_parent_phone');
                localStorage.removeItem('pixel_parent_code');
            }

            showToast(isAr ? 'تم تسجيل الدخول بنجاح' : 'Logged in successfully', 'success');
        }, 1000);
    };

    return (
        <main className="page-wrapper" style={{ paddingTop: '120px' }}>
            <div className={styles.parentContainer}>
                
                {!isLoggedIn ? (
                    <div className={styles.loginWrapper}>
                        <div className={styles.authCard}>
                            <FaUserShield style={{ fontSize: '3.5rem', color: 'var(--parent-gold)', marginBottom: '15px' }} />
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '10px' }}>
                                {isAr ? 'تسجيل دخول ولي الأمر' : 'Parent Login'}
                            </h2>
                            <p style={{ opacity: 0.8, marginBottom: '25px', fontSize: '0.95rem' }}>
                                {isAr ? 'لمتابعة أداء الطالب، يرجى إدخال البيانات التالية للتحقق من هويتك.' : 'Please enter your details to monitor student performance.'}
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <Input 
                                    type="tel" 
                                    label={isAr ? 'رقم هاتف الطالب' : 'Student Phone'} 
                                    placeholder="01xxxxxxxxx" 
                                    value={phone} 
                                    onChange={e => setPhone(e.target.value)} 
                                />
                                
                                {/* 💡 كود المتابعة مع أيقونة العين */}
                                <Input 
                                    type={showCode ? "text" : "password"} 
                                    label={isAr ? 'كود المتابعة (من حساب الطالب)' : 'Parent Code'} 
                                    placeholder="XXXX-XXXX" 
                                    value={code} 
                                    onChange={e => setCode(e.target.value)} 
                                    style={{ letterSpacing: '2px', textAlign: 'center' }}
                                    icon={
                                        <div 
                                            onClick={() => setShowCode(!showCode)} 
                                            style={{ cursor: 'pointer', display: 'flex', color: 'var(--parent-gold)' }}
                                            title={isAr ? 'إظهار/إخفاء الكود' : 'Toggle Code Visibility'}
                                        >
                                            {showCode ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                        </div>
                                    }
                                />
                            </div>

                            {/* 💡 زر تذكر بياناتي لولي الأمر */}
                            <div style={{ display: 'flex', justifyContent: 'flex-start', margin: '15px 0 25px 0', fontSize: '0.9rem', color: 'var(--txt)' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                                    <input 
                                        type="checkbox" 
                                        checked={rememberMe} 
                                        onChange={(e) => setRememberMe(e.target.checked)} 
                                        style={{ width: '16px', height: '16px', accentColor: 'var(--parent-gold)' }} 
                                    />
                                    {isAr ? 'تذكر بيانات الدخول' : 'Remember me'}
                                </label>
                            </div>

                            <Button 
                                fullWidth size="lg" 
                                style={{ background: 'var(--parent-gold)', color: '#000' }} 
                                icon={!isLoading && <FaSignInAlt />}
                                onClick={handleLogin}
                                isLoading={isLoading}
                            >
                                {isAr ? 'تسجيل الدخول' : 'Login'}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className={styles.dashboardView}>
                        
                        <div className={styles.profileHeader}>
                            <div className={styles.studentAvatar}>أ</div>
                            <div style={{ flex: 1, textAlign: isAr ? 'right' : 'left' }}>
                                <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--txt)', marginBottom: '5px' }}>أحمد محمد ناصر</h1>
                                <p style={{ fontSize: '1rem', opacity: 0.8, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <FaGraduationCap /> {isAr ? 'الصف الثالث الثانوي' : 'Grade 12'} | 
                                    <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <FaCircle style={{ fontSize: '0.6rem' }} /> {isAr ? 'متصل الآن بالمنصة' : 'Online'}
                                    </span>
                                </p>
                            </div>
                            <Button style={{ background: '#25D366', color: 'white' }} icon={<FaWhatsapp />} onClick={() => alert('سيتم تحويلك لواتساب الدعم')}>
                                {isAr ? 'تواصل بخصوص الطالب' : 'Contact Support'}
                            </Button>
                        </div>

                        {/* إحصائيات عامة */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                            <div style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.05)', padding: '25px', borderRadius: '15px', textAlign: 'center' }}>
                                <FaChalkboardTeacher style={{ fontSize: '2rem', color: 'var(--parent-gold)', marginBottom: '10px' }} />
                                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--txt)' }}>50</div>
                                <div style={{ opacity: 0.8, fontWeight: 'bold' }}>{isAr ? 'كورس مسجل' : 'Enrolled Courses'}</div>
                            </div>
                            <div style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.05)', padding: '25px', borderRadius: '15px', textAlign: 'center' }}>
                                <FaCalendarCheck style={{ fontSize: '2rem', color: 'var(--parent-gold)', marginBottom: '10px' }} />
                                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--success)' }}>95%</div>
                                <div style={{ opacity: 0.8, fontWeight: 'bold' }}>{isAr ? 'نسبة حضور الحصص' : 'Attendance Rate'}</div>
                            </div>
                            <div style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.05)', padding: '25px', borderRadius: '15px', textAlign: 'center' }}>
                                <FaStar style={{ fontSize: '2rem', color: 'var(--parent-gold)', marginBottom: '10px' }} />
                                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--warning)' }}>82%</div>
                                <div style={{ opacity: 0.8, fontWeight: 'bold' }}>{isAr ? 'متوسط الامتحانات' : 'Exams Average'}</div>
                            </div>
                            <div style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.05)', padding: '25px', borderRadius: '15px', textAlign: 'center' }}>
                                <FaTasks style={{ fontSize: '2rem', color: 'var(--parent-gold)', marginBottom: '10px' }} />
                                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--danger)' }}>3</div>
                                <div style={{ opacity: 0.8, fontWeight: 'bold' }}>{isAr ? 'واجبات متأخرة' : 'Late Homeworks'}</div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
                            {/* الكورسات */}
                            <div style={{ background: 'var(--card)', borderRadius: '20px', padding: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--parent-gold)' }}>
                                    <FaChartLine /> {isAr ? 'معدل إنجاز المنهج' : 'Course Progress'}
                                </h3>
                                <div className={styles.scrollableList}>
                                    {coursesData.map(c => (
                                        <div key={c.id} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px dashed rgba(255,255,255,0.1)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                                <div>
                                                    <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>{c.title}</div>
                                                    <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>أستاذ المادة</div>
                                                </div>
                                                <div style={{ fontWeight: 900, color: c.colorVar }}>{c.percent}%</div>
                                            </div>
                                            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                                <div style={{ height: '100%', width: `${c.percent}%`, background: c.colorVar }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* سجل الدرجات */}
                            <div style={{ background: 'var(--card)', borderRadius: '20px', padding: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--parent-gold)' }}>
                                    <FaClipboardCheck /> {isAr ? 'سجل الدرجات الشامل' : 'Grades Record'}
                                </h3>
                                
                                <div className={styles.gradeTabs}>
                                    <button className={`${styles.gTabBtn} ${activeTab === 'exams' ? styles.active : ''}`} onClick={() => setActiveTab('exams')}>الامتحانات (60)</button>
                                    <button className={`${styles.gTabBtn} ${activeTab === 'homework' ? styles.active : ''}`} onClick={() => setActiveTab('homework')}>الواجبات (50)</button>
                                </div>

                                <div className={styles.scrollableList}>
                                    {(activeTab === 'exams' ? examsData : homeworkData).map(item => (
                                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '12px', marginBottom: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <div>
                                                <h4 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: '5px' }}>{item.title}</h4>
                                                <p style={{ fontSize: '0.85rem', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '5px' }}><FaClock /> {isAr ? 'تم التسليم: مارس 2026' : 'Submitted: March 2026'}</p>
                                            </div>
                                            <div style={{ fontSize: '1.2rem', fontWeight: 900, padding: '5px 15px', borderRadius: '8px', minWidth: '80px', textAlign: 'center', background: item.statusClass, color: item.colorClass, border: `1px solid ${item.colorClass}` }}>
                                                {item.score} / {activeTab === 'exams' ? '20' : '10'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}