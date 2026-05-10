"use client";
import React from 'react';
import { servicesData } from '../../data/services';
import { FaVideo, FaClipboardCheck, FaTasks, FaGamepad, FaBrain, FaShoppingBag, FaHeartbeat, FaComments, FaUserShield, FaCalendarAlt, FaHeadset, FaRobot, FaUsersCog } from 'react-icons/fa';

interface ServicesSectionProps {
    lang: string;
}

const iconMap: { [key: string]: React.ReactNode } = {
    "fas fa-video": <FaVideo />,
    "fas fa-clipboard-check": <FaClipboardCheck />,
    "fas fa-tasks": <FaTasks />,
    "fas fa-gamepad": <FaGamepad />,
    "fas fa-brain": <FaBrain />,
    "fas fa-shopping-bag": <FaShoppingBag />,
    "fas fa-heartbeat": <FaHeartbeat />,
    "fas fa-comments": <FaComments />,
    "fas fa-user-shield": <FaUserShield />,
    "fas fa-calendar-alt": <FaCalendarAlt />,
    "fas fa-headset": <FaHeadset />,
    "fas fa-robot": <FaRobot />,
    "fas fa-users-cog": <FaUsersCog />
};

export default function ServicesSection({ lang }: ServicesSectionProps) {
    return (
        <section className="section-padding" style={{ background: 'var(--card)' }}>
            <h2 className="section-title reveal active">{lang === 'ar' ? 'لماذا بيكسل؟ 🛠️' : 'Why Pixel? 🛠️'}</h2>
            <div className="services-grid">
                {servicesData.map((service, idx) => (
                    <div className={`service-card reveal delay-${idx % 2 === 0 ? '1' : '2'} active`} key={service.titleEn}>
                        <div style={{ fontSize: '2.5rem', color: 'var(--p-purple)', marginBottom: '15px' }}>
                            {iconMap[service.icon]}
                        </div>
                        <h3>{lang === 'ar' ? service.titleAr : service.titleEn}</h3>
                    </div>
                ))}
            </div>
        </section>
    );
}