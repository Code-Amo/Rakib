import { supabase } from "@/supabaseClient";
import { AlertCircle, Brain, Dumbbell, Gem, Palette, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import TrophyCard, { type TrophyRarity } from "./Trophy";
import "./TrophyPage.css";

export interface TrophyItem {
    id: string;
    title: string;
    description: string;
    rarity: TrophyRarity;
    category: "sport" | "intelligence" | "creativite" | "platinum";
}

const LOCAL_TROPHIES: TrophyItem[] = [
    // Platine
    {
        id: "rakib_platine",
        title: "Rakib",
        description: "Débloquer tous les trophées !",
        rarity: "platinum",
        category: "platinum",
    },
    // Sport
    {
        id: "sport_1",
        title: "Premier Pas",
        description: "Valider ta première tâche en sport.",
        rarity: "bronze",
        category: "sport",
    },
    {
        id: "sport_2",
        title: "Échauffement",
        description: "10 tâches validées sport.",
        rarity: "bronze",
        category: "sport",
    },
    {
        id: "sport_3",
        title: "Machine",
        description: "50 tâches validées en sport.",
        rarity: "silver",
        category: "sport",
    },
    {
        id: "sport_4",
        title: "Mois de Fer",
        description: "1 mois consécutifs de sport.",
        rarity: "silver",
        category: "sport",
    },
    {
        id: "sport_5",
        title: "Centurion",
        description: "100 tâches validées en sport.",
        rarity: "gold",
        category: "sport",
    },
    // Intelligence
    {
        id: "intel_1",
        title: "Étincelle",
        description: "Valider ta première tâche intelligence.",
        rarity: "bronze",
        category: "intelligence",
    },
    {
        id: "intel_2",
        title: "Curieux",
        description: "10 tâches validées en intelligence.",
        rarity: "bronze",
        category: "intelligence",
    },
    {
        id: "intel_3",
        title: "Esprit Affûté",
        description: "50 tâches validées en intelligence.",
        rarity: "silver",
        category: "intelligence",
    },
    {
        id: "intel_4",
        title: "Discipline Mental",
        description: "1 mois consécutif d'intelligence.",
        rarity: "silver",
        category: "intelligence",
    },
    {
        id: "intel_5",
        title: "Génie",
        description: "100 tâches validées en intelligence.",
        rarity: "gold",
        category: "intelligence",
    },
    // Créativité
    {
        id: "creat_1",
        title: "Première oeuvre",
        description: "Valider ta première tâche en créativité.",
        rarity: "bronze",
        category: "creativite",
    },
    {
        id: "creat_2",
        title: "Inspiration",
        description: "10 tâches validées en créativité.",
        rarity: "bronze",
        category: "creativite",
    },
    {
        id: "creat_3",
        title: "Artisan",
        description: "50 tâches validées en créativité.",
        rarity: "silver",
        category: "creativite",
    },
    {
        id: "creat_4",
        title: "Créateur confirmé",
        description: "1 mois consécutif de créativité.",
        rarity: "silver",
        category: "creativite",
    },
    {
        id: "creat_5",
        title: "Flow",
        description: "100 tâches validées en créativité.",
        rarity: "gold",
        category: "creativite",
    },
];

interface TrophyPageProps {
    onClose: () => void;
}

const API_BASE_URL = "http://localhost:8000/trophy";
const CACHE_KEY = "user_unlocked_trophies";

const CATEGORY_CONFIG = {
    sport: { name: "Sport", icon: Dumbbell, color: "#c50000" },
    intelligence: { name: "Intelligence", icon: Brain, color: "#3182CE" },
    creativite: { name: "Créativité", icon: Palette, color: "#c59100" },
};

export default function TrophyPage({ onClose }: TrophyPageProps) {
    const [unlockedMap, setUnlockedMap] = useState<Record<string, boolean>>({});
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const fetchTrophyStatuses = async (forceRefresh = false) => {
        setErrorMessage(null);

        if (!forceRefresh) {
            const cachedData = sessionStorage.getItem(CACHE_KEY);
            if (cachedData) {
                try {
                    const parsedUnlockedIds: string[] = JSON.parse(cachedData);
                    const map: Record<string, boolean> = {};
                    parsedUnlockedIds.forEach(id => {
                        map[id] = true;
                    });
                    setUnlockedMap(map);
                } catch (e) {
                    console.error("Erreur lors de la lecture du cache sessionStorage:", e);
                    sessionStorage.removeItem(CACHE_KEY);
                }
            }
        }

        try {
            const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
            if (sessionError || !sessionData.session) {
                throw new Error("Utilisateur non authentifié. Impossible de récupérer la session.");
            }

            const token = sessionData.session.access_token;

            const res = await fetch(API_BASE_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                throw new Error(`Erreur HTTP (${res.status})`);
            }

            const unlockedIds: string[] = await res.json();

            const map: Record<string, boolean> = {};
            unlockedIds.forEach(id => {
                map[id] = true;
            });

            sessionStorage.setItem(CACHE_KEY, JSON.stringify(unlockedIds));

            setUnlockedMap(map);
        } catch (err: any) {
            console.error("Erreur serveur FastAPI / Supabase:", err);
            setErrorMessage("Impossible de contacter le serveur. Les trophées s'affichent en mode verrouillé.");
            setUnlockedMap({});
        }
    };

    useEffect(() => {
        fetchTrophyStatuses();
    }, []);

    const platinumTrophy = LOCAL_TROPHIES.find(t => t.category === "platinum");

    const getCategoryTrophies = (catKey: "sport" | "intelligence" | "creativite") =>
        LOCAL_TROPHIES.filter(t => t.category === catKey);

    const regularTrophies = LOCAL_TROPHIES.filter(t => t.category !== "platinum");
    const totalTrophiesCount = regularTrophies.length;
    const unlockedTrophiesCount = regularTrophies.filter(t => !!unlockedMap[t.id]).length;
    const progressPercentage =
        totalTrophiesCount > 0 ? Math.round((unlockedTrophiesCount / totalTrophiesCount) * 100) : 0;

    return createPortal(
        <div className="trophy-overlay" onClick={onClose}>
            <div className="trophy-modal-box" onClick={e => e.stopPropagation()}>
                <button type="button" className="trophy-close-btn" onClick={onClose}>
                    <X size={20} />
                </button>

                <h1 className="trophy-modal-title">Trophées</h1>
                <p className="subtitle-trophy">Les statistiques comme Imane et Relations n'ont pas de trophées.</p>

                {errorMessage && (
                    <div className="trophy-error-banner">
                        <AlertCircle size={18} />
                        <span>{errorMessage}</span>
                        <button type="button" className="trophy-retry-btn" onClick={() => fetchTrophyStatuses(true)}>
                            Réessayer
                        </button>
                    </div>
                )}

                <div className="global-progress-section">
                    <div className="global-progress-info">
                        <span className="global-progress-text">
                            {unlockedTrophiesCount} / {totalTrophiesCount} Trophées débloqués
                        </span>
                        <span className="global-progress-percentage">{progressPercentage}%</span>
                    </div>
                    <div className="global-progress-bar-bg">
                        <div className="global-progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                </div>

                <div className="trophies-list-container">
                    {platinumTrophy && (
                        <div className="platinum-trophy-wrapper">
                            <TrophyCard
                                title={platinumTrophy.title}
                                description={platinumTrophy.description}
                                rarity="platinum"
                                isUnlocked={!!unlockedMap[platinumTrophy.id]}
                                icon={<Gem size={18} color="#ffffff" />}
                            />
                        </div>
                    )}

                    {(["sport", "intelligence", "creativite"] as const).map(catKey => {
                        const catConfig = CATEGORY_CONFIG[catKey];
                        const catTrophies = getCategoryTrophies(catKey);
                        const catUnlocked = catTrophies.filter(t => !!unlockedMap[t.id]).length;
                        const CatIcon = catConfig.icon;

                        return (
                            <div key={catKey} className="trophy-category-block">
                                <div className="trophy-category-header">
                                    <div className="trophy-category-title-wrapper">
                                        <CatIcon size={20} color={catConfig.color} />
                                        <h3 className="trophy-category-name">{catConfig.name}</h3>
                                    </div>
                                    <span className="trophy-category-counter">
                                        {catUnlocked}/{catTrophies.length}
                                    </span>
                                </div>

                                <div className="trophy-category-group">
                                    {catTrophies.map(t => (
                                        <TrophyCard
                                            key={t.id}
                                            title={t.title}
                                            description={t.description}
                                            rarity={t.rarity}
                                            isUnlocked={!!unlockedMap[t.id]}
                                            icon={<CatIcon size={18} color="#ffffff" />}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>,
        document.body,
    );
}
