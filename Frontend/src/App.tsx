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
export type AuthFlow = "register" | "forget" | null;
function PageWrapper({
    Component,
    email,
    setEmail,
    flow,
    setFlow,
}: {
    Component: React.ComponentType<any>;
    email?: string;
    setEmail?: (e: string) => void;
    flow?: AuthFlow;
    setFlow?: (f: AuthFlow) => void;
}) {
    const navigate = useNavigate();

    const handleNavigate = (nextPage: string, newEmail?: string, newFlow?: AuthFlow) => {
        if (newEmail && setEmail) setEmail(newEmail);
        if (newFlow !== undefined && setFlow) setFlow(newFlow);
        navigate("/" + nextPage);
    };

    return <Component onNavigate={handleNavigate} email={email} flow={flow} />;
}

export default function App() {
    const [userEmail, setUserEmail] = useState("");
    const [authFlow, setAuthFlow] = useState<AuthFlow>(null);

    return (
        <Router>
            <div className="min-h-screen relative">
                <main>
                    <Routes>
                        <Route path="/" element={<Navigate to="/register" replace />} />
                        <Route path="/login" element={<PageWrapper Component={Login} />} />
                        <Route
                            path="/register"
                            element={<PageWrapper Component={Register} setEmail={setUserEmail} setFlow={setAuthFlow} />}
                        />
                        <Route
                            path="/forget"
                            element={<PageWrapper Component={Forget} setEmail={setUserEmail} setFlow={setAuthFlow} />}
                        />
                        <Route path="/new-mdp" element={<PageWrapper Component={New_mdp} />} />
                        <Route
                            path="/verification"
                            element={
                                <PageWrapper
                                    Component={Verification}
                                    email={userEmail}
                                    setEmail={setUserEmail}
                                    flow={authFlow}
                                />
                            }
                        />
                        <Route path="/home" element={<PageWrapper Component={Home} />} />
                        <Route path="/calendar" element={<PageWrapper Component={Calendar} />} />
                        <Route path="/stats" element={<PageWrapper Component={Stats} />} />
                        <Route path="/rivals" element={<PageWrapper Component={Rivals} />} />
                        <Route path="/secret_garden" element={<PageWrapper Component={Secret_garden} />} />
                        <Route path="/settings" element={<PageWrapper Component={Settings} />} />
                        <Route path="/success" element={<PageWrapper Component={Success} />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}
