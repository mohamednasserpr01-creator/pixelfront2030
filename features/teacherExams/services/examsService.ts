// FILE: features/teacherExams/services/examsService.ts

// 💡 محاكاة لقاعدة بيانات الامتحانات
const MOCK_EXAMS_DB = Array.from({ length: 45 }, (_, i) => ({
    id: i + 1,
    title: `امتحان رقم ${45 - i} - تقييم شامل`,
    stage: i % 2 === 0 ? 'sec3' : 'sec1',
    unit: `الباب ${ (i % 4) + 1 }`,
    questionsCount: Math.floor(Math.random() * 20) + 5, // عدد أسئلة عشوائي بين 5 و 25
    date: `2026-04-${(i % 28 + 1).toString().padStart(2, '0')}`
}));

export const examsService = {
    getExams: async (page: number, search: string, stage: string) => {
        return new Promise<{ data: any[], totalPages: number, total: number }>((resolve) => {
            setTimeout(() => {
                let filtered = [...MOCK_EXAMS_DB];

                if (search) {
                    filtered = filtered.filter(ex => ex.title.includes(search) || ex.unit.includes(search));
                }

                if (stage && stage !== 'all') {
                    filtered = filtered.filter(ex => ex.stage === stage);
                }

                filtered.sort((a, b) => b.id - a.id);

                const limit = 10;
                const total = filtered.length;
                const totalPages = Math.ceil(total / limit);
                const data = filtered.slice((page - 1) * limit, page * limit);

                resolve({ data, totalPages, total });
            }, 500);
        });
    },

    createExam: async (examData: { title: string, stage: string, unit: string }) => {
        return new Promise<{ success: boolean, id: number }>((resolve) => {
            setTimeout(() => {
                const newId = Date.now();
                resolve({ success: true, id: newId });
            }, 800);
        });
    }
};