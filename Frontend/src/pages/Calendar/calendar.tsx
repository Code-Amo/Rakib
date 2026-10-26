import { fetchWithAuth } from "@/function/api";
import { BookOpen, Brain, Briefcase, Clock, Dumbbell, Palette, Users, Wind } from "lucide-react";
import { useEffect, useMemo, useState, type SyntheticEvent } from "react";
import "./calendar.css";

interface Objective {
    id?: number;
    title: string;
    category: string;
    start_time: string;
    end_time: string;
    frequency: string;
    days_of_week: number[];
}

const CATEGORIES: Record<string, { color: string; icon: any }> = {
    Sport: { color: "#E53E3E", icon: Dumbbell }, // Rouge
    Intelligence: { color: "#3182CE", icon: Brain }, // Bleu
    Créativité: { color: "#805AD5", icon: Palette }, // Violet
    Career: { color: "#D69E2E", icon: Briefcase }, // Or / Jaune
    Mental: { color: "#319795", icon: Wind }, // Turquoise

    // --- LE JARDIN SECRET ---
    Imane: { color: "#38A169", icon: BookOpen }, // Vert
    Relations: { color: "#ED64A6", icon: Users }, // Rose
};

const WEEK_DAYS_NAMES = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

const START_HOUR = 6;
const END_HOUR = 23;
const TOTAL_MINUTES = (END_HOUR - START_HOUR + 1) * 60;

const HOURS_RANGE = Array.from(
    { length: END_HOUR - START_HOUR + 1 },
    (_, i) => `${(i + START_HOUR).toString().padStart(2, "0")}:00`,
);

const timeToMinutes = (timeStr: string): number => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(":").map(Number);
    return (hours || 0) * 60 + (minutes || 0);
};

export default function Calendar() {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("Sport");
    const [startTime, setStartTime] = useState("12:00");
    const [endTime, setEndTime] = useState("14:00");
    const [selectedDays, setSelectedDays] = useState<number[]>([]);
    const [objectives, setObjectives] = useState<Objective[]>([]);
    const [weekDays, setWeekDays] = useState<{ name: string; date: Date; dayIndex: number }[]>([]);
    const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

    const showNotification = (text: string, type: "success" | "error") => {
        setFeedbackMessage({ text, type });
        setTimeout(() => setFeedbackMessage(null), 4000);
    };

    const toggleDay = (index: number) => {
        if (selectedDays.includes(index)) {
            setSelectedDays(selectedDays.filter(d => d !== index));
        } else {
            setSelectedDays([...selectedDays, index].sort());
        }
    };

    const fetchObjectives = async (signal?: AbortSignal) => {
        try {
            const res = await fetchWithAuth(`/calendar/get`, {
                method: "GET",
                signal,
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (res.ok) {
                const data = await res.json();
                setObjectives(data);
            } else {
                throw new Error(`Erreur HTTP (${res.status})`);
            }
        } catch (err: any) {
            if (err.name !== "AbortError") {
                console.error("Erreur lors de la récupération des objectifs :", err);
                showNotification("Impossible de charger les objectifs depuis le serveur.", "error");
            }
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        fetchObjectives(controller.signal);

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

        return () => controller.abort();
    }, []);

    const getFrequencyLabel = (days: number[]) => {
        if (days.length === 7) return "Tous les jours";
        return `${days.length}j/semaine`;
    };

    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();

        const startMin = timeToMinutes(startTime);
        const endMin = timeToMinutes(endTime);

        if (!title.trim() || selectedDays.length === 0) {
            showNotification("Veuillez saisir un titre et sélectionner au moins un jour.", "error");
            return;
        }

        if (endMin <= startMin) {
            showNotification("L'heure de fin doit être supérieure à l'heure de début.", "error");
            return;
        }

        const newObj: Objective = {
            title: title.trim(),
            category,
            start_time: startTime,
            end_time: endTime,
            frequency: getFrequencyLabel(selectedDays),
            days_of_week: selectedDays,
        };

        try {
            const res = await fetchWithAuth(`/calendar/post`, {
                method: "POST",
                credentials: "include",
                body: JSON.stringify(newObj),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (res.ok) {
                const createdObj = await res.json();
                setObjectives(prev => [...prev, createdObj]);
                showNotification("Objectif créé avec succès !", "success");

                setTitle("");
                setStartTime("12:00");
                setEndTime("14:00");
                setSelectedDays([]);
            } else {
                showNotification("Erreur lors de la création de l'objectif sur le serveur.", "error");
            }
        } catch (err) {
            console.error("Erreur serveur .:", err);
            showNotification("Erreur de connexion au serveur.", "error");
        }
    };

    const handleDelete = async (id?: number) => {
        if (!id) return;
        try {
            const res = await fetchWithAuth(`/calendar/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!res.ok) throw new Error();
            setObjectives(prev => prev.filter(o => o.id !== id));
            showNotification("Objectif supprimé.", "success");
        } catch (err) {
            console.error("Erreur lors de la suppression :", err);
            showNotification("Erreur de suppression sur le serveur.", "error");
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

    const objectivesByDay = useMemo(() => {
        const map: Record<number, Objective[]> = {};
        for (let i = 0; i < 7; i++) {
            map[i] = objectives.filter(o => o.days_of_week.includes(i));
        }
        return map;
    }, [objectives]);

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

                                <div className="time-interval-wrapper">
                                    <Clock size={16} color="#A0AEC0" />
                                    <label className="duration-label">Horaire :</label>
                                    <div className="time-inputs-row">
                                        <input
                                            type="time"
                                            value={startTime}
                                            min="06:00"
                                            max="23:00"
                                            onChange={e => setStartTime(e.target.value)}
                                            className="input-field time-input"
                                            required
                                        />
                                        <span className="time-separator">à</span>
                                        <input
                                            type="time"
                                            value={endTime}
                                            min="06:00"
                                            max="23:00"
                                            onChange={e => setEndTime(e.target.value)}
                                            className="input-field time-input"
                                            required
                                        />
                                    </div>
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

                            <div className="objectives-section-wrapper">
                                <h3 className="section-title">Mes objectifs</h3>

                                <div className="objectives-list">
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
                                                            <span className="frequency-label">
                                                                • {obj.start_time || "12:00"} -{" "}
                                                                {obj.end_time || "14:00"}
                                                            </span>
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
                                </div>
                            </div>
                        </aside>

                        <section className="grid-section glass-card">
                            <div className="calendar-grid-header">
                                <div style={{ width: "50px", flexShrink: 0 }}></div>
                                <div style={{ display: "flex", flex: 1, minWidth: 0 }}>
                                    {weekDays.map(d => (
                                        <div
                                            key={d.name}
                                            className={`day-header ${isToday(d.date) ? "today-header" : ""}`}
                                        >
                                            <span className="day-name">{d.name}</span>
                                            <span className="day-date">{d.date.getDate()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="calendar-grid-body-time">
                                <div className="time-sidebar">
                                    {HOURS_RANGE.map(hour => (
                                        <div key={hour} className="time-slot">
                                            {hour}
                                        </div>
                                    ))}
                                </div>

                                <div className="day-cells-container">
                                    {weekDays.map((d, dayIndex) => {
                                        const dayObjectives = objectivesByDay[dayIndex] || [];

                                        return (
                                            <div
                                                key={d.name}
                                                className={`day-cell-time ${isToday(d.date) ? "today" : ""}`}
                                            >
                                                {dayObjectives.map(obj => {
                                                    const catConfig = CATEGORIES[obj.category] || CATEGORIES["Sport"];
                                                    const IconComponent = catConfig.icon;
                                                    const baseColor = catConfig.color;

                                                    const rawStartMin = timeToMinutes(obj.start_time || "12:00");
                                                    const rawEndMin = timeToMinutes(obj.end_time || "14:00");

                                                    const startMinOffset = Math.max(0, rawStartMin - START_HOUR * 60);
                                                    const durationMin = Math.max(rawEndMin - rawStartMin, 15);

                                                    const topPercent = (startMinOffset / TOTAL_MINUTES) * 100;
                                                    const heightPercent = (durationMin / TOTAL_MINUTES) * 100;

                                                    if (rawEndMin <= START_HOUR * 60) return null;

                                                    return (
                                                        <div
                                                            key={`${obj.id}-${dayIndex}`}
                                                            className="grid-objective-item-timed"
                                                            style={{
                                                                top: `${topPercent}%`,
                                                                height: `${heightPercent}%`,
                                                                background: `linear-gradient(135deg, ${baseColor}33 0%, ${baseColor}11 100%)`,
                                                                borderColor: `${baseColor}66`,
                                                            }}
                                                        >
                                                            <div className="grid-obj-header">
                                                                <IconComponent
                                                                    size={13}
                                                                    color={baseColor}
                                                                    className="grid-obj-icon"
                                                                />
                                                                <span className="grid-obj-title">{obj.title}</span>
                                                            </div>
                                                            <span className="grid-obj-duration">
                                                                {obj.start_time} - {obj.end_time}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>
                    </section>
                </div>
            </main>
        </div>
    );
}
