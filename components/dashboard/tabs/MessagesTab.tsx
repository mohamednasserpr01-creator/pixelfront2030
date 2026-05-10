"use client";
import React, { useState, useRef, useEffect } from 'react';
import { FaEnvelope, FaRobot, FaSearch, FaPaperPlane, FaComments, FaCircle, FaArrowRight, FaArrowLeft } from 'react-icons/fa';

interface Message {
    id: number;
    sender: 'me' | 'them';
    text: string;
    time: string;
}

export default function MessagesTab({ lang }: { lang: string }) {
    const isAr = lang === 'ar';

    // 💡 على الموبايل هنخلي الـ activeChatId بـ null في البداية عشان نعرض قائمة المحادثات
    const [activeChatId, setActiveChatId] = useState<number | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const chatBodyRef = useRef<HTMLDivElement>(null);

    const conversations = [
        { id: 1, name: 'Physics_Lover', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack', isBot: false, unread: true },
        { id: 2, name: 'Pixel Bot', isBot: true, avatar: '', unread: false },
        { id: 3, name: 'د. أحمد سمير', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher', isBot: false, unread: false },
    ];

    const [chatHistories, setChatHistories] = useState<Record<number, Message[]>>({
        1: [
            { id: 101, sender: 'them', text: 'يا صاحبي حليت مسألة كيرشوف الصعبة ولا لسه؟', time: '10:00 AM' },
            { id: 102, sender: 'me', text: 'لسه والله، بحاول فيها من الصبح ومعقدة شوية 😅', time: '10:05 AM' },
            { id: 103, sender: 'them', text: 'طب لو عرفت تحلها ابعتهالي ضروري عشان المستر هيسأل فيها بكرا', time: '10:10 AM' },
        ],
        2: [
            { id: 201, sender: 'them', text: 'مرحباً بك في مجتمع بيكسل! أنا هنا لمساعدتك في أي وقت 🤖', time: 'الأمس' }
        ],
        3: [
            { id: 301, sender: 'them', text: 'لا تنسَ حضور البث المباشر غداً لمراجعة الباب الثاني بالكامل.', time: 'منذ 3 أيام' },
            { id: 302, sender: 'me', text: 'حاضر يا دكتور، هكون موجود إن شاء الله.', time: 'منذ يومين' }
        ]
    });

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || activeChatId === null) return;

        const newMsg: Message = {
            id: Date.now(),
            sender: 'me',
            text: newMessage,
            time: isAr ? 'الآن' : 'Just now'
        };

        setChatHistories(prev => ({
            ...prev,
            [activeChatId]: [...(prev[activeChatId] || []), newMsg]
        }));
        
        setNewMessage('');
    };

    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [activeChatId, chatHistories]);

    const activeConversation = conversations.find(c => c.id === activeChatId);
    const currentMessages = activeChatId ? (chatHistories[activeChatId] || []) : [];

    return (
        <div className="tab-pane active fade-in" style={{ height: 'calc(100vh - 120px)', minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
            
            {/* 💡 حقنا ستايل خاص بالصفحة دي عشان نظبط الموبايل بدون ما نلمس ملفات تانية */}
            <style dangerouslySetInnerHTML={{__html: `
                .chat-wrapper { display: flex; flex: 1; background: var(--card); border-radius: 20px; border: 1px solid rgba(255,255,255,0.05); overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
                .chat-sidebar { width: 320px; background: var(--h-bg); display: flex; flex-direction: column; border-inline-end: 1px solid rgba(255,255,255,0.05); }
                .chat-main { flex: 1; display: flex; flex-direction: column; background: var(--bg); }
                .mobile-back-btn { display: none; }
                
                @media (max-width: 992px) {
                    .chat-sidebar { width: 100%; border: none; }
                    .chat-sidebar.hide-on-mobile { display: none !important; }
                    .chat-main { width: 100%; }
                    .chat-main.hide-on-mobile { display: none !important; }
                    .mobile-back-btn { display: flex; align-items: center; justify-content: center; background: transparent; border: none; color: var(--txt); font-size: 1.2rem; cursor: pointer; padding: 10px; margin-inline-end: 10px; border-radius: 50%; background: rgba(255,255,255,0.05); }
                }
            `}} />

            <h2 className="section-title" style={{ marginBottom: '15px' }}>
                <FaEnvelope /> {isAr ? 'الرسائل والمحادثات' : 'Messages'}
            </h2>

            <div className="chat-wrapper">
                
                {/* ==========================================
                    القسم الأول: القائمة الجانبية (قائمة المحادثات)
                ========================================== */}
                {/* 💡 على الموبايل هنخفي القائمة دي لو الطالب فاتح شات معين */}
                <div className={`chat-sidebar ${activeChatId !== null ? 'hide-on-mobile' : ''}`}>
                    
                    <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ position: 'relative', width: '100%' }}>
                            <input 
                                type="text" 
                                placeholder={isAr ? 'ابحث عن جهة اتصال...' : 'Search contacts...'} 
                                style={{ width: '100%', padding: '12px 35px 12px 15px', borderRadius: '50px', background: 'var(--bg)', border: '1px solid rgba(108,92,231,0.3)', color: 'var(--txt)', outline: 'none', fontSize: '0.9rem' }} 
                            />
                            <FaSearch style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: isAr ? '15px' : 'auto', left: isAr ? 'auto' : '15px', color: 'var(--txt-mut)' }} />
                        </div>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
                        {conversations.map(conv => {
                            const chatLog = chatHistories[conv.id] || [];
                            const lastMessage = chatLog.length > 0 ? chatLog[chatLog.length - 1] : null;
                            const isActive = activeChatId === conv.id;

                            return (
                                <div 
                                    key={conv.id} 
                                    onClick={() => setActiveChatId(conv.id)}
                                    style={{ 
                                        display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 15px', marginBottom: '8px',
                                        background: isActive ? 'var(--p-purple)' : 'transparent',
                                        borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s ease',
                                    }}
                                >
                                    {conv.isBot ? (
                                        <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(108,92,231,0.2)', color: isActive ? 'white' : 'var(--p-purple)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem', flexShrink: 0 }}><FaRobot /></div>
                                    ) : (
                                        <div style={{ position: 'relative' }}>
                                            <img src={conv.avatar} style={{ width: '45px', height: '45px', borderRadius: '50%', border: isActive ? '2px solid white' : '2px solid var(--p-purple)', flexShrink: 0 }} alt="User" />
                                            {!isActive && conv.unread && <FaCircle style={{ position: 'absolute', bottom: '0', right: '0', color: 'var(--warning)', fontSize: '12px', border: '2px solid var(--h-bg)', borderRadius: '50%' }} />}
                                        </div>
                                    )}
                                    
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <h3 style={{ margin: 0, fontSize: '0.95rem', color: isActive ? 'white' : 'var(--txt)', fontWeight: isActive || conv.unread ? 'bold' : 'normal' }}>{conv.name}</h3>
                                            <span style={{ fontSize: '0.7rem', color: isActive ? 'rgba(255,255,255,0.7)' : 'var(--txt-mut)' }}>{lastMessage?.time}</span>
                                        </div>
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: isActive ? 'rgba(255,255,255,0.9)' : 'var(--txt-mut)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {lastMessage?.sender === 'me' ? (isAr ? 'أنت: ' : 'You: ') : ''} 
                                            {lastMessage ? lastMessage.text : '...'}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ==========================================
                    القسم الثاني: مساحة الشات نفسها
                ========================================== */}
                {/* 💡 على الموبايل هنخفي الشات لو الطالب لسه مختارش حد من القائمة */}
                <div className={`chat-main ${activeChatId === null ? 'hide-on-mobile' : ''}`}>
                    {activeConversation ? (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px 20px', background: 'var(--card)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                {/* 💡 زرار الرجوع اللي هيظهر على الموبايل بس */}
                                <button className="mobile-back-btn" onClick={() => setActiveChatId(null)}>
                                    {isAr ? <FaArrowRight /> : <FaArrowLeft />}
                                </button>

                                {activeConversation.isBot ? (
                                    <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'rgba(108,92,231,0.2)', color: 'var(--p-purple)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem', flexShrink: 0 }}><FaRobot /></div>
                                ) : (
                                    <img src={activeConversation.avatar} style={{ width: '45px', height: '45px', borderRadius: '50%', border: '2px solid var(--p-purple)', flexShrink: 0 }} alt="Avatar" />
                                )}
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--txt)' }}>{activeConversation.name}</h3>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <FaCircle size={8} /> {isAr ? 'متصل الآن' : 'Online'}
                                    </span>
                                </div>
                            </div>

                            <div ref={chatBodyRef} style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {currentMessages.length === 0 ? (
                                    <div style={{ textAlign: 'center', color: 'var(--txt-mut)', marginTop: 'auto', marginBottom: 'auto' }}>
                                        {isAr ? 'لا توجد رسائل سابقة. ابدأ المحادثة!' : 'No previous messages. Start the chat!'}
                                    </div>
                                ) : (
                                    currentMessages.map(msg => (
                                        <div key={msg.id} style={{ 
                                            alignSelf: msg.sender === 'me' ? 'flex-end' : 'flex-start', 
                                            maxWidth: '85%', display: 'flex', flexDirection: 'column', gap: '5px'
                                        }}>
                                            <div style={{
                                                background: msg.sender === 'me' ? 'var(--p-purple)' : 'var(--card)',
                                                color: 'white', padding: '12px 18px',
                                                borderRadius: '20px',
                                                borderBottomLeftRadius: msg.sender === 'me' ? '20px' : '5px',
                                                borderBottomRightRadius: msg.sender === 'me' ? '5px' : '20px',
                                                border: msg.sender === 'them' ? '1px solid rgba(255,255,255,0.05)' : 'none',
                                                fontSize: '0.95rem', lineHeight: '1.5',
                                                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                                            }}>
                                                {msg.text}
                                            </div>
                                            <span style={{ fontSize: '0.7rem', color: 'var(--txt-mut)', alignSelf: msg.sender === 'me' ? 'flex-end' : 'flex-start', padding: '0 5px' }}>
                                                {msg.time}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>

                            <form onSubmit={handleSendMessage} style={{ padding: '15px', background: 'var(--card)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <input 
                                    type="text" 
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder={isAr ? 'اكتب رسالة...' : 'Type a message...'} 
                                    style={{ flex: 1, padding: '12px 20px', borderRadius: '50px', background: 'var(--bg)', border: '1px solid rgba(108,92,231,0.3)', color: 'var(--txt)', outline: 'none', fontSize: '0.95rem' }} 
                                />
                                <button type="submit" style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--p-purple), #ff007f)', color: 'white', border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', fontSize: '1.2rem', flexShrink: 0, boxShadow: '0 4px 15px rgba(108,92,231,0.4)', transition: 'transform 0.2s' }}>
                                    <FaPaperPlane style={{ transform: isAr ? 'rotate(180deg)' : 'none', marginLeft: isAr ? '0' : '-3px', marginRight: isAr ? '-3px' : '0' }} />
                                </button>
                            </form>
                        </>
                    ) : (
                        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', color: 'var(--txt-mut)', opacity: 0.5 }}>
                            <FaComments size={80} style={{ marginBottom: '20px' }} />
                            <h2 style={{ textAlign: 'center' }}>{isAr ? 'اختر محادثة للبدء' : 'Select a conversation to start'}</h2>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}