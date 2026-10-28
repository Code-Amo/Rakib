import { AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./new_mdp.css";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function New_pswd() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "";
    const reset_token = location.state?.reset_token || "";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!email || !reset_token) {
            setError("Session invalide. Veuillez recommencer la procédure.");
            return;
        }

        if (password.length < 8) {
            setError("Le mot de passe doit contenir au moins 8 caractères.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/auth/password-reset`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email,
                    new_password: password,
                    reset_token: reset_token,
                }),
            });

            if (response.ok) {
                setSuccess("Mot de passe modifié avec succès ! Redirection...");
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            } else {
                const data = await response.json();
                setError(data.detail || "Erreur lors de la réinitialisation.");
            }
        } catch (err) {
            setError("Erreur de connexion au serveur.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-card-new_mdp">
            <div className="login-brand-new_mdp">
                <svg width="72" height="72" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                    <path d="M32 10 L52 28 L46 34 L32 21 L18 34 L12 28 Z" fill="#9501d9" />
                    <path d="M32 25 L52 43 L46 49 L32 36 L18 49 L12 43 Z" fill="#9501d9" />
                    <path d="M32 40 L52 58 L46 64 L32 51 L18 64 L12 58 Z" fill="#9501d9" />
                </svg>
                <h1 className="login-brand-text-new_mdp">Rakib</h1>
            </div>

            <form className="login-form-new_mdp" onSubmit={handleSubmit}>
                <h2 className="title-new_mdp">Nouveau mot de passe</h2>
                <p className="subtitle-new_mdp">
                    Sécurisez votre compte <span className="email-highlight">{email}</span>
                </p>

                {error && (
                    <div className="message-box error">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div className="message-box success">
                        <CheckCircle2 size={18} />
                        <span>{success}</span>
                    </div>
                )}

                <div className="form-group-new_mdp">
                    <input
                        className="input-new_mdp"
                        type={showPassword ? "text" : "password"}
                        placeholder="Nouveau mot de passe"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        className="btn-toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                <div className="form-group-new_mdp">
                    <input
                        className="input-new_mdp"
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirmer le mot de passe"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn-submit-new_mdp" disabled={loading || !!success}>
                    {loading ? "Enregistrement..." : "Confirmer"}
                </button>

                <button type="button" className="btn-switch-new_mdp" onClick={() => navigate("/login")}>
                    Retour à la connexion
                </button>
            </form>
        </div>
    );
}
