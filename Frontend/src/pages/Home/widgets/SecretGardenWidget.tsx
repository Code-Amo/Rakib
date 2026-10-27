import { ArrowRight, Check, Heart } from "lucide-react";
import React, { useMemo } from "react";
import "./SecretGardenWidget.css";

export type SecretGardenCategory = "Imane" | "Relations";

export interface Task {
    id: string;
    title: string;
    category: SecretGardenCategory | string;
    completed: boolean;
}
export interface SecretGardenWidgetProps {
    tasks: Task[];
    onCheckin: (id: string) => void;
    onNavigateToSecretGarden: () => void;
}

export const SecretGardenWidget: React.FC<SecretGardenWidgetProps> = ({
    tasks,
    onCheckin,
    onNavigateToSecretGarden,
}) => {
    const filteredTasks = useMemo(() => {
        return tasks.filter(task => task.category === "Imane" || task.category === "Relations");
    }, [tasks]);

    return (
        <section className="secret-garden-widget" aria-label="Jardin Secret">
            <header className="secret-garden-header">
                <div className="secret-garden-title-container">
                    <div className="secret-garden-icon-wrapper" aria-hidden="true">
                        <Heart size={20} className="secret-garden-heart-icon" />
                    </div>
                    <div className="secret-garden-header-text">
                        <h2 className="secret-garden-title">Jardin Secret</h2>
                        <p className="secret-garden-subtitle">L'essentiel, sans pression.</p>
                    </div>
                </div>
            </header>

            <main className="secret-garden-content">
                {filteredTasks.length === 0 ? (
                    <div className="secret-garden-empty-state">
                        <p className="secret-garden-empty-text">
                            Aucune tâche spirituelle ou relationnelle prévue aujourd'hui. Profite de l'instant.
                        </p>
                        <button type="button" className="secret-garden-action-btn" onClick={onNavigateToSecretGarden}>
                            <span>Ouvrir le jardin</span>
                            <ArrowRight size={16} />
                        </button>
                    </div>
                ) : (
                    <ul className="secret-garden-task-list" role="list">
                        {filteredTasks.map(task => (
                            <li
                                key={task.id}
                                className={`secret-garden-task-item ${task.completed ? "completed" : ""}`}
                            >
                                <button
                                    type="button"
                                    className={`secret-garden-checkbox ${task.completed ? "checked" : ""}`}
                                    onClick={() => onCheckin(task.id)}
                                    aria-label={`Marquer "${task.title}" comme ${
                                        task.completed ? "non accomplie" : "accomplie"
                                    }`}
                                >
                                    {task.completed && <Check size={13} strokeWidth={2.5} />}
                                </button>

                                <span className="secret-garden-task-title">{task.title}</span>

                                <span className={`secret-garden-category-badge badge-${task.category.toLowerCase()}`}>
                                    {task.category}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </main>
        </section>
    );
};

export default SecretGardenWidget;
