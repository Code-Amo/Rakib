import { Trophy } from "lucide-react";
import "./notification.css";

interface TrophyToastProps {
    trophy: { title: string; rarity: string } | null;
    isVisible: boolean;
}

export default function TrophyToast({ trophy, isVisible }: TrophyToastProps) {
    if (!trophy) return null;

    return (
        <div className={`rakib-toast ${trophy.rarity} ${isVisible ? "show" : ""}`}>
            <div className="toast-icon-wrapper">
                <Trophy size={24} className="toast-icon" />
            </div>
            <div className="toast-content">
                <h4>Succès débloqué</h4>
                <p>{trophy.title}</p>
            </div>
        </div>
    );
}
