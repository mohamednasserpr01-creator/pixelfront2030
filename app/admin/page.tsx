// FILE: app/admin/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { FaQuoteRight, FaUsers, FaChalkboardTeacher, FaBarcode, FaStore, FaChartLine } from 'react-icons/fa';

const motivationalQuotes = [
    "وراء كل منصة عظيمة، فريق عظيم يديرها بكفاءة! 🚀",
    "الأرقام لا تكذب، اجعل اليوم حافلاً بالإنجازات! 📈",
    "مهمتك اليوم: تحويل التحديات إلى نجاحات مبهرة! 💪",
    "التركيز والسرعة هما سلاحك السري اليوم، انطلق! ⚡",
    "ملايين البيانات تحت سيطرتك، أنت المايسترو! 🎵",
    "التفاصيل الصغيرة تصنع النجاحات الكبيرة، ركز في عملك! 🎯",
    "بيكسل أكاديمي تكبر بجهودك، استمر في التألق! 🌟"
];

export default function AdminOverview() {
    const [quote, setQuote] = useState("");
    const [mounted, setMounted] = useState(false);
    
    const [stats, setStats] = useState({
        students: 12461,
        newStudentsThisWeek: 120,
        codesUsed: 361,
        newCodesToday: 45,
        orders: 20
    });

    useEffect(() => {
        setMounted(true);
        setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);

        const liveInterval = setInterval(() => {
            setStats(prev => ({
                ...prev,
                students: prev.students + (Math.random() > 0.7 ? 1 : 0),
                newStudentsThisWeek: prev.newStudentsThisWeek + (Math.random() > 0.7 ? 1 : 0),
                codesUsed: prev.codesUsed + (Math.random() > 0.5 ? 1 : 0),
                newCodesToday: prev.newCodesToday + (Math.random() > 0.5 ? 1 : 0),
                orders: prev.orders + (Math.random() > 0.9 ? 1 : 0)
            }));
        }, 4000);

        return () => clearInterval(liveInterval);
    }, []);

    // 💡 لمنع أي Hydration Error بنعرض الشاشة فقط بعد ما تعمل Mount على المتصفح
    if (!mounted) return null;

    return (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
            
            <div style={{ 
                background: 'linear-gradient(135deg, rgba(108,92,231,0.1), rgba(255,0,127,0.05))', 
                border: '1px solid rgba(108,92,231,0.2)', 
                borderRight: '5px solid var(--p-purple)', 
                padding: '25px', 
                borderRadius: '15px', 
                marginBottom: '30px',
                display: 'flex', 
                alignItems: 'center', 
                gap: '15px' 
            }}>
                <FaQuoteRight style={{ fontSize: '2rem', color: 'var(--p-purple)', opacity: 0.5 }} />
                <div>
                    <h2 style={{ fontSize: '1.4rem', color: 'var(--txt)', marginBottom: '5px', fontWeight: 900 }}>صباح الخير يا بطل! ☕</h2>
                    <p style={{ color: 'var(--txt-mut)', fontSize: '1.1rem', fontWeight: 'bold' }}>{quote}</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                
                <div style={{ background: 'var(--card)', padding: '25px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', transition: '0.3s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h3 style={{ color: 'var(--txt-mut)', fontSize: '1rem' }}>إجمالي الطلاب</h3>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(108,92,231,0.1)', color: 'var(--p-purple)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem' }}><FaUsers /></div>
                    </div>
                    {/* 💡 السحر هنا: استخدام en-US لإجبار الأرقام تكون بالشكل العالمي */}
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--txt)' }}>{stats.students.toLocaleString('en-US')}</div>
                    <div style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: 'bold', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <FaChartLine /> +{stats.newStudentsThisWeek.toLocaleString('en-US')} طالب هذا الأسبوع
                    </div>
                </div>

                <div style={{ background: 'var(--card)', padding: '25px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h3 style={{ color: 'var(--txt-mut)', fontSize: '1rem' }}>الكورسات المفعلة</h3>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(46, 204, 113, 0.1)', color: 'var(--success)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem' }}><FaChalkboardTeacher /></div>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--txt)' }}>84</div>
                    <div style={{ color: 'var(--txt-mut)', fontSize: '0.85rem', fontWeight: 'bold', marginTop: '5px' }}>لـ 12 مدرس مختلف</div>
                </div>

                <div style={{ background: 'var(--card)', padding: '25px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h3 style={{ color: 'var(--txt-mut)', fontSize: '1rem' }}>الأكواد المستخدمة اليوم</h3>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(241, 196, 15, 0.1)', color: 'var(--warning)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem' }}><FaBarcode /></div>
                    </div>
                    {/* 💡 استخدام en-US */}
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--txt)' }}>{stats.codesUsed.toLocaleString('en-US')}</div>
                    <div style={{ color: 'var(--warning)', fontSize: '0.85rem', fontWeight: 'bold', marginTop: '5px' }}>+{stats.newCodesToday.toLocaleString('en-US')} كود جديد تم تفعيله</div>
                </div>

                <div style={{ background: 'var(--card)', padding: '25px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h3 style={{ color: 'var(--txt-mut)', fontSize: '1rem' }}>طلبات المتجر المعلقة</h3>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(231, 76, 60, 0.1)', color: 'var(--danger)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem' }}><FaStore /></div>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--txt)' }}>{stats.orders.toLocaleString('en-US')}</div>
                    <div style={{ color: 'var(--danger)', fontSize: '0.85rem', fontWeight: 'bold', marginTop: '5px' }}>تحتاج إلى مراجعة وتأكيد</div>
                </div>

            </div>
        </div>
    );
}