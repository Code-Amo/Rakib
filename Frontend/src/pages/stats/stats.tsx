import Header from "../../components/Sidebar/header";
import Sidebar, { type SidebarPage } from "../../components/Sidebar/Sidebar";
import "./stats.css";

interface Props {
    onNavigate: (page: SidebarPage) => void;
}

export default function Stats({ onNavigate }: Props) {
    return (
        <div className="app-container">
            <Sidebar currentPage="stats" onNavigate={onNavigate} />
            <main className="page-content"></main>
            <Header />
        </div>
    );
}
