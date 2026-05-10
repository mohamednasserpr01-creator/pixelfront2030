"use client";
import React, { useState, useRef } from 'react';
import { FaTimes, FaQrcode, FaPalette, FaImage, FaTrash, FaPrint } from 'react-icons/fa';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (type: 'wallet' | 'course', value: string, count: number) => any[];
}

export const CodeGeneratorModal: React.FC<Props> = ({ isOpen, onClose, onGenerate }) => {
    const [type, setType] = useState<'wallet' | 'course'>('wallet');
    const [walletValue, setWalletValue] = useState('100');
    const [courseId, setCourseId] = useState('كورس المراجعة النهائية');
    const [count, setCount] = useState('54'); 

    const [codePriceLabel, setCodePriceLabel] = useState(100);
    const [codeTextColor, setCodeTextColor] = useState('#000000');
    const [bgImageBase64, setBgImageBase64] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleGenerateAndPrint = () => {
        const numCount = parseInt(count);
        if (isNaN(numCount) || numCount <= 0) return alert("❌ عدد الأكواد يجب أن يكون أكبر من صفر!");
        if (type === 'wallet' && (!walletValue || isNaN(parseInt(walletValue)))) return alert("❌ يرجى إدخال قيمة صحيحة للمحفظة!");
        if (!bgImageBase64) return alert("⚠️ يرجى رفع صورة خلفية الكارت أولاً!");

        setIsGenerating(true);

        setTimeout(() => {
            const value = type === 'wallet' ? walletValue : courseId;
            
            // 1. توليد الداتا من الجدول بتاعنا عشان تتسجل
            const newCodes = onGenerate(type, value, numCount);
            
            // 2. كود الـ HTML الداخلي بتاعك بالحرف (class="index")
            let cardsHtml = '';
            newCodes.forEach(c => {
                cardsHtml += `
                    <div class="card">
                        <p class="price">${codePriceLabel}</p>
                        <p class="index">${c.serial}</p>
                        <p class="code" style="color: ${codeTextColor}">${c.code}</p>
                    </div>
                `;
            });

            // 3. فتح نافذة الطباعة
            const printWindow = window.open('', '_blank');
            if (!printWindow) {
                alert("يرجى السماح بالنوافذ المنبثقة (Pop-ups).");
                setIsGenerating(false);
                return;
            }

            // 4. كود التصميم بتاعك حرفياً بدون أي تعديل
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
                    .price { position: absolute; top: 6%; left: 11%; font-size: 11px; font-weight: 900; color: black; }
                    .index { position: absolute; bottom: 25%; left: 50%; transform: translateX(-50%); font-size: 11px; font-weight: 900; color: black; letter-spacing: 1px; }
                    .code { position: absolute; bottom: 5%; left: 50%; transform: translateX(-50%); font-size: 13px; font-weight: 900; letter-spacing: 1px; }
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
            
            setIsGenerating(false);
            onClose();
        }, 1000);
    };

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
                            <select value={courseId} onChange={e => setCourseId(e.target.value)} style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }}>
                                <option value="كورس المراجعة النهائية" style={{ background: '#1e1e2d' }}>كورس المراجعة النهائية</option>
                                <option value="كورس الباب الأول" style={{ background: '#1e1e2d' }}>كورس الباب الأول</option>
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