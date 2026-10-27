import Panel from "@/components/Sidebar/header";
import { fetchWithAuth } from "@/function/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";
import CheckinToast from "./notification/CheckinToast";
import TrophyToast from "./notification/notification";
import { CompanionWidget, type Companion } from "./widgets/CompanionWidget";
import { StatsRadarWidget } from "./widgets/Radar";
import { SecretGardenWidget } from "./widgets/SecretGardenWidget";
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

const playCheckinSound = () => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
        console.error("Audio error:", e);
    }
};

const DEFAULT_STATS = {
    sport: 0,
    intel: 0,
    crea: 0,
    career: 0,
    mental: 0,
};

export default function Home() {
    const navigate = useNavigate();

    const [toastTrophy, setToastTrophy] = useState<{ title: string; rarity: string } | null>(null);
    const [isToastVisible, setIsToastVisible] = useState(false);

    const [isCheckinToastVisible, setIsCheckinToastVisible] = useState(false);
    const [earnedXp, setEarnedXp] = useState(0);

    const [tasks, setTasks] = useState<Task[]>([]);
    const [stats, setStats] = useState(DEFAULT_STATS);
    const [companion, setCompanion] = useState<Companion | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resTasks, resStats, resCompanions] = await Promise.all([
                    fetchWithAuth("/calendar/get?today_only=true"),
                    fetchWithAuth("/progression/"),
                    fetchWithAuth("/compagnon/me"),
                ]);

                if (resTasks.ok) {
                    const dataTasks = await resTasks.json();
                    setTasks(dataTasks);
                }

                if (resStats.ok) {
                    const dataStats = await resStats.json();
                    if (dataStats && dataStats.breakdown) {
                        setStats(dataStats.breakdown);
                    }
                }

                if (resCompanions.ok) {
                    const dataComp = await resCompanions.json();
                    if (dataComp.accepted && dataComp.accepted.length > 0) {
                        setCompanion(dataComp.accepted[0]);
                    } else if (dataComp.pending && dataComp.pending.length > 0) {
                        setCompanion(dataComp.pending[0]);
                    }
                }
            } catch (error) {
                console.error("Erreur chargement données:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleCheckin = async (objectiveId: string) => {
        setTasks(prevTasks => prevTasks.map(t => (t.id === objectiveId ? { ...t, completed: true } : t)));

        try {
            const res = await fetchWithAuth("/checkins/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ objective_id: objectiveId }),
            });

            if (res.ok) {
                const data = await res.json();

                const resStats = await fetchWithAuth("/progression/");
                if (resStats.ok) {
                    const dataStats = await resStats.json();
                    if (dataStats && dataStats.breakdown) {
                        setStats(dataStats.breakdown);
                    }
                }

                const resComp = await fetchWithAuth("/compagnon/me");
                if (resComp.ok) {
                    const dataComp = await resComp.json();
                    if (dataComp.accepted && dataComp.accepted.length > 0) {
                        setCompanion(dataComp.accepted[0]);
                    }
                }

                window.dispatchEvent(new Event("refreshPanel"));

                setEarnedXp(data.xp_gained || 10);
                playCheckinSound();
                setIsCheckinToastVisible(true);
                setTimeout(() => setIsCheckinToastVisible(false), 2500);

                if (data.unlocked_trophies && data.unlocked_trophies.length > 0) {
                    const trophy = data.unlocked_trophies[0];
                    playSuccessSound();

                    setTimeout(() => {
                        setToastTrophy(trophy);
                        setIsToastVisible(true);

                        setTimeout(() => {
                            setIsToastVisible(false);
                            setTimeout(() => setToastTrophy(null), 400);
                        }, 4000);
                    }, 500);
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
            <CheckinToast isVisible={isCheckinToastVisible} xp={earnedXp} />
            <TrophyToast trophy={toastTrophy} isVisible={isToastVisible} />

            <div className="home-main-content">
                <div className="home-header">
                    <h1 className="home-title">Tableau de bord</h1>
                    <p className="home-subtitle">Prêt à progresser aujourd'hui ?</p>
                </div>

                <div className="home-widgets">
                    {isLoading ? (
                        <p style={{ color: "#A0AEC0" }}>Chargement des données...</p>
                    ) : (
                        <>
                            <StatsRadarWidget stats={stats} />
                            <TodayFocusWidget
                                tasks={tasks}
                                onCheckin={handleCheckin}
                                onNavigateToCalendar={() => navigate("/calendar")}
                            />
                            <CompanionWidget companion={companion} onNavigateToRivals={() => navigate("/rivals")} />
                            <SecretGardenWidget
                                tasks={tasks}
                                onCheckin={handleCheckin}
                                onNavigateToSecretGarden={() => navigate("/secret_garden")}
                            />{" "}
                        </>
                    )}
                </div>
            </div>

            <div className="home-side-panel">
                <Panel />
            </div>
        </div>
    );
}
