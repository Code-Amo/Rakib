import Sidebar, { type SidebarPage } from "../../components/Sidebar/Sidebar";
import Header from "../../components/Sidebar/header";
import "./home.css";

interface Props {
    onNavigate: (page: SidebarPage) => void;
}

export default function Profile({ onNavigate }: Props) {
    return (
        <div className="app-container">
            <Sidebar currentPage="home" onNavigate={onNavigate} />
            <Header />
            <main className="page-content"></main>
        </div>
    );
}
