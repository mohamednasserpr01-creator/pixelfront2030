const API_BASE_URL = 'http://localhost:5290/api';

export const homeworkService = {
    // 🚀 تمرير معلمة المرحلة (stage) للاستعلام
    getAll: async (stage: string = 'all') => {
        const token = localStorage.getItem('accessToken');
        const res = await fetch(`${API_BASE_URL}/homeworks?stage=${stage}`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (!res.ok) throw new Error('فشل جلب الواجبات');
        const result = await res.json();
        return result.data || [];
    },

    getById: async (id: string) => {
        const token = localStorage.getItem('accessToken');
        const res = await fetch(`${API_BASE_URL}/homeworks/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (!res.ok) throw new Error('فشل جلب تفاصيل الواجب');
        const result = await res.json();
        return result.data;
    },

    // 🚀 إضافة المرحلة للبيانات المُرسلة
    create: async (data: { title: string, stage: string }) => {
        const token = localStorage.getItem('accessToken');
        const res = await fetch(`${API_BASE_URL}/homeworks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            const err = await res.text();
            throw new Error(err || 'فشل إنشاء الواجب');
        }
        const result = await res.json();
        return result.data;
    },

    update: async (id: string, data: any) => {
        const token = localStorage.getItem('accessToken');
        const res = await fetch(`${API_BASE_URL}/homeworks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('فشل حفظ الواجب');
        return true;
    },

    delete: async (id: string) => {
        const token = localStorage.getItem('accessToken');
        const res = await fetch(`${API_BASE_URL}/homeworks/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
        if (!res.ok) throw new Error('فشل مسح الواجب');
        return true;
    }
};