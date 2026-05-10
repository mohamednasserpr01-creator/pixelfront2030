"use client";
import React, { useEffect, useState } from 'react';

export default function PrintCodesPage() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        // قراءة الداتا من المتصفح اللي بعتتها شاشة التسعير
        const stored = localStorage.getItem('print_codes_data');
        if (stored) {
            setData(JSON.parse(stored));
            // 💡 أمر الطباعة التلقائي بعد ثانية عشان الصورة تلحق تحمل
            setTimeout(() => {
                window.print();
            }, 1000);
        }
    }, []);

    if (!data) return <div style={{ padding: '50px', textAlign: 'center', fontSize: '2rem', direction: 'rtl' }}>جاري التجهيز للطباعة... 🖨️</div>;

    return (
        <div id="print-area">
            {/* 🚀 السحر هنا: استخدام نفس كود الـ C# القديم بتاعك بالظبط مع حماية الطباعة */}
            <style dangerouslySetInnerHTML={{__html: `
                @import url('https://fonts.googleapis.com/css2?family=Russo+One&display=swap');

                /* 💡 إخفاء كل السايد بار والناف بار وقت الطباعة وتوسيع الشاشة بالكامل للكروت */
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    #print-area, #print-area * {
                        visibility: visible;
                    }
                    #print-area {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                    /* 💡 نفس المارجن المخصص اللي إنت بتعمله في جوجل كروم بالمللي! */
                    @page {
                        size: A4 portrait;
                        margin-top: 4.5mm;
                        margin-bottom: 4mm;
                        margin-left: 10mm;
                        margin-right: 10mm;
                    }
                    ::-webkit-scrollbar { display: none; }
                }

                *, *::before, *::after {
                    padding: 0;
                    margin: 0;
                    box-sizing: border-box;
                }

                body {
                    background: white;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }

                /* 💡 نفس الـ Grid بتاعك بالمللي */
                .grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 10px;
                }

                .card {
                    background-image: url('${data.background}');
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: cover;
                    aspect-ratio: 21 / 10;
                    color: ${data.color || 'black'};
                    position: relative;
                    font-family: 'Russo One', sans-serif;
                    page-break-inside: avoid;
                }

                .price {
                    position: absolute;
                    top: 6%;
                    left: 11%;
                    font-size: 10px;
                    font-weight: bold;
                    color: black;
                }

                .index {
                    position: absolute;
                    bottom: 25%;
                    left: 50%;
                    transform: translateX(-50%);
                    font-size: 10px;
                    font-weight: bold;
                    color: black;
                }

                .code {
                    position: absolute;
                    bottom: 5%;
                    left: 50%;
                    transform: translateX(-50%);
                    font-size: 14px;
                    font-weight: bold;
                    letter-spacing: 1px;
                }
            `}} />

            <div className="grid">
                {data.codes.map((c: any, i: number) => (
                    <div key={i} className="card">
                        <p className="price">{c.price}</p>
                        <p className="index">{c.serial}</p>
                        <p className="code">{c.code}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}