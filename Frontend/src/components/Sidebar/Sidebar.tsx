import { Calendar, ChartNoAxesCombined, Cog, HeartHandshake, House, Leaf, Timer } from "lucide-react";
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
                        className={buttonClass("sidebar-button-succes", "success", currentPage)}
                        onClick={() => onNavigate("success")}
                        data-tooltip="Focus"
                    >
                        <Timer />
                    </button>
                    <button
                        type="button"
                        className={buttonClass("sidebar-button2", "secret_garden", currentPage)}
                        onClick={() => onNavigate("secret_garden")}
                        data-tooltip="Jardin secret"
                    >
                        <Leaf />
                    </button>
                </ul>
            </aside>
            <div className="sidebar-for-settings">
                <button
                    type="button"
                    className={buttonClass("sidebar-button-settings", "settings", currentPage)}
                    onClick={() => onNavigate("settings")}
                    data-tooltip=" Paramètres"
                >
                    <Cog />
                </button>
            </div>
        </>
    );
}
