import { Calendar, ChartNoAxesCombined, Cog, HeartHandshake, House, Leaf } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css";

export type SidebarPage = "home" | "rivals" | "calendar" | "secret_garden" | "stats" | "settings" | "success";

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPage = (location.pathname === "/" ? "home" : location.pathname.substring(1)) as SidebarPage;

    // Correction : on a enlevé le paramètre "page" inutile
    const handleNavigation = (path: string) => {
        navigate(path);
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                    <path d="M32 10 L52 28 L46 34 L32 21 L18 34 L12 28 Z" fill="#cdd6f4" />
                    <path d="M32 25 L52 43 L46 49 L32 36 L18 49 L12 43 Z" fill="#cdd6f4" />
                    <path d="M32 40 L52 58 L46 64 L32 51 L18 64 L12 58 Z" fill="#cdd6f4" />
                </svg>
            </div>

            <nav className="sidebar-menu">
                <button
                    type="button"
                    className={`nav-item ${currentPage === "home" ? "active" : ""}`}
                    onClick={() => handleNavigation("/home")}
                    data-tooltip="Accueil"
                >
                    <House size={24} />
                </button>

                <button
                    type="button"
                    className={`nav-item ${currentPage === "calendar" ? "active" : ""}`}
                    onClick={() => handleNavigation("/calendar")}
                    data-tooltip="Agenda"
                >
                    <Calendar size={24} />
                </button>

                <button
                    type="button"
                    className={`nav-item ${currentPage === "rivals" ? "active" : ""}`}
                    onClick={() => handleNavigation("/rivals")}
                    data-tooltip="Compagnons"
                >
                    <HeartHandshake size={24} />
                </button>

                <button
                    type="button"
                    className={`nav-item ${currentPage === "stats" ? "active" : ""}`}
                    onClick={() => handleNavigation("/stats")}
                    data-tooltip="Statistiques"
                >
                    <ChartNoAxesCombined size={24} />
                </button>

                <button
                    type="button"
                    className={`nav-item ${currentPage === "secret_garden" ? "active" : ""}`}
                    onClick={() => handleNavigation("/secret_garden")}
                    data-tooltip="Jardin secret"
                >
                    <Leaf size={24} />
                </button>

                <button
                    type="button"
                    className={`nav-item settings-item ${currentPage === "settings" ? "active" : ""}`}
                    onClick={() => handleNavigation("/settings")}
                    data-tooltip="Paramètres"
                >
                    <Cog size={24} />
                </button>
            </nav>
        </aside>
    );
}
