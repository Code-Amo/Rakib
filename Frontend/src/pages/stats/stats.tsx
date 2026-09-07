import { CalendarDays, ChartNoAxesCombined, CircleUserRound, Cog, House, Leaf } from "lucide-react";
import "./stats.css";
interface Props {
    onNavigate: (
        page: "home" | "account" | "login" | "profile" | "calendar" | "settings" | "secret_garden" | "stats",
    ) => void;
}

export default function App({ onNavigate }: Props) {
    return (
        <div className="app-container-stats">
            {/* Menu latéral gauche */}
            <aside className="sidebar-stats">
                <ul className="sidebar-menu-stats">
                    {onNavigate && (
                        <button className="profil-button-stats" onClick={() => onNavigate("profile")}>
                            <CircleUserRound />
                        </button>
                    )}
                    {onNavigate && (
                        <button className="sidebar-button0-stats" onClick={() => onNavigate("home")}>
                            <House />
                        </button>
                    )}
                    {onNavigate && (
                        <button className="sidebar-button-stats" onClick={() => onNavigate("calendar")}>
                            <CalendarDays />
                        </button>
                    )}
                    {onNavigate && (
                        <button className="sidebar-button2-stats" onClick={() => onNavigate("secret_garden")}>
                            <Leaf />
                        </button>
                    )}
                    {onNavigate && (
                        <button className="sidebar-button3-stats" onClick={() => onNavigate("stats")}>
                            <ChartNoAxesCombined />
                        </button>
                    )}
                    {onNavigate && (
                        <button className="sidebar-button-settings-stats" onClick={() => onNavigate("settings")}>
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
