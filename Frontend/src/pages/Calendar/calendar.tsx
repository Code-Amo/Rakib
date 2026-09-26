import Sidebar, { type SidebarPage } from "../../components/Sidebar/Sidebar";
import "./calendar.css";

interface Props {
    onNavigate: (page: SidebarPage) => void;
}

export default function Calendar({ onNavigate }: Props) {
    return (
        <div className="app-container">
            <Sidebar currentPage="calendar" onNavigate={onNavigate} />
            <main className="page-content">
                <h1 className="Title">Calendrier</h1>
            </main>
        </div>
    );
}
