import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import "./new_mdp.css";
interface Props {
    email?: string;
    onNavigate: (page: "login" | "register" | "forget") => void;
}
export default function New_pswd({ email, onNavigate }: Props) {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setError(null);
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
            const response = await fetch("http://127.0.0.1:8000/auth/password-reset", {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({
                    email: email,
                    new_password: password,
                }),
            });
            if (response.ok) {
                alert("Mot de passe modifié. Veuillez vous reconnectez.");
                onNavigate("login");
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
            <form className="login-form-new_mdp" onSubmit={handleSubmit}>
                <h1 className="title-new_mdp">Récupération</h1>
                <p className="subtitle-new_mdp">Définissez votre nouveau mot de passe.</p>
                {error && <p className="error-message">{error}</p>}
                <div className="form-group-new_mdp">
                    <input
                        className="input-new_mdp"
                        type={showPassword ? "text" : "password"}
                        placeholder="Nouveau mot de passe "
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
                <div className="form-group">
                    <input
                        className="input-new_mdp"
                        type="password"
                        placeholder="Confirmer votre nouveau mot de passe"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn-submit-new_mdp" disabled={loading}>
                    {loading ? "Enregitrement..." : "Confirmer"}
                    Confirmer
                </button>
                <button type="button" className="btn-switch-new_mdp" onClick={() => onNavigate("login")}>
                    Retour à la connexion
                </button>
            </form>
        </div>
    );
}
