// FILE: features/teacherLessons/services/lessonsService.ts

const API_BASE_URL = 'http://localhost:5000/api';

export const lessonsService = {
    getLessons: async (page: number, search: string, stage: string) => {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${API_BASE_URL}/lectures`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error('فشل في جلب الحصص من الخادم');
        const rawResponse = await response.json(); 

        console.log("📦 داتا الحصص اللي جاية من الباك إند:", rawResponse);

        let rawData: any[] = [];
        if (Array.isArray(rawResponse)) {
            rawData = rawResponse;
        } else if (rawResponse && Array.isArray(rawResponse.data)) {
            rawData = rawResponse.data;
        } else if (rawResponse && Array.isArray(rawResponse.items)) {
            rawData = rawResponse.items;
        } else if (rawResponse && rawResponse.data && Array.isArray(rawResponse.data.items)) {
            rawData = rawResponse.data.items;
        }

        let filtered = [...rawData];

        if (search) {
            filtered = filtered.filter((lec: any) => 
                lec.title?.includes(search) || lec.description?.includes(search)
            );
        }

        filtered.sort((a: any, b: any) => (b.orderIndex || 0) - (a.orderIndex || 0));

        const limit = 10;
        const total = filtered.length;
        const totalPages = Math.ceil(total / limit) || 1;
        const data = filtered.slice((page - 1) * limit, page * limit);

        return { data, totalPages, total };
    },

    // 🚀 الدالة الجديدة: جلب بيانات حصة محددة عشان صفحة التعديل
    getLessonById: async (id: string) => {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${API_BASE_URL}/lectures/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('فشل في جلب بيانات الحصة');
        return await response.json(); 
    },

    createLesson: async (lessonData: { title: string, stage: string, unit: string }) => {
        const token = localStorage.getItem('accessToken');
        const payload = {
            title: lessonData.title,
            description: lessonData.unit || "بدون وصف", 
            orderIndex: 1, 
            durationMinutes: 60,
            isPreview: false,
            videoUrl: "",
            // 🚀 السحر هنا: لو المرحلة فاضية نبعتها null بدل نص فاضي عشان C# ميزعلش
            stage: lessonData.stage && lessonData.stage !== "" ? lessonData.stage : null
        };

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

    updateLesson: async (id: string, lessonState: any) => {
        const token = localStorage.getItem('accessToken');
        const payload = {
            title: lessonState.title,
            description: lessonState.description || "بدون وصف",
            orderIndex: 0,
            durationMinutes: 30,
            isPreview: false,
            // 🚀 بنبعت رابط أول فيديو عشان لو الباك إند القديم لسه بيعتمد عليه
            videoUrl: lessonState.videos?.length > 0 ? lessonState.videos[0].url : "",
            stage: lessonState.stage, // 🚀 بعتنا المرحلة للباك إند
            
            // 🚀 السحر هنا: حملنا الدليفري بكل الفيديوهات والمذكرات والمراجع!
            videos: lessonState.videos || [],
            pdfs: lessonState.pdfs || [],
            references: lessonState.references || []
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
    },

    deleteLesson: async (id: string) => {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${API_BASE_URL}/lectures/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error('فشل في مسح الحصة من السيرفر');
        }
        
        return true; 
    }
};