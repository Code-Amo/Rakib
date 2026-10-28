import { fetchWithAuth } from "@/function/api";
import {
    AlertCircle,
    BookOpen,
    Calendar,
    Check,
    CheckCircle2,
    Feather,
    Heart,
    Leaf,
    Loader2,
    RefreshCw,
    Save,
    Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Task } from "../Home/widgets/Todayfocus";
import "./secret_garden.css";

const QUOTES = [
    { text: "Le calme de l'âme est une adoration.", author: "Sagesse" },
    { text: "Ce qui est accompli dans le secret avec sincérité est ce qui demeure.", author: "Pensée du Jour" },
    { text: "Prends soin de ton cœur, car c'est de lui que découlent les sources de la vie.", author: "Rappel" },
];

export default function SecretGarden() {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [note, setNote] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSavingNote, setIsSavingNote] = useState(false);
    const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
    const [quoteIndex, setQuoteIndex] = useState(0);

    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        const fetchGardenData = async () => {
            try {
                const [resTasks, resJournal] = await Promise.all([
                    fetchWithAuth("/calendar/get?today_only=true"),
                    fetchWithAuth("/secret_garden/journal"),
                ]);

                if (resTasks.ok) {
                    const dataTasks = await resTasks.json();
                    setTasks(dataTasks);
                }

                if (resJournal.ok) {
                    const dataJournal = await resJournal.json();
                    setNote(dataJournal.content || "");
                }
            } catch (error) {
                showToast("Impossible de charger votre jardin.", "error");
            } finally {
                setIsLoading(false);
            }
        };
        fetchGardenData();
    }, []);

    const gardenTasks = tasks.filter(t => t.category === "Imane" || t.category === "Relations");

    const handleSilentCheckin = async (taskId: string) => {
        setTasks(prev => prev.map(t => (t.id === taskId ? { ...t, completed: true } : t)));

        try {
            const res = await fetchWithAuth("/checkins/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ objective_id: taskId }),
            });

            if (!res.ok) throw new Error("Erreur serveur");
            showToast("Action accomplie en toute sérénité.", "success");
        } catch (error) {
            setTasks(prev => prev.map(t => (t.id === taskId ? { ...t, completed: false } : t)));
            showToast("Erreur lors de la validation.", "error");
        }
    };

    const handleSaveNote = async () => {
        setIsSavingNote(true);
        try {
            const res = await fetchWithAuth("/secret_garden/journal", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: note }),
            });

            if (!res.ok) throw new Error("Erreur serveur");

            const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            setLastSavedTime(time);
            showToast("Carnet sauvegardé à l'abri des regards.", "success");
        } catch (error) {
            showToast("Impossible de sauvegarder le carnet.", "error");
        } finally {
            setIsSavingNote(false);
        }
    };

    const getCategoryClass = (category: string) => {
        switch (category.toLowerCase()) {
            case "imane":
            case "foi":
                return "badge-foi";
            case "relations":
                return "badge-relations";
            default:
                return "badge-default";
        }
    };

    if (isLoading) {
        return (
            <div className="secret-garden-loading">
                <Loader2 className="spinner" size={32} />
                <p>Chargement de votre espace...</p>
            </div>
        );
    }

    return (
        <div className="secret-garden-container">
            <div className="secret-garden-bg-glow"></div>

            {toast && (
                <div className={`garden-toast ${toast.type}`}>
                    {toast.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    <span>{toast.message}</span>
                </div>
            )}

            <header className="secret-garden-header">
                <div>
                    <div className="secret-garden-tag">
                        <span className="tag-badge">0 XP • Pure Sincérité</span>
                    </div>
                    <h1 className="secret-garden-title">Jardin Secret</h1>
                </div>
                <div className="secret-garden-philosophy">
                    <Heart size={16} className="text-rose-400" />
                    <span>Espace personnel</span>
                </div>
            </header>

            <div className="secret-garden-grid">
                <div className="garden-widget carnet-widget">
                    <div className="widget-header">
                        <div className="widget-title-group">
                            <BookOpen className="text-purple-400" size={20} />
                            <div>
                                <h2>Carnet Intime</h2>
                                <p>Espace d'écriture</p>
                            </div>
                        </div>
                    </div>
                    <textarea
                        className="carnet-textarea"
                        placeholder="Dépose ici ce que tu as sur le cœur..."
                        value={note}
                        onChange={e => setNote(e.target.value)}
                    />
                    <div className="carnet-footer">
                        <span className="word-count">{note.trim() ? note.trim().split(/\s+/).length : 0} mots</span>
                        <div className="save-section">
                            {lastSavedTime && <span className="last-saved">Sauvegardé à {lastSavedTime}</span>}
                            <button className="save-btn" onClick={handleSaveNote} disabled={isSavingNote}>
                                {isSavingNote ? <RefreshCw className="spinner" size={14} /> : <Save size={14} />}
                                {isSavingNote ? "Sauvegarde..." : "Sauvegarder"}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="garden-widget tasks-widget">
                    <div className="widget-header">
                        <div className="widget-title-group">
                            <Leaf className="text-emerald-400" size={20} />
                            <div>
                                <h2>Mon Jardin</h2>
                                <p>Foi & Relations</p>
                            </div>
                        </div>
                    </div>

                    <div className="garden-tasks-list">
                        {gardenTasks.length === 0 ? (
                            <div className="empty-garden">
                                <p>Aucune tâche spirituelle ou relationnelle prévue aujourd'hui.</p>
                                <button className="garden-calendar-cta" onClick={() => navigate("/calendar")}>
                                    <Calendar size={16} /> Planifier ma journée
                                </button>
                            </div>
                        ) : (
                            gardenTasks.map(task => (
                                <div
                                    key={task.id}
                                    className={`garden-task-item ${task.completed ? "completed" : ""}`}
                                    onClick={() => !task.completed && handleSilentCheckin(task.id)}
                                >
                                    <div className="garden-task-left">
                                        <div className="garden-checkbox">
                                            {task.completed && <Check size={12} strokeWidth={3} />}
                                        </div>
                                        <span className="garden-task-title">{task.title}</span>
                                    </div>
                                    <span className={`garden-task-badge ${getCategoryClass(task.category)}`}>
                                        {task.category}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="garden-widget quote-widget">
                    <div className="widget-header">
                        <div className="widget-title-group">
                            <Sparkles className="text-amber-400" size={20} />
                            <div>
                                <h2>Rappel</h2>
                                <p>Inspiration</p>
                            </div>
                        </div>
                        <button
                            className="refresh-quote-btn"
                            onClick={() => setQuoteIndex(prev => (prev + 1) % QUOTES.length)}
                        >
                            <RefreshCw size={14} />
                        </button>
                    </div>

                    <div className="quote-content" key={quoteIndex}>
                        <p className="quote-text">“{QUOTES[quoteIndex].text}”</p>
                        <p className="quote-author">— {QUOTES[quoteIndex].author}</p>
                    </div>
                </div>

                <div className="garden-widget philosophy-widget">
                    <Feather className="text-purple-400" size={24} />
                    <div>
                        <h3>Pourquoi 0 XP ?</h3>
                        <p>
                            Le Jardin Secret est un espace privé. La Foi (Imane) et les Relations ne donnent ni XP, ni
                            statistiques, ni trophées. Parce que certaines choses n'ont pas de prix et ne doivent pas
                            être motivées par le gain.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
