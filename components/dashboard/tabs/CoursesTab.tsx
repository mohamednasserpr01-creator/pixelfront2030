"use client";
import React from 'react';
import { FaPlayCircle, FaUserTie } from 'react-icons/fa';
import { dashboardData } from '../../../data/mock/dashboardData';

export default function CoursesTab() {
    return (
        <div className="tab-pane active" style={{ animation: 'fadeIn 0.4s ease' }}>
            <h2 className="section-title"><FaPlayCircle /> الكورسات المشترك بها</h2>
            
            {dashboardData.courses.map(course => (
                <div className="course-card" key={course.id}>
                    <div className="course-info">
                        <h3>{course.title}</h3>
                        <p style={{ color: 'var(--txt-mut)', fontWeight: 'bold', fontSize: '0.85rem' }}>
                            <FaUserTie /> {course.teacher}
                        </p>
                    </div>
                    <div className="progress-container">
                        <div className="progress-text">
                            <span>نسبة الإنجاز</span>
                            <span>{course.progress}%</span>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${course.progress}%`, background: course.color }}></div>
                        </div>
                    </div>
                    <button className="btn-resume">دخول الكورس</button>
                </div>
            ))}
        </div>
    );
}