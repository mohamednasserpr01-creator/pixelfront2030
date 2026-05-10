// FILE: app/admin/messages/page.tsx
"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
    FaSearch, FaPaperPlane, FaPaperclip, FaCheckDouble, 
    FaUserCircle, FaPhoneAlt, FaBan, FaComments, FaUnlock, FaCalendarAlt 
} from 'react-icons/fa';
import { useToast } from '../../../context/ToastContext';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';

// 💡 توليد 50 محادثة بتواريخ مختلفة عشان نجرب فلتر التاريخ
const generateMockChats = () => {
    return Array.from({ length: 50 }, (_, i) => {
        // توليد تواريخ وهمية للـ 5 أيام اللي فاتوا
        const d = new Date();
        d.setDate(d.getDate() - (i % 5));
        const dateStr = d.toISOString().split('T')[0];

        return {
            id: i + 1,
            name: i === 0 ? 'يوسف أحمد' : i === 1 ? 'شهد محمود' : i === 2 ? 'علي مصطفى' : `طالب تجريبي ${i + 1}`,
            grade: i % 3 === 0 ? 'الصف الأول الثانوي' : (i % 2 === 0 ? 'الصف الثاني الثانوي' : 'الصف الثالث الثانوي'),
            code: `PX-${1000 + i}`,
            phone: `010${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
            lastMsg: i === 0 ? 'لو سمحت الفيديو بيقطع عندي' : i === 1 ? 'ممكن اعرف كود الشحن بكام؟' : 'يا مستر المنصة مش بتفتح',
            time: i === 0 ? '10:30 ص' : i === 1 ? '09:15 ص' : 'أمس',
            date: dateStr, // 💡 حقل التاريخ الفعلي للبحث
            unread: i < 3 ? Math.floor(Math.random() * 3) : 0,
            online: i % 4 === 0,
            isBanned: false
        };
    });
};

export default function SupportMessages() {
    const router = useRouter();
    const { showToast } = useToast();
    
    const [mounted, setMounted] = useState(false);
    const [chats, setChats] = useState<any[]>([]);
    const [activeChatId, setActiveChatId] = useState<number | null>(1);
    const [msgText, setMsgText] = useState('');
    
    // 💡 حالات البحث (نص + تاريخ)
    const [searchQuery, setSearchQuery] = useState('');
    const [searchDate, setSearchDate] = useState('');
    
    const [isBanModalOpen, setIsBanModalOpen] = useState(false);

    useEffect(() => {
        setChats(generateMockChats());
        setMounted(true);
    }, []);

    // 💡 فلترة المحادثات (البحث بالنص والتاريخ)
    const filteredChats = useMemo(() => {
        return chats.filter(c => {
            const matchesText = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                c.phone.includes(searchQuery);
            
            const matchesDate = searchDate === '' || c.date === searchDate;

            return matchesText && matchesDate;
        });
    }, [chats, searchQuery, searchDate]);

    const activeUser = chats.find(c => c.id === activeChatId);

    const handleGoToProfile = () => {
        showToast(`جاري فتح ملف الطالب: ${activeUser?.name}...`, 'info');
        router.push('/admin/students');
    };

    const toggleBanStatus = () => {
        setChats(chats.map(c => c.id === activeChatId ? { ...c, isBanned: !c.isBanned } : c));
        setIsBanModalOpen(false);
        if (!activeUser?.isBanned) {
            showToast(`تم حظر الطالب ${activeUser?.name} بنجاح!`, 'error');
        } else {
            showToast(`تم فك الحظر عن الطالب ${activeUser?.name}!`, 'success');
        }
    };

    if (!mounted) return null;

    return (
        <div style={{ animation: 'fadeIn 0.5s ease', height: 'calc(100vh - 120px)', display: 'flex', gap: '20px' }}>
            
            <div style={{ width: '380px', background: 'var(--card)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 900 }}>رسائل الدعم الفني</h2>
                        <span style={{ background: 'rgba(108,92,231,0.1)', color: 'var(--p-purple)', padding: '5px 10px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                            {filteredChats.length} محادثة
                        </span>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ position: 'relative' }}>
                            <FaSearch style={{ position: 'absolute', right: '15px', top: '12px', color: 'var(--txt-mut)' }} />
                            <input 
                                type="text" 
                                placeholder="بحث بالاسم، الكود، التليفون..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 40px 10px 15px', borderRadius: '10px', color: 'var(--txt)', outline: 'none' }} 
                            />
                        </div>
                        {/* 💡 فلتر التاريخ */}
                        <div style={{ position: 'relative' }}>
                            <FaCalendarAlt style={{ position: 'absolute', right: '15px', top: '12px', color: 'var(--txt-mut)' }} />
                            <input 
                                type="date" 
                                value={searchDate}
                                onChange={(e) => setSearchDate(e.target.value)}
                                style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 15px 10px 40px', borderRadius: '10px', color: 'var(--txt)', outline: 'none', fontFamily: 'inherit' }} 
                            />
                            {searchDate && (
                                <button onClick={() => setSearchDate('')} style={{ position: 'absolute', left: '10px', top: '12px', background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>إلغاء</button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="chat-list-scrollbar" style={{ overflowY: 'auto', flex: 1 }}>
                    <style>{`
                        .chat-list-scrollbar::-webkit-scrollbar { width: 5px; }
                        .chat-list-scrollbar::-webkit-scrollbar-track { background: transparent; }
                        .chat-list-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
                    `}</style>
                    
                    {filteredChats.length > 0 ? (
                        filteredChats.map(chat => (
                            <div key={chat.id} onClick={() => setActiveChatId(chat.id)} style={{ padding: '15px 20px', display: 'flex', gap: '15px', cursor: 'pointer', background: activeChatId === chat.id ? 'rgba(108,92,231,0.1)' : 'transparent', borderBottom: '1px solid rgba(255,255,255,0.02)', transition: '0.2s', opacity: chat.isBanned ? 0.5 : 1 }}>
                                <div style={{ position: 'relative' }}>
                                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--bg)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: chat.isBanned ? 'var(--danger)' : 'var(--p-purple)', fontSize: '1.2rem', fontWeight: 'bold', border: chat.isBanned ? '1px solid var(--danger)' : 'none' }}>
                                        {chat.isBanned ? <FaBan /> : chat.name.charAt(0)}
                                    </div>
                                    {chat.online && !chat.isBanned && <div style={{ position: 'absolute', bottom: '2px', right: '2px', width: '12px', height: '12px', background: 'var(--success)', borderRadius: '50%', border: '2px solid var(--card)' }}></div>}
                                </div>
                                <div style={{ flex: 1, overflow: 'hidden' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                        <strong style={{ color: chat.isBanned ? 'var(--danger)' : 'white', fontSize: '1rem', textDecoration: chat.isBanned ? 'line-through' : 'none' }}>{chat.name}</strong>
                                        <span style={{ fontSize: '0.75rem', color: chat.unread ? 'var(--p-purple)' : 'var(--txt-mut)' }}>{chat.date}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.85rem', color: chat.unread ? 'white' : 'var(--txt-mut)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {chat.isBanned ? '🚫 حساب محظور' : chat.lastMsg}
                                        </span>
                                        {chat.unread > 0 && !chat.isBanned && <span style={{ background: 'var(--p-purple)', color: 'white', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold' }}>{chat.unread}</span>}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ padding: '30px', textAlign: 'center', color: 'var(--txt-mut)' }}>
                            لا توجد محادثات مطابقة للبحث.
                        </div>
                    )}
                </div>
            </div>

            {/* منطقة الشات */}
            <div style={{ flex: 1, background: 'var(--card)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
                {activeUser ? (
                    <>
                        <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.1)', flexWrap: 'wrap', gap: '15px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: activeUser.isBanned ? 'var(--danger)' : 'var(--p-purple)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                    {activeUser.name.charAt(0)}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 900, color: activeUser.isBanned ? 'var(--danger)' : 'white', fontSize: '1.1rem' }}>
                                        {activeUser.name} <span style={{ fontSize: '0.8rem', color: 'var(--warning)', fontFamily: 'monospace', marginLeft: '10px' }}>({activeUser.code})</span>
                                        {activeUser.isBanned && <span style={{ fontSize: '0.8rem', background: 'var(--danger)', color: 'white', padding: '2px 8px', borderRadius: '10px', marginLeft: '10px' }}>محظور</span>}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--txt-mut)' }}>{activeUser.grade} - 📱 {activeUser.phone}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={() => setIsBanModalOpen(true)} style={{ background: activeUser.isBanned ? 'rgba(46,204,113,0.1)' : 'rgba(231,76,60,0.1)', color: activeUser.isBanned ? 'var(--success)' : 'var(--danger)', border: 'none', padding: '10px 15px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', transition: '0.3s' }}>
                                    {activeUser.isBanned ? <><FaUnlock /> فك الحظر</> : <><FaBan /> حظر الطالب</>}
                                </button>
                                <button onClick={handleGoToProfile} style={{ background: 'rgba(108,92,231,0.1)', color: 'var(--p-purple)', border: 'none', padding: '10px 15px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', transition: '0.3s' }}>
                                    <FaUserCircle /> ملف الطالب
                                </button>
                            </div>
                        </div>

                        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div style={{ textAlign: 'center', color: 'var(--txt-mut)', fontSize: '0.8rem', margin: '10px 0' }}>تاريخ المحادثة: {activeUser.date}</div>
                            
                            <div style={{ display: 'flex', gap: '10px', maxWidth: '70%' }}>
                                <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: 'var(--bg)', flexShrink: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--txt)' }}>{activeUser.name.charAt(0)}</div>
                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '0 15px 15px 15px', color: 'white', fontSize: '0.95rem', lineHeight: '1.5' }}>
                                    {activeUser.lastMsg}
                                    <div style={{ fontSize: '0.7rem', color: 'var(--txt-mut)', marginTop: '5px', textAlign: 'left' }}>{activeUser.time}</div>
                                </div>
                            </div>

                            {activeUser.isBanned && (
                                <div style={{ textAlign: 'center', margin: '20px 0' }}>
                                    <span style={{ background: 'rgba(231,76,60,0.1)', color: 'var(--danger)', padding: '10px 20px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                        🚫 لا يمكن إرسال رسائل لطالب محظور.
                                    </span>
                                </div>
                            )}
                        </div>

                        <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '15px', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.1)', opacity: activeUser.isBanned ? 0.5 : 1, pointerEvents: activeUser.isBanned ? 'none' : 'auto' }}>
                            <button style={{ background: 'none', border: 'none', color: 'var(--txt-mut)', fontSize: '1.2rem', cursor: 'pointer' }}><FaPaperclip /></button>
                            <input 
                                type="text" 
                                placeholder="اكتب رسالتك هنا..." 
                                value={msgText}
                                onChange={(e) => setMsgText(e.target.value)}
                                onKeyDown={(e) => { if(e.key === 'Enter' && msgText.trim()) { showToast('تم إرسال الرسالة!', 'success'); setMsgText(''); } }}
                                style={{ flex: 1, background: 'var(--bg)', border: '1px solid rgba(255,255,255,0.1)', padding: '15px 20px', borderRadius: '25px', color: 'white', outline: 'none' }}
                            />
                            <button onClick={() => { if(msgText.trim()){ showToast('تم إرسال الرسالة!', 'success'); setMsgText(''); } }} style={{ background: 'var(--p-purple)', border: 'none', color: 'white', width: '50px', height: '50px', borderRadius: '50%', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem', transition: '0.3s', transform: msgText ? 'scale(1.1)' : 'scale(1)' }}>
                                <FaPaperPlane style={{ marginLeft: '-3px' }}/>
                            </button>
                        </div>
                    </>
                ) : (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'var(--txt-mut)' }}>
                        <FaComments style={{ fontSize: '4rem', opacity: 0.2, marginBottom: '20px' }} />
                        <h3>اختر محادثة للبدء</h3>
                    </div>
                )}
            </div>

            <Modal isOpen={isBanModalOpen} onClose={() => setIsBanModalOpen(false)} title={activeUser?.isBanned ? "فك حظر الطالب" : "تأكيد حظر الطالب"} maxWidth="400px">
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                    <div style={{ fontSize: '3rem', color: activeUser?.isBanned ? 'var(--success)' : 'var(--danger)', marginBottom: '15px' }}>
                        {activeUser?.isBanned ? <FaUnlock /> : <FaBan />}
                    </div>
                    <p style={{ fontSize: '1.1rem', color: 'var(--txt)', marginBottom: '10px' }}>هل أنت متأكد من {activeUser?.isBanned ? "فك حظر" : "حظر"} الطالب <strong>{activeUser?.name}</strong>؟</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--txt-mut)', marginBottom: '25px' }}>{activeUser?.isBanned ? "سيتمكن الطالب من إرسال واستقبال الرسائل مرة أخرى." : "لن يتمكن الطالب من الدخول للمنصة أو إرسال أي رسائل للدعم."}</p>
                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                        <Button variant="outline" onClick={() => setIsBanModalOpen(false)}>تراجع</Button>
                        <Button variant="primary" style={{ background: activeUser?.isBanned ? 'var(--success)' : 'var(--danger)' }} onClick={toggleBanStatus}>{activeUser?.isBanned ? "نعم، فك الحظر" : "نعم، احظر الطالب"}</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}