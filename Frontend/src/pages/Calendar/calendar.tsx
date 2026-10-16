import Panel from "@/components/Sidebar/header";
import { BookOpen, Brain, Dumbbell, Heart, Lightbulb } from "lucide-react";
import { useEffect, useState, type SyntheticEvent } from "react";
import Sidebar, { type SidebarPage } from "../../components/Sidebar/Sidebar";
import "./calendar.css";

interface Props {
    onNavigate: (page: SidebarPage) => void;
}

interface Objective {
    id?: number;
    title: string;
    category: string;
    frequency: string;
    days_of_week: number[];
}

const CATEGORIES: Record<string, { color: string; icon: any }> = {
    Sport: { color: "#c50000", icon: Dumbbell },
    Intelligence: { color: "#3182CE", icon: Brain },
    Imane: { color: "#38a169", icon: BookOpen },
    Créativité: { color: "#c59100", icon: Lightbulb },
    Relation: { color: "#00eeff", icon: Heart },
};

const WEEK_DAYS_NAMES = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

const API_BASE_URL = "http://localhost:8000/calendar";

export default function Calendar({ onNavigate }: Props) {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("Sport");
    const [selectedDays, setSelectedDays] = useState<number[]>([]);
    const [objectives, setObjectives] = useState<Objective[]>([]);
    const [weekDays, setWeekDays] = useState<{ name: string; date: Date; dayIndex: number }[]>([]);

    const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

    const showNotification = (text: string, type: "success" | "error") => {
        setFeedbackMessage({ text, type });
        setTimeout(() => {
            setFeedbackMessage(null);
        }, 4000);
    };

    const toggleDay = (index: number) => {
        if (selectedDays.includes(index)) {
            setSelectedDays(selectedDays.filter(d => d !== index));
        } else {
            setSelectedDays([...selectedDays, index].sort());
        }
    };

    const fetchObjectives = async () => {
        try {
            const res = await fetch(API_BASE_URL);
            if (res.ok) {
                const data = await res.json();
                setObjectives(data);
            }
        } catch (err) {
            console.error("Erreur lors de la récupération des objectifs:", err);
            showNotification("Impossible de charger les objectifs depuis le serveur.", "error");
        }
    };

    useEffect(() => {
        fetchObjectives();

        const today = new Date();
        const dayIdx = today.getDay();
        const monday = new Date(today);
        const offset = dayIdx === 0 ? -6 : 1 - dayIdx;
        monday.setDate(today.getDate() + offset);

        const days = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            days.push({ name: WEEK_DAYS_NAMES[i], date: d, dayIndex: i });
        }
        setWeekDays(days);
    }, []);

    const getFrequencyLabel = (days: number[]) => {
        if (days.length === 7) return "Tous les jours";
        return `${days.length}j/semaine`;
    };

    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();
        if (!title.trim() || selectedDays.length === 0) {
            showNotification("Veuillez remplir un titre et sélectionner au moins un jour.", "error");
            return;
        }

        const newObj: Objective = {
            title: title.trim(),
            category,
            frequency: getFrequencyLabel(selectedDays),
            days_of_week: selectedDays,
        };

        try {
            const res = await fetch(API_BASE_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newObj),
            });
            if (res.ok) {
                const createdObj = await res.json();
                setObjectives(prev => [...prev, createdObj]);
                showNotification("Objectif créé avec succès !", "success");
            } else {
                setObjectives(prev => [...prev, { ...newObj, id: Date.now() }]);
                showNotification("Objectif ajouté (mode local hors-ligne).", "success");
            }
        } catch (err) {
            console.error("Erreur serveur, fallback local:", err);
            setObjectives(prev => [...prev, { ...newObj, id: Date.now() }]);
            showNotification("Erreur de connexion au serveur.", "error");
        }

        setTitle("");
        setSelectedDays([]);
    };

    const handleDelete = async (id?: number) => {
        if (!id) return;
        try {
            const res = await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error();
            showNotification("Objectif supprimé.", "success");
        } catch (err) {
            console.error("Erreur lors de la suppression:", err);
            showNotification("Erreur lors de la suppression sur le serveur.", "error");
        }
        setObjectives(prev => prev.filter(o => o.id !== id));
    };

    const handleSaveTemplate = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/template`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ objectives }),
            });
            if (res.ok) {
                showNotification("Semaine type sauvegardée avec succès !", "success");
            } else {
                showNotification("Erreur lors de la sauvegarde de la semaine type.", "error");
            }
        } catch (err) {
            console.error("Erreur lors de la sauvegarde du template:", err);
            showNotification("Impossible de joindre le serveur pour la semaine type.", "error");
        }
    };

    const isToday = (date: Date) => {
        const now = new Date();
        return (
            date.getDate() === now.getDate() &&
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear()
        );
    };

    return (
        <div className="app-container-calendar">
            <main className="page-content-calendar">
                <div className="calendar-wrapper">
                    <section className="calendar-body">
                        <aside className="form-section">
                            {feedbackMessage && (
                                <div className={`feedback-banner ${feedbackMessage.type}`}>{feedbackMessage.text}</div>
                            )}

                            <form className="objective-form glass-card" onSubmit={handleSubmit}>
                                <h2 className="section-title">Créer un objectif</h2>

                                <input
                                    type="text"
                                    placeholder="Titre de l'objectif..."
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    className="input-field"
                                    required
                                />

                                <div className="select-with-icon-wrapper">
                                    <select
                                        value={category}
                                        onChange={e => setCategory(e.target.value)}
                                        className="select-field select-with-icon"
                                    >
                                        {Object.keys(CATEGORIES).map(cat => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="days-picker">
                                    <label className="days-label">Jours programmés :</label>
                                    <div className="days-buttons">
                                        {WEEK_DAYS_NAMES.map((dayName, idx) => (
                                            <button
                                                key={dayName}
                                                type="button"
                                                className={`day-btn ${selectedDays.includes(idx) ? "active" : ""}`}
                                                onClick={() => toggleDay(idx)}
                                            >
                                                {dayName.slice(0, 2)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button type="submit" className="btn-primary">
                                    Créer l'objectif
                                </button>
                            </form>

                            <div className="objectives-list">
                                <h3 className="section-title">Mes objectifs</h3>

                                {objectives.length === 0 ? (
                                    <div className="glass-card empty-state">
                                        <p className="empty-msg">Aucun objectif pour l'instant.</p>
                                    </div>
                                ) : (
                                    objectives.map(obj => {
                                        const catConfig = CATEGORIES[obj.category] || CATEGORIES["Sport"];
                                        const IconComponent = catConfig.icon;
                                        return (
                                            <div
                                                key={obj.id}
                                                className="glass-card objective-card"
                                                style={{ borderLeft: `4px solid ${catConfig.color}` }}
                                            >
                                                <div className="objective-info">
                                                    <div className="objective-header-row">
                                                        <IconComponent size={15} color={catConfig.color} />
                                                        <strong className="objective-title">{obj.title}</strong>
                                                    </div>
                                                    <div className="tags-container">
                                                        <span className="category-label">{obj.category}</span>
                                                        <span className="frequency-label">• {obj.frequency}</span>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    className="close-btn"
                                                    onClick={() => handleDelete(obj.id)}
                                                    aria-label="Supprimer l'objectif"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        );
                                    })
                                )}

                                <button type="button" className="save-template-btn" onClick={handleSaveTemplate}>
                                    Sauvegarder en tant que semaine type
                                </button>
                            </div>
                        </aside>

                        <section className="grid-section glass-card">
                            <div className="calendar-grid-header">
                                {weekDays.map(d => (
                                    <div key={d.name} className={`day-header ${isToday(d.date) ? "today-header" : ""}`}>
                                        <span className="day-name">{d.name}</span>
                                        <span className="day-date">{d.date.getDate()}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="calendar-grid-body">
                                {weekDays.map((d, dayIndex) => {
                                    const dayObjectives = objectives.filter(o => o.days_of_week.includes(dayIndex));

                                    return (
                                        <div key={d.name} className={`day-cell ${isToday(d.date) ? "today" : ""}`}>
                                            {dayObjectives.map(obj => {
                                                const catConfig = CATEGORIES[obj.category] || CATEGORIES["Sport"];
                                                const IconComponent = catConfig.icon;
                                                const baseColor = catConfig.color;
                                                return (
                                                    <div
                                                        key={`${obj.id}-${dayIndex}`}
                                                        className="grid-objective-item"
                                                        style={{
                                                            background: `linear-gradient(135deg, ${baseColor}33 0%, ${baseColor}11 100%)`,
                                                            borderColor: `${baseColor}66`,
                                                        }}
                                                    >
                                                        <IconComponent
                                                            size={14}
                                                            color={baseColor}
                                                            className="grid-obj-icon"
                                                        />
                                                        <span className="grid-obj-title">{obj.title}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    </section>
                </div>
            </main>
            <Panel />
            <Sidebar currentPage="calendar" onNavigate={onNavigate} />
        </div>
    );
}
