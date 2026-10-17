import { Brain, Dumbbell, Gem, Palette, X } from "lucide-react";
import { createPortal } from "react-dom";
import TrophyCard from "./Trophy";
import "./TrophyPage.css";

interface TrophyPageProps {
    onClose: () => void;
}

export default function TrophyPage({ onClose }: TrophyPageProps) {
    return createPortal(
        <div className="trophy-overlay" onClick={onClose}>
            <div className="trophy-modal-box" onClick={e => e.stopPropagation()}>
                <button type="button" className="trophy-close-btn" onClick={onClose}>
                    <X size={20} />
                </button>

                <h1 className="trophy-modal-title">Trophées</h1>
                <p className="subtitle-trophy">Les statistisques comme Imane et Relations n'ont pas de trophées.</p>
                <div className="trophy-search-wrapper">
                    <input className="trophy-search-input" type="text" placeholder="Rechercher un trophée..." />
                </div>
                <TrophyCard
                    title="Rakib"
                    description="Débloquer tous les trophés !"
                    rarity="platinum"
                    isUnlocked={false}
                    icon={<Gem size={18} color="#ffffff" />}
                />
                <div className="trophies-list-container">
                    <TrophyCard
                        title="Premier Pas"
                        description="Valider ta première tâche en sport."
                        rarity="bronze"
                        isUnlocked={true}
                        icon={<Dumbbell size={18} color="#ffffff" />}
                    />
                    <TrophyCard
                        title="Échauffement"
                        description="10 tâches validées sport."
                        rarity="bronze"
                        isUnlocked={true}
                        icon={<Dumbbell size={18} color="#ffffff" />}
                    />
                    <TrophyCard
                        title="Machine"
                        description="50 tâches validées en sport."
                        rarity="silver"
                        isUnlocked={true}
                        icon={<Dumbbell size={18} color="#ffffff" />}
                    />
                    <TrophyCard
                        title="Mois de Fer"
                        description="1 mois consécutifs de sport."
                        rarity="silver"
                        isUnlocked={true}
                        icon={<Dumbbell size={18} color="#ffffff" />}
                    />
                    <TrophyCard
                        title="Centurion"
                        description="100 tâches validées en sport."
                        rarity="gold"
                        isUnlocked={true}
                        icon={<Dumbbell size={18} color="#ffffff" />}
                    />
                    <TrophyCard
                        title="Étincelle"
                        description="Valider ta première tâche intelligence."
                        rarity="bronze"
                        isUnlocked={true}
                        icon={<Brain size={18} color="#ffffff" />}
                    />
                    <TrophyCard
                        title="Curieux"
                        description="10 tâches validées en intelligence."
                        rarity="bronze"
                        isUnlocked={false}
                        icon={<Brain size={18} color="#ffffff" />}
                    />
                    <TrophyCard
                        title="Esprit Affûté"
                        description="50 tâches validées en intelligence."
                        rarity="silver"
                        isUnlocked={true}
                        icon={<Brain size={18} color="#ffffff" />}
                    />
                    <TrophyCard
                        title="Discipline Mental"
                        description="1 mois consécutif d'intlligence."
                        rarity="silver"
                        isUnlocked={true}
                        icon={<Brain size={18} color="#ffffff" />}
                    />
                    <TrophyCard
                        title="Génie"
                        description="100 tâches validées en intelligence."
                        rarity="gold"
                        isUnlocked={true}
                        icon={<Brain size={18} color="#ffffff" />}
                    />
                    <TrophyCard
                        title="Première oeuvre"
                        description="Valider ta première tâche en créativité."
                        rarity="bronze"
                        isUnlocked={true}
                        icon={<Palette size={18} color="#ffffff" />}
                    />
                    <TrophyCard
                        title="Inspiration"
                        description="10 tâches validées en créativité."
                        rarity="bronze"
                        isUnlocked={true}
                        icon={<Palette size={18} color="#ffffff" />}
                    />
                    <TrophyCard
                        title="Artisan"
                        description="50 tâches validées en créativité."
                        rarity="silver"
                        isUnlocked={true}
                        icon={<Palette size={18} color="#ffffff" />}
                    />
                    <TrophyCard
                        title="Créateur confirmé"
                        description="1 mois consécutif de créativité."
                        rarity="silver"
                        isUnlocked={true}
                        icon={<Palette size={18} color="#ffffff" />}
                    />
                    <TrophyCard
                        title="Flow"
                        description="100 tâches validées en créativité."
                        rarity="gold"
                        isUnlocked={true}
                        icon={<Palette size={18} color="#ffffff" />}
                    />
                </div>
            </div>
        </div>,
        document.body,
    );
}
