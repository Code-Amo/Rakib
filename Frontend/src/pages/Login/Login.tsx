import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const API_URL = import.meta.env.VITE_API_URL || "/api";
interface RegisterForm {
    email: string;
    password: string;
}

function apiErrorMessage(payload: unknown, fallback: string): string {
    if (!payload || typeof payload !== "object") return fallback;
    const detail = (payload as { detail?: unknown }).detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail) && detail.length > 0) {
        const first = detail[0] as { msg?: string };
        if (typeof first?.msg === "string") return first.msg;
    }
    return fallback;
}

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState<RegisterForm>({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const updateField = (field: keyof RegisterForm) => (value: string) => {
        setForm(current => ({ ...current, [field]: value }));
        if (error) setError("");
    };

    const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        const email = form.email.trim();

        if (!email || !form.password) {
            setError("Tous les champs sont requis.");
            return;
        }

        setLoading(true);
        setError("");
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password: form.password }),
            });

            const payload: any = await response.json().catch(() => null);

            if (!response.ok) {
                setError(apiErrorMessage(payload, "Impossible de vous connecter."));
                return;
            }
            navigate("/home");
        } catch {
            setError("Le serveur est injoignable.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-card">
            <div className="login-brand">
                <svg width="72" height="72" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                    <path d="M32 10 L52 28 L46 34 L32 21 L18 34 L12 28 Z" fill="#9501d9" />
                    <path d="M32 25 L52 43 L46 49 L32 36 L18 49 L12 43 Z" fill="#9501d9" />
                    <path d="M32 40 L52 58 L46 64 L32 51 L18 64 L12 58 Z" fill="#9501d9" />
                </svg>
                <h1 className="login-brand-text">Rakib</h1>
            </div>

            <form className="login-form" onSubmit={handleSubmit} noValidate>
                <h2 className="login-title">Connexion</h2>

                <div className="form-group">
                    <input
                        className="input"
                        type="email"
                        placeholder="votre@email.com"
                        autoComplete="email"
                        value={form.email}
                        onChange={event => updateField("email")(event.target.value)}
                    />
                </div>

                <div className="form-group">
                    <input
                        className="input"
                        type={showPassword ? "text" : "password"}
                        placeholder="Mot de passe"
                        autoComplete="current-password"
                        value={form.password}
                        onChange={event => updateField("password")(event.target.value)}
                    />
                    <button
                        type="button"
                        className="btn-toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                {error && <p className="form-error-r">{error}</p>}

                <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? "Connexion..." : "Se connecter"}
                </button>

                <button type="button" className="btn-switch" onClick={() => navigate("/register")}>
                    Créer un compte
                </button>
                <button type="button" className="btn-switch" onClick={() => navigate("/forget")}>
                    Mot de passe oublié ?
                </button>
            </form>
        </div>
    );
}
