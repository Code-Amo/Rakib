import { useState } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes, useNavigate } from "react-router-dom";
import Calendar from "./pages/Calendar/calendar";
import Forget from "./pages/forget_mdp/forget";
import New_mdp from "./pages/forget_mdp/new_mdp";
import Verification from "./pages/forget_mdp/verfication";
import Home from "./pages/Home/home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Rivals from "./pages/Rivals/rivals";
import Secret_garden from "./pages/Secret_garden/secret_garden";
import Settings from "./pages/Settings/settings";
import Stats from "./pages/stats/stats";
import Success from "./pages/Success/success";

function PageWrapper({
    Component,
    email,
    setEmail,
}: {
    Component: React.ComponentType<any>;
    email?: string;
    setEmail?: (e: string) => void;
}) {
    const navigate = useNavigate();

    const handleNavigate = (nextPage: string, newEmail?: string) => {
        if (newEmail && setEmail) setEmail(newEmail);
        navigate("/" + nextPage);
    };

    return <Component onNavigate={handleNavigate} email={email} />;
}

export default function App() {
    const [userEmail, setUserEmail] = useState("");

    return (
        <Router>
            <div className="min-h-screen relative">
                <main>
                    <Routes>
                        <Route path="/" element={<Navigate to="/register" replace />} />
                        <Route path="/login" element={<PageWrapper Component={Login} />} />
                        <Route
                            path="/register"
                            element={<PageWrapper Component={Register} setEmail={setUserEmail} />}
                        />
                        <Route path="/forget" element={<PageWrapper Component={Forget} setEmail={setUserEmail} />} />
                        <Route path="/new-mdp" element={<PageWrapper Component={New_mdp} />} />
                        <Route
                            path="/verification"
                            element={<PageWrapper Component={Verification} email={userEmail} setEmail={setUserEmail} />}
                        />
                        <Route path="/home" element={<PageWrapper Component={Home} />} />
                        <Route path="/calendar" element={<PageWrapper Component={Calendar} />} />
                        <Route path="/stats" element={<PageWrapper Component={Stats} />} />
                        <Route path="/rivals" element={<PageWrapper Component={Rivals} />} />
                        <Route path="/secret-garden" element={<PageWrapper Component={Secret_garden} />} />
                        <Route path="/settings" element={<PageWrapper Component={Settings} />} />
                        <Route path="/success" element={<PageWrapper Component={Success} />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}
