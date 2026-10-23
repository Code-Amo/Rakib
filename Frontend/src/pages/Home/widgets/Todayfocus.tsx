import { CalendarX, Check, CheckCircle } from "lucide-react";
import React from "react";
import "./Todayfocus.css";

export interface Task {
    id: string;
    title: string;
    category: string;
    completed: boolean;
}

export interface TodayFocusWidgetProps {
    tasks: Task[];
    onCheckin: (taskId: string) => void;
    onNavigateToCalendar: () => void;
}

export const TodayFocusWidget: React.FC<TodayFocusWidgetProps> = ({ tasks, onCheckin, onNavigateToCalendar }) => {
    const getCategoryClass = (category: string) => {
        switch (category.toLowerCase()) {
            case "sport":
                return "badge-sport";
            case "intelligence":
            case "étude":
            case "etude":
                return "badge-intelligence";
            case "foi":
            case "religion":
                return "badge-foi";
            default:
                return "badge-default";
        }
    };

    const completedCount = tasks.filter(t => t.completed).length;

    const handleTaskClick = (e: React.MouseEvent, taskId: string, isCompleted: boolean) => {
        e.preventDefault();
        e.stopPropagation();

        if (isCompleted) return;

        onCheckin(taskId);
    };

    return (
        <div className="today-focus-widget">
            <div className="widget-header">
                <div className="header-title-group">
                    <CheckCircle className="header-icon" size={22} />
                    <h2>Focus du jour</h2>
                </div>
                <span className="task-count">
                    {completedCount}/{tasks.length}
                </span>
            </div>

            {tasks.length > 0 ? (
                <div className="tasks-list">
                    {tasks.map(task => (
                        <div
                            key={task.id}
                            className={`task-item ${task.completed ? "completed" : ""}`}
                            onClick={e => handleTaskClick(e, task.id, task.completed)}
                            style={{ cursor: task.completed ? "default" : "pointer" }}
                        >
                            <div className="task-left">
                                <div className={`task-checkbox ${task.completed ? "checked" : ""}`}>
                                    {task.completed && <Check size={12} color="#fff" strokeWidth={3} />}
                                </div>
                                <span className="task-title" title={task.title}>
                                    {task.title}
                                </span>
                            </div>
                            <span className={`task-badge ${getCategoryClass(task.category)}`}>{task.category}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <CalendarX size={40} className="empty-icon" />
                    <p className="empty-text">Aucune tâche prévue aujourd'hui.</p>
                    <button className="plan-button" onClick={onNavigateToCalendar}>
                        Planifier ma journée
                    </button>
                </div>
            )}
        </div>
    );
};
