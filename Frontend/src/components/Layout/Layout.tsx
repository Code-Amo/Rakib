import MobileHeader from "@/components/MobileHeader/MobileHeader";
import Sidebar from "@/components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div className="app-layout">
            <Sidebar />
            <MobileHeader />

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}
