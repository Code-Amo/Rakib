import { ArrowRight, Clock, Users } from "lucide-react";
import React from "react";
import "./CompanionWidget.css";

export interface Companion {
    id: string;
    pseudo: string;
    category: string;
    target_checkins: number;
    user_checkins: number;
    companion_checkins: number;
    status: "pending" | "accepted";
}

interface CompanionWidgetProps {
    companion: Companion | null;
    onNavigateToRivals: () => void;
}

export const CompanionWidget: React.FC<CompanionWidgetProps> = ({ companion, onNavigateToRivals }) => {
    if (!companion) {
        return (
            <div className="companion-widget">
                <div className="companion-header">
                    <h3 className="companion-title">
                        <Users className="companion-title-icon" size={20} />
                        Mon Compagnon
                    </h3>
                </div>
                <div className="companion-empty-state">
                    <div className="icon-wrapper">
                        <Users size={32} className="empty-icon" />
                    </div>
                    <p className="companion-text">Tu n'as pas encore d'allié pour tes objectifs.</p>
                    <button className="plan-button" onClick={onNavigateToRivals}>
                        Trouver un compagnon
                    </button>
                </div>
            </div>
        );
    }

    if (companion.status === "pending") {
        return (
            <div className="companion-widget">
                <div className="companion-header">
                    <h3 className="companion-title">
                        <Users className="companion-title-icon" size={20} />
                        Mon Compagnon
                    </h3>
                </div>
                <div className="companion-pending-state">
                    <div className="icon-wrapper">
                        <Clock size={32} className="pending-icon" />
                    </div>
                    <p className="companion-text">
                        Invitation en attente avec <strong>{companion.pseudo}</strong>.
                    </p>
                    <button className="plan-button" onClick={onNavigateToRivals}>
                        Voir la demande
                    </button>
                </div>
            </div>
        );
    }

    const userProgressPercentage = Math.min(100, (companion.user_checkins / companion.target_checkins) * 100);
    const companionProgressPercentage = Math.min(100, (companion.companion_checkins / companion.target_checkins) * 100);
    const firstLetter = companion.pseudo.charAt(0).toUpperCase();

    return (
        <div className="companion-widget">
            <div className="companion-header">
                <h3 className="companion-title">
                    <Users className="companion-title-icon" size={20} />
                    Mon Compagnon
                </h3>
                <span className="category-badge">{companion.category}</span>
            </div>

            <div className="companion-active-content">
                <div className="companion-user-info">
                    <div className="companion-avatar">{firstLetter}</div>
                    <span className="companion-pseudo">{companion.pseudo}</span>
                </div>

                <div className="progress-section">
                    <div className="progress-row">
                        <div className="progress-label-group">
                            <span className="progress-label">Toi</span>
                            <span className="progress-count">
                                {companion.user_checkins}/{companion.target_checkins}
                            </span>
                        </div>
                        <div className="progress-bar-bg">
                            <div
                                className="progress-bar-fill user-fill"
                                style={{ width: `${userProgressPercentage}%` }}
                            />
                        </div>
                    </div>

                    <div className="progress-row">
                        <div className="progress-label-group">
                            <span className="progress-label">{companion.pseudo}</span>
                            <span className="progress-count">
                                {companion.companion_checkins}/{companion.target_checkins}
                            </span>
                        </div>
                        <div className="progress-bar-bg">
                            <div
                                className="progress-bar-fill companion-fill"
                                style={{ width: `${companionProgressPercentage}%` }}
                            />
                        </div>
                    </div>
                </div>

                <button className="plan-button details-button" onClick={onNavigateToRivals}>
                    <span>Détails</span>
                    <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
};
