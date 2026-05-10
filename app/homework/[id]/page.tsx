// FILE: app/homework/[id]/page.tsx
"use client";
import React, { useState, useEffect, use } from 'react';
import { FaExclamationTriangle, FaStar, FaCheckDouble } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

import { useSettings } from '../../../context/SettingsContext';
import { homeworkService } from '../../../services/homeworkService';
import { useToast } from '../../../context/ToastContext'; 
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Skeleton } from '../../../components/ui/Skeleton';
import HomeworkProgress from '../../../components/homework/HomeworkProgress';

const QuestionCard = dynamic(
    () => import('../../../components/homework/QuestionCard'),
    { 
        ssr: false, 
        loading: () => <div style={{ marginBottom: '20px' }}><Skeleton variant="rectangular" height="250px" width="100%" /></div>
    }
);

const HomeworkResult = dynamic(
    () => import('../../../components/homework/HomeworkResult'),
    { ssr: false, loading: () => <Skeleton variant="rectangular" height="300px" width="100%" /> }
);

const HomeworkReview = dynamic(
    () => import('../../../components/homework/HomeworkReview'),
    { ssr: false, loading: () => <Skeleton variant="rectangular" height="400px" width="100%" /> }
);

export default function HomeworkRoom({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const hwId = resolvedParams.id;
    const router = useRouter();
    const { lang } = useSettings();
    const { showToast } = useToast();
    const isAr = lang === 'ar';

    // States
    const [hw, setHw] = useState<any>(null);
    const [step, setStep] = useState<'live' | 'result' | 'review'>('live');
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [files, setFiles] = useState<Record<string, File | null>>({});
    
    // Grading & Modal States
    const [earnedScore, setEarnedScore] = useState(0);
    const [scorePercentage, setScorePercentage] = useState(0);
    const [showSubmitModal, setShowSubmitModal] = useState(false);

    useEffect(() => {
        homeworkService.getHomework(hwId).then(data => setHw(data));
    }, [hwId]);

    const handleAnswerChange = (qId: string, val: any) => {
        setAnswers(prev => ({ ...prev, [qId]: val }));
    };

    // التعديل العبقري لرفع الملفات (بيحافظ على النص المكتوب)
    const handleFileChange = (qId: string, file: File | null) => {
        setFiles(prev => ({ ...prev, [qId]: file }));
        
        if(file) {
            setAnswers(prev => {
                const currentAnswer = prev[qId] || '';
                if (!currentAnswer.includes('[مرفق:')) {
                    return { ...prev, [qId]: currentAnswer ? `${currentAnswer}\n[مرفق: ${file.name}]` : `[مرفق: ${file.name}]` };
                }
                return prev;
            });
        }
    };

    const saveProgress = () => {
        showToast(isAr ? 'تم حفظ تقدمك بنجاح! يمكنك العودة لاحقاً. 💾' : 'Progress saved successfully! 💾', 'success');
    };

    const requestSubmit = () => {
        setShowSubmitModal(true);
    };

    const executeSubmit = () => {
        setShowSubmitModal(false);
        showToast(isAr ? 'جاري تصحيح الواجب... ⏳' : 'Grading homework... ⏳', 'info');
        
        let calculatedScore = 0;
        hw.questions.forEach((q: any) => {
            if (q.type !== 'essay' && answers[q.id] === q.correctAns) {
                calculatedScore += q.score;
            }
        });

        const percentage = Math.round((calculatedScore / hw.totalScore) * 100);
        setEarnedScore(calculatedScore);
        setScorePercentage(percentage);

        setTimeout(() => {
            setStep('result');
            window.scrollTo(0, 0);
            showToast(isAr ? 'تم التسليم بنجاح! 🎉' : 'Submitted successfully! 🎉', 'success');
        }, 1000);
    };

    if (!hw) return (
        <main className="page-wrapper" style={{ paddingTop: '50px' }}>
            <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto', background: 'var(--card)', borderRadius: '20px', padding: '30px', border: '1px solid rgba(108,92,231,0.2)' }}>
                <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <Skeleton variant="text" height="30px" width="40%" />
                    <Skeleton variant="text" height="20px" width="60%" />
                </div>
                <div style={{ marginBottom: '30px' }}>
                    <Skeleton variant="rectangular" height="10px" width="100%" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <Skeleton variant="rectangular" height="250px" width="100%" />
                    <Skeleton variant="rectangular" height="250px" width="100%" />
                </div>
            </div>
        </main>
    );

    // حساب التقدم (بيقبل النص أو الصورة أو الاتنين)
    const answeredCount = hw.questions.filter((q: any) => {
        const hasText = answers[q.id] !== undefined && answers[q.id] !== null && answers[q.id].toString().trim() !== '';
        const hasFile = files[q.id] !== undefined && files[q.id] !== null;
        return hasText || hasFile;
    }).length;

    const progressPercent = Math.round((answeredCount / hw.questions.length) * 100);

    return (
        <main className="page-wrapper" style={{ paddingTop: '50px' }}>
            <div className="hw-container" style={{ width: '100%', maxWidth: '900px', margin: '0 auto', background: 'var(--card)', borderRadius: '20px', padding: '30px', border: '1px solid rgba(108,92,231,0.2)', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
                
                {step === 'live' && (
                    <div id="step-live">
                        <div className="hw-intro" style={{ marginBottom: '30px', textAlign: 'center' }}>
                            {hw.isMandatory && <span className="hw-badge" style={{ display: 'inline-block', background: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c', padding: '5px 15px', borderRadius: '50px', fontWeight: 'bold', marginBottom: '15px' }}><FaExclamationTriangle style={{ margin: '0 5px' }} /> {isAr ? 'واجب إجباري' : 'Mandatory'}</span>}
                            <h1 style={{ color: 'var(--p-purple)', marginBottom: '15px' }}>{isAr ? hw.titleAr : hw.titleEn}</h1>
                            <p style={{ color: 'var(--txt-mut)', marginBottom: '15px' }}>{isAr ? hw.descAr : hw.descEn}</p>
                            <div className="hw-total-score" style={{ fontWeight: 'bold', color: '#f1c40f' }}><FaStar style={{ margin: '0 5px' }} /> {isAr ? 'إجمالي درجات الواجب:' : 'Total Score:'} {hw.totalScore}</div>
                        </div>

                        <HomeworkProgress 
                            answeredCount={answeredCount} totalCount={hw.questions.length} progressPercent={progressPercent} lang={lang}
                            // 👇 التعديل هنا: استخدام router.push عشان يرجع لتراك الحصة بقوة
                            onBack={() => router.push('/courses/1/lecture/1')} 
                            onSave={saveProgress} onSubmit={requestSubmit}
                        />

                        <div className="questions-list">
                            {hw.questions.map((q: any, index: number) => (
                                <QuestionCard 
                                    key={q.id} q={q} index={index} lang={lang} answer={answers[q.id]} file={files[q.id] || null}
                                    onAnswerChange={handleAnswerChange} onFileChange={handleFileChange}
                                />
                            ))}
                        </div>

                        <div className="hw-footer-actions" style={{ marginTop: '40px', display: 'flex', justifyContent: 'center' }}>
                            <Button variant="primary" size="lg" icon={<FaCheckDouble />} onClick={requestSubmit} style={{ background: 'var(--success)' }}>
                                {isAr ? 'تسليم الواجب النهائي' : 'Final Submit'}
                            </Button>
                        </div>
                    </div>
                )}

                {step === 'result' && (
                    <HomeworkResult scorePercentage={scorePercentage} earnedScore={earnedScore} totalScore={hw.totalScore} lang={lang} onReview={() => setStep('review')} />
                )}

                {step === 'review' && (
                    <HomeworkReview hw={hw} answers={answers} earnedScore={earnedScore} lang={lang} />
                )}

            </div>

            <Modal 
                isOpen={showSubmitModal} 
                onClose={() => setShowSubmitModal(false)}
                title={isAr ? 'تأكيد تسليم الواجب' : 'Confirm Submission'}
                maxWidth="400px"
            >
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                    <p style={{ marginBottom: '10px', fontSize: '1.1rem', color: 'var(--txt)' }}>
                        {answeredCount < hw.questions.length 
                            ? (isAr ? `لقد أجبت على ${answeredCount} من أصل ${hw.questions.length} أسئلة فقط. هل أنت متأكد من التسليم؟` : `You answered ${answeredCount}/${hw.questions.length} questions. Submit anyway?`)
                            : (isAr ? 'هل أنت متأكد من تسليم الواجب نهائياً؟ لا يمكن التراجع.' : 'Are you sure you want to submit the homework?')}
                    </p>
                    
                    {answeredCount < hw.questions.length && (
                        <p style={{ color: 'var(--danger)', fontSize: '0.9rem', marginBottom: '20px', fontWeight: 'bold' }}>
                            {isAr ? '⚠️ درجات الأسئلة المتروكة ستُحسب بصفر.' : '⚠️ Unanswered questions will receive zero points.'}
                        </p>
                    )}

                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '20px' }}>
                        <Button variant="outline" onClick={() => setShowSubmitModal(false)}>
                            {isAr ? 'تراجع' : 'Cancel'}
                        </Button>
                        <Button variant="primary" onClick={executeSubmit} style={{ background: answeredCount < hw.questions.length ? 'var(--warning)' : 'var(--success)' }}>
                            {isAr ? 'نعم، قم بالتسليم' : 'Yes, Submit'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </main>
    );
}