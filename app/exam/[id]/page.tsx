// FILE: app/exam/[id]/page.tsx
"use client";
import React, { useState, use } from 'react';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic'; // 💡 1. استدعاء دالة التحميل الديناميكي

// استدعاء الخدمات والإعدادات
import { useSettings } from '../../../context/SettingsContext';
import { useToast } from '../../../context/ToastContext'; 
import { examService } from '../../../services/examService';

// 💡 شاشة البداية هتحمل فوراً لأنها الواجهة الأولى
import ExamIntro from '../../../components/exam/ExamIntro';

// استدعاء مكونات الـ UI System
import { Skeleton } from '../../../components/ui/Skeleton';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';

// 💡 2. Lazy Loading للمكونات الثقيلة مع منع الـ SSR لحماية التايمر ونظام الغش
const ExamLive = dynamic(
    () => import('../../../components/exam/ExamLive'),
    { 
        ssr: false, 
        loading: () => (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <Skeleton variant="text" height="40px" width="30%" />
                <Skeleton variant="rectangular" height="300px" width="100%" />
            </div>
        )
    }
);

const ExamResult = dynamic(
    () => import('../../../components/exam/ExamResult'),
    { 
        ssr: false,
        loading: () => <Skeleton variant="rectangular" height="300px" width="100%" />
    }
);

const ExamReview = dynamic(
    () => import('../../../components/exam/ExamReview'),
    { 
        ssr: false,
        loading: () => <Skeleton variant="rectangular" height="400px" width="100%" />
    }
);

export default function ExamRoom({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const examId = resolvedParams.id;
    const { lang } = useSettings();
    const { showToast } = useToast();
    const isAr = lang === 'ar';

    // حالات الامتحان
    const [step, setStep] = useState<'intro' | 'live' | 'result' | 'review'>('intro');
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, any>>({});
    const [score, setScore] = useState(0);

    // حالة مودال التأكيد
    const [showSubmitModal, setShowSubmitModal] = useState(false);

    // سحب بيانات الامتحان بـ React Query
    const { data: exam, isLoading, isError } = useQuery({
        queryKey: ['exam', examId],
        queryFn: () => examService.getExam(examId),
    });

    // دالة فتح مودال التسليم أو التسليم الإجباري
    const handleFinalSubmitRequest = (isForceSubmit = false) => {
        if (!exam) return;

        if (!isForceSubmit) {
            const unanswered = exam.questions.some(q => {
                const ans = answers[q.id];
                return ans === undefined || ans === null || ans.toString().trim() === '';
            });

            if (unanswered) {
                showToast(isAr ? '⚠️ يرجى الإجابة على جميع الأسئلة قبل التسليم!' : '⚠️ Please answer all questions before submitting!', 'error');
                return;
            }
            
            setShowSubmitModal(true);
        } else {
            showToast(isAr ? 'انتهى الوقت! تم سحب الورقة تلقائياً.' : 'Time is up! Exam submitted automatically.', 'error');
            executeFinalSubmit();
        }
    };

    // دالة التسليم الفعلية وحساب الدرجة
    const executeFinalSubmit = () => {
        setShowSubmitModal(false);
        if (!exam) return;

        let correctAnswers = 0;
        let totalMCQ = 0;
        
        exam.questions.forEach(q => {
            if (q.type === 'mcq') {
                totalMCQ++;
                if (answers[q.id] === q.correctAns) correctAnswers++;
            }
        });
        
        const finalScore = totalMCQ > 0 ? Math.round((correctAnswers / totalMCQ) * 100) : 100;
        setScore(finalScore);
        setStep('result');
        showToast(isAr ? 'تم تسليم الامتحان بنجاح 🎓' : 'Exam submitted successfully 🎓', 'success');
    };

    if (isLoading || !exam) return (
        <main className="page-wrapper" style={{ paddingTop: '50px' }}>
            <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', background: 'var(--card)', borderRadius: '20px', padding: '30px', border: '1px solid rgba(108,92,231,0.2)' }}>
                <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                    <Skeleton variant="text" height="40px" width="50%" />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <Skeleton variant="rectangular" height="200px" width="100%" />
                </div>
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                    <Skeleton variant="rectangular" height="50px" width="150px" />
                </div>
            </div>
        </main>
    );

    if (isError) return (
        <main className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <h2 style={{ color: 'var(--danger)' }}>{isAr ? 'حدث خطأ أثناء جلب بيانات الامتحان.' : 'Failed to load exam data.'}</h2>
        </main>
    );

    return (
        <main className="page-wrapper" style={{ paddingTop: '50px' }}>
            
            <div className="exam-container" style={{ width: '100%', maxWidth: '800px', margin: '0 auto', background: 'var(--card)', borderRadius: '20px', padding: '30px', border: '1px solid rgba(108,92,231,0.2)', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
                
                {step === 'intro' && (
                    <ExamIntro exam={exam} lang={lang} onStart={() => setStep('live')} />
                )}

                {/* المكونات دي هتحمل بس لما الطالب يوصل للخطوة بتاعتها */}
                {step === 'live' && (
                    <ExamLive 
                        exam={exam} 
                        lang={lang} 
                        currentQIndex={currentQIndex} 
                        timeLeft={exam.timeLimit * 60} 
                        answers={answers} 
                        onAnswerChange={(qId, val) => setAnswers(prev => ({ ...prev, [qId]: val }))} 
                        onNext={() => setCurrentQIndex(prev => prev + 1)} 
                        onPrev={() => setCurrentQIndex(prev => prev - 1)} 
                        onSubmit={() => handleFinalSubmitRequest(false)} 
                        onTimeUp={() => handleFinalSubmitRequest(true)} 
                        onNavigateTo={(idx) => setCurrentQIndex(idx)}
                    />
                )}

                {step === 'result' && (
                    <ExamResult lang={lang} scorePercentage={score} onReview={() => setStep('review')} />
                )}

                {step === 'review' && (
                    <ExamReview exam={exam} lang={lang} answers={answers} onBackToResult={() => setStep('result')} />
                )}

            </div>

            <Modal 
                isOpen={showSubmitModal} 
                onClose={() => setShowSubmitModal(false)}
                title={isAr ? 'تأكيد التسليم' : 'Confirm Submission'}
                maxWidth="400px"
            >
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                    <p style={{ marginBottom: '25px', fontSize: '1.1rem', color: 'var(--txt)' }}>
                        {isAr ? 'هل أنت متأكد من رغبتك في تسليم الامتحان؟ لا يمكن التراجع عن هذه الخطوة.' : 'Are you sure you want to submit the exam? This action cannot be undone.'}
                    </p>
                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                        <Button variant="outline" onClick={() => setShowSubmitModal(false)}>
                            {isAr ? 'تراجع' : 'Cancel'}
                        </Button>
                        <Button variant="primary" onClick={executeFinalSubmit}>
                            {isAr ? 'نعم، قم بالتسليم' : 'Yes, Submit'}
                        </Button>
                    </div>
                </div>
            </Modal>

        </main>
    );
}