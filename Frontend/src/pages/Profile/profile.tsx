import { CalendarDays, ChartNoAxesCombined, CircleUserRound, Cog, House, Leaf } from "lucide-react";
import "./profile.css";
interface Props {
    onNavigate: (
        page: "home" | "account" | "login" | "profile" | "calendar" | "settings" | "secret_garden" | "stats",
    ) => void;
}

export default function App({ onNavigate }: Props) {
    return (
        <div className="app-container-profile">
            {/* Menu latéral gauche */}
            <aside className="sidebar-profile">
                <ul className="sidebar-menu-profile">
                    {onNavigate && (
                        <button className="profil-button-profile" onClick={() => onNavigate("profile")}>
                            <CircleUserRound />
                        </button>
                    )}
                    {onNavigate && (
                        <button className="sidebar-button0-profile" onClick={() => onNavigate("home")}>
                            <House />
                        </button>
                    )}
                    {onNavigate && (
                        <button className="sidebar-button-profile" onClick={() => onNavigate("calendar")}>
                            <CalendarDays />
                        </button>
                    )}
                    {onNavigate && (
                        <button className="sidebar-button2-profile" onClick={() => onNavigate("secret_garden")}>
                            <Leaf />
                        </button>
                    )}
                    {onNavigate && (
                        <button className="sidebar-button3-profile" onClick={() => onNavigate("stats")}>
                            <ChartNoAxesCombined />
                        </button>
                    )}
                    {onNavigate && (
                        <button className="sidebar-button-settings-profile" onClick={() => onNavigate("settings")}>
                            <Cog />
                        </button>
                    )}
                </ul>
            </aside>

            {/* Contenu principal à droite */}
            <main className="main-content">
                <h1>Bienvenue jeune prodige</h1>
                <p>Le contenu de votre page s'affiche ici.</p>
            </main>
        </div>
    );
}
