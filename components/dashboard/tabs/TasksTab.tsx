"use client";
import React, { useState } from 'react';
import { FaClipboardList, FaPlus, FaCheckCircle, FaRegCircle, FaTrash, FaCalendarAlt } from 'react-icons/fa';
import { useToast } from '../../../context/ToastContext';
import { Button } from '../../ui/Button';

interface Task {
    id: number;
    text: string;
    done: boolean;
    deadline?: string;
}

export default function TasksTab({ lang }: { lang: string }) {
    const isAr = lang === 'ar';
    const { showToast } = useToast();

    const [tasks, setTasks] = useState<Task[]>([
        { id: 1, text: isAr ? 'حل امتحان الكيمياء الشامل' : 'Full Chemistry Exam', done: false, deadline: '2024-05-20' },
        { id: 2, text: isAr ? 'مراجعة الباب الأول في الفيزياء' : 'Review Physics Ch.1', done: true, deadline: '2024-05-18' }
    ]);
    
    const [newTask, setNewTask] = useState('');
    const [taskDate, setTaskDate] = useState('');

    const addTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTask.trim()) return;
        setTasks([{ id: Date.now(), text: newTask, done: false, deadline: taskDate }, ...tasks]);
        setNewTask('');
        setTaskDate('');
        showToast(isAr ? 'تمت إضافة المهمة لجدولك 📌' : 'Task added to your schedule 📌', 'success');
    };

    const toggleTask = (id: number, currentStatus: boolean) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, done: !currentStatus } : t));
        if (!currentStatus) {
            showToast(isAr ? 'عاش يا بطل! استمر 🚀' : 'Great job! Keep going 🚀', 'success');
        }
    };

    const deleteTask = (id: number) => {
        setTasks(tasks.filter(t => t.id !== id));
        showToast(isAr ? 'تم حذف المهمة' : 'Task deleted', 'info');
    };

    const pendingTasks = tasks.filter(t => !t.done);
    const completedTasks = tasks.filter(t => t.done);

    return (
        <div className="tab-pane active fade-in">
            <h2 className="section-title"><FaClipboardList /> {isAr ? 'مهامي الدراسية' : 'My Tasks'}</h2>
            
            {/* 💡 كارت إضافة مهمة جديدة */}
            <div style={{ background: 'var(--card)', padding: '25px', borderRadius: '15px', border: '1px solid rgba(108,92,231,0.3)', marginBottom: '30px' }}>
                <h3 style={{ marginBottom: '15px', color: 'var(--txt)' }}>
                    {isAr ? 'إضافة مهمة جديدة' : 'Add New Task'}
                </h3>
                <form onSubmit={addTask} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    <input 
                        type="text" 
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder={isAr ? 'ماذا تريد أن تنجز اليوم؟' : 'What needs to be done?'}
                        style={{ flex: '1 1 300px', padding: '12px 15px', borderRadius: '10px', border: '1px solid rgba(108,92,231,0.3)', background: 'var(--bg)', color: 'var(--txt)', outline: 'none' }}
                    />
                    <div style={{ display: 'flex', gap: '10px', flex: '1 1 200px' }}>
                        <input 
                            type="date" 
                            value={taskDate}
                            onChange={(e) => setTaskDate(e.target.value)}
                            style={{ flex: 1, padding: '12px 15px', borderRadius: '10px', border: '1px solid rgba(108,92,231,0.3)', background: 'var(--bg)', color: 'var(--txt-mut)', outline: 'none', colorScheme: 'dark' }}
                        />
                        <Button type="submit" variant="primary" icon={<FaPlus />}>
                            {isAr ? 'إضافة' : 'Add'}
                        </Button>
                    </div>
                </form>
            </div>

            {/* 💡 المهام المتبقية */}
            <div style={{ marginBottom: '30px' }}>
                <h3 style={{ color: 'var(--warning)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    ⏳ {isAr ? 'المهام قيد التنفيذ' : 'Pending Tasks'} ({pendingTasks.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {pendingTasks.length === 0 ? (
                        <div style={{ padding: '20px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', color: 'var(--txt-mut)' }}>
                            {isAr ? 'لا توجد مهام متبقية! أنت وحش 🦅' : 'No pending tasks! You are a beast 🦅'}
                        </div>
                    ) : pendingTasks.map(task => (
                        <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: '15px', background: 'var(--card)', padding: '15px 20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', transition: '0.3s' }}>
                            <button onClick={() => toggleTask(task.id, task.done)} style={{ background: 'transparent', border: 'none', color: 'var(--txt-mut)', fontSize: '1.5rem', cursor: 'pointer' }}>
                                <FaRegCircle />
                            </button>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '1.1rem', color: 'var(--txt)', fontWeight: 'bold' }}>{task.text}</div>
                                {task.deadline && (
                                    <div style={{ fontSize: '0.85rem', color: 'var(--warning)', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <FaCalendarAlt /> {task.deadline}
                                    </div>
                                )}
                            </div>
                            <button onClick={() => deleteTask(task.id)} style={{ background: 'rgba(231, 76, 60, 0.1)', border: 'none', color: 'var(--danger)', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <FaTrash />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* 💡 المهام المنجزة */}
            {completedTasks.length > 0 && (
                <div>
                    <h3 style={{ color: 'var(--success)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        ✅ {isAr ? 'المهام المنجزة' : 'Completed Tasks'} ({completedTasks.length})
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', opacity: 0.7 }}>
                        {completedTasks.map(task => (
                            <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(46, 204, 113, 0.05)', padding: '15px 20px', borderRadius: '12px', border: '1px solid rgba(46, 204, 113, 0.2)' }}>
                                <button onClick={() => toggleTask(task.id, task.done)} style={{ background: 'transparent', border: 'none', color: 'var(--success)', fontSize: '1.5rem', cursor: 'pointer' }}>
                                    <FaCheckCircle />
                                </button>
                                <div style={{ flex: 1, textDecoration: 'line-through', color: 'var(--txt-mut)', fontWeight: 'bold' }}>
                                    {task.text}
                                </div>
                                <button onClick={() => deleteTask(task.id)} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}