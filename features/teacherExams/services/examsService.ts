const API_BASE_URL = 'http://localhost:5290/api';

export const examsService = {
    getExams: async (page: number, search: string, stage: string) => {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${API_BASE_URL}/exams?page=${page}&search=${search}&stage=${stage}`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (!response.ok) throw new Error('فشل جلب الامتحانات');
        const result = await response.json();
        return { data: result.data || [], totalPages: result.totalPages || 1, total: result.total || 0 };
    },

    getExamById: async (id: string) => {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${API_BASE_URL}/exams/${id}`, { headers: { 'Authorization': `Bearer ${token}` }});
        if (!response.ok) throw new Error('فشل جلب تفاصيل الامتحان');
        return await response.json();
    },

    createExam: async (examData: { title: string, stage: string, unit: string }) => {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${API_BASE_URL}/exams`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(examData)
        });
        
        // 🚀 السطر ده هيخلينا نشوف الإيرور الحقيقي من الباك إند لو رفض الإضافة
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'فشل إنشاء الامتحان من السيرفر');
        }
        return await response.json(); 
    },

    updateExam: async (id: string, examState: any) => {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${API_BASE_URL}/exams/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(examState)
        });
        if (!response.ok) throw new Error('فشل حفظ التعديلات');
        return true;
    },

    deleteExam: async (id: string) => {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${API_BASE_URL}/exams/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
        if (!response.ok) throw new Error('فشل المسح');
        return true;
    }
};