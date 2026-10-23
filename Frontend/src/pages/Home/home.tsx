import Panel from "@/components/Sidebar/header";
import { fetchWithAuth } from "@/function/api";
import { Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";
import type { Task } from "./widgets/Todayfocus";
import { TodayFocusWidget } from "./widgets/Todayfocus";

const playSuccessSound = () => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
        console.error("Audio error:", e);
    }
};

export default function Home() {
    const navigate = useNavigate();
    const [toastTrophy, setToastTrophy] = useState<{ title: string; rarity: string } | null>(null);
    const [isToastVisible, setIsToastVisible] = useState(false);

    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await fetchWithAuth("/calendar/get");
                if (res.ok) {
                    const data = await res.json();
                    setTasks(data);
                }
            } catch (error) {
                console.error("Erreur chargement tâches:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTasks();
    }, []);

    const handleCheckin = async (objectiveId: string) => {
        setTasks(prevTasks => prevTasks.map(t => (t.id === objectiveId ? { ...t, completed: true } : t)));

        try {
            const res = await fetchWithAuth("/checkins/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ objective_id: parseInt(objectiveId) }),
            });

            if (res.ok) {
                const data = await res.json();
                if (data.unlocked_trophies && data.unlocked_trophies.length > 0) {
                    const trophy = data.unlocked_trophies[0];
                    playSuccessSound();
                    setToastTrophy(trophy);
                    setIsToastVisible(true);

                    setTimeout(() => {
                        setIsToastVisible(false);
                        setTimeout(() => setToastTrophy(null), 400);
                    }, 4000);
                }
            } else {
                setTasks(prevTasks => prevTasks.map(t => (t.id === objectiveId ? { ...t, completed: false } : t)));
            }
        } catch (error) {
            console.error(error);
            setTasks(prevTasks => prevTasks.map(t => (t.id === objectiveId ? { ...t, completed: false } : t)));
        }
    };

    return (
        <div className="home-page-wrapper">
            {toastTrophy && (
                <div className={`steam-toast ${toastTrophy.rarity} ${isToastVisible ? "show" : ""}`}>
                    <div className="steam-toast-icon">
                        <Trophy size={32} color="#ffd700" />
                    </div>
                    <div className="steam-toast-content">
                        <h4>Succès débloqué</h4>
                        <p>{toastTrophy.title}</p>
                    </div>
                </div>
            )}

            <div className="home-main-content">
                <div className="home-header">
                    <h1 className="home-title">Tableau de bord</h1>
                    <p className="home-subtitle">Prêt à progresser aujourd'hui ?</p>
                </div>

                <div className="home-widgets">
                    {isLoading ? (
                        <p style={{ color: "#A0AEC0" }}>Chargement des tâches...</p>
                    ) : (
                        <TodayFocusWidget
                            tasks={tasks}
                            onCheckin={handleCheckin}
                            onNavigateToCalendar={() => navigate("/calendar")}
                        />
                    )}
                </div>
            </div>

            <div className="home-side-panel">
                <Panel />
            </div>
        </div>
    );
}
