import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import "./Login.css";

const API_URL = "http://localhost:8000";

interface Props {
    onNavigate: (page: "login" | "register" | "forget" | "verification" | "home") => void;
}

interface RegisterForm {
    email: string;
    password: string;
}

function apiErrorMessage(payload: unknown, fallback: string): string {
    if (!payload || typeof payload !== "object") {
        return fallback;
    }
    const detail = (payload as { detail?: unknown }).detail;
    if (typeof detail === "string") {
        return detail;
    }
    if (Array.isArray(detail) && detail.length > 0) {
        const first = detail[0] as { msg?: string };
        if (typeof first?.msg === "string") {
            return first.msg;
        }
    }
    return fallback;
}

export default function Login({ onNavigate }: Props) {
    const [form, setForm] = useState<RegisterForm>({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShoPassword] = useState(false);

    const updateField = (field: keyof RegisterForm) => (value: string) => {
        setForm(current => ({ ...current, [field]: value }));
        if (error) {
            setError("");
        }
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
                body: JSON.stringify({
                    email,
                    password: form.password,
                }),
            });

            const payload: any = await response.json().catch(() => null);
            console.log({ payload });

            if (!response.ok) {
                setError(apiErrorMessage(payload, "Impossible de vous connecter."));
                return;
            }
            if (payload && payload.token) {
                localStorage.setItem("token", payload.token);
            }

            onNavigate("home");
        } catch {
            setError("Le serveur est injoignable.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-card">
            <form className="login-form" onSubmit={handleSubmit} noValidate>
                <h1 className="title">Connexion</h1>
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
                        autoComplete="password"
                        value={form.password}
                        onChange={event => updateField("password")(event.target.value)}
                    />
                    <button type="button" className="btn-toggle-password" onClick={() => setShoPassword(!showPassword)}>
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                {error && <p className="form-error-r">{error}</p>}
                <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? "Connexion..." : "Se connecter"}
                </button>
                {onNavigate && (
                    <button type="button" className="btn-switch" onClick={() => onNavigate("register")}>
                        Créer un compte
                    </button>
                )}
                {onNavigate && (
                    <button type="button" className="btn-switch" onClick={() => onNavigate("forget")}>
                        Mot de passe oublié ?
                    </button>
                )}
            </form>
        </div>
    );
}
