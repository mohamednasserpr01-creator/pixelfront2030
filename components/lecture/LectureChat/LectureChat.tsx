// FILE: components/lecture/LectureChat/LectureChat.tsx
"use client"; // 💡 إجباري عشان ده بيستخدم Hooks
import React, { useState, useEffect, useRef } from 'react';
import { FaComments, FaEllipsisV, FaRobot, FaUserTie, FaPaperPlane } from 'react-icons/fa';

import { Input } from '../../ui/Input'; // 💡 استدعاء الإدخال الخارق
import { useToast } from '../../../context/ToastContext'; // 💡 استدعاء الإشعارات

export default function LectureChat({ lang }: { lang: string }) {
    const isAr = lang === 'ar';
    const { showToast } = useToast();

    const [chatMsgs, setChatMsgs] = useState<any[]>([]);
    const [chatInput, setChatInput] = useState("");
    const [showInitialOpts, setShowInitialOpts] = useState(true);
    const chatBoxRef = useRef<HTMLDivElement>(null);

    const generateId = () => Date.now() + Math.random();

    useEffect(() => {
        setChatMsgs([{ id: generateId(), sender: 'bot', text: isAr ? 'أهلاً بك يا بطل! كيف تفضل المساعدة اليوم؟' : 'Hello! How can I help you today?' }]);
    }, [lang, isAr]);

    // النزول لأسفل الشات تلقائياً
    useEffect(() => { 
        if(chatBoxRef.current) chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight; 
    }, [chatMsgs]);

    const handleChatOption = (type: 'ai'|'human') => {
        setShowInitialOpts(false);
        setChatMsgs(prev => [...prev, { id: generateId(), sender: 'user', text: type === 'ai' ? (isAr ? 'أريد التحدث مع المساعد الذكي' : 'I want AI Assistant') : (isAr ? 'أريد التحدث مع مدرس حقيقي' : 'I want human teacher') }]);
        setTimeout(() => {
            setChatMsgs(prev => [...prev, { id: generateId(), sender: 'bot', text: type === 'human' ? (isAr ? 'تواصل مع الدعم عبر الواتساب على رقم 0123456789.' : 'Contact support via WhatsApp.') : (isAr ? 'أنا بيكسل AI! تفضل بسؤالك.' : 'I am Pixel AI! Ask your question.') }]);
        }, 600);
    };

    const sendChat = () => {
        if(!chatInput.trim()) {
            showToast(isAr ? 'لا يمكنك إرسال رسالة فارغة!' : 'Cannot send an empty message!', 'info');
            return;
        }
        
        setShowInitialOpts(false);
        setChatMsgs(prev => [...prev, { id: generateId(), sender: 'user', text: chatInput }]);
        setChatInput("");
        
        const botMsgId = generateId();
        setTimeout(() => { 
            setChatMsgs(prev => [...prev, { id: botMsgId, sender: 'bot', text: isAr ? 'جاري التحليل...' : 'Analyzing...' }]); 
            setTimeout(() => {
                setChatMsgs(prev => prev.map(msg => msg.id === botMsgId ? { ...msg, text: isAr ? 'إجابة سؤالك موجودة في الدقيقة 12:00 من الفيديو.' : 'The answer is at 12:00 in the video.' } : msg));
            }, 1500);
        }, 600);
    };

    return (
        <div className="chat-section">
            <div className="chat-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FaComments /> {isAr ? 'مركز المساعدة الذكي' : 'Smart Help Center'}</div>
                <FaEllipsisV style={{ cursor: 'pointer' }} />
            </div>
            
            <div id="chat-msgs" ref={chatBoxRef}>
                {chatMsgs.map((msg) => (
                    <div key={msg.id} className={`msg ${msg.sender}`}>
                        {msg.text}
                        {msg.id === chatMsgs[0]?.id && showInitialOpts && (
                            <div className="chat-options">
                                <button className="chat-opt-btn" onClick={() => handleChatOption('ai')}><FaRobot /> {isAr ? 'مساعد ذكي (AI)' : 'AI Assistant'}</button>
                                <button className="chat-opt-btn" onClick={() => handleChatOption('human')}><FaUserTie /> {isAr ? 'مدرس حقيقي' : 'Human Teacher'}</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            
            <div className="chat-input" style={{ alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                    {/* 💡 استخدام مكون الإدخال الخارق */}
                    <Input 
                        type="text" 
                        value={chatInput} 
                        onChange={(e) => setChatInput(e.target.value)} 
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault(); // منع السلوك الافتراضي
                                sendChat();
                            }
                        }}
                        placeholder={isAr ? 'اكتب رسالتك هنا...' : 'Type your message...'} 
                        inputSize="md"
                    />
                </div>
                {/* 💡 زرار إرسال احترافي بدل زرار الـ HTML */}
                <button 
                    onClick={sendChat} 
                    style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--p-purple)', border: 'none', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', fontSize: '1.2rem', transition: '0.3s', flexShrink: 0 }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <FaPaperPlane style={{ transform: isAr ? 'rotate(180deg)' : 'none' }} />
                </button>
            </div>
        </div>
    );
}