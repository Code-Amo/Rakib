import { Zap } from "lucide-react";
import "./CheckinToast.css";

interface CheckinToastProps {
    isVisible: boolean;
    xp: number;
}

export default function CheckinToast({ isVisible, xp }: CheckinToastProps) {
    return (
        <div className={`rakib-checkin-toast ${isVisible ? "show" : ""}`}>
            <div className="checkin-toast-icon-wrapper">
                <Zap size={24} className="checkin-toast-icon" />
            </div>
            <div className="checkin-toast-content">
                <h4>Tâche validée !</h4>
                <p>+{xp} XP</p>
            </div>
        </div>
    );
}
