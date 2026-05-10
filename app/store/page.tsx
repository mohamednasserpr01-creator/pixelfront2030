"use client";
import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { FaSearch, FaLock } from 'react-icons/fa';

// 💡 الداتا الوهمية (Mock Data) اللي هتتشال أول ما نربط بالـ API
const dummyProducts = [
    { id: 1, title: 'كتاب المراجعة النهائية - إصدار 3', price: 249, image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500', category: 'books', status: 'متوفر' },
    { id: 2, title: 'كتاب المراجعة النهائية - إصدار 2', price: 149, image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=500', category: 'books', status: 'متوفر' },
    { id: 3, title: 'أدوات مدرسية - صنف 1', price: 103, image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=500', category: 'tools', status: 'متوفر' },
];

export default function StorePage() {
    const { lang } = useSettings();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [stage, setStage] = useState('all');

    // 💡 برمجة الفلاتر والبحث
    const filteredProducts = dummyProducts.filter(product => {
        const matchesSearch = product.title.includes(searchQuery);
        const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <main className="page-wrapper">
            
            {/* ======== الهيدر الجديد (مطابق للصورة) ======== */}
            <div className="store-header" style={{ textAlign: 'center', marginBottom: '50px', marginTop: '20px' }}>
                <h1 style={{ color: 'var(--p-purple)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: '900', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                    {lang === 'ar' ? 'متجر بيكسل أكاديمى' : 'Pixel Academy Store'} 🛒
                </h1>
                <p style={{ color: 'var(--txt)', fontSize: '1.15rem', fontWeight: 'bold', maxWidth: '800px', margin: '0 auto', lineHeight: '1.8' }}>
                    {lang === 'ar' ? 'اطلب مذكراتك وكتبك وتصلك لباب البيت، وادفع بالطريقة التي تناسبك بعد المراجعة.' : 'Order your books and notes to your doorstep, and pay with the method that suits you upon delivery.'}
                </p>
            </div>

            {/* ======== شريط الفلاتر الأفقي ======== */}
            <div className="store-filter-bar" style={{ background: 'var(--card)', padding: '15px', borderRadius: '15px', display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', border: '1px solid rgba(108,92,231,0.1)' }}>
                
                {/* 1. أزرار الأقسام (يمين) */}
                <div className="category-toggles" style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => setActiveCategory('tools')} style={{ background: activeCategory === 'tools' ? 'var(--p-purple)' : 'transparent', color: activeCategory === 'tools' ? '#fff' : 'var(--txt)', border: '1px solid var(--h-bg)', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' }}>
                        أدوات أخرى
                    </button>
                    <button onClick={() => setActiveCategory('books')} style={{ background: activeCategory === 'books' ? 'var(--p-purple)' : 'transparent', color: activeCategory === 'books' ? '#fff' : 'var(--txt)', border: '1px solid var(--h-bg)', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' }}>
                        كتب وملازم
                    </button>
                    <button onClick={() => setActiveCategory('all')} style={{ background: activeCategory === 'all' ? 'var(--p-purple)' : 'transparent', color: activeCategory === 'all' ? '#fff' : 'var(--txt)', border: '1px solid var(--h-bg)', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' }}>
                        الكل
                    </button>
                </div>

                {/* 2. قائمة المراحل (في النص) */}
                <select value={stage} onChange={(e) => setStage(e.target.value)} style={{ flex: '1', minWidth: '200px', padding: '12px', borderRadius: '8px', background: 'var(--bg)', border: '1px solid var(--h-bg)', color: 'var(--txt)', outline: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                    <option value="all">جميع المراحل الدراسية</option>
                    <option value="sec3">الصف الثالث الثانوي</option>
                    <option value="sec2">الصف الثاني الثانوي</option>
                    <option value="sec1">الصف الأول الثانوي</option>
                </select>

                {/* 3. مربع البحث (شمال) */}
                <div style={{ flex: '2', minWidth: '250px', position: 'relative' }}>
                    <input 
                        type="text" 
                        placeholder={lang === 'ar' ? "ابحث باسم الكتاب أو المذكرة..." : "Search..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ width: '100%', padding: '12px 15px 12px 40px', borderRadius: '8px', background: 'var(--bg)', border: '1px solid var(--h-bg)', color: 'var(--txt)', outline: 'none' }}
                    />
                    <FaSearch style={{ position: 'absolute', top: '15px', insetInlineStart: '15px', color: 'var(--txt-mut)' }} />
                </div>
            </div>

            {/* ======== شبكة المنتجات ======== */}
            <div className="products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
                {filteredProducts.map(product => (
                    <div key={product.id} className="store-card" style={{ background: 'var(--card)', borderRadius: '15px', overflow: 'hidden', border: '1px solid rgba(108,92,231,0.1)', display: 'flex', flexDirection: 'column', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                        
                        {/* صورة المنتج والبادج */}
                        <div style={{ position: 'relative', height: '220px' }}>
                            <span style={{ position: 'absolute', top: '15px', right: '15px', background: '#2ecc71', color: '#fff', padding: '5px 15px', borderRadius: '8px', fontWeight: 'bold', zIndex: 2 }}>
                                {product.status}
                            </span>
                            <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>

                        {/* تفاصيل المنتج */}
                        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                            <h3 style={{ textAlign: 'center', marginBottom: '25px', color: 'var(--txt)', fontSize: '1.2rem' }}>
                                {product.title}
                            </h3>
                            
                            {/* الفوتر (السعر والزرار) */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                                <button style={{ background: 'var(--p-purple)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' }}>
                                    <FaLock /> شراء الكتاب
                                </button>
                                <span style={{ color: '#f1c40f', fontWeight: '900', fontSize: '1.4rem' }}>
                                    {product.price} ج.م
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ستايل الموبايل عشان الشريط الأفقي يترص تحت بعضه بشياكة */}
            <style dangerouslySetInnerHTML={{__html: `
                @media (max-width: 992px) {
                    .store-filter-bar { flex-direction: column-reverse; align-items: stretch !important; }
                    .category-toggles { display: grid !important; grid-template-columns: 1fr 1fr 1fr; }
                    .category-toggles button { padding: 10px 5px !important; font-size: 0.9rem; }
                }
            `}} />
            
        </main>
    );
}