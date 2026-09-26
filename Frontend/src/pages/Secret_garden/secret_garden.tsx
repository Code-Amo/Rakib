import Sidebar, { type SidebarPage } from "../../components/Sidebar/Sidebar";
import "./secret_garden.css";

interface Props {
    onNavigate: (page: SidebarPage) => void;
}

export default function Secret_garden({ onNavigate }: Props) {
    return (
        <div className="app-container">
            <Sidebar currentPage="secret_garden" onNavigate={onNavigate} />
            <main className="page-content">
                <h1 className="Title">Secret Garden</h1>
            </main>
        </div>
    );
}
