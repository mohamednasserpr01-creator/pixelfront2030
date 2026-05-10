"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { FaChevronDown, FaQuestionCircle, FaHome } from 'react-icons/fa';

export default function FAQPage() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    // 💡 تم تعديل الإجابات بناءً على سياسة المنصة الجديدة
    const faqs = [
        { 
            q: 'كيف يمكنني الاشتراك في الكورسات؟', 
            a: 'يمكنك الاشتراك من خلال إنشاء حساب على المنصة، ثم التوجه لصفحة الكورسات، اختيار الكورس المناسب، والضغط على "اشتراك الآن" وإتمام عملية الدفع عبر المحفظة أو فوري.' 
        },
        { 
            q: 'هل يمكنني استرجاع المبلغ بعد الدفع؟', 
            a: 'لا يمكن استرجاع قيمة الكود بعد شحنه في المحفظة، يرجى التأكد من الكورس المطلوب قبل إتمام عملية الشحن.' 
        },
        { 
            q: 'كيف أحصل على أكواد الخصم؟', 
            a: 'يتم نشر أكواد الخصم في صفحة "العروض والخصومات"، كما يتم إرسالها للطلاب المتفوقين كجوائز، ويمكنك متابعة صفحاتنا على السوشيال ميديا لمعرفة أحدث العروض.' 
        },
        { 
            q: 'هل الحصص مسجلة أم بث مباشر؟', 
            a: 'المنصة تعتمد على النظامين معاً. معظم الدروس مسجلة بجودة عالية لتشاهدها في أي وقت، وهناك حصص بث مباشر للمراجعات والأسئلة يتم جدولتها مسبقاً.' 
        },
        { 
            q: 'كيف أتواصل مع المدرس إذا كان لدي سؤال؟', 
            a: 'يمكنك إرسال رسالة عن طريق واتساب المساعدين، أو عن طريق نظام "اسأل المدرس" المتاح داخل المنصة.' 
        }
    ];

    const toggleFAQ = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '50px 20px', direction: 'rtl' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '2.5rem', color: 'var(--txt)', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                        <FaQuestionCircle color="var(--p-purple)" /> الأسئلة الشائعة
                    </h1>
                    <p style={{ color: 'var(--txt-mut)', fontSize: '1.1rem' }}>جمعنا لك إجابات لأكثر الأسئلة التي قد تدور في ذهنك.</p>
                    <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '20px', color: 'var(--p-purple)', textDecoration: 'none', fontWeight: 'bold' }}>
                        <FaHome /> العودة للرئيسية
                    </Link>
                </div>

                {/* FAQ Accordion */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {faqs.map((faq, index) => (
                        <div 
                            key={index} 
                            style={{ 
                                background: 'var(--card)', 
                                borderRadius: '15px', 
                                border: '1px solid rgba(255,255,255,0.05)', 
                                overflow: 'hidden',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <button 
                                onClick={() => toggleFAQ(index)}
                                style={{ 
                                    width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                                    padding: '20px', background: 'transparent', border: 'none', cursor: 'pointer', 
                                    color: activeIndex === index ? 'var(--p-purple)' : 'var(--txt)', 
                                    fontSize: '1.1rem', fontWeight: 'bold', textAlign: 'right' 
                                }}
                            >
                                {faq.q}
                                <FaChevronDown style={{ transform: activeIndex === index ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                            </button>
                            
                            <div style={{ 
                                maxHeight: activeIndex === index ? '200px' : '0', 
                                padding: activeIndex === index ? '0 20px 20px 20px' : '0 20px', 
                                overflow: 'hidden', transition: 'all 0.3s ease',
                                color: 'var(--txt-mut)', lineHeight: '1.6'
                            }}>
                                {faq.a}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}