"use client";
import React, { useState, useEffect, useRef } from 'react';
import { FaRobot, FaTimes, FaPaperPlane, FaWhatsapp } from 'react-icons/fa';
import styles from './ChatBox.module.css';

export default function ChatBox() {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [messages, setMessages] = useState<{text: string, sender: 'user'|'bot'}[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // استرجاع رسائل الشات من المتصفح (عشان متمسحش لو عمل ريفريش)
    useEffect(() => {
        const savedChat = localStorage.getItem('pixel_chat_history');
        if (savedChat) {
            setMessages(JSON.parse(savedChat));
        } else {
            setMessages([{ text: `أهلاً بك يا بطل! أنا بيكسل AI، مساعدك الشخصي. اقدر اساعدك في إيه؟`, sender: 'bot' }]);
        }
    }, []);

    // حفظ الرسائل في المتصفح مع كل رسالة جديدة
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem('pixel_chat_history', JSON.stringify(messages));
        }
    }, [messages]);

    // النزول التلقائي لآخر رسالة
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping, isChatOpen]);

    const handleSendMessage = () => {
        if (!chatInput.trim()) return;
        const newMsg = { text: chatInput, sender: 'user' as const };
        setMessages(prev => [...prev, newMsg]);
        setChatInput('');
        setIsTyping(true);

        // محاكاة لرد البوت (ممكن نربطها بـ API حقيقي بعدين)
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, { text: 'فهمت سؤالك! جاري البحث في بنك المعرفة...', sender: 'bot' }]);
        }, 1500);
    };

    return (
        <>
            {/* الأزرار الطافية (تظهر فقط لو الشات مقفول) */}
            {!isChatOpen && (
                <div className={styles.fabContainer}>
                    <a href="https://wa.me/201000000000" target="_blank" rel="noopener noreferrer" className={`${styles.fabBtn} ${styles.fabWa}`}>
                        <FaWhatsapp />
                    </a>
                    <button className={`${styles.fabBtn} ${styles.fabAi}`} onClick={() => setIsChatOpen(true)}>
                        <FaRobot />
                    </button>
                </div>
            )}

            {/* الـ Overlay (شاشة ضبابية ورا الشات في الموبايل) */}
            <div 
                className={`${styles.chatOverlay} ${isChatOpen ? styles.active : ''}`} 
                onClick={() => setIsChatOpen(false)}
            ></div>

            {/* نافذة الشات نفسها */}
            <div className={`${styles.chatWindow} ${isChatOpen ? styles.active : ''}`}>
                <div className={styles.chatHeader}>
                    <span><FaRobot style={{marginRight: '8px'}} /> بيكسل AI</span>
                    <button className={styles.closeBtn} onClick={() => setIsChatOpen(false)}>
                        <FaTimes />
                    </button>
                </div>
                
                <div className={styles.chatBody}>
                    {messages.map((msg, index) => (
                        <div key={index} className={`${styles.message} ${msg.sender === 'bot' ? styles.bot : styles.user}`}>
                            {msg.text}
                        </div>
                    ))}
                    
                    {/* حركة الثلاث نقط لما البوت بيكتب */}
                    {isTyping && (
                        <div className={styles.typingIndicator}>
                            <span></span><span></span><span></span>
                        </div>
                    )}
                    {/* نقطة وهمية عشان السكرول يقف عندها */}
                    <div ref={messagesEndRef} />
                </div>
                
                <div className={styles.chatInputArea}>
                    <input 
                        className={styles.inputField}
                        type="text" 
                        placeholder="اكتب رسالتك..." 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} 
                    />
                    <button className={styles.sendBtn} onClick={handleSendMessage} disabled={!chatInput.trim()}>
                        <FaPaperPlane />
                    </button>
                </div>
            </div>
        </>
    );
}