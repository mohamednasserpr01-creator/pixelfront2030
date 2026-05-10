// FILE: components/ui/EgyptMap.tsx
import React, { useState } from 'react';

// 💡 دي الداتا اللي هتيجي من الباك إند أو قاعدة البيانات
export const mapData = {
    'EG-C': { name: 'القاهرة', count: 4520, color: '#e84393' },
    'EG-ALX': { name: 'الإسكندرية', count: 3200, color: '#0984e3' },
    'EG-GZ': { name: 'الجيزة', count: 2100, color: '#d63031' },
    'EG-MT': { name: 'مطروح', count: 800, color: '#f1c40f' },
    'EG-BA': { name: 'البحر الأحمر', count: 1200, color: '#00cec9' },
    'EG-WAD': { name: 'الوادي الجديد', count: 450, color: '#e17055' },
    // ... (وهكذا لباقي الـ 27 محافظة)
};

export default function EgyptMap() {
    const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, data: null as any });

    const handleMouseEnter = (e: React.MouseEvent, govId: string) => {
        const data = mapData[govId as keyof typeof mapData];
        if (data) {
            setTooltip({ show: true, x: e.pageX, y: e.pageY, data });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (tooltip.show) {
            setTooltip(prev => ({ ...prev, x: e.pageX, y: e.pageY }));
        }
    };

    const handleMouseLeave = () => {
        setTooltip({ show: false, x: 0, y: 0, data: null });
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center' }}>
            
            {/* خريطة SVG */}
            <svg 
                viewBox="0 0 800 800" /* أبعاد الخريطة العالمية */
                style={{ width: '100%', maxWidth: '600px', filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.3))' }}
                onMouseMove={handleMouseMove}
            >
                {/* 💡 هنا بيتم وضع الـ 27 مسار (Paths) الحقيقيين للمحافظات 
                  أنا حاطط أمثلة توضيحية للفكرة، الإحداثيات الحقيقية بتيجي من ملف SVG
                */}
                
                {/* محافظة مطروح */}
                <path 
                    id="EG-MT"
                    d="..." /* ⚠️ هنا بيتحط كود المسار الحقيقي لمطروح اللي بيبقى مئات الأرقام */
                    fill={mapData['EG-MT']?.color || '#333'}
                    stroke="rgba(255,255,255,0.5)"
                    strokeWidth="1.5"
                    style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
                    onMouseEnter={(e) => handleMouseEnter(e, 'EG-MT')}
                    onMouseLeave={handleMouseLeave}
                    onMouseOver={(e) => e.currentTarget.style.filter = 'brightness(1.3)'}
                    onMouseOut={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                />

                {/* محافظة الوادي الجديد */}
                <path 
                    id="EG-WAD"
                    d="..." /* ⚠️ كود المسار الحقيقي للوادي الجديد */
                    fill={mapData['EG-WAD']?.color || '#333'}
                    stroke="rgba(255,255,255,0.5)"
                    strokeWidth="1.5"
                    style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
                    onMouseEnter={(e) => handleMouseEnter(e, 'EG-WAD')}
                    onMouseLeave={handleMouseLeave}
                    onMouseOver={(e) => e.currentTarget.style.filter = 'brightness(1.3)'}
                    onMouseOut={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                />
                
                {/* وهكذا لباقي الـ 27 محافظة... */}
            </svg>

            {/* الـ Tooltip اللي بيطير مع الماوس */}
            {tooltip.show && tooltip.data && (
                <div style={{
                    position: 'fixed',
                    top: tooltip.y - 100, // بيظهر فوق الماوس بشوية
                    left: tooltip.x - 100, // متمركز مع الماوس
                    background: 'rgba(15, 23, 42, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: `2px solid ${tooltip.data.color}`,
                    padding: '20px',
                    borderRadius: '15px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                    pointerEvents: 'none', // عشان الماوس ميعلقش عليه
                    zIndex: 99999,
                    color: 'white',
                    width: '200px',
                    textAlign: 'center'
                }}>
                    <h3 style={{ color: tooltip.data.color, marginBottom: '10px', fontSize: '1.4rem', fontWeight: 900 }}>
                        {tooltip.data.name}
                    </h3>
                    <div style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '5px' }}>
                        {tooltip.data.count.toLocaleString()}
                    </div>
                    <div style={{ color: 'var(--txt-mut)', fontSize: '0.9rem' }}>طالب مسجل</div>
                </div>
            )}
        </div>
    );
}