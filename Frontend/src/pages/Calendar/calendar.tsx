import { CalendarDays, ChartNoAxesCombined, CircleUserRound, Cog, House, Leaf } from "lucide-react";
import "./calendar.css";
interface Props {
    onNavigate: (
        page: "home" | "account" | "login" | "profile" | "calendar" | "settings" | "secret_garden" | "stats",
    ) => void;
}

export default function App({ onNavigate }: Props) {
    return (
        <div className="app-container-calendar">
            {/* Menu latéral gauche */}
            <aside className="sidebar-calendar">
                <ul className="sidebar-menu-calendar">
                    {onNavigate && (
                        <button className="profil-button-calendar" onClick={() => onNavigate("profile")}>
                            <CircleUserRound />
                        </button>
                    )}
                    {onNavigate && (
                        <button className="sidebar-button0-calendar" onClick={() => onNavigate("home")}>
                            <House />
                        </button>
                    )}
                    {onNavigate && (
                        <button className="sidebar-button-calendar" onClick={() => onNavigate("calendar")}>
                            <CalendarDays />
                        </button>
                    )}
                    {onNavigate && (
                        <button className="sidebar-button2-calendar" onClick={() => onNavigate("secret_garden")}>
                            <Leaf />
                        </button>
                    )}
                    {onNavigate && (
                        <button className="sidebar-button3-calendar" onClick={() => onNavigate("stats")}>
                            <ChartNoAxesCombined />
                        </button>
                    )}
                    {onNavigate && (
                        <button className="sidebar-button-settings-calendar" onClick={() => onNavigate("settings")}>
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
