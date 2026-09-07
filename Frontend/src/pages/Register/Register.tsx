import "./Register.css";
interface Props {
    onNavigate: (page: "login" | "register" | "forget" | "verification") => void;
}
export default function Login({ onNavigate }: Props) {
    return (
        <div className="login-card-r">
            <form className="login-form-r">
                <h1 className="title-r">S'inscrire</h1>
                <div className="form-group-r">
                    <input className="input-r" type="password" placeholder="Nom" />
                </div>
                <div className="form-group-r">
                    <input className="input-r" type="password" placeholder="Pseudo" />
                </div>
                <div className="form-group-r">
                    <input className="input-r" type="email" placeholder="votre@email.com" />
                </div>
                <div className="form-group-r">
                    <input className="input-r" type="password" placeholder="Mot de passe" />
                </div>
                <div className="form-group-r">
                    <input className="input-r" type="password" placeholder="Confirmer votre mot de passe" />
                </div>
                {onNavigate && (
                    <button type="button" className="btn-submit-r" onClick={() => onNavigate("verification")}>
                        Débuter l'aventure
                    </button>
                )}
                {onNavigate && (
                    <button type="button" className="btn-switch-r" onClick={() => onNavigate("login")}>
                        Se connecter
                    </button>
                )}
            </form>
        </div>
    );
}
