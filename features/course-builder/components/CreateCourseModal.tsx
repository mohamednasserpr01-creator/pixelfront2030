import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave } from 'react-icons/fa';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/context/ToastContext';
import { courseService } from '@/features/teacherCourses/services/courseService';

const CORE_API_URL = 'http://localhost:5290/api';

export const CreateCourseModal = ({ isOpen, onClose, onSuccess }: { isOpen: boolean, onClose: () => void, onSuccess: () => void }) => {
    const { showToast } = useToast();
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [stages, setStages] = useState<any[]>([]);
    const [selectedStage, setSelectedStage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchStages();
        }
    }, [isOpen]);

    const fetchStages = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`${CORE_API_URL}/educational-stages`, {
                method: 'GET',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json' 
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                const extracted = data.data || data.items || data || [];
                setStages(extracted);
                if (extracted.length > 0) setSelectedStage(extracted[0].name);
            } else {
                console.warn('Backend returned status:', response.status);
            }
        } catch (error) {
            console.error("CORS or Network Error:", error);
            // لن تضرب الشاشة الحمراء مجدداً، فقط سيتجاهل الخطأ
        }
    };

    const handleCreate = async () => {
        if (!title || !price || !selectedStage) {
            showToast('يرجى ملء جميع الحقول المطلوبة', 'error');
            return;
        }

        setIsLoading(true);
        try {
            await courseService.create({
                title,
                shortDescription: 'وصف قصير للكورس',
                description: 'وصف كامل للكورس',
                category: selectedStage,
                price: parseFloat(price)
            });
            showToast('تم إنشاء الكورس بنجاح!', 'success');
            onSuccess();
            onClose();
        } catch (error) {
            showToast('حدث خطأ أثناء إنشاء الكورس', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', boxSizing: 'border-box' }}>
            <div style={{ background: 'var(--card)', width: '100%', maxWidth: '500px', borderRadius: '15px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)', animation: 'slideDown 0.3s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0, color: 'white', fontSize: '1.2rem' }}>إضافة كورس جديد</h2>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--txt-mut)', cursor: 'pointer', fontSize: '1.2rem' }}><FaTimes /></button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <Input label="اسم الكورس" placeholder="مثال: كورس الجيولوجيا الشامل" value={title} onChange={(e) => setTitle(e.target.value)} />
                    
                    <div>
                        <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '5px', fontSize: '0.85rem', fontWeight: 'bold' }}>المرحلة الدراسية</label>
                        <select value={selectedStage} onChange={(e) => setSelectedStage(e.target.value)} style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', outline: 'none' }}>
                            {stages.length === 0 ? (
                                <option value="" disabled>جاري تحميل المراحل...</option>
                            ) : (
                                stages.map((s: any) => (
                                    <option key={s.id} value={s.name} style={{ background: '#1e1e2d' }}>{s.name}</option>
                                ))
                            )}
                        </select>
                    </div>

                    <Input label="سعر الكورس (ج.م)" type="number" placeholder="مثال: 250" value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '25px' }}>
                    <Button variant="primary" onClick={handleCreate} disabled={isLoading} style={{ flex: 1, justifyContent: 'center' }} icon={<FaSave />}>
                        {isLoading ? 'جاري الإنشاء...' : 'إنشاء الكورس'}
                    </Button>
                    <Button variant="danger" onClick={onClose} style={{ flex: 1, justifyContent: 'center' }}>
                        إلغاء
                    </Button>
                </div>
            </div>
        </div>
    );
};