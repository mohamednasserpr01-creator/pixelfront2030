// FILE: app/admin/broadcast/components/TargetingStep.tsx
"use client";
import React, { useEffect } from 'react';
import { FaUsers, FaGraduationCap, FaLayerGroup, FaArrowRight, FaFilter, FaChalkboardTeacher, FaBoxOpen } from 'react-icons/fa';
import { Button } from '../../../../components/ui/Button';
import { useBroadcastStore } from '../../../../features/broadcast/store/useBroadcastStore';

const STAGES = [
    { id: 'all', name: 'جميع المراحل' },
    { id: 'sec1', name: 'الصف الأول الثانوي' },
    { id: 'sec2', name: 'الصف الثاني الثانوي' },
    { id: 'sec3', name: 'الصف الثالث الثانوي' }
];

const MAJORS = [
    { id: 'all', name: 'جميع الشعب' },
    { id: 'science', name: 'علمي علوم' },
    { id: 'math', name: 'علمي رياضة' },
    { id: 'literary', name: 'أدبي' }
];

// 💡 MOCK DATA (لحد ما نربط بالباك إند)
const MOCK_TEACHERS = [{ id: 't1', name: 'أ. محمد ناصر' }, { id: 't2', name: 'أ. محمود سعيد' }];
const MOCK_COURSES = [{ id: 'c1', teacherId: 't1', title: 'فيزياء 3 ثانوي (الباب الأول)' }, { id: 'c2', teacherId: 't2', title: 'كيمياء عضوية كاملة' }];
const MOCK_OFFERS = [{ id: 'o1', title: 'عرض بطل الثانوية (خصم 50%)' }];
const MOCK_PRODUCTS = [{ id: 'p1', title: 'كتاب المراجعة النهائية' }, { id: 'p2', title: 'أدوات هندسية' }];
const MOCK_BANKS = [{ id: 'b1', teacherId: 't1', title: 'بنك أسئلة الفيزياء الشامل' }];
const MOCK_LIBRARY = [{ id: 'l1', teacherId: 't2', title: 'ملخص الكيمياء (PDF)' }];

export default function TargetingStep() {
    const { 
        targetStage, targetMajor, targetAudience, condition, targetCount, 
        selectedTeacherId, selectedEntityId,
        updateField, setStep 
    } = useBroadcastStore();

    // حساب العدد التقريبي (محاكاة)
    useEffect(() => {
        let base = targetStage === 'all' ? 15000 : 5000;
        if (targetMajor !== 'all') base = Math.floor(base * 0.4);
        if (targetAudience === 'both') base = base * 2;
        updateField('targetCount', base);
    }, [targetStage, targetMajor, targetAudience, condition, selectedTeacherId, selectedEntityId, updateField]);

    // تفريغ الاختيارات الفرعية لما نغير الشرط الرئيسي
    const handleConditionChange = (newCond: any) => {
        updateField('condition', newCond);
        updateField('selectedTeacherId', 'all');
        updateField('selectedEntityId', 'all');
    };

    return (
        <div style={{ background: 'var(--card)', padding: '30px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', animation: 'fadeIn 0.3s ease' }}>
            <h2 style={{ marginBottom: '25px', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaUsers color="#3498db" /> الفلترة الذكية للجمهور
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                {/* الفلاتر الأساسية (مرحلة، شعبة، فئة) */}
                <div>
                    <label style={s.label}><FaGraduationCap /> المرحلة الدراسية</label>
                    <select value={targetStage} onChange={e => updateField('targetStage', e.target.value)} style={s.select}>
                        {STAGES.map(st => <option key={st.id} value={st.id} style={s.option}>{st.name}</option>)}
                    </select>
                </div>
                <div>
                    <label style={s.label}><FaLayerGroup /> الشعبة الدراسية</label>
                    <select value={targetMajor} onChange={e => updateField('targetMajor', e.target.value)} style={s.select}>
                        {MAJORS.map(m => <option key={m.id} value={m.id} style={s.option}>{m.name}</option>)}
                    </select>
                </div>
                <div>
                    <label style={s.label}><FaUsers /> فئة المتلقي</label>
                    <select value={targetAudience} onChange={e => updateField('targetAudience', e.target.value as any)} style={s.select}>
                        <option value="students" style={s.option}>أرقام الطلاب فقط</option>
                        <option value="parents" style={s.option}>أرقام أولياء الأمور فقط</option>
                        <option value="both" style={s.option}>الطلاب وأولياء الأمور معاً</option>
                    </select>
                </div>

                {/* 💣 شرط الاستهداف الذكي (الخاص بالأدمن) */}
                <div style={{ gridColumn: '1 / -1', background: 'rgba(241, 196, 15, 0.05)', padding: '20px', borderRadius: '15px', border: '1px dashed rgba(241, 196, 15, 0.3)' }}>
                    <label style={{ ...s.label, color: 'var(--warning)', fontSize: '1rem' }}><FaFilter /> شرط الاستهداف الذكي (Smart Targeting)</label>
                    <select value={condition} onChange={e => handleConditionChange(e.target.value)} style={{ ...s.select, borderColor: 'rgba(241, 196, 15, 0.5)', color: 'var(--warning)', fontWeight: 'bold' }}>
                        <option value="all" style={s.option}>إرسال للجميع (بدون شرط)</option>
                        <option value="new_course" style={s.option}>كورس جديد</option>
                        <option value="new_offer" style={s.option}>عرض جديد على المنصة</option>
                        <option value="new_product" style={s.option}>منتج جديد في المتجر</option>
                        <option value="new_bank" style={s.option}>بنك أسئلة جديد</option>
                        <option value="new_library" style={s.option}>مكتبة / ملف جديد</option>
                    </select>

                    {/* 💡 الحقول المتغيرة بناءً على الاختيار */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
                        
                        {/* 1. اختيار المدرس (بيظهر لو اخترنا كورس، بنك، مكتبة) */}
                        {['new_course', 'new_bank', 'new_library'].includes(condition) && (
                            <div>
                                <label style={s.label}><FaChalkboardTeacher /> المدرس</label>
                                <select value={selectedTeacherId} onChange={e => { updateField('selectedTeacherId', e.target.value); updateField('selectedEntityId', 'all'); }} style={s.select}>
                                    <option value="all" style={s.option}>-- حدد المدرس --</option>
                                    {MOCK_TEACHERS.map(t => <option key={t.id} value={t.id} style={s.option}>{t.name}</option>)}
                                </select>
                            </div>
                        )}

                        {/* 2. اختيار العنصر الفرعي (كورس، عرض، منتج، بنك، ملف) */}
                        {condition !== 'all' && (
                            <div>
                                <label style={s.label}><FaBoxOpen /> {
                                    condition === 'new_course' ? 'الكورس' : 
                                    condition === 'new_offer' ? 'العرض' : 
                                    condition === 'new_product' ? 'المنتج' : 
                                    condition === 'new_bank' ? 'البنك' : 'الملف'
                                }</label>
                                <select value={selectedEntityId} onChange={e => updateField('selectedEntityId', e.target.value)} disabled={['new_course', 'new_bank', 'new_library'].includes(condition) && selectedTeacherId === 'all'} style={{ ...s.select, opacity: (['new_course', 'new_bank', 'new_library'].includes(condition) && selectedTeacherId === 'all') ? 0.5 : 1 }}>
                                    <option value="all" style={s.option}>-- حدد العنصر --</option>
                                    {condition === 'new_course' && MOCK_COURSES.filter(c => c.teacherId === selectedTeacherId).map(c => <option key={c.id} value={c.id} style={s.option}>{c.title}</option>)}
                                    {condition === 'new_offer' && MOCK_OFFERS.map(o => <option key={o.id} value={o.id} style={s.option}>{o.title}</option>)}
                                    {condition === 'new_product' && MOCK_PRODUCTS.map(p => <option key={p.id} value={p.id} style={s.option}>{p.title}</option>)}
                                    {condition === 'new_bank' && MOCK_BANKS.filter(b => b.teacherId === selectedTeacherId).map(b => <option key={b.id} value={b.id} style={s.option}>{b.title}</option>)}
                                    {condition === 'new_library' && MOCK_LIBRARY.filter(l => l.teacherId === selectedTeacherId).map(l => <option key={l.id} value={l.id} style={s.option}>{l.title}</option>)}
                                </select>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div style={{ background: 'rgba(52, 152, 219, 0.1)', padding: '25px', borderRadius: '15px', border: '1px dashed rgba(52, 152, 219, 0.3)', textAlign: 'center' }}>
                <div style={{ color: 'var(--txt-mut)', marginBottom: '5px', fontSize: '1.1rem' }}>العدد التقريبي للجمهور المستهدف</div>
                <div style={{ fontSize: '3rem', fontWeight: 900, color: '#3498db', textShadow: '0 0 10px rgba(52, 152, 219, 0.5)' }}>
                    {targetCount.toLocaleString()} <span style={{ fontSize: '1rem', color: 'var(--txt-mut)' }}>مُستلم</span>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
                <Button variant="primary" onClick={() => setStep(2)} disabled={targetCount === 0 || (condition !== 'all' && selectedEntityId === 'all')} style={{ background: '#e67e22', border: 'none', padding: '15px 40px', fontSize: '1.1rem' }}>
                    متابعة صياغة الرسالة <FaArrowRight style={{ transform: 'rotate(180deg)', marginLeft: '10px' }} />
                </Button>
            </div>
        </div>
    );
}

const s = {
    label: { display: 'block', color: 'var(--txt-mut)', marginBottom: '10px', fontWeight: 'bold' },
    select: { width: '100%', padding: '15px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '10px', outline: 'none' },
    option: { background: '#1e1e2d', color: 'white' }
};