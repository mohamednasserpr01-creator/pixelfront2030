const API_BASE_URL = 'http://localhost:5290/api';

export const homeworkLessonsService = {
    getHomeworks: async (page: number, search: string, stage: string) => {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${API_BASE_URL}/homework-lessons`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error('فشل جلب حصص الواجب');
        const result = await response.json(); 

        let rawData: any[] = [];
        if (Array.isArray(result)) rawData = result;
        else if (result?.data && Array.isArray(result.data)) rawData = result.data;
        else if (result?.items && Array.isArray(result.items)) rawData = result.items;

        let mappedData = rawData.map(lec => ({
            ...lec,
            educationalStageId: lec.stage || lec.educationalStageId, 
            videosCount: lec.videosCount || 0,
            pdfsCount: lec.pdfsCount || 0,
            referencesCount: lec.referencesCount || 0
        }));

        if (stage && stage !== 'all') {
            mappedData = mappedData.filter((lec: any) => lec.educationalStageId === stage);
        }

        if (search) {
            const lowerSearch = search.toLowerCase();
            mappedData = mappedData.filter((lec: any) => 
                (lec.title && lec.title.toLowerCase().includes(lowerSearch)) || 
                (lec.description && lec.description.toLowerCase().includes(lowerSearch))
            );
        }

        mappedData.reverse(); 

        const limit = 10;
        const total = mappedData.length;
        const totalPages = Math.ceil(total / limit) || 1;
        const data = mappedData.slice((page - 1) * limit, page * limit);

        return { data, totalPages, total };
    },

    getHomeworkById: async (id: string) => {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${API_BASE_URL}/homework-lessons/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('فشل جلب بيانات الحصة');
        const data = await response.json();
        
        return {
            ...data,
            stage: data.stage || data.educationalStageId,
        };
    },

    createHomework: async (data: { title: string, stage: string, unit?: string }) => {
        const token = localStorage.getItem('accessToken');
        const payload = {
            title: data.title,
            description: data.unit || "واجب", 
            stage: data.stage && data.stage !== "" ? data.stage : null
        };

        const response = await fetch(`${API_BASE_URL}/homework-lessons`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('فشل الإنشاء');
        return await response.json(); 
    },

    updateHomework: async (id: string, lessonState: any) => {
        const token = localStorage.getItem('accessToken');
        
        // 🚀 بننضف الداتا قبل ما تروح للباك إند
        const payload = {
            title: lessonState.title,
            description: lessonState.description || "واجب",
            stage: lessonState.stage,
            videos: (lessonState.videos || []).map((v: any) => ({
                title: v.title || 'فيديو',
                url: v.url || '',
                platform: v.platform || 'bunny',
                showPreview: !!v.showPreview
            })),
            pdfs: (lessonState.pdfs || []).map((p: any) => ({
                title: p.title || 'ملف',
                url: p.url || ''
            })),
            references: (lessonState.references || []).map((r: any) => ({
                title: r.title || 'مرجع',
                url: r.url || ''
            }))
        };

        const response = await fetch(`${API_BASE_URL}/homework-lessons/${id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('فشل في حفظ التعديلات');
        return true; 
    },

    deleteHomework: async (id: string) => {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${API_BASE_URL}/homework-lessons/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('فشل المسح');
        return true; 
    }
};