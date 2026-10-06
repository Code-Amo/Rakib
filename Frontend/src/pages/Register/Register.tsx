import { useState } from "react";
import "./Register.css";

const API_URL = "http://127.0.0.1:8000";

interface Props {
    onNavigate: (page: "login" | "register" | "forget" | "verification", newEmail?: string) => void;
}

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

export default function Register({ onNavigate }: Props) {
    const [form, setForm] = useState<RegisterForm>({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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

        if (form.password !== form.confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username,
                    email,
                    password: form.password,
                }),
            });

            const payload: unknown = await response.json().catch(() => null);

            if (!response.ok) {
                setError(apiErrorMessage(payload, "Impossible de créer le compte."));
                return;
            }

            onNavigate("verification", email);
        } catch {
            setError("Le serveur est injoignable.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-card-r">
            <form className="login-form-r" onSubmit={handleSubmit} noValidate>
                <h1 className="title-r">S'inscrire</h1>
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
                        type="password"
                        name="password"
                        autoComplete="new-password"
                        placeholder="Mot de passe"
                        value={form.password}
                        onChange={event => updateField("password")(event.target.value)}
                    />
                </div>
                <div className="form-group-r">
                    <input
                        className="input-r"
                        type="password"
                        name="confirmPassword"
                        autoComplete="new-password"
                        placeholder="Confirmer votre mot de passe"
                        value={form.confirmPassword}
                        onChange={event => updateField("confirmPassword")(event.target.value)}
                    />
                </div>
                <label className="cyberpunk-checkbox-label">
                    <input type="checkbox" className="cyberpunk-checkbox" />
                    <span>
                        Vous acceptez les{" "}
                        <a href="/cgu.pdf" target="_blank" rel="noopener noreferrer" className="cyberpunk-link">
                            CGU
                        </a>{" "}
                        et notre{" "}
                        <a
                            href="/politique-de-confidentialite.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cyberpunk-link"
                        >
                            politique de confidentialité
                        </a>
                        .
                    </span>
                </label>
                {error && <p className="form-error-r">{error}</p>}
                <button type="submit" className="btn-submit-r" disabled={loading}>
                    {loading ? "Création du compte..." : "Débuter l'aventure"}
                </button>
                <button type="button" className="btn-switch-r" onClick={() => onNavigate("login")}>
                    Se connecter
                </button>
            </form>
        </div>
    );
}
