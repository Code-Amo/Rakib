import { CalendarDays, ChartNoAxesCombined, CircleUserRound, Cog, House, Leaf } from "lucide-react";
import "./home.css";
interface Props {
    onNavigate: (
        page: "home" | "account" | "login" | "profile" | "calendar" | "settings" | "secret_garden" | "stats",
    ) => void;
}

export default function App({ onNavigate }: Props) {
    return (
        <div className="app-container">
            {/* Menu latéral gauche */}
            <aside className="sidebar">
                <ul className="sidebar-menu">
                    {onNavigate && (
                        <button className="profil-button" onClick={() => onNavigate("profile")}>
                            <CircleUserRound />
                        </button>
                    )}
                    {onNavigate && (
                        <button className="sidebar-button0" onClick={() => onNavigate("home")}>
                            <House />
                        </button>
                    )}
                    {onNavigate && (
                        <button className="sidebar-button" onClick={() => onNavigate("calendar")}>
                            <CalendarDays />
                        </button>
                    )}
                    {onNavigate && (
                        <button className="sidebar-button2" onClick={() => onNavigate("secret_garden")}>
                            <Leaf />
                        </button>
                    )}
                    {onNavigate && (
                        <button className="sidebar-button3" onClick={() => onNavigate("stats")}>
                            <ChartNoAxesCombined />
                        </button>
                    )}
                    {onNavigate && (
                        <button className="sidebar-button-settings" onClick={() => onNavigate("settings")}>
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
