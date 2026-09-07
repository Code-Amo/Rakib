import logo from "../../assets/rihla-light.png";
import "./Login.css";
interface Props {
    onNavigate: (page: "login" | "register" | "forget" | "home") => void;
}
export default function Login({ onNavigate }: Props) {
    return (
        <div className="login-card">
            <img src={logo} className="logo-login" alt="logo" />
            <form className="login-form">
                <h1 className="title">Connexion</h1>
                <div className="form-group">
                    <input className="input" type="email" placeholder="votre@email.com" />
                </div>

                <div className="form-group">
                    <input className="input" type="password" placeholder="Mot de passe" />
                </div>
                {onNavigate && (
                    <button type="button" className="btn-submit" onClick={() => onNavigate("home")}>
                        Se connecter
                    </button>
                )}
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
