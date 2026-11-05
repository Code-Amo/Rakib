import pic from "@/assets/logo.png";
import { fetchWithAuth } from "@/function/api";
import { AlertCircle, Flame, Loader2, Pencil, Target, Trophy as TrophyIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import TrophyPage from "../Trophy/TrophyPage";
import "./header.css";

interface Task {
    id: string;
    title: string;
    completed: boolean;
}

interface DashboardData {
    user: {
        id?: string;
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
    streak?: {
        current: number;
        next_milestone: number;
        bonus_percentage: number;
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

export default function Panel() {
    const [isTrophyOpen, setIsTrophyOpen] = useState(false);
    const [data, setData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const fetchDashboardData = useCallback(async (signal?: AbortSignal) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetchWithAuth("/panel/dashboard", { signal });

            if (!response.ok) {
                throw new Error(`Erreur serveur (${response.status})`);
            }

            const json: DashboardData = await response.json();
            setData(json);
        } catch (err: any) {
            if (err.name !== "AbortError") {
                setError(err.message || "Impossible de récupérer les données du profil.");
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

    useEffect(() => {
        const handleRefresh = () => {
            fetchDashboardData();
        };

        window.addEventListener("refreshPanel", handleRefresh);

        return () => {
            window.removeEventListener("refreshPanel", handleRefresh);
        };
    }, [fetchDashboardData]);

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = event.target.files?.[0];
            if (!file) return;
            setIsUploading(true);

            // ⚠️ SECTION DÉSACTIVÉE CAR SUPABASE EST RETIRÉ DU PROJET PORTFOLIO
            /*
            const fileExt = file.name.split(".").pop() || "jpg";
            const userId = data?.user?.id || "user";
            const fileName = `${userId}-${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage.from("avatars").upload(fileName, file);
            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(fileName);
            const publicUrl = urlData.publicUrl;

            const response = await fetchWithAuth("/auth/me/avatar", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ avatar_url: publicUrl }),
            });

            if (!response.ok) throw new Error("Erreur lors de la mise à jour de l'avatar");

            setData(prevData => {
                if (!prevData) return prevData;
                return {
                    ...prevData,
                    user: { ...prevData.user, avatar_url: publicUrl },
                };
            });
            */

            console.log("Upload d'avatar désactivé (Projet Portfolio)");
        } catch (error) {
            console.error("Erreur upload:", error);
            alert("Impossible de mettre à jour la photo de profil.");
        } finally {
            setIsUploading(false);
        }
    };

    const levelProgress = data ? Math.min(100, Math.round((data.level.current_xp / data.level.max_xp) * 100)) : 0;

    const achievementProgress = data?.next_achievement
        ? Math.min(100, Math.round((data.next_achievement.current_count / data.next_achievement.target_count) * 100))
        : 0;

    const streakProgress = data?.streak
        ? Math.min(100, Math.round((data.streak.current / data.streak.next_milestone) * 100))
        : 0;

    const getFlameLevel = (streak: number) => {
        if (streak >= 30) return "flame-legendary";
        if (streak >= 7) return "flame-hot";
        return "flame-normal";
    };

    return (
        <div className="panel-container">
            {isLoading && (
                <div className="panel-loading-container">
                    <Loader2 className="panel-spinner" size={32} />
                    <p>Connexion à votre espace...</p>
                </div>
            )}

            {!isLoading && error && (
                <div className="panel-error-container">
                    <AlertCircle size={28} color="#e53e3e" />
                    <p className="panel-error-text">Oups, impossible de charger votre profil.</p>
                    <button className="panel-retry-btn" disabled={isLoading} onClick={() => fetchDashboardData()}>
                        Actualiser
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
                                    <>
                                        <img
                                            src={data.user.avatar_url || pic}
                                            alt="Photo de profil"
                                            className="profil-pic"
                                        />
                                        <span className="avatar-edit-icon">
                                            <Pencil size={28} />
                                        </span>
                                    </>
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

                        <div className={`glass-stat-card streak-card ${getFlameLevel(data.streak?.current || 0)}`}>
                            <div className="stat-card-header">
                                <h3 className="stat-card-title flex-title">
                                    <Flame size={18} className="flame-icon" />
                                    Discipline
                                </h3>
                                <span className="streak-count">{data.streak?.current || 0} Jours</span>
                            </div>
                            <div className="stat-bar-bg">
                                <div className="stat-bar-fill streak-bar" style={{ width: `${streakProgress}%` }}></div>
                            </div>
                            <span className="stat-card-subtext">
                                {(data.streak?.bonus_percentage || 0) > 0
                                    ? `Bonus XP actif : +${data.streak?.bonus_percentage}%`
                                    : `Plus que ${(data.streak?.next_milestone || 7) - (data.streak?.current || 0)} jours pour le bonus`}
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
                                    Prochain palier
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
                    </div>
                </>
            )}

            {isTrophyOpen && <TrophyPage onClose={() => setIsTrophyOpen(false)} />}
        </div>
    );
}
