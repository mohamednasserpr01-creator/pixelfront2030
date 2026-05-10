import React from 'react';
import { FaTimes, FaCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';

// 💡 السر هنا: ضفنا lang للكتالوج عشان الـ TypeScript يفهمها وميزعلش
interface Props {
    onAccept: () => void;
    onClose: () => void;
    lang: string;
}

export default function TermsModal({ onAccept, onClose, lang }: Props) {
    const isAr = lang === 'ar';

    return (
        <div className="modal-overlay active" onClick={onClose} style={{ zIndex: 9999 }}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.9 }}
                className="modal-box" 
                onClick={e => e.stopPropagation()} 
                style={{ direction: isAr ? 'rtl' : 'ltr', background: 'var(--card)', padding: '30px', borderRadius: '20px', maxWidth: '500px', width: '90%' }}
            >
                <button className="close-modal-btn" onClick={onClose} style={{ left: isAr ? '15px' : 'auto', right: isAr ? 'auto' : '15px', background: 'none', border: 'none', color: '#e74c3c', fontSize: '1.5rem', cursor: 'pointer' }}>
                    <FaTimes />
                </button>
                
                <h2 style={{ color: 'var(--p-purple)', marginBottom: '15px', fontWeight: 'bold' }}>
                    {isAr ? 'الشروط والأحكام 📜' : 'Terms & Conditions 📜'}
                </h2>
                
                <div style={{ maxHeight: '300px', overflowY: 'auto', color: 'var(--txt-mut)', lineHeight: '1.8', marginBottom: '25px', paddingRight: isAr ? '0' : '10px', paddingLeft: isAr ? '10px' : '0' }}>
                    <p>{isAr ? 'مرحباً بك في بيكسل أكاديمي. يرجى قراءة الشروط والأحكام بعناية:' : 'Welcome to Pixel Academy. Please read the terms carefully:'}</p>
                    <ul style={{ padding: isAr ? '0 20px 0 0' : '0 0 0 20px', marginTop: '10px' }}>
                        <li>{isAr ? 'الالتزام بحضور المحاضرات في موعدها.' : 'Commitment to attending lectures on time.'}</li>
                        <li>{isAr ? 'عدم مشاركة الحساب مع أي شخص آخر.' : 'Do not share your account with anyone else.'}</li>
                        <li>{isAr ? 'احترام المعلمين والزملاء في المنصة.' : 'Respect teachers and peers on the platform.'}</li>
                    </ul>
                </div>
                
                <button className="glow-btn" onClick={onAccept} style={{ width: '100%', padding: '15px', background: 'var(--success)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                    {isAr ? 'موافق' : 'I Agree'} <FaCheck />
                </button>
            </motion.div>
        </div>
    );
}