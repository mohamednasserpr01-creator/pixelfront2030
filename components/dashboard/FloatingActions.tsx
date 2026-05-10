"use client";
import React, { useState } from 'react';
import { FaWhatsapp, FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';

export default function FloatingActions() {
    const [isChatOpen, setIsChatOpen] = useState(false);

    const toggleChat = () => setIsChatOpen(!isChatOpen);

    return (
        <>
            {/* الزراير الطافية في الجنب */}
            <div className="fab-container">
                <a href="https://wa.me/201000000000" target="_blank" rel="noopener noreferrer" className="fab-btn fab-wa" title="الدعم الفني عبر واتساب">
                    <FaWhatsapp />
                </a>
                <button className="fab-btn fab-ai" title="بيكسل AI - المساعد الذكي" onClick={toggleChat}>
                    <FaRobot />
                </button>
            </div>

            {/* نافذة الشات بوت الذكي */}
            <div className={`ai-chat-window ${isChatOpen ? 'active' : ''}`}>
                <div className="ai-chat-header">
                    <span><FaRobot /> بيكسل AI</span>
                    <button onClick={toggleChat} className="close-chat-btn"><FaTimes /></button>
                </div>
                <div className="ai-chat-body">
                    <div className="ai-msg bot">أهلاً بك يا بطل! أنا بيكسل AI، مساعدك الشخصي جوه لوحة التحكم. اقدر اساعدك في إيه؟</div>
                </div>
                <div className="ai-chat-input">
                    <input type="text" placeholder="اكتب سؤالك هنا..." />
                    <button><FaPaperPlane /></button>
                </div>
            </div>
        </>
    );
}