"use client";
import React, { useRef } from 'react';
import Image from 'next/image';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { coursesData } from '../../data/courses';
import { useCarousel } from '../../hooks/useCarousel';

interface CoursesSectionProps {
    lang: string;
}

export default function CoursesSection({ lang }: CoursesSectionProps) {
    const trackRef = useRef<HTMLDivElement>(null);
    const { moveCarousel } = useCarousel();

    return (
        <section className="section-padding">
            <h2 className="section-title reveal active">{lang === 'ar' ? 'أحدث الكورسات 🔥' : 'Latest Courses 🔥'}</h2>
            <div className="carousel-wrapper reveal active">
                <button className="carousel-btn" onClick={() => moveCarousel(trackRef, 1, lang)}>
                    {lang === 'ar' ? <FaChevronRight /> : <FaChevronLeft />}
                </button>
                <div className="carousel-track" ref={trackRef}>
                    {coursesData.map((item) => (
                        <div className="card" key={item.id}>
                            <div>
                                <div className="img-wrapper">
                                    <Image src={item.img} alt={item.titleEn} width={400} height={200} style={{ objectFit: 'cover' }} />
                                </div>
                                <h3 style={{ marginTop: '15px' }}>{lang === 'ar' ? item.titleAr : item.titleEn}</h3>
                                <p style={{ marginBottom: '15px' }}>{lang === 'ar' ? item.descAr : item.descEn}</p>
                            </div>
                            <button className="card-btn">
                                {lang === 'ar' ? 'اشترك الآن' : 'Subscribe'}
                            </button>
                        </div>
                    ))}
                </div>
                <button className="carousel-btn" onClick={() => moveCarousel(trackRef, -1, lang)}>
                    {lang === 'ar' ? <FaChevronLeft /> : <FaChevronRight />}
                </button>
            </div>
        </section>
    );
}