// FILE: services/trackingService.ts

// 💡 ضفنا 'video_progress_sync' هنا عشان التايب سكريبت يقبله
export type EventType = 
    | 'video_play' 
    | 'video_pause' 
    | 'video_seek' 
    | 'video_complete' 
    | 'video_progress_sync' // 👈 الإضافة الجديدة
    | 'exam_start' 
    | 'exam_submit' 
    | 'page_view';

export interface TrackingEvent {
    userId: string;
    courseId?: string;
    lectureId?: string;
    eventType: EventType;
    eventData: any; // بيانات إضافية (زي الثانية اللي وقف عندها في الفيديو)
    timestamp: string;
}

class TrackingService {
    private eventQueue: TrackingEvent[] = [];
    private flushInterval: NodeJS.Timeout | null = null;

    constructor() {
        // ابدأ دورة الإرسال للباك إند كل 15 ثانية لو في أحداث متسجلة
        if (typeof window !== 'undefined') {
            this.startFlushing();
            
            // عشان لو الطالب قفل المتصفح فجأة، نبعت اللي في الطابور بسرعة
            window.addEventListener('beforeunload', () => this.flushNow());
        }
    }

    // دالة لتسجيل الحدث الجديد في الطابور
    public track(event: Omit<TrackingEvent, 'timestamp'>) {
        this.eventQueue.push({
            ...event,
            timestamp: new Date().toISOString()
        });

        // لو الطابور زاد عن 20 حدث، ابعتهم فوراً عشان الميموري
        if (this.eventQueue.length >= 20) {
            this.flushNow();
        }
    }

    // دالة إرسال الداتا للباك إند
    private async flushNow() {
        if (this.eventQueue.length === 0) return;

        const eventsToSend = [...this.eventQueue];
        this.eventQueue = []; // فضي الطابور فوراً عشان نستقبل الجديد

        try {
            // 💡 هنا هيتم ربطها بالـ API الحقيقي بتاعك بعدين
            console.log('🚀 [Tracking System] Sending events to backend:', eventsToSend);
            
            /*
            await fetch('/api/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ events: eventsToSend })
            });
            */
        } catch (error) {
            console.error('Failed to send tracking events', error);
            // لو الإرسال فشل، نرجعهم الطابور تاني عشان ميفقدوش
            this.eventQueue = [...eventsToSend, ...this.eventQueue];
        }
    }

    private startFlushing() {
        this.flushInterval = setInterval(() => {
            this.flushNow();
        }, 15000); // 15 ثانية
    }
}

export const trackingService = new TrackingService();