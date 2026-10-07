import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import "./new_mdp.css";
interface Props {
    onNavigate: (page: "login" | "register" | "forget") => void;
}
export default function Login({ onNavigate }: Props) {
    const [showPassword, setShoPassword] = useState(false);
    return (
        <div className="login-card-new_mdp">
            <form className="login-form-new_mdp">
                <h1 className="title-new_mdp">Récupération</h1>
                <p className="subtitle-new_mdp">Définissez votre nouveau mot de passe.</p>
                <div className="form-group-new_mdp">
                    <input
                        className="input-new_mdp"
                        type={showPassword ? "text" : "password"}
                        placeholder="Nouveau mot de passe "
                    />
                    <button type="button" className="btn-toggle-password" onClick={() => setShoPassword(!showPassword)}>
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                <div className="form-group">
                    <input
                        className="input-new_mdp"
                        type="password"
                        placeholder="Confirmer votre nouveau mot de passe"
                    />
                </div>
                {onNavigate && (
                    <button type="button" className="btn-submit-new_mdp" onClick={() => onNavigate("login")}>
                        Confirmer
                    </button>
                )}
                <button type="button" className="btn-switch-new_mdp" onClick={() => window.history.back()}>
                    Retour
                </button>
            </form>
        </div>
    );
}
