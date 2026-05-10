"use client";

export function useCarousel() {
    // ضفنا بس الأنواع هنا: ref: any, direction: number, lang: string
    const moveCarousel = (ref: any, direction: number, lang: string) => {
        if (ref.current) {
            const cardWidth = ref.current.querySelector('.card')?.offsetWidth || 280;
            const scrollAmount = (cardWidth + 20) * direction * (lang === 'ar' ? -1 : 1);
            ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return { moveCarousel };
}