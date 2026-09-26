import { useState } from "react";
import Calendar from "./pages/Calendar/calendar";
import Forget from "./pages/forget_mdp/forget";
import New_mdp from "./pages/forget_mdp/new_mdp";
import Verfication from "./pages/forget_mdp/verfication";
import Home from "./pages/Home/home";
import Login from "./pages/Login/Login";
import Profile from "./pages/Profile/profile";
import Register from "./pages/Register/Register";
import Secret_garden from "./pages/Secret_garden/secret_garden";
import Settings from "./pages/Settings/settings";
import Stats from "./pages/stats/stats";
import Success from "./pages/Success/success";

export default function App() {
    const [page, setPage] = useState<
        | "login"
        | "register"
        | "forget"
        | "new_mdp"
        | "verification"
        | "home"
        | "account"
        | "profile"
        | "secret_garden"
        | "settings"
        | "calendar"
        | "stats"
        | "success"
    >("home");

    return (
        <div className="min-h-screen relative">
            <main>
                {page === "login" && <Login onNavigate={setPage} />}
                {page === "register" && <Register onNavigate={setPage} />}
                {page === "forget" && <Forget onNavigate={setPage} />}
                {page === "new_mdp" && <New_mdp onNavigate={setPage} />}
                {page === "verification" && <Verfication onNavigate={setPage} />}
                {page === "home" && <Home onNavigate={setPage} />}
                {page === "profile" && <Profile onNavigate={setPage} />}
                {page === "secret_garden" && <Secret_garden onNavigate={setPage} />}
                {page === "calendar" && <Calendar onNavigate={setPage} />}
                {page === "settings" && <Settings onNavigate={setPage} />}
                {page === "stats" && <Stats onNavigate={setPage} />}
                {page === "success" && <Success onNavigate={setPage} />}
            </main>
        </div>
    );
}
