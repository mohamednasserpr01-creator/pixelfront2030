"use client";
import React, { useState } from 'react';

// 💡 1. استدعاء مركز الإعدادات (بدل الـ Navbar والـ Footer والـ LocalStorage)
import { useSettings } from '../../context/SettingsContext';

import { 
    FaHeadset, FaPhoneAlt, FaWhatsapp, FaShareAlt, 
    FaFacebookF, FaInstagram, FaTiktok, FaYoutube, 
    FaPaperPlane, FaCheckCircle 
} from 'react-icons/fa';

export default function ContactPage() {
    // 💡 2. سحبنا اللغة مباشرة من المركز
    const { lang } = useSettings();
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toastMsg, setToastMsg] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setToastMsg(lang === 'ar' ? 'تم إرسال رسالتك بنجاح!' : 'Message sent successfully!');
            setTimeout(() => { setToastMsg(null); }, 3000);
            (e.target as HTMLFormElement).reset();
        }, 2000);
    };

    return (
        // 💡 3. الكلاس السحري لحماية التصميم ومنع التداخل
        <main className="page-wrapper">

            <div className="contact-hero" style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ color: 'var(--p-purple)', fontSize: '2.5rem', marginBottom: '15px' }}>
                    {lang === 'ar' ? 'إحنا دايماً معاك 🎧' : 'We Are Always Here 🎧'}
                </h1>
                <p style={{ color: 'var(--txt-mut)', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
                    {lang === 'ar' ? 'سواء عندك استفسار أو واجهتك مشكلة، فريق الدعم جاهز للرد عليك.' : 'Whether you have an inquiry or an issue, our team is ready to help.'}
                </p>
            </div>

            <div className="contact-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', width: '100%' }}>
                
                {/* FORM SECTION */}
                <div className="contact-form-wrapper" style={{ background: 'var(--card)', padding: '30px', borderRadius: '20px', border: '1px solid rgba(108,92,231,0.1)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ marginBottom: '25px', color: 'var(--txt)' }}>{lang === 'ar' ? 'أرسل رسالة ✉️' : 'Send a Message ✉️'}</h2>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: 'var(--txt)' }}>{lang === 'ar' ? 'الاسم بالكامل' : 'Full Name'}</label>
                            <input type="text" style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '2px solid var(--h-bg)', background: 'var(--bg)', color: 'var(--txt)', outline: 'none' }} placeholder={lang === 'ar' ? 'أدخل اسمك' : 'Enter your name'} required />
                        </div>
                        
                        <div>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: 'var(--txt)' }}>{lang === 'ar' ? 'نوع الاستفسار' : 'Inquiry Type'}</label>
                            <select style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '2px solid var(--h-bg)', background: 'var(--bg)', color: 'var(--txt)', outline: 'none', cursor: 'pointer' }} required defaultValue="">
                                <option value="" disabled>{lang === 'ar' ? 'اختر نوع المشكلة...' : 'Select issue type...'}</option>
                                <option value="tech">{lang === 'ar' ? 'مشكلة تقنية' : 'Technical Issue'}</option>
                                <option value="payment">{lang === 'ar' ? 'الدفع والمحفظة' : 'Payment & Wallet'}</option>
                                <option value="other">{lang === 'ar' ? 'أخرى' : 'Other'}</option>
                            </select>
                        </div>
                        
                        <div>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: 'var(--txt)' }}>{lang === 'ar' ? 'رسالتك' : 'Message'}</label>
                            <textarea style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '2px solid var(--h-bg)', background: 'var(--bg)', color: 'var(--txt)', outline: 'none', minHeight: '120px', resize: 'vertical' }} placeholder={lang === 'ar' ? 'اكتب تفاصيل استفسارك...' : 'Type your details...'} required></textarea>
                        </div>
                        
                        <button type="submit" className="glow-btn" disabled={isSubmitting} style={{ width: '100%', padding: '15px', background: 'var(--p-purple)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', transition: '0.3s' }}>
                            {isSubmitting ? (
                                <div style={{ width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                            ) : (
                                <><span>{lang === 'ar' ? 'إرسال الرسالة' : 'Send Message'}</span><FaPaperPlane /></>
                            )}
                        </button>
                    </form>
                </div>

                {/* INFO SECTION */}
                <div className="contact-info-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <div className="info-card" style={{ background: 'var(--card)', padding: '30px', borderRadius: '20px', border: '1px solid rgba(108,92,231,0.1)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ marginBottom: '20px', color: 'var(--p-purple)', display: 'flex', alignItems: 'center', gap: '10px' }}><FaHeadset /> {lang === 'ar' ? 'الدعم المباشر' : 'Direct Support'}</h3>
                        <div className="contact-methods" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <a href="tel:+201033259951" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: 'var(--h-bg)', borderRadius: '10px', color: 'var(--txt)', textDecoration: 'none', fontWeight: 'bold', transition: '0.3s' }}>
                                <span style={{ fontFamily: 'monospace', fontSize: '1.1rem', letterSpacing: '2px' }}>01033259951</span>
                                <FaPhoneAlt style={{ color: 'var(--p-purple)' }} />
                            </a>
                            
                            <a href="tel:+201221466441" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: 'var(--h-bg)', borderRadius: '10px', color: 'var(--txt)', textDecoration: 'none', fontWeight: 'bold', transition: '0.3s' }}>
                                <span style={{ fontFamily: 'monospace', fontSize: '1.1rem', letterSpacing: '2px' }}>01221466441</span>
                                <FaPhoneAlt style={{ color: 'var(--p-purple)' }} />
                            </a>

                            <a href="https://wa.me/201221466441" target="_blank" rel="noreferrer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: 'rgba(37, 211, 102, 0.1)', border: '1px solid #25D366', borderRadius: '10px', color: '#25D366', textDecoration: 'none', fontWeight: 'bold', transition: '0.3s' }}>
                                <span>{lang === 'ar' ? 'واتساب السكرتارية' : 'WhatsApp Support'}</span>
                                <FaWhatsapp style={{ fontSize: '1.5rem' }} />
                            </a>
                        </div>
                    </div>

                    <div className="info-card" style={{ background: 'var(--card)', padding: '30px', borderRadius: '20px', border: '1px solid rgba(108,92,231,0.1)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ marginBottom: '20px', color: 'var(--p-purple)', display: 'flex', alignItems: 'center', gap: '10px' }}><FaShareAlt /> {lang === 'ar' ? 'السوشيال ميديا' : 'Social Media'}</h3>
                        <div className="social-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <a href="https://www.facebook.com/NasourMedia/" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: 'rgba(24, 119, 242, 0.1)', color: '#1877F2', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', transition: '0.3s' }}><FaFacebookF /> <span>Facebook</span></a>
                            <a href="https://www.instagram.com/nasourr__media/" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: 'rgba(225, 48, 108, 0.1)', color: '#E1306C', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', transition: '0.3s' }}><FaInstagram /> <span>Instagram</span></a>
                            <a href="https://www.tiktok.com/@nasourmedia" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: 'rgba(0, 0, 0, 0.1)', color: 'var(--txt)', border: '1px solid var(--h-bg)', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', transition: '0.3s' }}><FaTiktok /> <span>TikTok</span></a>
                            <a href="#" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: 'rgba(255, 0, 0, 0.1)', color: '#FF0000', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', transition: '0.3s' }}><FaYoutube /> <span>YouTube</span></a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast Notification */}
            <div className={`toast ${toastMsg ? 'show' : ''}`} style={{ 
                position: 'fixed', bottom: '30px', right: lang === 'ar' ? '30px' : 'auto', left: lang === 'ar' ? 'auto' : '30px', 
                background: '#2ecc71', color: 'white', padding: '15px 25px', borderRadius: '10px', fontWeight: 'bold', 
                boxShadow: '0 5px 20px rgba(0,0,0,0.3)', transform: toastMsg ? 'translateY(0)' : 'translateY(100px)', 
                opacity: toastMsg ? 1 : 0, transition: '0.4s ease', zIndex: 9999, display: 'flex', alignItems: 'center', gap: '10px', pointerEvents: 'none' 
            }}>
                <FaCheckCircle /> <span>{toastMsg}</span>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}} />

        </main>
    );
}