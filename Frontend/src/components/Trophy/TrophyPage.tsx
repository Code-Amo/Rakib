import { fetchWithAuth } from "@/function/api";
import { AlertCircle, Brain, Briefcase, Dumbbell, Gem, Palette, Wind, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import TrophyCard, { type TrophyRarity } from "./Trophy";
import "./TrophyPage.css";

export interface TrophyItem {
    id: string;
    title: string;
    description: string;
    rarity: TrophyRarity;
    category: "sport" | "intelligence" | "créativité" | "career" | "mental" | "platinum";
}

const LOCAL_TROPHIES: TrophyItem[] = [
    {
        id: "rakib_platine",
        title: "Rakib",
        description: "Débloquer tous les trophées !",
        rarity: "platinum",
        category: "platinum",
    },
    {
        id: "sport_1",
        title: "Premier Pas",
        description: "1 tâche validée en Sport.",
        rarity: "bronze",
        category: "sport",
    },
    {
        id: "sport_2",
        title: "Échauffement",
        description: "10 tâches validées en Sport.",
        rarity: "bronze",
        category: "sport",
    },
    {
        id: "sport_3",
        title: "Machine",
        description: "50 tâches validées en Sport.",
        rarity: "silver",
        category: "sport",
    },
    {
        id: "sport_4",
        title: "Mois de Fer",
        description: "7 jours consécutifs de Sport.",
        rarity: "silver",
        category: "sport",
    },
    {
        id: "sport_5",
        title: "Centurion",
        description: "100 tâches validées en Sport.",
        rarity: "gold",
        category: "sport",
    },
    {
        id: "intel_1",
        title: "Étincelle",
        description: "1 tâche validée en Intelligence.",
        rarity: "bronze",
        category: "intelligence",
    },
    {
        id: "intel_2",
        title: "Curieux",
        description: "10 tâches validées en Intelligence.",
        rarity: "bronze",
        category: "intelligence",
    },
    {
        id: "intel_3",
        title: "Esprit Affûté",
        description: "50 tâches validées en Intelligence.",
        rarity: "silver",
        category: "intelligence",
    },
    {
        id: "intel_4",
        title: "Discipline Mentale",
        description: "7 jours consécutifs d'Intelligence.",
        rarity: "silver",
        category: "intelligence",
    },
    {
        id: "intel_5",
        title: "Génie",
        description: "100 tâches validées en Intelligence.",
        rarity: "gold",
        category: "intelligence",
    },
    {
        id: "creat_1",
        title: "Première oeuvre",
        description: "1 tâche validée en Créativité.",
        rarity: "bronze",
        category: "créativité",
    },
    {
        id: "creat_2",
        title: "Inspiration",
        description: "10 tâches validées en Créativité.",
        rarity: "bronze",
        category: "créativité",
    },
    {
        id: "creat_3",
        title: "Artisan",
        description: "50 tâches validées en Créativité.",
        rarity: "silver",
        category: "créativité",
    },
    {
        id: "creat_4",
        title: "Créateur confirmé",
        description: "7 jours consécutifs de Créativité.",
        rarity: "silver",
        category: "créativité",
    },
    {
        id: "creat_5",
        title: "Flow",
        description: "100 tâches validées en Créativité.",
        rarity: "gold",
        category: "créativité",
    },
    {
        id: "career_1",
        title: "Premier contrat",
        description: "1 tâche validée en Career.",
        rarity: "bronze",
        category: "career",
    },
    {
        id: "career_2",
        title: "Réseau",
        description: "10 tâches validées en Career.",
        rarity: "bronze",
        category: "career",
    },
    {
        id: "career_3",
        title: "Professionnel",
        description: "50 tâches validées en Career.",
        rarity: "silver",
        category: "career",
    },
    {
        id: "career_4",
        title: "Stratège",
        description: "7 jours consécutifs de Career.",
        rarity: "silver",
        category: "career",
    },
    {
        id: "career_5",
        title: "Bâtisseur",
        description: "100 tâches validées en Career.",
        rarity: "gold",
        category: "career",
    },
    {
        id: "mental_1",
        title: "Pause Mentale",
        description: "1 tâche validée en Mental.",
        rarity: "bronze",
        category: "mental",
    },
    {
        id: "mental_2",
        title: "Zen",
        description: "10 tâches validées en Mental.",
        rarity: "bronze",
        category: "mental",
    },
    {
        id: "mental_3",
        title: "Clarté",
        description: "50 tâches validées en Mental.",
        rarity: "silver",
        category: "mental",
    },
    {
        id: "mental_4",
        title: "Esprit sain",
        description: "7 jours consécutifs de Mental.",
        rarity: "silver",
        category: "mental",
    },
    {
        id: "mental_5",
        title: "Paix Intérieure",
        description: "100 tâches validées en Mental.",
        rarity: "gold",
        category: "mental",
    },
];

interface TrophyPageProps {
    onClose: () => void;
}

const CACHE_KEY = "user_unlocked_trophies";

const CATEGORY_CONFIG = {
    sport: { name: "Sport", icon: Dumbbell, color: "#E53E3E" },
    intelligence: { name: "Intelligence", icon: Brain, color: "#3182CE" },
    créativité: { name: "Créativité", icon: Palette, color: "#805AD5" },
    career: { name: "Career", icon: Briefcase, color: "#D69E2E" },
    mental: { name: "Mental", icon: Wind, color: "#319795" },
};

export default function TrophyPage({ onClose }: TrophyPageProps) {
    const [unlockedMap, setUnlockedMap] = useState<Record<string, boolean>>({});
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const fetchTrophyStatuses = async (forceRefresh = false) => {
        setErrorMessage(null);

        if (forceRefresh) {
            sessionStorage.removeItem(CACHE_KEY);
        }

        if (!forceRefresh) {
            const cachedData = sessionStorage.getItem(CACHE_KEY);
            if (cachedData) {
                try {
                    const parsedUnlockedTitles: string[] = JSON.parse(cachedData);
                    const map: Record<string, boolean> = {};
                    parsedUnlockedTitles.forEach(title => {
                        map[title] = true;
                    });
                    setUnlockedMap(map);
                } catch (e) {
                    sessionStorage.removeItem(CACHE_KEY);
                }
            }
        }

        try {
            const res = await fetchWithAuth("/trophy", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                if (res.status === 401) {
                    throw new Error("Session expirée. Veuillez vous reconnecter.");
                }
                throw new Error(`Erreur HTTP (${res.status})`);
            }

            const backendTrophies: { title: string; is_unlocked: boolean }[] = await res.json();

            const map: Record<string, boolean> = {};
            const unlockedTitles: string[] = [];

            backendTrophies.forEach(trophy => {
                if (trophy.is_unlocked) {
                    map[trophy.title] = true;
                    unlockedTitles.push(trophy.title);
                }
            });

            sessionStorage.setItem(CACHE_KEY, JSON.stringify(unlockedTitles));
            setUnlockedMap(map);
        } catch (err: any) {
            setErrorMessage(
                err.message || "Impossible de contacter le serveur. Les trophées s'affichent en mode verrouillé.",
            );
            setUnlockedMap({});
        }
    };

    useEffect(() => {
        fetchTrophyStatuses();
    }, []);

    const platinumTrophy = LOCAL_TROPHIES.find(t => t.category === "platinum");

    const getCategoryTrophies = (catKey: "sport" | "intelligence" | "créativité" | "career" | "mental") =>
        LOCAL_TROPHIES.filter(t => t.category === catKey);

    const regularTrophies = LOCAL_TROPHIES.filter(t => t.category !== "platinum");
    const totalTrophiesCount = regularTrophies.length;
    const unlockedTrophiesCount = regularTrophies.filter(t => !!unlockedMap[t.title]).length;
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
                                isUnlocked={!!unlockedMap[platinumTrophy.title]}
                                icon={<Gem size={18} color="#ffffff" />}
                            />
                        </div>
                    )}

                    {(["sport", "intelligence", "créativité", "career", "mental"] as const).map(catKey => {
                        const catConfig = CATEGORY_CONFIG[catKey];
                        const catTrophies = getCategoryTrophies(catKey);
                        const catUnlocked = catTrophies.filter(t => !!unlockedMap[t.title]).length;
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
                                            isUnlocked={!!unlockedMap[t.title]}
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
