import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Calendar from "./pages/Calendar/calendar";
import Forget from "./pages/forget_mdp/forget";
import New_mdp from "./pages/forget_mdp/new_mdp";
import Verification from "./pages/forget_mdp/verfication";
import Home from "./pages/Home/home";
import LandingPage from "./pages/LandingPage/LandingPage";
import Legal from "./pages/Legal/legal";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Rivals from "./pages/Rivals/rivals";
import Secret_garden from "./pages/Secret_garden/secret_garden";
import Settings from "./pages/Settings/settings";
import Stats from "./pages/stats/stats";

import ProtectedRoute from "@/components/Protection/ProtectedRoute";
import Layout from "./components/Layout/Layout";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />

                {/* ROUTES PUBLIQUES */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forget" element={<Forget />} />
                <Route path="/new-mdp" element={<New_mdp />} />
                <Route path="/verification" element={<Verification />} />
                <Route path="/legal" element={<Legal />} />

                {/* ROUTES PRIVÉES */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<Layout />}>
                        <Route path="/home" element={<Home />} />
                        <Route path="/calendar" element={<Calendar />} />
                        <Route path="/stats" element={<Stats />} />
                        <Route path="/rivals" element={<Rivals />} />
                        <Route path="/secret_garden" element={<Secret_garden />} />
                        <Route path="/settings" element={<Settings />} />
                    </Route>
                </Route>
            </Routes>
        </Router>
    );
}
