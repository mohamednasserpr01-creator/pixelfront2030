// FILE: features/teacherLessons/services/lessonsService.ts

// 💡 محاكاة لقاعدة البيانات (Database Mock)
const MOCK_DB = Array.from({ length: 145 }, (_, i) => ({
    id: i + 1,
    title: `حصة رقم ${145 - i} - فيزياء متقدمة`,
    stage: i % 2 === 0 ? 'sec3' : 'sec1',
    unit: `الباب ${ (i % 4) + 1 }`,
    videosCount: Math.floor(Math.random() * 3) + 1,
    filesCount: Math.floor(Math.random() * 2),
    date: `2026-04-${(i % 28 + 1).toString().padStart(2, '0')}`
}));

export const lessonsService = {
    // 💡 محاكاة API جلب الحصص مع Server-side Pagination & Search
    getLessons: async (page: number, search: string, stage: string) => {
        return new Promise<{ data: any[], totalPages: number, total: number }>((resolve) => {
            setTimeout(() => { // محاكاة تأخير السيرفر
                let filtered = [...MOCK_DB];

                // 1. Server-side Search
                if (search) {
                    filtered = filtered.filter(lec => lec.title.includes(search) || lec.unit.includes(search));
                }

                // 2. Server-side Filter
                if (stage && stage !== 'all') {
                    filtered = filtered.filter(lec => lec.stage === stage);
                }

                // 3. Server-side Sort (الأحدث أولاً)
                filtered.sort((a, b) => b.id - a.id);

                // 4. Server-side Pagination
                const limit = 10;
                const total = filtered.length;
                const totalPages = Math.ceil(total / limit);
                const data = filtered.slice((page - 1) * limit, page * limit);

                resolve({ data, totalPages, total });
            }, 500); // 500ms delay
        });
    },

    // 💡 محاكاة API إنشاء حصة
    createLesson: async (lessonData: { title: string, stage: string, unit: string }) => {
        return new Promise<{ success: boolean, id: number }>((resolve) => {
            setTimeout(() => {
                const newId = Date.now();
                // في الحقيقة هنا بنعمل POST Request
                resolve({ success: true, id: newId });
            }, 800);
        });
    }
};