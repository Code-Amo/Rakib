import { Activity, Check, ChevronRight, Leaf, Rocket, Target, X } from "lucide-react";
import React, { useState } from "react";
import "./onboarding.css";

interface OnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const STEPS = [
    {
        icon: Rocket,
        title: "Bienvenue sur Rakib.",
        description: "Ici, on ne vend pas ton âme. On construit ton futur.",
    },
    {
        icon: Target,
        title: "Crée tes objectifs.",
        description: "Planifie tes tâches dans le Calendar et valide-les pour gagner de l'XP.",
    },
    {
        icon: Activity,
        title: "Développe tes 5 stats.",
        description: "Physique, Intellect, Créativité, Career, Mental. Équilibre ta vie.",
    },
    {
        icon: Leaf,
        title: "Le Jardin Secret.",
        description: "Un espace privé pour ta Foi et tes Relations. Zéro XP, juste toi et Allah.",
    },
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
    const [currentStep, setCurrentStep] = useState<number>(0);

    if (!isOpen) return null;

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            onClose();
        }
    };

    const currentData = STEPS[currentStep];
    const StepIcon = currentData.icon;
    const isLastStep = currentStep === STEPS.length - 1;

    return (
        <div className="onboarding-overlay">
            <div className="onboarding-card">
                {/* Bouton Fermer / Passer */}
                <button className="onboarding-skip-btn" onClick={onClose} aria-label="Passer">
                    <span>Passer</span>
                    <X size={18} />
                </button>

                {/* Contenu principal animé via clé d'étape */}
                <div className="onboarding-content" key={currentStep}>
                    <div className="onboarding-icon-wrapper">
                        <StepIcon size={38} className="onboarding-icon" />
                    </div>
                    <h2 className="onboarding-title">{currentData.title}</h2>
                    <p className="onboarding-description">{currentData.description}</p>
                </div>

                {/* Footer avec indicateurs de progression et bouton d'action */}
                <div className="onboarding-footer">
                    <div className="onboarding-dots">
                        {STEPS.map((_, index) => (
                            <span key={index} className={`onboarding-dot ${index === currentStep ? "active" : ""}`} />
                        ))}
                    </div>

                    <button className="onboarding-next-btn" onClick={handleNext}>
                        <span>{isLastStep ? "Commencer" : "Suivant"}</span>
                        {isLastStep ? <Check size={18} /> : <ChevronRight size={18} />}
                    </button>
                </div>
            </div>
        </div>
    );
};
