import Sidebar, { type SidebarPage } from "../../components/Sidebar/Sidebar";
import "./home.css";

interface Props {
    onNavigate: (page: SidebarPage) => void;
}

export default function Home({ onNavigate }: Props) {
    return (
        <div className="app-container">
            <Sidebar currentPage="home" onNavigate={onNavigate} />
            <main className="page-content">
                <h1 className="Title">Dashboard</h1>
            </main>
        </div>
    );
}
