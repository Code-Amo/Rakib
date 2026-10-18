import pic from "@/assets/ichigo.jpg";
import { supabase } from "@/supabaseClient";
import {
    AlertCircle,
    CheckCircle,
    Loader2,
    SquarePen,
    Target,
    Trophy as TrophyIcon,
    UserRoundPlus,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Add from "../Add/add";
import TrophyPage from "../Trophy/TrophyPage";
import "./header.css";

interface Task {
    id: string;
    title: string;
    completed: boolean;
}

interface DashboardData {
    user: {
        username: string;
        name: string;
        avatar_url?: string;
        is_online: boolean;
    };
    level: {
        current_level: number;
        title: string;
        current_xp: number;
        max_xp: number;
    };
    trophies_summary: {
        unlocked_count: number;
        total_count: number;
        percentage: number;
    };
    next_achievement: {
        title: string;
        remaining_count: number;
        current_count: number;
        target_count: number;
    };
    today_focus: Task[];
}

const API_DASHBOARD_URL = "http://localhost:8000/panel/dashboard";

export default function Panel() {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isTrophyOpen, setIsTrophyOpen] = useState(false);

    const [data, setData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [isUploading, setIsUploading] = useState<boolean>(false);

    const fetchDashboardData = useCallback(async (signal?: AbortSignal) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(API_DASHBOARD_URL, {
                signal,
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error(`Erreur serveur (${response.status})`);
            }

            const json: DashboardData = await response.json();
            setData(json);
        } catch (err: any) {
            if (err.name !== "AbortError") {
                setError(err.message || "Impossible de charger les données.");
            }
        } finally {
            if (!signal?.aborted) {
                setIsLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        fetchDashboardData(controller.signal);
        return () => controller.abort();
    }, [fetchDashboardData]);

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = event.target.files?.[0];
            if (!file) return;

            setIsUploading(true);

            const fileExt = file.name.split(".").pop();
            const fileName = `avatar-${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage.from("avatars").upload(fileName, file);
            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(fileName);
            const publicUrl = urlData.publicUrl;

            const response = await fetch("http://localhost:8000/auth/me/avatar", {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ avatar_url: publicUrl }),
            });

            if (!response.ok) throw new Error("Erreur lors de la mise à jour de l'avatar sur le serveur");

            setData(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    user: { ...prev.user, avatar_url: publicUrl },
                };
            });
        } catch (error) {
            console.error("Erreur upload:", error);
            alert("Erreur lors de l'upload de l'image.");
        } finally {
            setIsUploading(false);
        }
    };

    const levelProgress = data ? Math.min(100, Math.round((data.level.current_xp / data.level.max_xp) * 100)) : 0;

    const achievementProgress = data?.next_achievement
        ? Math.min(100, Math.round((data.next_achievement.current_count / data.next_achievement.target_count) * 100))
        : 0;

    return (
        <div className="panel-container">
            <button className="add-friends" onClick={() => setIsAddOpen(!isAddOpen)} aria-label="Ajouter un ami">
                <UserRoundPlus />
            </button>
            <button className="modify-button" aria-label="Modifier le profil">
                <SquarePen />
            </button>

            {isLoading && (
                <div className="panel-loading-container">
                    <Loader2 className="panel-spinner" size={32} />
                    <p>Chargement de votre profil...</p>
                </div>
            )}

            {!isLoading && error && (
                <div className="panel-error-container">
                    <AlertCircle size={28} color="#e53e3e" />
                    <p className="panel-error-text">{error}</p>
                    <button className="panel-retry-btn" disabled={isLoading} onClick={() => fetchDashboardData()}>
                        Réessayer
                    </button>
                </div>
            )}

            {!isLoading && !error && data && (
                <>
                    <div className="profile-container">
                        <div className="profile-wrapper">
                            <input
                                type="file"
                                id="avatar-upload"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={handleAvatarUpload}
                                disabled={isUploading}
                            />

                            <label
                                htmlFor="avatar-upload"
                                className="profile-image"
                                style={{ cursor: "pointer", opacity: isUploading ? 0.5 : 1 }}
                            >
                                {isUploading ? (
                                    <div className="avatar-loading">...</div>
                                ) : (
                                    <img
                                        src={data.user.avatar_url || pic}
                                        alt="Photo de profil"
                                        className="profil-pic"
                                    />
                                )}
                            </label>
                            {data.user.is_online && <span className="online"></span>}
                        </div>
                        <h1 className="username">{data.user.username}</h1>
                        <p className="name">{data.user.name}</p>
                    </div>

                    <div className="panel-widgets-container">
                        <div className="glass-stat-card">
                            <h3 className="stat-card-title">
                                Niveau {data.level.current_level} - {data.level.title}
                            </h3>
                            <div className="stat-bar-bg">
                                <div className="stat-bar-fill level-bar" style={{ width: `${levelProgress}%` }}></div>
                            </div>
                            <span className="stat-card-subtext">
                                {data.level.current_xp} / {data.level.max_xp} XP
                            </span>
                        </div>

                        <button
                            className="glass-stat-card trophy-card-button"
                            onClick={() => setIsTrophyOpen(!isTrophyOpen)}
                        >
                            <div className="stat-card-header">
                                <h3 className="stat-card-title">
                                    {data.trophies_summary.unlocked_count} / {data.trophies_summary.total_count}{" "}
                                    Trophées
                                </h3>
                                <span className="stat-card-percentage">
                                    {data.trophies_summary.percentage}% complété
                                </span>
                            </div>
                            <div className="stat-bar-bg">
                                <div
                                    className="stat-bar-fill trophy-bar"
                                    style={{ width: `${data.trophies_summary.percentage}%` }}
                                ></div>
                            </div>
                        </button>

                        <div className="glass-stat-card">
                            <div className="stat-card-header">
                                <h3 className="stat-card-title flex-title">
                                    <Target size={16} color="#9f7aea" />
                                    Objectif suivant
                                </h3>
                            </div>
                            <div className="next-achievement-info">
                                <TrophyIcon size={16} color="#ffd700" className="trophy-subicon" />
                                <span className="next-achievement-text">
                                    Plus que {data.next_achievement.remaining_count} check-ins pour{" "}
                                    <strong>{data.next_achievement.title}</strong>
                                </span>
                            </div>
                            <div className="stat-bar-bg">
                                <div
                                    className="stat-bar-fill next-achievement-bar"
                                    style={{ width: `${achievementProgress}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="glass-stat-card focus-card">
                            <div className="stat-card-header">
                                <h3 className="stat-card-title flex-title">
                                    <CheckCircle size={16} color="#38a169" />
                                    Aujourd'hui
                                </h3>
                            </div>
                            <ul className="focus-tasks-list">
                                {data.today_focus.map(task => (
                                    <li key={task.id} className="focus-task-item">
                                        <span className={`checkbox-circle ${task.completed ? "completed" : ""}`}></span>
                                        <span className="task-text">{task.title}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </>
            )}

            {isAddOpen && <Add onClose={() => setIsAddOpen(false)} />}
            {isTrophyOpen && <TrophyPage onClose={() => setIsTrophyOpen(false)} />}
        </div>
    );
}
