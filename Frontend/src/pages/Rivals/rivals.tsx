import Sidebar, { type SidebarPage } from "../../components/Sidebar/Sidebar";
import "./rivals.css";

interface Props {
    onNavigate: (page: SidebarPage) => void;
}

export default function Profile({ onNavigate }: Props) {
    return (
        <div className="app-container">
            <Sidebar currentPage="rivals" onNavigate={onNavigate} />
            <main className="page-content">
                <h1 className="Title">Profil</h1>
            </main>
        </div>
    );
}
