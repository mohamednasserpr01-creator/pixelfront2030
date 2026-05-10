"use client";
import React, { useState, useEffect, useRef } from 'react';
import { FaRobot, FaBolt, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { chatResponses } from '../../data/chatResponses';
import { ChatMessage } from '../../types';

interface ChatBotProps {
    lang: string;
}

export default function ChatBot({ lang }: ChatBotProps) {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        { id: 1, sender: 'bot', text: 'أهلاً بيك يا بطل في أكاديمية بيكسل! أقدر أساعدك إزاي النهاردة؟' }
    ]);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    const getSmartResponse = (text: string) => {
        text = text.toLowerCase();
        let finalResponse = '';
        
        for (const item of chatResponses) {
            if (item.keywords.some(kw => text.includes(kw))) {
                finalResponse = item.response;
                break;
            }
        }
        
        if (!finalResponse) {
            const defaultItem = chatResponses.find(item => item.keywords.includes('default'));
            finalResponse = defaultItem ? defaultItem.response : 'عفواً، سيب رقمك وهنتواصل معاك.';
        }
        return finalResponse;
    };

    const handleSendMessage = () => {
        if (!chatInput.trim()) return;
        const newUserMsg: ChatMessage = { id: Date.now(), sender: 'user', text: chatInput };
        setChatMessages(prev => [...prev, newUserMsg]);
        setChatInput('');

        setTimeout(() => {
            const botReply: ChatMessage = { id: Date.now() + 1, sender: 'bot', text: getSmartResponse(newUserMsg.text) };
            setChatMessages(prev => [...prev, botReply]);
        }, 800);
    };

    return (
        <>
            <button id="chat-icon" onClick={() => setIsChatOpen(!isChatOpen)}>
                <FaRobot />
            </button>
            <div id="chat-win" className={isChatOpen ? 'show' : ''}>
                <div className="chat-header">
                    <span><FaBolt style={{ marginRight: '5px' }} /> Pixel AI Assistant</span>
                    <button className="icon-btn" style={{ color: 'white', width: 'auto', height: 'auto' }} onClick={() => setIsChatOpen(false)}>
                        <FaTimes />
                    </button>
                </div>
                <div id="msgs">
                    {chatMessages.map(msg => (
                        <div key={msg.id} className={`msg-bubble ${msg.sender === 'bot' ? 'msg-bot' : 'msg-user'}`}>{msg.text}</div>
                    ))}
                    <div ref={chatEndRef} />
                </div>
                <div className="chat-input-area">
                    <input type="text" value={chatInput} onChange={(e)=>setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder={lang === 'ar' ? 'اكتب رسالتك...' : 'Type message...'} />
                    <button onClick={handleSendMessage}><FaPaperPlane /></button>
                </div>
            </div>
        </>
    );
}