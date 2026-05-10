"use client";
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FaGripVertical, FaCog, FaFilePdf, FaLink, FaChartBar, FaPenNib } from 'react-icons/fa'; // 🚀 استدعاء أيقونة القلم
import { LectureItem as LectureItemType } from '../types/curriculum.types';
import { getIconForType } from '../utils/icon.utils';
import styles from '../styles/builder.module.css';

interface Props {
    item: LectureItemType;
    onOpenSettings: (item: LectureItemType) => void;
    onOpenReports?: (item: LectureItemType) => void; 
    onOpenGrading?: (item: LectureItemType) => void; // 🚀 إضافة خاصية دالة التصحيح
}

export const LectureItem: React.FC<Props> = ({ item, onOpenSettings, onOpenReports, onOpenGrading }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });
    
    const dndStyle = { transform: CSS.Transform.toString(transform), transition };

    return (
        <div ref={setNodeRef} style={dndStyle} className={styles.itemWrapper}>
            <div className={styles.itemLeft}>
                <div {...attributes} {...listeners} className={styles.dragHandle}>
                    <FaGripVertical />
                </div>
                
                <div className={styles.itemInfo}>
                    <span className={styles.itemTitle}>
                        {getIconForType(item.type)} {item.title}
                    </span>
                    
                    <div className={styles.badges}>
                        {item.hasPdf && <span className={`${styles.badge} ${styles.badgePdf}`}><FaFilePdf /> PDF</span>}
                        {item.hasRef && <span className={`${styles.badge} ${styles.badgeRef}`}><FaLink /> مراجع</span>}
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                
                {/* 🚀 زرار مركز التصحيح المقالي (يظهر فقط مع الامتحانات والواجبات) */}
                {onOpenGrading && ['exam', 'homework', 'makeup_exam'].includes(item.type) && (
                    <button 
                        onClick={() => onOpenGrading(item)}
                        style={{ background: 'rgba(230, 126, 34, 0.1)', border: 'none', color: '#e67e22', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', transition: '0.2s' }}
                        title="مركز التصحيح المقالي"
                    >
                        <FaPenNib /> تصحيح
                    </button>
                )}

                {/* زرار التقارير */}
                {onOpenReports && (
                    <button 
                        onClick={() => onOpenReports(item)}
                        style={{ background: 'rgba(241, 196, 15, 0.1)', border: 'none', color: '#f1c40f', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', transition: '0.2s' }}
                        title="التقارير والإحصائيات"
                    >
                        <FaChartBar /> التقارير
                    </button>
                )}

                <button onClick={() => onOpenSettings(item)} className={styles.iconBtn}>
                    <FaCog />
                </button>
            </div>
        </div>
    );
};