import "./notification.css";

interface TrophyToastProps {
    trophy: { title: string; rarity: string } | null;
    isVisible: boolean;
}

export default function TrophyToast({ trophy, isVisible }: TrophyToastProps) {
    if (!trophy) return null;

    return (
        <div className={`steam-toast ${trophy.rarity} ${isVisible ? "show" : ""}`}>
            <div className="steam-toast-icon">🏆</div>
            <div className="steam-toast-content">
                <h4>Succès débloqué</h4>
                <p>{trophy.title}</p>
            </div>
        </div>
    );
}
