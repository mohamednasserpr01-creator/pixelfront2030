import { useState, useRef } from 'react';
import { generateCodesData } from '@/features/shared/utils/codeGenerator'; 
import { PricingService, GeneratedCodePayload } from '../services/pricing.service';

export const usePricing = (initialCoursePrice: number = 500) => {
    // 1. States
    const [isFree, setIsFree] = useState(false);
    const [coursePrice, setCoursePrice] = useState(initialCoursePrice);
    const [hasDiscount, setHasDiscount] = useState(false);
    const [discountPrice, setDiscountPrice] = useState(350);
    const [allowPartialPurchase, setAllowPartialPurchase] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'custom_codes' | 'both'>('both');
    const [lecturePrices, setLecturePrices] = useState<Record<string, number>>({});

    const [showCodeGenerator, setShowCodeGenerator] = useState(false);
    const [codeCount, setCodeCount] = useState(54);
    const [codeTextColor, setCodeTextColor] = useState('#000000');
    const [codePriceLabel, setCodePriceLabel] = useState(initialCoursePrice);
    const [codeTarget, setCodeTarget] = useState<string>('full_course'); 
    
    const [bgImageBase64, setBgImageBase64] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [isGenerating, setIsGenerating] = useState(false); // حالة التحميل

    // 2. Handlers
    const handleLecturePriceChange = (lectureId: string, price: number) => {
        setLecturePrices(prev => ({ ...prev, [lectureId]: price }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => setBgImageBase64(event.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleGenerateCourseCodes = async () => {
        // Validation
        if (codeCount <= 0) return alert("❌ عدد الأكواد يجب أن يكون أكبر من صفر!");
        if (codePriceLabel < 0) return alert("❌ السعر لا يمكن أن يكون بالسالب!");
        if (!bgImageBase64) return alert("⚠️ يرجى رفع صورة خلفية الكارت أولاً!");

        try {
            setIsGenerating(true);

            // توليد الداتا
            const rawCodesData = generateCodesData(codeCount, codePriceLabel);

            // إرسال للباك إند
            const dbPayload: GeneratedCodePayload[] = rawCodesData.map(c => ({
                code: c.code,
                serial: c.serial,
                price: Number(c.price),
                targetId: codeTarget,
                targetType: codeTarget === 'full_course' ? 'full_course' : 'lecture',
                createdBy: 'ADMIN_ID',
                isUsed: false
            }));

            await PricingService.saveGeneratedCodes(dbPayload);

            // بناء الـ HTML خام للطباعة (بعد نجاح الحفظ فقط)
            let cardsHtml = '';
            rawCodesData.forEach(c => {
                cardsHtml += `
                    <div class="card">
                        <p class="price">${c.price}</p>
                        <p class="index">${c.serial}</p>
                        <p class="code" style="color: ${codeTextColor}">${c.code}</p>
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
            
        } catch (error) {
            console.error(error);
            alert("❌ حدث خطأ أثناء الحفظ! لن تتم الطباعة لمنع ضياع الأكواد.");
        } finally {
            setIsGenerating(false);
        }
    };

    return {
        isFree, setIsFree, coursePrice, setCoursePrice, hasDiscount, setHasDiscount,
        discountPrice, setDiscountPrice, allowPartialPurchase, setAllowPartialPurchase,
        paymentMethod, setPaymentMethod, lecturePrices, handleLecturePriceChange,
        showCodeGenerator, setShowCodeGenerator, codeCount, setCodeCount,
        codeTextColor, setCodeTextColor, codePriceLabel, setCodePriceLabel,
        codeTarget, setCodeTarget, fileInputRef, bgImageBase64, setBgImageBase64,
        handleImageUpload, handleGenerateCourseCodes, isGenerating
    };
};