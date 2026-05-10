"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaTag, FaHome, FaShoppingCart, FaCheckCircle, FaBookOpen } from 'react-icons/fa';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';

// 💡 واجهة البيانات اللي هتيجي للطالب (مبنية على كود الأدمن)
interface StudentOffer {
    id: number;
    title: string;
    desc: string;
    originalPrice: number;
    price: number;
    image: string;
    endDate: string;
    courses: string[]; // أسماء الكورسات المشمولة في العرض
}

export default function OffersPage() {
    const { showToast } = useToast();
    const [offers, setOffers] = useState<StudentOffer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [subscribingId, setSubscribingId] = useState<number | null>(null);

    // 💡 محاكاة جلب العروض النشطة من قاعدة البيانات
    useEffect(() => {
        setTimeout(() => {
            const mockOffers: StudentOffer[] = [
                {
                    id: 1,
                    title: 'عرض بطل الثانوية',
                    desc: 'أقوى باقة مراجعات نهائية تشمل المواد العلمية بالكامل مع أفضل نخبة من المدرسين.',
                    originalPrice: 1000,
                    price: 600,
                    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=500',
                    endDate: '2026-05-01',
                    courses: ['مراجعة الفيزياء - أ/مارك منصور', 'مراجعة الكيمياء - د/أحمد سمير', 'مراجعة الأحياء - أ/محمود']
                },
                {
                    id: 2,
                    title: 'باقة اللغات المتكاملة',
                    desc: 'قفل الإنجليزي والفرنساوي والعربي مع باقة اللغات اللي بتشمل حل امتحانات شاملة وتدريب على التركات.',
                    originalPrice: 750,
                    price: 450,
                    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=500',
                    endDate: '2026-04-15',
                    courses: ['اللغة العربية - أ/رضا الفاروق', 'اللغة الإنجليزية - أ/حسن النجار']
                }
            ];
            setOffers(mockOffers);
            setIsLoading(false);
        }, 1000);
    }, []);

    const handleSubscribe = (id: number) => {
        setSubscribingId(id);
        // محاكاة عملية الدفع أو الخصم من المحفظة
        setTimeout(() => {
            setSubscribingId(null);
            showToast('تم الاشتراك في الباقة بنجاح! تم إضافة الكورسات لمسيرتك 🚀', 'success');
        }, 1500);
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '50px 20px', direction: 'rtl' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                    <h1 style={{ fontSize: '2.5rem', color: 'var(--txt)', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                        <FaTag color="#ff007f" /> الباقات والعروض الخاصة
                    </h1>
                    <p style={{ color: 'var(--txt-mut)', fontSize: '1.1rem' }}>وفر فلوسك واشترك في الباقات المجمعة اللي بتضم أقوى الكورسات بسعر استثنائي.</p>
                    <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '20px', color: 'var(--p-purple)', textDecoration: 'none', fontWeight: 'bold' }}>
                        <FaHome /> العودة للرئيسية
                    </Link>
                </div>

                {/* Grid العروض */}
                {isLoading ? (
                    <div style={{ textAlign: 'center', color: 'var(--txt-mut)', fontSize: '1.2rem', padding: '50px' }}>
                        جاري تحميل الباقات المتاحة... ⏳
                    </div>
                ) : offers.length === 0 ? (
                    <div style={{ textAlign: 'center', background: 'var(--card)', padding: '40px', borderRadius: '15px', color: 'var(--txt-mut)' }}>
                        لا توجد باقات متاحة في الوقت الحالي.
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
                        {offers.map((offer) => (
                            <div key={offer.id} style={{ 
                                background: 'var(--card)', 
                                border: '1px solid rgba(108,92,231,0.2)', 
                                borderRadius: '20px', 
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                                transition: 'transform 0.3s ease',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                {/* صورة الباقة */}
                                <div style={{ position: 'relative', height: '200px', width: '100%' }}>
                                    <img src={offer.image} alt={offer.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    {/* شريط نسبة الخصم */}
                                    <div style={{ 
                                        position: 'absolute', top: '15px', right: '15px', 
                                        background: '#ff007f', color: 'white', padding: '8px 15px', 
                                        borderRadius: '10px', fontWeight: 'bold', fontSize: '0.9rem',
                                        boxShadow: '0 4px 10px rgba(255,0,127,0.4)'
                                    }}>
                                        وفر {offer.originalPrice - offer.price} ج.م
                                    </div>
                                </div>

                                {/* تفاصيل الباقة */}
                                <div style={{ padding: '25px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    <h3 style={{ fontSize: '1.4rem', color: 'var(--txt)', margin: '0 0 10px 0' }}>{offer.title}</h3>
                                    <p style={{ color: 'var(--txt-mut)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '20px' }}>{offer.desc}</p>
                                    
                                    {/* الكورسات المشمولة */}
                                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--p-purple)', fontWeight: 'bold', marginBottom: '10px' }}>هذه الباقة تشمل:</div>
                                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {offer.courses.map((course, idx) => (
                                                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--txt)', fontSize: '0.85rem' }}>
                                                    <FaCheckCircle color="var(--success)" size={14} /> {course}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* السعر وزرار الشراء */}
                                    <div style={{ marginTop: 'auto' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ textDecoration: 'line-through', color: 'var(--txt-mut)', fontSize: '0.9rem' }}>{offer.originalPrice} ج.م</span>
                                                <span style={{ color: 'var(--success)', fontSize: '1.6rem', fontWeight: 'bold' }}>{offer.price} ج.م</span>
                                            </div>
                                            <div style={{ color: 'var(--warning)', fontSize: '0.8rem', fontWeight: 'bold', textAlign: 'left' }}>
                                                ينتهي في<br/>{offer.endDate}
                                            </div>
                                        </div>
                                        
                                        <Button 
                                            variant="primary" 
                                            fullWidth 
                                            icon={<FaShoppingCart />}
                                            onClick={() => handleSubscribe(offer.id)}
                                            disabled={subscribingId === offer.id}
                                        >
                                            {subscribingId === offer.id ? 'جاري الاشتراك...' : 'اشترك في الباقة الآن'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}