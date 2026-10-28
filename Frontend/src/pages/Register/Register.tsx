import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const API_URL = "http://127.0.0.1:8000";

interface RegisterForm {
    name: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
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

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState<RegisterForm>({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [acceptedCgu, setAcceptedCgu] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const updateField = (field: keyof RegisterForm) => (value: string) => {
        setForm(current => ({ ...current, [field]: value }));
        if (error) {
            setError("");
        }
    };

    const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        const name = form.name.trim();
        const username = form.username.trim();
        const email = form.email.trim();

        if (!name || !username || !email || !form.password || !form.confirmPassword) {
            setError("Tous les champs sont requis.");
            return;
        }
        if (form.password.length < 8) {
            setError("Le mot de passe doit contenir au moins 8 caractères.");
            return;
        }
        if (form.password !== form.confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }
        if (!acceptedCgu) {
            setError("Vous devez accepter les CGU et la politique de confidentialité.");
            return;
        }
        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name,
                    username,
                    email,
                    password: form.password,
                    accepted_cgu: acceptedCgu,
                }),
            });

            const payload: unknown = await response.json().catch(() => null);

            if (!response.ok) {
                setError(apiErrorMessage(payload, "Impossible de créer le compte."));
                return;
            }

            navigate("/verification", { state: { email: email, flow: "register" } });
        } catch {
            setError("Le serveur est injoignable.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-card-r">
            <div className="login-brand-r">
                <svg width="72" height="72" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                    <path d="M32 10 L52 28 L46 34 L32 21 L18 34 L12 28 Z" fill="#9501d9" />
                    <path d="M32 25 L52 43 L46 49 L32 36 L18 49 L12 43 Z" fill="#9501d9" />
                    <path d="M32 40 L52 58 L46 64 L32 51 L18 64 L12 58 Z" fill="#9501d9" />
                </svg>
                <h1 className="login-brand-text-r">Rakib</h1>
            </div>

            <form className="login-form-r" onSubmit={handleSubmit} noValidate>
                <h2 className="title-r">S'inscrire</h2>

                <div className="form-row-r">
                    <div className="form-group-r">
                        <input
                            className="input-r"
                            type="text"
                            name="name"
                            autoComplete="name"
                            placeholder="Nom"
                            value={form.name}
                            onChange={event => updateField("name")(event.target.value)}
                        />
                    </div>
                    <div className="form-group-r">
                        <input
                            className="input-r"
                            type="text"
                            name="username"
                            autoComplete="username"
                            placeholder="Pseudo"
                            value={form.username}
                            onChange={event => updateField("username")(event.target.value)}
                        />
                    </div>
                </div>

                <div className="form-group-r">
                    <input
                        className="input-r"
                        type="email"
                        name="email"
                        autoComplete="email"
                        placeholder="votre@email.com"
                        value={form.email}
                        onChange={event => updateField("email")(event.target.value)}
                    />
                </div>

                <div className="form-group-r">
                    <input
                        className="input-r"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        autoComplete="new-password"
                        placeholder="Mot de passe"
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

                <div className="form-group-r">
                    <input
                        className="input-r"
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        autoComplete="new-password"
                        placeholder="Confirmer votre mot de passe"
                        value={form.confirmPassword}
                        onChange={event => updateField("confirmPassword")(event.target.value)}
                    />
                </div>

                <label className="cyberpunk-checkbox-label">
                    <input
                        type="checkbox"
                        className="cyberpunk-checkbox"
                        checked={acceptedCgu}
                        onChange={e => setAcceptedCgu(e.target.checked)}
                    />
                    <span>
                        Vous acceptez les{" "}
                        <a href="/legal#cgu" target="_blank" rel="noopener noreferrer" className="cyberpunk-link">
                            CGU
                        </a>{" "}
                        et notre{" "}
                        <a href="/legal#privacy" target="_blank" rel="noopener noreferrer" className="cyberpunk-link">
                            politique de confidentialité
                        </a>
                        .
                    </span>
                </label>

                {error && <p className="form-error-r">{error}</p>}

                <button type="submit" className="btn-submit-r" disabled={loading}>
                    {loading ? "Création du compte..." : "Débuter l'aventure"}
                </button>

                <button type="button" className="btn-switch-r" onClick={() => navigate("/login")}>
                    Déjà un compte ? Se connecter
                </button>
            </form>
        </div>
    );
}
