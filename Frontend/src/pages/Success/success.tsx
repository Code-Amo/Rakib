import Sidebar, { type SidebarPage } from "../../components/Sidebar/Sidebar";
import "./success.css";

interface Props {
    onNavigate: (page: SidebarPage) => void;
}

export default function Success({ onNavigate }: Props) {
    return (
        <div className="app-container">
            <Sidebar currentPage="success" onNavigate={onNavigate} />
            <main className="page-content">
                <h1 className="Title">Succès</h1>
            </main>
        </div>
    );
}
