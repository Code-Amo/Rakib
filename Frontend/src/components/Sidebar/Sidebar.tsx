import { CalendarDays, ChartNoAxesCombined, CircleUserRound, Cog, House, Leaf, Trophy } from "lucide-react";
import "./Sidebar.css";

export type SidebarPage =
    | "home"
    | "profile"
    | "calendar"
    | "secret_garden"
    | "stats"
    | "settings"
    | "success";

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
                        className={buttonClass("profil-button", "profile", currentPage)}
                        onClick={() => onNavigate("profile")}
                    >
                        <CircleUserRound />
                    </button>
                    <button
                        type="button"
                        className={buttonClass("sidebar-button0", "home", currentPage)}
                        onClick={() => onNavigate("home")}
                    >
                        <House />
                    </button>
                    <button
                        type="button"
                        className={buttonClass("sidebar-button", "calendar", currentPage)}
                        onClick={() => onNavigate("calendar")}
                    >
                        <CalendarDays />
                    </button>
                    <button
                        type="button"
                        className={buttonClass("sidebar-button2", "secret_garden", currentPage)}
                        onClick={() => onNavigate("secret_garden")}
                    >
                        <Leaf />
                    </button>
                    <button
                        type="button"
                        className={buttonClass("sidebar-button3", "stats", currentPage)}
                        onClick={() => onNavigate("stats")}
                    >
                        <ChartNoAxesCombined />
                    </button>
                    <button
                        type="button"
                        className={buttonClass("sidebar-button-succes", "success", currentPage)}
                        onClick={() => onNavigate("success")}
                    >
                        <Trophy />
                    </button>
                </ul>
            </aside>
            <div className="sidebar-for-settings">
                <button
                    type="button"
                    className={buttonClass("sidebar-button-settings", "settings", currentPage)}
                    onClick={() => onNavigate("settings")}
                >
                    <Cog />
                </button>
            </div>
        </>
    );
}
