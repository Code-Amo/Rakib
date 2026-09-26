import Sidebar, { type SidebarPage } from "../../components/Sidebar/Sidebar";
import "./profile.css";

interface Props {
    onNavigate: (page: SidebarPage) => void;
}

export default function Profile({ onNavigate }: Props) {
    return (
        <div className="app-container">
            <Sidebar currentPage="profile" onNavigate={onNavigate} />
            <main className="page-content">
                <h1 className="Title">Profil</h1>
            </main>
        </div>
    );
}
