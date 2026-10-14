import { Calendar, ChartNoAxesCombined, Cog, HeartHandshake, House, Leaf } from "lucide-react";
import "./Sidebar.css";

export type SidebarPage = "home" | "rivals" | "calendar" | "secret_garden" | "stats" | "settings" | "success";

interface Props {
    currentPage: SidebarPage;
    onNavigate: (page: SidebarPage) => void;
}

function buttonClass(base: string, page: SidebarPage, currentPage: SidebarPage) {
    return currentPage === page ? `${base} sidebar-button-active` : base;
}

export default function Sidebar({ currentPage, onNavigate }: Props) {
    return (
        <>
            <aside className="sidebar">
                <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                    <path d="M32 10 L52 28 L46 34 L32 21 L18 34 L12 28 Z" fill="#cdd6f4" />
                    <path d="M32 25 L52 43 L46 49 L32 36 L18 49 L12 43 Z" fill="#cdd6f4" />
                    <path d="M32 40 L52 58 L46 64 L32 51 L18 64 L12 58 Z" fill="#cdd6f4" />
                </svg>
                <ul className="sidebar-menu">
                    <button
                        type="button"
                        className={buttonClass("sidebar-button0", "home", currentPage)}
                        onClick={() => onNavigate("home")}
                        data-tooltip="Accueil"
                    >
                        <House />
                    </button>
                    <button
                        type="button"
                        className={buttonClass("sidebar-button", "calendar", currentPage)}
                        onClick={() => onNavigate("calendar")}
                        data-tooltip="Agenda"
                    >
                        <Calendar />
                    </button>
                    <button
                        type="button"
                        className={buttonClass("profil-button", "rivals", currentPage)}
                        onClick={() => onNavigate("rivals")}
                        data-tooltip="Compagnons"
                    >
                        <HeartHandshake />
                    </button>
                    <button
                        type="button"
                        className={buttonClass("sidebar-button3", "stats", currentPage)}
                        onClick={() => onNavigate("stats")}
                        data-tooltip="Statistiques"
                    >
                        <ChartNoAxesCombined />
                    </button>
                    <button
                        type="button"
                        className={buttonClass("sidebar-button2", "secret_garden", currentPage)}
                        onClick={() => onNavigate("secret_garden")}
                        data-tooltip="Jardin secret"
                    >
                        <Leaf />
                    </button>
                    <button
                        type="button"
                        className={buttonClass("sidebar-button-settings", "settings", currentPage)}
                        onClick={() => onNavigate("settings")}
                        data-tooltip=" Paramètres"
                    >
                        <Cog />
                    </button>
                </ul>
            </aside>
        </>
    );
}
