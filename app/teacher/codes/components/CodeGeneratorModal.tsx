"use client";
import React, { useState, useRef, useEffect } from 'react';
import { FaTimes, FaQrcode, FaPalette, FaImage, FaTrash, FaPrint } from 'react-icons/fa';
import { fetchAPI } from '../../../../lib/api/client';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (type: 'wallet' | 'course', value: string, count: number) => Promise<any[]>;
}

export const CodeGeneratorModal: React.FC<Props> = ({ isOpen, onClose, onGenerate }) => {
    const [type, setType] = useState<'wallet' | 'course'>('wallet');
    const [walletValue, setWalletValue] = useState('100');
    
    // 🚀 تحديثات الكورسات الديناميكية
    const [courses, setCourses] = useState<any[]>([]);
    const [courseId, setCourseId] = useState('');
    const [isLoadingCourses, setIsLoadingCourses] = useState(false);

    const [count, setCount] = useState('54'); 
    const [codePriceLabel, setCodePriceLabel] = useState(100);
    const [codeTextColor, setCodeTextColor] = useState('#000000');
    const [bgImageBase64, setBgImageBase64] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 🚀 جلب الكورسات من الباك إند
    useEffect(() => {
        if (isOpen && type === 'course') {
            setIsLoadingCourses(true);
            // 💡 تم تغيير المسار إلى /Course ليتوافق مع الـ C# Controller
            fetchAPI<any[]>('/Course') 
                .then(data => {
                    setCourses(data || []);
                    if (data && data.length > 0) {
                        setCourseId(data[0].id.toString()); 
                    }
                })
                .catch(err => console.error("Error fetching courses:", err))
                .finally(() => setIsLoadingCourses(false));
        }
    }, [isOpen, type]);

    if (!isOpen) return null;

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBgImageBase64(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
        e.target.value = '';
    };

    const handleGenerateAndPrint = async () => {
        const numCount = parseInt(count);
        if (isNaN(numCount) || numCount <= 0) return alert("❌ عدد الأكواد يجب أن يكون أكبر من صفر!");
        if (type === 'wallet' && (!walletValue || isNaN(parseInt(walletValue)))) return alert("❌ يرجى إدخال قيمة صحيحة للمحفظة!");
        if (type === 'course' && !courseId) return alert("❌ يرجى اختيار كورس أولاً!");
        if (!bgImageBase64) return alert("⚠️ يرجى رفع صورة خلفية الكارت أولاً!");

        setIsGenerating(true);

        try {
            const value = type === 'wallet' ? walletValue : courseId;
            
            const newCodes = await onGenerate(type, value, numCount);
            
            const priceLen = codePriceLabel.toString().length;
            let dynamicPriceSize = '11px';
            if (priceLen === 4) dynamicPriceSize = '8px';
            if (priceLen >= 5) dynamicPriceSize = '6px';
            
            let cardsHtml = '';
            newCodes.forEach((c: any) => {
                const formattedCode = c.code.match(/.{1,4}/g)?.join(' ') || c.code;

                const serialLen = c.serial.toString().length;
                let dynamicFontSize = '11px';
                if (serialLen === 4) dynamicFontSize = '9px';
                if (serialLen === 5) dynamicFontSize = '8px';
                if (serialLen >= 6) dynamicFontSize = '7px';

                cardsHtml += `
                    <div class="card">
                        <p class="price" style="font-size: ${dynamicPriceSize};">${codePriceLabel}</p>
                        <p class="index" style="font-size: ${dynamicFontSize};">${c.serial}</p>
                        <p class="code" style="color: ${codeTextColor}">${formattedCode}</p>
                    </div>
                `;
            });

            const printWindow = window.open('', '_blank');
            if (!printWindow) {
                alert("يرجى السماح بالنوافذ المنبثقة (Pop-ups).");
                setIsGenerating(false);
                return;
            }

            const htmlContent = `
            <!DOCTYPE html>
            <html dir="ltr">
            <head>
                <title>طباعة أكواد الشحن</title>
                <link href="https://fonts.googleapis.com/css2?family=Russo+One&display=swap" rel="stylesheet">
                <style>
                    *, *::before, *::after { padding: 0; margin: 0; box-sizing: border-box; }
                    body { background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    @page { size: A4 portrait; margin-top: 4.5mm; margin-bottom: 4mm; margin-left: 10mm; margin-right: 10mm; }
                    @media print { div.card { page-break-inside: avoid; } ::-webkit-scrollbar { display: none; } }
                    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
                    .card { background-image: url('${bgImageBase64}'); background-position: center; background-repeat: no-repeat; background-size: cover; aspect-ratio: 21 / 10; position: relative; font-family: 'Russo One', sans-serif; }
                    .price { position: absolute; top: 6%; left: 11%; font-weight: 900; color: black; }
                    .index { position: absolute; bottom: 25%; left: 50%; transform: translateX(-50%); font-weight: 900; color: black; letter-spacing: 1px; }
                    .code { position: absolute; bottom: 5%; left: 50%; transform: translateX(-50%); font-size: 13px; font-weight: 900; letter-spacing: 1px; width: 100%; text-align: center; }
                </style>
            </head>
            <body>
                <div class="grid">${cardsHtml}</div>
                <script> window.onload = () => { setTimeout(() => { window.print(); }, 500); }; </script>
            </body>
            </html>
            `;

            printWindow.document.open();
            printWindow.document.write(htmlContent);
            printWindow.document.close();
            
        } catch (error) {
            console.error("لم يتم الطباعة لوجود خطأ في السيرفر");
        } finally {
            setIsGenerating(false);
            onClose();
        }
    };

    const priceStrLen = codePriceLabel.toString().length;
    let previewPriceSize = '11px';
    if (priceStrLen === 4) previewPriceSize = '8px';
    if (priceStrLen >= 5) previewPriceSize = '6px';

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
            <div style={{ background: '#1a1a2e', width: '100%', maxWidth: '500px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)', padding: '25px', animation: 'fadeIn 0.2s ease', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: '0 0 5px 0', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}><FaQrcode color="#9b59b6"/> مصنع تصميم وطباعة الأكواد</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--txt-mut)', cursor: 'pointer', fontSize: '1.2rem' }}><FaTimes /></button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
                    
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => { setType('wallet'); setCodePriceLabel(parseInt(walletValue) || 0); }} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: type === 'wallet' ? '2px solid #2ecc71' : '1px solid rgba(255,255,255,0.1)', background: type === 'wallet' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(0,0,0,0.2)', color: type === 'wallet' ? 'white' : 'var(--txt-mut)', cursor: 'pointer', fontWeight: 'bold' }}>رصيد محفظة</button>
                        <button onClick={() => { setType('course'); setCodePriceLabel(0); }} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: type === 'course' ? '2px solid #3498db' : '1px solid rgba(255,255,255,0.1)', background: type === 'course' ? 'rgba(52, 152, 219, 0.1)' : 'rgba(0,0,0,0.2)', color: type === 'course' ? 'white' : 'var(--txt-mut)', cursor: 'pointer', fontWeight: 'bold' }}>مخصص لكورس</button>
                    </div>

                    {type === 'wallet' ? (
                        <div>
                            <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '0.9rem' }}>قيمة الكود (بالجنيه)</label>
                            <input type="number" placeholder="مثال: 100" value={walletValue} onChange={e => { setWalletValue(e.target.value); setCodePriceLabel(parseInt(e.target.value) || 0); }} style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }} />
                        </div>
                    ) : (
                        <div>
                            <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '0.9rem' }}>اختر الكورس المستهدف</label>
                            <select value={courseId} onChange={e => setCourseId(e.target.value)} disabled={isLoadingCourses} style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }}>
                                {isLoadingCourses ? (
                                    <option value="" style={{ background: '#1e1e2d' }}>جاري تحميل الكورسات...</option>
                                ) : courses.length > 0 ? (
                                    courses.map(course => (
                                        <option key={course.id} value={course.id} style={{ background: '#1e1e2d' }}>
                                            {course.title || course.name}
                                        </option>
                                    ))
                                ) : (
                                    <option value="" style={{ background: '#1e1e2d' }}>لا توجد كورسات متاحة حالياً</option>
                                )}
                            </select>
                        </div>
                    )}

                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '15px' }}>
                            <div>
                                <label style={{ display: 'block', color: 'var(--txt-mut)', fontSize: '0.8rem', marginBottom: '5px' }}>العدد المطلوب</label>
                                <input type="number" value={count} onChange={(e) => setCount(e.target.value)} style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '5px', outline: 'none' }} />
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
                                    <div style={{ color: 'var(--txt-mut)', fontSize: '0.9rem' }}>اضغط لرفع صورة خلفية الكارت</div>
                                </>
                            )}
                        </div>

                        <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '15px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px dashed rgba(255,255,255,0.05)' }}>
                            <h4 style={{ margin: '0 0 15px 0', color: 'var(--txt-mut)' }}>معاينة الطباعة</h4>
                            <div style={{ width: '100%', aspectRatio: '21/10', background: bgImageBase64 ? `url(${bgImageBase64}) center/cover no-repeat` : '#1e1e2d', borderRadius: '10px', position: 'relative', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                                {!bgImageBase64 && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>ارفع التصميم للمعاينة هنا</div>}
                                
                                <div style={{ position: 'absolute', top: '6%', left: '11%', fontWeight: '900', color: '#000', fontSize: previewPriceSize }}>
                                    {codePriceLabel}
                                </div>
                                
                                <div style={{ position: 'absolute', bottom: '25%', left: '50%', transform: 'translateX(-50%)', color: '#000', fontWeight: '900', fontSize: '11px', letterSpacing: '1px' }}>
                                    123
                                </div>
                                
                                <div style={{ position: 'absolute', bottom: '5%', left: '50%', transform: 'translateX(-50%)', width: '100%', textAlign: 'center' }}>
                                    <div style={{ color: codeTextColor, fontSize: '13px', fontWeight: 900, letterSpacing: '1px' }}>
                                        1234 5678 9012 3456
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <button 
                    onClick={handleGenerateAndPrint} 
                    disabled={isGenerating}
                    style={{ width: '100%', background: isGenerating ? 'gray' : '#2ecc71', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: isGenerating ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '1rem' }}
                >
                    <FaPrint /> {isGenerating ? 'جاري التوليد والطباعة...' : 'تسجيل الأكواد وطباعة الشيت 🖨️'}
                </button>
            </div>
        </div>
    );
};