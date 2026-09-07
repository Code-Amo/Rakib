import { CalendarDays, ChartNoAxesCombined, CircleUserRound, Cog, House, Leaf } from "lucide-react";
import "./secret_garden.css";
interface Props {
    onNavigate: (
        page: "home" | "account" | "login" | "profile" | "calendar" | "settings" | "secret_garden" | "stats",
    ) => void;
}

export default function App({ onNavigate }: Props) {
    return (
        <div className="app-container-secret">
            {/* Menu latéral gauche */}
            <aside className="sidebar-secret">
                <ul className="sidebar-menu-secret">
                    {onNavigate && (
                        <button className="profil-button-secret" onClick={() => onNavigate("profile")}>
                            <CircleUserRound />
                        </button>
                    )}
                    {onNavigate && (
                        <button className="sidebar-button0-secret" onClick={() => onNavigate("home")}>
                            <House />
                        </button>
                    )}
                    {onNavigate && (
                        <button className="sidebar-button-secret" onClick={() => onNavigate("calendar")}>
                            <CalendarDays />
                        </button>
                    )}
                    {onNavigate && (
                        <button className="sidebar-button2-secret" onClick={() => onNavigate("secret_garden")}>
                            <Leaf />
                        </button>
                    )}
                    {onNavigate && (
                        <button className="sidebar-button3-secret" onClick={() => onNavigate("stats")}>
                            <ChartNoAxesCombined />
                        </button>
                    )}
                    {onNavigate && (
                        <button className="sidebar-button-settings-secret" onClick={() => onNavigate("settings")}>
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
