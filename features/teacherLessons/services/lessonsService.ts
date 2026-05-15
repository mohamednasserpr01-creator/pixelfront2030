// FILE: features/teacherLessons/services/lessonsService.ts

const API_BASE_URL = 'http://localhost:5000/api';

export const lessonsService = {
    getLessons: async (page: number, search: string, stage: string) => {
        const token = localStorage.getItem('accessToken');
        // 🚀 بيكلم api/lectures مباشرة
        const response = await fetch(`${API_BASE_URL}/lectures`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error('فشل في جلب الحصص من الخادم');
        const rawData = await response.json(); 

        let filtered = [...rawData];

        if (search) {
            filtered = filtered.filter((lec: any) => 
                lec.title?.includes(search) || lec.description?.includes(search)
            );
        }

        filtered.sort((a: any, b: any) => b.orderIndex - a.orderIndex);

        const limit = 10;
        const total = filtered.length;
        const totalPages = Math.ceil(total / limit) || 1;
        const data = filtered.slice((page - 1) * limit, page * limit);

        return { data, totalPages, total };
    },

    createLesson: async (lessonData: { title: string, stage: string, unit: string }) => {
        const token = localStorage.getItem('accessToken');
        const payload = {
            title: lessonData.title,
            description: lessonData.unit || "بدون وصف", 
            orderIndex: 1, 
            durationMinutes: 60,
            isPreview: false,
            videoUrl: ""
        };

        // 🚀 بيكلم api/lectures مباشرة من غير ID الكورس الوهمي
        const response = await fetch(`${API_BASE_URL}/lectures`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            let errorMsg = 'فشل في الحفظ.';
            try {
                const errData = await response.json();
                console.error("Backend Error Data:", errData); 
                
                if (errData.errors) {
                    const firstErrorKey = Object.keys(errData.errors)[0];
                    errorMsg = errData.errors[firstErrorKey][0];
                } else {
                    errorMsg = errData.title || errData.message || errorMsg;
                }
            } catch(e) {}
            throw new Error(errorMsg);
        }
        
        return await response.json(); 
    },

    // 🚀 الدالة الجديدة اللي هتحفظ التعديلات والفيديوهات
    updateLesson: async (id: string, lessonState: any) => {
        const token = localStorage.getItem('accessToken');
        const payload = {
            title: lessonState.title,
            description: lessonState.description || "بدون وصف",
            orderIndex: 0,
            durationMinutes: 30,
            isPreview: false,
            videoUrl: lessonState.videos?.length > 0 ? lessonState.videos[0].url : ""
        };

        const response = await fetch(`${API_BASE_URL}/lectures/${id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error('فشل في حفظ التعديلات في السيرفر');
        }
        
        return await response.json(); 
    }
};