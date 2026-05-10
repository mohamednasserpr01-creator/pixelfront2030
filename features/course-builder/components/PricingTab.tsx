"use client";
import React from 'react';
import { FaMoneyBillWave, FaPercentage, FaUnlockAlt, FaCheckCircle, FaBarcode, FaPrint, FaImage, FaPalette, FaTrash } from 'react-icons/fa';
import { Lecture } from '../types/curriculum.types';
import { usePricing } from '../hooks/usePricing'; // 💡 الاستدعاء من الـ Hook

interface Props {
    curriculum: Lecture[];
}

export const PricingTab: React.FC<Props> = ({ curriculum }) => {
    // 🚀 سحب كل حاجة من الـ Hook
    const {
        isFree, setIsFree, coursePrice, setCoursePrice, hasDiscount, setHasDiscount,
        discountPrice, setDiscountPrice, allowPartialPurchase, setAllowPartialPurchase,
        paymentMethod, setPaymentMethod, lecturePrices, handleLecturePriceChange,
        showCodeGenerator, setShowCodeGenerator, codeCount, setCodeCount,
        codeTextColor, setCodeTextColor, codePriceLabel, setCodePriceLabel,
        codeTarget, setCodeTarget, fileInputRef, bgImageBase64, handleImageUpload, setBgImageBase64,
        handleGenerateCourseCodes, isGenerating
    } = usePricing(500);

    return (
        <div style={{ animation: 'fadeIn 0.4s ease', display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* 1. إعدادات السعر الأساسي */}
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '25px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 style={{ margin: '0 0 20px 0', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}><FaMoneyBillWave color="#2ecc71" /> إعدادات السعر الأساسي</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '25px', flexWrap: 'wrap' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white', cursor: 'pointer', background: isFree ? 'rgba(46, 204, 113, 0.2)' : 'rgba(255,255,255,0.05)', padding: '15px 25px', borderRadius: '10px', border: `1px solid ${isFree ? '#2ecc71' : 'transparent'}`, transition: '0.2s', flex: 1 }}>
                        <input type="radio" checked={isFree} onChange={() => setIsFree(true)} name="priceType" style={{ accentColor: '#2ecc71' }} />
                        كورس مجاني بالكامل
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white', cursor: 'pointer', background: !isFree ? 'rgba(155, 89, 182, 0.2)' : 'rgba(255,255,255,0.05)', padding: '15px 25px', borderRadius: '10px', border: `1px solid ${!isFree ? 'var(--p-purple)' : 'transparent'}`, transition: '0.2s', flex: 1 }}>
                        <input type="radio" checked={!isFree} onChange={() => setIsFree(false)} name="priceType" style={{ accentColor: 'var(--p-purple)' }} />
                        كورس مدفوع
                    </label>
                </div>
                {!isFree && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                        <div>
                            <label style={{ color: 'var(--txt-mut)', display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>سعر الكورس الإجمالي (ج.م)</label>
                            <input type="number" value={coursePrice} onChange={(e) => { setCoursePrice(Number(e.target.value)); setCodePriceLabel(Number(e.target.value)); }} style={{ width: '100%', padding: '12px 15px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none', fontSize: '1.1rem' }} />
                        </div>
                    </div>
                )}
            </div>

            {/* 2. الشراء المنفصل للمحاضرات */}
            {!isFree && (
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '25px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: allowPartialPurchase ? '20px' : '0' }}>
                        <div>
                            <h3 style={{ margin: '0 0 5px 0', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}><FaUnlockAlt color="#3498db" /> الشراء المنفصل</h3>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--txt-mut)' }}>السماح للطالب بشراء محاضرات معينة بدلاً من الكورس بالكامل</p>
                        </div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3498db', cursor: 'pointer' }}>
                            <input type="checkbox" checked={allowPartialPurchase} onChange={(e) => setAllowPartialPurchase(e.target.checked)} style={{ accentColor: '#3498db', width: '18px', height: '18px' }} />
                            تفعيل البيع المنفصل
                        </label>
                    </div>

                    {allowPartialPurchase && (
                        <div style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {curriculum.length === 0 ? (
                                <div style={{ color: 'var(--txt-mut)', textAlign: 'center', padding: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>لا توجد محاضرات في المنهج.</div>
                            ) : (
                                curriculum.map(lec => (
                                    <div key={lec.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                        <div style={{ color: 'white', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '10px' }}><FaCheckCircle color="#3498db" size={14}/> {lec.title}</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span style={{ color: 'var(--txt-mut)', fontSize: '0.85rem' }}>السعر:</span>
                                            <div style={{ position: 'relative' }}>
                                                <input type="number" placeholder="0" value={lecturePrices[lec.id] || ''} onChange={(e) => handleLecturePriceChange(lec.id, Number(e.target.value))} style={{ width: '100px', padding: '8px 30px 8px 10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '5px', outline: 'none', textAlign: 'center' }} />
                                                <span style={{ position: 'absolute', right: '10px', top: '8px', color: 'var(--txt-mut)', fontSize: '0.8rem' }}>ج.م</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* 3. طرق الشراء ومحرك الأكواد المخصصة */}
            {!isFree && (
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '25px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h3 style={{ margin: '0 0 20px 0', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}><FaBarcode color="#3498db" /> طريقة شراء الكورس / الأكواد</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white', cursor: 'pointer', background: paymentMethod === 'both' ? 'rgba(52, 152, 219, 0.1)' : 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '10px', border: `1px solid ${paymentMethod === 'both' ? '#3498db' : 'rgba(255,255,255,0.05)'}` }}>
                            <input type="radio" checked={paymentMethod === 'both'} onChange={() => setPaymentMethod('both')} name="payMethod" style={{ accentColor: '#3498db' }} />
                            <span>متاح شراؤه <strong style={{color: '#2ecc71'}}>برصيد المحفظة العامة</strong> أو <strong style={{color: 'var(--p-purple)'}}>بكود مخصص للكورس</strong></span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white', cursor: 'pointer', background: paymentMethod === 'custom_codes' ? 'rgba(155, 89, 182, 0.1)' : 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '10px', border: `1px solid ${paymentMethod === 'custom_codes' ? 'var(--p-purple)' : 'rgba(255,255,255,0.05)'}` }}>
                            <input type="radio" checked={paymentMethod === 'custom_codes'} onChange={() => setPaymentMethod('custom_codes')} name="payMethod" style={{ accentColor: 'var(--p-purple)' }} />
                            <span>مغلق وحصري: يتم الدخول إليه <strong style={{color: 'var(--p-purple)'}}>بأكواد مخصصة للكورس فقط</strong> (لا يُباع بالرصيد)</span>
                        </label>

                        {/* محرك توليد الأكواد */}
                        {(paymentMethod === 'custom_codes' || paymentMethod === 'both') && (
                            <div style={{ marginTop: '10px', padding: '20px', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showCodeGenerator ? '20px' : '0' }}>
                                    <div>
                                        <h4 style={{ margin: '0 0 5px 0', color: 'white', fontSize: '1rem' }}>توليد أكواد مخصصة</h4>
                                        <p style={{ margin: 0, color: 'var(--txt-mut)', fontSize: '0.85rem' }}>الأكواد تمنح صلاحية الدخول المباشر للمحتوى المحدد.</p>
                                    </div>
                                    <button onClick={() => setShowCodeGenerator(!showCodeGenerator)} style={{ background: showCodeGenerator ? 'rgba(255,255,255,0.1)' : 'var(--p-purple)', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                                        {showCodeGenerator ? 'إغلاق المولد' : 'توليد أكواد جديدة'}
                                    </button>
                                </div>

                                {showCodeGenerator && (
                                    <div style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', gap: '15px', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '20px' }}>
                                        
                                        <div>
                                            <label style={{ display: 'block', color: 'var(--txt-mut)', fontSize: '0.8rem', marginBottom: '5px' }}>ماذا يفتح هذا الكود؟</label>
                                            <select value={codeTarget} onChange={(e) => {
                                                setCodeTarget(e.target.value);
                                                if(e.target.value === 'full_course') setCodePriceLabel(coursePrice);
                                                else setCodePriceLabel(lecturePrices[e.target.value] || 0);
                                            }} style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '5px', outline: 'none' }}>
                                                <option value="full_course" style={{ color: 'black' }}>الكورس بالكامل</option>
                                                {allowPartialPurchase && curriculum.map(lec => (
                                                    <option key={lec.id} value={lec.id} style={{ color: 'black' }}>محاضرة: {lec.title}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
                                            <div>
                                                <label style={{ display: 'block', color: 'var(--txt-mut)', fontSize: '0.8rem', marginBottom: '5px' }}>العدد المطلوب</label>
                                                <input type="number" value={codeCount} onChange={(e) => setCodeCount(Number(e.target.value))} style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '5px', outline: 'none' }} />
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', color: 'var(--txt-mut)', fontSize: '0.8rem', marginBottom: '5px' }}>السعر المطبوع (للعرض)</label>
                                                <input type="number" value={codePriceLabel} onChange={(e) => setCodePriceLabel(Number(e.target.value))} style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '5px', outline: 'none' }} />
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', color: 'var(--txt-mut)', fontSize: '0.8rem', marginBottom: '5px' }}><FaPalette /> لون النص</label>
                                                <input type="color" value={codeTextColor} onChange={(e) => setCodeTextColor(e.target.value)} style={{ width: '100%', height: '40px', background: 'transparent', border: 'none', cursor: 'pointer' }} />
                                            </div>
                                        </div>

                                        <div 
                                            onClick={() => fileInputRef.current?.click()} 
                                            style={{ padding: bgImageBase64 ? '0' : '20px', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', position: 'relative', overflow: 'hidden', height: bgImageBase64 ? '150px' : 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
                                        >
                                            <input type="file" ref={fileInputRef} accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
                                            {bgImageBase64 ? (
                                                <>
                                                    <img src={bgImageBase64} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    <button onClick={(e) => { e.stopPropagation(); setBgImageBase64(null); }} style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', color: '#e74c3c', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}><FaTrash /></button>
                                                </>
                                            ) : (
                                                <>
                                                    <FaImage size={24} color="var(--txt-mut)" style={{ marginBottom: '10px' }} />
                                                    <div style={{ color: 'var(--txt-mut)', fontSize: '0.9rem' }}>اضغط لرفع صورة خلفية الكارت (أبعاد 21:10)</div>
                                                </>
                                            )}
                                        </div>

                                        {/* 🚀 زرار التوليد مربوط بحالة التحميل */}
                                        <button 
                                            onClick={handleGenerateCourseCodes} 
                                            disabled={isGenerating}
                                            style={{ background: isGenerating ? 'gray' : '#2ecc71', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: isGenerating ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '10px' }}
                                        >
                                            <FaPrint /> {isGenerating ? 'جاري تسجيل الأكواد...' : 'تسجيل الأكواد وطباعة الشيت 🖨️'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};