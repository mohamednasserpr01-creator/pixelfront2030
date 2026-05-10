"use client";
import React, { useState } from 'react';
import { FaChartPie, FaBrain, FaCalendarAlt, FaMagic, FaCheck } from 'react-icons/fa';
import { dashboardData } from '../../../data/mock/dashboardData';

export default function AnalyticsTab() {
    // 🔥 State for Genius Study Planner
    const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
    const [schedule, setSchedule] = useState<{day: string, task: string}[] | null>(null);

    const availableCourses = ['الفيزياء (الباب الأول)', 'الكيمياء العضوية', 'اللغة العربية (نحو)', 'اللغة الإنجليزية'];
    const days = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء'];

    const toggleCourse = (course: string) => {
        if (selectedCourses.includes(course)) {
            setSelectedCourses(selectedCourses.filter(c => c !== course));
        } else {
            setSelectedCourses([...selectedCourses, course]);
        }
    };

    const generateSchedule = () => {
        if (selectedCourses.length === 0) return;
        const newSchedule = selectedCourses.map((course, index) => ({
            day: days[index % days.length],
            task: `مراجعة وحل أسئلة ${course}`
        }));
        setSchedule(newSchedule);
    };

    return (
        <div className="tab-pane active" style={{ animation: 'fadeIn 0.4s ease' }}>
            <h2 className="section-title"><FaChartPie /> تحليل الأداء الأكاديمي</h2>
            
            {/* 💡 الجزء القديم بتاعك (محتفظين بيه زي ما هو) */}
            <div className="analytics-grid">
                <div className="analytics-card">
                    <h3 style={{ marginBottom: '20px', color: 'var(--txt)' }}>نسبة الحضور والتفاعل</h3>
                    <div className="circle-chart"><span>{dashboardData.analytics.attendance}%</span></div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--txt-mut)', fontWeight: 'bold' }}>{dashboardData.analytics.msg}</p>
                </div>
                <div className="analytics-card">
                    <h3 style={{ marginBottom: '20px', color: 'var(--txt)' }}>نقاط القوة والضعف</h3>
                    {dashboardData.analytics.skills.map((skill, i) => (
                        <div style={{ textAlign: 'right', marginBottom: '15px' }} key={i}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                <span>{skill.name}</span><span style={{ color: skill.color }}>{skill.score}%</span>
                            </div>
                            <div className="progress-bar"><div className="progress-fill" style={{ width: `${skill.score}%`, background: skill.color }}></div></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 🔥 الإضافة الجديدة: جدول المذاكرة العبقري */}
            <div style={{ background: 'var(--card)', padding: '25px', borderRadius: '15px', border: '1px solid rgba(108,92,231,0.3)', marginTop: '30px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--txt)', marginBottom: '15px' }}>
                    <FaBrain color="var(--p-purple)" /> مولد جدول المذاكرة العبقري 🤖
                </h3>
                <p style={{ color: 'var(--txt-mut)', marginBottom: '20px', fontSize: '0.9rem' }}>
                    حدد المواد التي تريد مراجعتها هذا الأسبوع، وسيقوم الذكاء الاصطناعي بتوزيعها لك في جدول متوازن.
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
                    {availableCourses.map(course => (
                        <button 
                            key={course}
                            onClick={() => toggleCourse(course)}
                            style={{ 
                                padding: '10px 15px', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s',
                                border: selectedCourses.includes(course) ? 'none' : '1px solid rgba(255,255,255,0.1)',
                                background: selectedCourses.includes(course) ? 'var(--p-purple)' : 'transparent',
                                color: selectedCourses.includes(course) ? 'white' : 'var(--txt-mut)'
                            }}
                        >
                            {selectedCourses.includes(course) && <FaCheck style={{ marginInlineEnd: '5px' }} />}
                            {course}
                        </button>
                    ))}
                </div>

                <button 
                    onClick={generateSchedule} 
                    disabled={selectedCourses.length === 0}
                    style={{
                        background: selectedCourses.length === 0 ? 'rgba(255,255,255,0.1)' : 'linear-gradient(45deg, var(--p-purple), #ff007f)',
                        color: selectedCourses.length === 0 ? 'var(--txt-mut)' : 'white',
                        border: 'none', padding: '12px 25px', borderRadius: '10px', fontWeight: '900', cursor: selectedCourses.length === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                    }}
                >
                    <FaMagic /> توليد الجدول السحري
                </button>

                {schedule && (
                    <div style={{ marginTop: '25px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', overflow: 'hidden' }}>
                        {schedule.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '15px' }}>
                                <div style={{ width: '100px', fontWeight: '900', color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <FaCalendarAlt /> {item.day}
                                </div>
                                <div style={{ flex: 1, color: 'var(--txt)' }}>{item.task}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}