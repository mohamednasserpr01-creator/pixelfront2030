const API_BASE_URL = 'http://localhost:5290/api';

export const courseService = {
    getAll: async () => {
        const token = localStorage.getItem('accessToken');
        const res = await fetch(`${API_BASE_URL}/courses/my-courses`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (!res.ok) throw new Error('فشل جلب الكورسات');
        const result = await res.json();
        return result.data || [];
    },

    create: async (data: any) => {
        const token = localStorage.getItem('accessToken');
        const res = await fetch(`${API_BASE_URL}/courses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('فشل إنشاء الكورس');
        const result = await res.json();
        return result.data;
    },

    getBuilderData: async (id: string) => {
        const token = localStorage.getItem('accessToken');
        const res = await fetch(`${API_BASE_URL}/courses/builder/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (!res.ok) throw new Error('فشل تحميل بيانات الكورس');
        return await res.json();
    },

    saveMeta: async (id: string, meta: any) => {
        const token = localStorage.getItem('accessToken');
        const res = await fetch(`${API_BASE_URL}/courses/meta/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(meta)
        });
        return res.ok;
    },

    saveCurriculum: async (id: string, curriculum: any[]) => {
        const token = localStorage.getItem('accessToken');
        const res = await fetch(`${API_BASE_URL}/courses/curriculum/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ curriculum })
        });
        return res.ok;
    },

    saveGeneratedCodes: async (codes: any[]) => {
        const token = localStorage.getItem('accessToken');
        const res = await fetch(`${API_BASE_URL}/courses/generate-codes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(codes)
        });
        return res.ok;
    }
};