import Header from "../../components/Sidebar/header";
import Sidebar, { type SidebarPage } from "../../components/Sidebar/Sidebar";
import "./calendar.css";

interface Props {
    onNavigate: (page: SidebarPage) => void;
}

export default function Profile({ onNavigate }: Props) {
    return (
        <div className="app-container">
            <Sidebar currentPage="calendar" onNavigate={onNavigate} />
            <main className="page-content"></main>
            <Header />
        </div>
    );
}
