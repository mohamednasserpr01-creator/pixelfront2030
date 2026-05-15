"use client";
import React, { useState, useEffect } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';

const API_BASE_URL = 'http://localhost:5000/api';

interface CreateCourseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void; 
}

export function CreateCourseModal({ isOpen, onClose, onSuccess }: CreateCourseModalProps) {
    const { showToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [educationalStages, setEducationalStages] = useState<any[]>([]);
    const [isStagesLoading, setIsStagesLoading] = useState(true);

    const [formData, setFormData] = useState({
        title: '',
        shortDescription: '',
        description: '',
        stageName: '', 
        streamName: 'عام', 
        price: ''
    });

    // 🚀 جلب المراحل الحقيقية (بصايد أخطاء عشان نعرف السيرفر زعلان من إيه)
    useEffect(() => {
        if (isOpen) {
            const fetchStages = async () => {
                setIsStagesLoading(true);
                try {
                    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
                    
                    const response = await fetch(`${API_BASE_URL}/educational-stages`, {
                        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                    });

                    if (response.ok) {
                        const data = await response.json();
                        console.log("Real Stages Data from Backend:", data); // عشان لو احتجنا نشوفها في F12

                        let extracted = [];
                        if (Array.isArray(data)) extracted = data;
                        else if (data?.data) extracted = data.data;
                        else if (data?.items) extracted = data.items;
                        else if (data?.result) extracted = data.result;

                        setEducationalStages(extracted);
                        
                        if (extracted.length > 0) {
                            const firstItem = extracted[0];
                            const defaultName = firstItem.name || firstItem.Name || firstItem.title || firstItem.Title || 'عام';
                            setFormData(prev => ({ ...prev, stageName: defaultName }));
                        } else {
                            showToast('الباك إند استجاب، بس مفيش أي مراحل متسجلة في الداتا بيز!', 'error');
                        }
                    } else {
                        showToast(`فشل جلب المراحل - كود الخطأ: ${response.status}`, 'error');
                    }
                } catch (error) {
                    console.error("Failed to fetch stages", error);
                    showToast('خطأ في الاتصال بالسيرفر أثناء جلب المراحل', 'error');
                } finally {
                    setIsStagesLoading(false);
                }
            };
            fetchStages();
        }
    }, [isOpen]);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const currentStage = educationalStages.find(s => 
        s.name === formData.stageName || s.Name === formData.stageName || 
        s.title === formData.stageName || s.Title === formData.stageName
    );
    const availableStreams = currentStage?.streams || currentStage?.educationStreams || currentStage?.EducationStreams || [];

    const handleSubmit = async () => {
        if (!formData.title.trim()) {
            showToast('يرجى إدخال اسم الكورس', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
            
            const finalStage = formData.stageName ? formData.stageName : 'عام';
            const finalStream = formData.streamName ? formData.streamName : 'عام';
            const combinedCategory = `${finalStage} | ${finalStream}`;

            const payload = {
                title: formData.title,
                shortDescription: formData.shortDescription || "بدون وصف قصير", 
                description: formData.description || "بدون وصف", 
                level: 0, 
                category: combinedCategory, 
                price: formData.price ? parseFloat(formData.price) : 0,
                tags: "كورس_جديد" 
            };

            const response = await fetch(`${API_BASE_URL}/courses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                showToast('تم إنشاء الكورس بنجاح! 🎉', 'success');
                
                const firstStageName = educationalStages[0]?.name || educationalStages[0]?.Name || 'عام';
                setFormData({
                    title: '', shortDescription: '', description: '', stageName: firstStageName, streamName: 'عام', price: ''
                });
                
                if (onSuccess) onSuccess(); 
                onClose(); 
            } else {
                const errorData = await response.json().catch(() => null);
                let errorMessage = 'حدث خطأ أثناء إنشاء الكورس';
                
                if (errorData) {
                    if (errorData.errors && typeof errorData.errors === 'object') {
                        const firstErrorKey = Object.keys(errorData.errors)[0];
                        errorMessage = errorData.errors[firstErrorKey][0];
                    } else if (errorData.message) {
                        errorMessage = errorData.message;
                    } else if (errorData.title) {
                        errorMessage = errorData.title;
                    }
                }
                
                showToast(`خطأ: ${errorMessage}`, 'error');
            }
        } catch (error) {
            showToast('خطأ في الاتصال بالخادم', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title="إضافة كورس جديد"
            maxWidth="600px"
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px 0' }}>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                    <Input 
                        label="اسم الكورس *" 
                        placeholder="مثال: المراجعة النهائية في الفيزياء" 
                        value={formData.title} 
                        onChange={(e) => handleChange('title', e.target.value)} 
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>المرحلة الدراسية</label>
                        <select 
                            value={formData.stageName} 
                            onChange={(e) => {
                                handleChange('stageName', e.target.value);
                                handleChange('streamName', 'عام');
                            }}
                            disabled={isStagesLoading}
                            style={{ width: '100%', padding: '12px 15px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '10px', outline: 'none' }}
                        >
                            {isStagesLoading ? (
                                <option>جاري التحميل...</option>
                            ) : educationalStages.length > 0 ? (
                                educationalStages.map((stage: any, idx: number) => {
                                    const stageName = stage.name || stage.Name || stage.title || stage.Title;
                                    return (
                                        <option key={idx} value={stageName} style={{ background: '#1e1e2d' }}>
                                            {stageName}
                                        </option>
                                    );
                                })
                            ) : (
                                <option disabled>لا توجد مراحل مضافة</option>
                            )}
                        </select>
                    </div>
                    
                    <div>
                        <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>الشعبة التابعة (اختياري)</label>
                        <select 
                            value={formData.streamName} 
                            onChange={(e) => handleChange('streamName', e.target.value)}
                            disabled={isStagesLoading || availableStreams.length === 0}
                            style={{ width: '100%', padding: '12px 15px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '10px', outline: 'none' }}
                        >
                            <option value="عام" style={{ background: '#1e1e2d', color: '#f1c40f' }}>عام (لكل الشعب)</option>
                            {availableStreams.map((stream: any, idx: number) => {
                                const streamName = stream.name || stream.Name || stream.title || stream.Title;
                                return (
                                    <option key={idx} value={streamName} style={{ background: '#1e1e2d' }}>
                                        مخصص لـ: {streamName}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                    <Input 
                        label="سعر الكورس (جنيه مصري)" 
                        type="number"
                        placeholder="مثال: 150 (اتركه فارغاً ليكون مجانياً)" 
                        value={formData.price} 
                        onChange={(e) => handleChange('price', e.target.value)} 
                    />
                </div>

                <div>
                    <label style={{ display: 'block', color: 'var(--txt-mut)', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>وصف قصير (يظهر في كارت الكورس)</label>
                    <textarea 
                        value={formData.shortDescription} 
                        onChange={(e) => handleChange('shortDescription', e.target.value)}
                        placeholder="اكتب نبذة مختصرة عن الكورس..."
                        style={{ width: '100%', padding: '15px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '10px', outline: 'none', resize: 'vertical', minHeight: '80px', fontFamily: 'inherit' }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '15px', marginTop: '10px', justifyContent: 'flex-end' }}>
                    <Button variant="outline" onClick={onClose} disabled={isSubmitting} icon={<FaTimes />}>
                        إلغاء
                    </Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting} icon={<FaSave />}>
                        {isSubmitting ? 'جاري الحفظ...' : 'حفظ وإنشاء الكورس'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}